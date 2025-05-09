const express = require('express');
const { adminOnly, protect } = require('../middlewares/authMiddleware');
const { getUsers, getUserById, deleteUser } = require('../controllers/userController');
const router = express.Router();

//User Manger Routes
router.get("/",protect, adminOnly, getUsers);
router.get("/:id",protect, adminOnly, getUserById);


module.exports = router;