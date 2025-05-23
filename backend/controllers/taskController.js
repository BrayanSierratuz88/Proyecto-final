const Task = require("../models/Task"); // ✅ Corrección de ruta

const getTasks = async (req, res) => {
    try {
        const {status} = req.query;
        let filter = {};
        if (status) {
            filter.status = status;
        }
        let tasks;
        if (req.user.role === "admin") {
            tasks = await Task.find(filter).populate("assignedTo","name email profileImageUrl");
        } else{
            tasks = await Task.find({ ...filter, assignedTo: req.user._id }).populate("assignedTo","name email profileImageUrl");
        }
        tasks = await Promise.all(
            tasks.map(async (task) => {
                const completedCount = task.todoChecklist.filter((item) => item.completed).length;
                return {
                    ...task._doc,
                    completedTodoCount: completedCount,
                };
            })
        );
        //status summary counts
        const allTasks = await Task.countDocuments(
            req.user.role === "admin" ? {} : { assignedTo: req.user._id }
        );
        const pendingTasks = await Task.countDocuments({
            ...filter,
            status: "pending",
            ...(req.user.role !== "admin" && { assignedTo: req.user._id }),
        });
        const inProgressTasks = await Task.countDocuments({
            ...filter,
            status: "in-progress",
            ...(req.user.role !== "admin" && { assignedTo: req.user._id }),
        });
        const completedTasks = await Task.countDocuments({
            ...filter,
            status: "completed",
            ...(req.user.role !== "admin" && { assignedTo: req.user._id }),
        });
        res.json({
            tasks, 
            statusSummary: {
                all: allTasks,
                pendingTasks,
                inProgressTasks,
                completedTasks,
            },
        });
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};

const getTaskById = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id).populate("assignedTo","name email profileImageUrl");
        if (!task) 
            return res.status(404).json({ message: "Task not found" });
         res.json(task);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

