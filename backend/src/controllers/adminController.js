const { User, Task, ProgressLog } = require('../models');
const { Op } = require('sequelize');

// Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: {
        exclude: ['googleId'],
      },
      order: [['createdAt', 'DESC']],
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
};

// Get user by ID
const getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: {
        exclude: ['googleId'],
      },
    });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user', error: error.message });
  }
};

// Update user role
const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!['user', 'admin', 'manager'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.role = role;
    await user.save();

    res.json({
      message: 'User role updated successfully',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating user role', error: error.message });
  }
};

// Deactivate user
const deactivateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.isActive = false;
    await user.save();

    res.json({ message: 'User deactivated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deactivating user', error: error.message });
  }
};

// Get dashboard statistics
const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.count();
    const activeUsers = await User.count({ where: { isActive: true } });
    const adminCount = await User.count({ where: { role: 'admin' } });
    const managerCount = await User.count({ where: { role: 'manager' } });
    const totalTasks = await Task.count();
    const completedTasks = await Task.count({ where: { status: 'completed' } });
    const inProgressTasks = await Task.count({ where: { status: 'in-progress' } });
    const totalLogs = await ProgressLog.count();

    const avgProgress = await Task.findOne({
      attributes: [
        [require('sequelize').fn('AVG', require('sequelize').col('progress')), 'avgProgress'],
      ],
    });

    const tasksPerUser = await Task.findAll({
      attributes: [
        'userId',
        [require('sequelize').fn('COUNT', require('sequelize').col('id')), 'taskCount'],
      ],
      group: ['userId'],
      raw: true,
    });

    res.json({
      users: {
        total: totalUsers,
        active: activeUsers,
        admins: adminCount,
        managers: managerCount,
      },
      tasks: {
        total: totalTasks,
        completed: completedTasks,
        inProgress: inProgressTasks,
        avgProgress: Math.round(avgProgress.dataValues.avgProgress || 0),
      },
      logs: totalLogs,
      tasksPerUser: tasksPerUser,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching dashboard stats', error: error.message });
  }
};

// Get activity logs
const getActivityLogs = async (req, res) => {
  try {
    const logs = await ProgressLog.findAll({
      include: [
        {
          model: Task,
          attributes: ['id', 'title'],
        },
      ],
      order: [['createdAt', 'DESC']],
      limit: 50,
    });
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching activity logs', error: error.message });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  updateUserRole,
  deactivateUser,
  getDashboardStats,
  getActivityLogs,
};
