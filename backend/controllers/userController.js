const Task = require('../models/task');
const User = require('../models/User');
const bcrypt = require('bcryptjs');


//@desc Get All User(Admin Only)
//@route GET /api/user
//@access Private/Admin
const getUsers = async (req, res) => {
    try {
        const users = await User.find({ role: 'member' }).select('-password');
        
        // Add task count to each user
        const usersWithTaskCount = await Promise.all(users.map(async (user) => {
            const pendingTasks = await Task.countDocuments({ assignedTo: user._id, status: 'pending' });
            const inProgressTasks = await Task.countDocuments({ assignedTo: user._id, status: 'In progress' });
            const completedTasks = await Task.countDocuments({ assignedTo: user._id, status: 'completed' });
            
            return {
                ...user._doc,
                pendingTasks,
                inProgressTasks,
                completedTasks,
            };
        }));

        res.json(usersWithTaskCount);

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

//@desc Get User By ID(Admin Only)
//@route GET /api/user/:id
//@access Private/Admin
const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) return res.status(404).json({ message: "User not found" });
        res.json(user);
     } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
     }
    };


module.exports = {
    getUsers,
    getUserById

};