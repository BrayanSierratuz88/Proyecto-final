const ask = require("./models/Task");


//@desc Get All Tasks
//@route GET /api/task
//@access Private
const getTasks = async (req, res) => {
    try {
        const tasks = await Task.find(); // Obtiene todas las tareas
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

//@desc Get Task By ID
//@route GET /api/task/:id
//@access Private
const getTaskById = async (req, res) => {
    try {
        const tasks = await Task.find(); // Obtiene todas las tareas
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }};


//@desc Create Task
//@route POST /api/task
//@access Private
const createTask = async (req,res) => {
    try {
        const{
            title,
            description,
            priority,
            dueDate,
            assignedTo,
            attachment,
            todochecklist,
        } = req.body;

        if(!Array.isArray(assignedTo)){
            return res.status(400).json({ message : "assignedTo must be an array of user ID" });
        }
        const tasks = await Task.create({
            title,
            description,
            priority,
            dueDate,
            assignedTo,
            createdBy: req.user._id,
            todoChecklist,
            attachments,
        });
        res.status(201).json({message: "Task created successfully", task});
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


//@desc Update Task
//@route PUT /api/task/:id
//@access Private
const updateTask = async (req,res) => {
    try {
        const tasks = await Task.find(); // Obtiene todas las tareas
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

//@desc Delete Task
//@route DELETE /api/task/:id
//@access Private
const deleteTask = async (req,res) => {
    try {
        const tasks = await Task.find(); // Obtiene todas las tareas
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

//@desc Update Task Status
//@route PUT /api/task/:id/status
//@access Private
const updateTaskStatus = async (req,res) => {
    try {
        const tasks = await Task.find(); // Obtiene todas las tareas
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

//@desc Update Task Todo
//@route PUT /api/task/:id/todo
//@access Private
const updateTaskChecklist = async (req,res) => {
    try {
        const tasks = await Task.find(); // Obtiene todas las tareas
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

//@desc Get Dashboard Data
//@route GET /api/task/dashboard-data
//@access Private
const getDashboardData = async (req,res) => {
    try {
        const tasks = await Task.find(); // Obtiene todas las tareas
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

//@desc Get User Dashboard Data
//@route GET /api/task/dashboard-data
//@access Private
const getUserDashboardData = async (req,res) => {
    try {
        const tasks = await Task.find(); // Obtiene todas las tareas
        res.json(tasks);
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
