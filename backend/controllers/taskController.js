const Task = require("./models/Task");

// Obtener todas las tareas
const getTasks = async (req, res) => {
    try {
        const tasks = await Task.find();
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Obtener tarea por ID
const getTaskById = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }
        res.json(task);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Crear nueva tarea
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

// Actualizar tarea
const updateTask = async (req, res) => {
    try {
        const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }
        res.json(task);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Eliminar tarea
const deleteTask = async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }
        res.json({ message: "Task deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Actualizar estado de tarea
const updateTaskStatus = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        task.status = req.body.status;
        await task.save();
        res.json({ message: "Task status updated", task });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Actualizar checklist de tarea
const updateTaskChecklist = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        task.todoChecklist = req.body.todoChecklist;
        await task.save();
        res.json({ message: "Todo checklist updated", task });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Obtener datos de dashboard
const getDashboardData = async (req, res) => {
    try {
        const tasks = await Task.find();
        res.json({ totalTasks: tasks.length });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Obtener datos del dashboard del usuario
const getUserDashboardData = async (req, res) => {
    try {
        const tasks = await Task.find({ assignedTo: req.user._id });
        res.json({ totalUserTasks: tasks.length });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
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