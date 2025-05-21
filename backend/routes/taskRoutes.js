const express = require("express");
const { protect, adminOnly } = require("../middlewares/authMiddleware");
const {
    getDashboardData,
    getUserDashboardData,
    getTasks,
    getTaskById,
    createTask,
    updateTask,
    deleteTask,
    updateTaskStatus,
    updateTaskChecklist
} = require("../controllers/taskController"); // ✅ Corrección

const router = express.Router();

router.get("/dashboard-data", protect, getDashboardData);
router.get("/user-dashboard", protect, getUserDashboardData);
router.get("/", protect, getTasks);
router.get("/:id", protect, getTaskById);
router.post("/", protect, adminOnly, createTask);
router.put("/:id", protect, updateTask);
router.delete("/:id", protect, adminOnly, deleteTask);
router.put("/:id/status", protect, updateTaskStatus);
router.put("/:id/todo", protect, updateTaskChecklist);

module.exports = router;