const createTask = async (req, res) => {
    try {
        const { title, description, priority, dueDate, assignedTo, attachments, todoChecklist } = req.body;

        if (!Array.isArray(assignedTo)) {
            return res.status(400).json({ message: "assignedTo must be an array of user IDs" });
        }

        const task = await Task.create({
            title,
            description,
            priority,
            dueDate,
            assignedTo,
            createdBy: req.user._id,
            todoChecklist,
            attachments,
        });

        res.status(201).json({ message: "Task created successfully", task });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

const updateTask = async (req, res) => {
    try {
       const task = await Task.findById(req.params.id);
       if (!task) return res.status(404).json({ message: "Task not found" });
        task.title = req.body.title || task.title;
        task.description = req.body.description || task.description;
        task.priority = req.body.priority || task.priority;
        task.dueDate = req.body.dueDate || task.dueDate;
        task.todoChecklist = req.body.todoChecklist || task.todoChecklist;
        task.attachments = req.body.attachments || task.attachments;
        if (req.body.assignedTo){
            if ( !Array.isArray(req.body.assignedTo)) {
                return res.status(400).json({ message: "assignedTo must be an array of user IDs" });

        }
        task.assignedTo = req.body.assignedTo;
        }
        const updatedTask = await task.save();
        res.json({ message: "Task updated successfully", task: updatedTask });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

const deleteTask = async (req, res) => {
    try {
        const task  = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ message: "Task not found" });

        await task.deleteOne();
        res.json({ message: "Task deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

const updateTaskStatus = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) 
            return res.status(404).json({ message: "Task not found" });
        const isAssigned = task.assignedTo.some(
            (userId) => userId.toString() === req.user._id.toString()
        );
        if (!isAssigned && req.user.role !== "admin") {
            return res.status(403).json({ message: "not authorized" });
        }
        task.status = req.body.status || task.status;
        if (task.status === "completed"){
            task.todoChecklist.forEach((item) => {
                item.completed = true
            });
            task.progress = 100;
        }
        await task.save();
        res.json({ message: "Task status updated successfully", task });
        
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

const updateTaskChecklist = async (req, res) => {
    try {
        const { todoChecklist } = req.body;
        const task = await Task.findById(req.params.id);
        if (!task) 
            return res.status(404).json({ message: "Task not found" });
        if (!task.assignedTo.includes(req.user._id) && req.user.role !== "admin") {
            return res.status(403).json({ message: "not authorized" });
        }
        task.todoChecklist = todoChecklist;

        const completedCount = todoChecklist.filter((item) => item.completed).length;
        const totalItems = todoChecklist.length;
        task.progress = totalItems > 0 ? (completedCount / totalItems) * 100 : 0;

        if (task.progress === 100) {
            task.status = "completed";
        } else if (task.progress > 0) {
            task.status = "in-progress";
        }else {
            task.status = "pending";
        }
        await task.save();
        const updatedTask = await Task.findById(req.params.id).populate("assignedTo","name email profileImageUrl");
        res.json({ message: "Task checklist updated successfully", task: updatedTask });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

const getDashboardData = async (req, res) => {
    try {
        const totalTask = await Task.countDocuments();
        const pendingTasks = await Task.countDocuments({ status: "pending" });
        const completedTasks = await Task.countDocuments({ status: "completed" });
        const overdueTasks = await Task.countDocuments({ dueDate: { $lt: new Date() }, status: { $ne: "completed" } });
        
        //ensure all possible statuses are included
        const taskStatuses = ["pending", "in-progress", "completed"];
        const taskDistributionRaw = await Task.aggregate([
            {
                $group: {
                    _id: "$status",
                    count: { $sum: 1 },
                },
            },
        ]);
        const taskDistribution = taskStatuses.reduce((acc, status) => {
            const formattedkey = status.replace(/\s+/g, "");
            acc[formattedkey] = taskDistributionRaw.find((item) => item._id === status)?.count || 0;
            return acc;
        }, {});
        taskDistribution["All"] = totalTask;
        const taskPriorities = ["low", "medium", "high"];
        const taskPrioritylevelsRaw = await Task.aggregate([
            {
                $group: {
                    _id: "$priority",
                    count: { $sum: 1 },
                },
            },
        ]);
        const taskPrioritylevels = taskPriorities.reduce((acc, priority) => {
            acc[priority] = taskPrioritylevelsRaw.find((item) => item._id === priority)?.count || 0;
            return acc;
        }, {});
        const recentTasks = await Task.find()
        .sort({ createdAt: -1 })
        .limit(10)
        .select("title status priority dueDate createdAt")
        res.status(200).json({
            statistics:{
                totalTask,
                pendingTasks,
                completedTasks,
                overdueTasks,

            },
                charts:{
                    taskDistribution,
                    taskPrioritylevels,
                },
                recentTasks
            });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

const getUserDashboardData = async (req, res) => {
    try {
        const userId = req.user._id;
        const totalTask = await Task.countDocuments({ assignedTo: userId });
        const pendingTasks = await Task.countDocuments({ assignedTo: userId, status: "pending" });
        const completedTasks = await Task.countDocuments({ assignedTo: userId, status: "completed" });
        const overdueTasks = await Task.countDocuments({ assignedTo: userId, dueDate: { $lt: new Date() }, status: { $ne: "completed" } });

        const taskStatuses = ["pending", "in-progress", "completed"];
        const taskDistributionRaw = await Task.aggregate([
            {
                $match: { assignedTo: userId },
            },
            {
                $group: {
                    _id: "$status",
                    count: { $sum: 1 },
                },
            },
        ]);
        const taskDistribution = taskStatuses.reduce((acc, status) => {
            const formattedkey = status.replace(/\s+/g, "");
            acc[formattedkey] = taskDistributionRaw.find((item) => item._id === status)?.count || 0;
            return acc;
        }, {});
        taskDistribution["All"] = totalTasks;
        const taskPriorities = ["low", "medium", "high"];
        const taskPrioritylevelsRaw = await Task.aggregate([
            {
                $match: { assignedTo: userId },
            },
            {
                $group: {
                    _id: "$priority",
                    count: { $sum: 1 },
                },
            },
        ]);
        const taskPrioritylevels = taskPriorities.reduce((acc, priority) => {
            acc[priority] = taskPrioritylevelsRaw.find((item) => item._id === priority)?.count || 0;
            return acc;
        }, {});

        const recentTasks = await Task.find({ assignedTo: userId })
            .sort({ createdAt: -1 })
            .limit(10)
            .select("title status priority dueDate createdAt");
        res.status(200).json({
            statistics: {
                totalTask,
                pendingTasks,
                completedTasks,
                overdueTasks,
            },
            charts: {
                taskDistribution,
                taskPrioritylevels,
            },
            recentTasks,
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    };
};

module.exports = {
    getTasks,
    getTaskById,
    createTask,
    updateTask,
    deleteTask,
    updateTaskStatus,
    updateTaskChecklist,
    getDashboardData,
    getUserDashboardData,
};