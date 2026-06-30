// const Task = require('../models/Task');
// const ProgressLog = require('../models/ProgressLog');
// const { Op } = require('sequelize');

// exports.getAllTasks = async (req, res) => {
//   try {
//     const tasks = await Task.findAll({
//       include: [{
//         model: ProgressLog,
//         limit: 5,
//         order: [['createdAt', 'DESC']]
//       }],
//       order: [['startDate', 'ASC']]
//     });
//     res.json(tasks);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// exports.getTaskById = async (req, res) => {
//   try {
//     const task = await Task.findByPk(req.params.id, {
//       include: [{
//         model: ProgressLog,
//         order: [['createdAt', 'DESC']]
//       }]
//     });
//     if (!task) {
//       return res.status(404).json({ error: 'Task not found' });
//     }
//     res.json(task);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// exports.createTask = async (req, res) => {
//   try {
//     const task = await Task.create(req.body);
//     await ProgressLog.create({
//       taskId: task.id,
//       action: 'started',
//       description: 'Task created',
//       location: task.location || 'Not specified',
//       userName: req.body.assignedTo || 'System'
//     });
//     res.status(201).json(task);
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// };

// exports.updateTask = async (req, res) => {
//   try {
//     const task = await Task.findByPk(req.params.id);
//     if (!task) {
//       return res.status(404).json({ error: 'Task not found' });
//     }
//     const oldProgress = task.progress;
//     const oldStatus = task.status;
//     const oldLocation = task.location;
//     await task.update(req.body);
//     if (req.body.progress !== undefined && req.body.progress !== oldProgress) {
//       await ProgressLog.create({
//         taskId: task.id,
//         action: 'progress-update',
//         description: `Progress updated from ${oldProgress}% to ${req.body.progress}%`,
//         progressValue: req.body.progress,
//         location: task.location || oldLocation || 'Not specified',
//         userName: req.body.assignedTo || 'System'
//       });
//     }
//     if (req.body.status && req.body.status !== oldStatus) {
//       await ProgressLog.create({
//         taskId: task.id,
//         action: 'status-change',
//         description: `Status changed from ${oldStatus} to ${req.body.status}`,
//         location: task.location || oldLocation || 'Not specified',
//         userName: req.body.assignedTo || 'System'
//       });
//     }
//     if (req.body.location && req.body.location !== oldLocation) {
//       await ProgressLog.create({
//         taskId: task.id,
//         action: 'location-change',
//         description: `Location changed from ${oldLocation || 'Not set'} to ${req.body.location}`,
//         location: req.body.location,
//         locationDetails: req.body.locationDetails || null,
//         userName: req.body.assignedTo || 'System'
//       });
//     }
//     if (req.body.status === 'completed' && oldStatus !== 'completed') {
//       await ProgressLog.create({
//         taskId: task.id,
//         action: 'completed',
//         description: 'Task completed successfully',
//         location: task.location || 'Not specified',
//         userName: req.body.assignedTo || 'System'
//       });
//     }
//     res.json(task);
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// };

// exports.addProgressLog = async (req, res) => {
//   try {
//     const { taskId } = req.params;
//     const task = await Task.findByPk(taskId);
//     if (!task) {
//       return res.status(404).json({ error: 'Task not found' });
//     }
//     const logData = {
//       taskId,
//       ...req.body,
//       userName: req.body.userName || task.assignedTo || 'System'
//     };
//     const log = await ProgressLog.create(logData);
//     if (req.body.progressValue !== undefined) {
//       await task.update({ 
//         progress: req.body.progressValue,
//         lastProgressUpdate: new Date()
//       });
//     }
//     if (req.body.location) {
//       await task.update({ 
//         location: req.body.location,
//         locationDetails: req.body.locationDetails || null
//       });
//     }
//     res.status(201).json(log);
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// };

// exports.getProgressLogs = async (req, res) => {
//   try {
//     const { taskId } = req.params;
//     const logs = await ProgressLog.findAll({
//       where: { taskId },
//       order: [['createdAt', 'DESC']]
//     });
//     res.json(logs);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// exports.getProgressSummary = async (req, res) => {
//   try {
//     const tasks = await Task.findAll();
//     const totalTasks = tasks.length;
//     const completedTasks = tasks.filter(t => t.status === 'completed').length;
//     const inProgressTasks = tasks.filter(t => t.status === 'in-progress').length;
//     const totalProgress = tasks.reduce((sum, t) => sum + t.progress, 0);
//     const averageProgress = totalTasks > 0 ? Math.round(totalProgress / totalTasks) : 0;
//     const locationStats = {};
//     tasks.forEach(task => {
//       if (task.location) {
//         locationStats[task.location] = (locationStats[task.location] || 0) + 1;
//       }
//     });
//     const recentLogs = await ProgressLog.findAll({
//       limit: 20,
//       order: [['createdAt', 'DESC']],
//       include: [Task]
//     });
//     res.json({
//       totalTasks,
//       completedTasks,
//       inProgressTasks,
//       averageProgress,
//       locationStats,
//       recentLogs
//     });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// exports.deleteTask = async (req, res) => {
//   try {
//     const task = await Task.findByPk(req.params.id);
//     if (!task) {
//       return res.status(404).json({ error: 'Task not found' });
//     }
//     await ProgressLog.destroy({ where: { taskId: task.id } });
//     await task.destroy();
//     res.status(204).send();
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };
// backend/src/controllers/taskController.js
const { Task, ProgressLog } = require('../models');
const { Op } = require('sequelize');

// Get all tasks with progress logs
exports.getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.findAll({
      include: [{
        model: ProgressLog,
        as: 'ProgressLogs',
        limit: 5,
        order: [['createdAt', 'DESC']]
      }],
      order: [['startDate', 'ASC']]
    });
    res.json(tasks);
  } catch (error) {
    console.error('Error in getAllTasks:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get a single task with all progress logs
exports.getTaskById = async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id, {
      include: [{
        model: ProgressLog,
        as: 'ProgressLogs',
        order: [['createdAt', 'DESC']]
      }]
    });
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.json(task);
  } catch (error) {
    console.error('Error in getTaskById:', error);
    res.status(500).json({ error: error.message });
  }
};

// Create a new task
exports.createTask = async (req, res) => {
  try {
    const task = await Task.create(req.body);
    
    // Create initial progress log
    await ProgressLog.create({
      taskId: task.id,
      action: 'started',
      description: 'Task created',
      location: task.location || 'Not specified',
      userName: req.body.assignedTo || 'System'
    });
    
    // Fetch the task with its logs
    const createdTask = await Task.findByPk(task.id, {
      include: [{
        model: ProgressLog,
        as: 'ProgressLogs',
        limit: 5,
        order: [['createdAt', 'DESC']]
      }]
    });
    
    res.status(201).json(createdTask);
  } catch (error) {
    console.error('Error in createTask:', error);
    res.status(400).json({ error: error.message });
  }
};

// Update a task with progress tracking
exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    const oldProgress = task.progress;
    const oldStatus = task.status;
    const oldLocation = task.location;
    
    await task.update(req.body);
    
    // Log progress update if progress changed
    if (req.body.progress !== undefined && req.body.progress !== oldProgress) {
      await ProgressLog.create({
        taskId: task.id,
        action: 'progress-update',
        description: `Progress updated from ${oldProgress}% to ${req.body.progress}%`,
        progressValue: req.body.progress,
        location: task.location || oldLocation || 'Not specified',
        userName: req.body.assignedTo || 'System'
      });
    }
    
    // Log status change
    if (req.body.status && req.body.status !== oldStatus) {
      await ProgressLog.create({
        taskId: task.id,
        action: 'status-change',
        description: `Status changed from ${oldStatus} to ${req.body.status}`,
        location: task.location || oldLocation || 'Not specified',
        userName: req.body.assignedTo || 'System'
      });
    }
    
    // Log location change
    if (req.body.location && req.body.location !== oldLocation) {
      await ProgressLog.create({
        taskId: task.id,
        action: 'location-change',
        description: `Location changed from ${oldLocation || 'Not set'} to ${req.body.location}`,
        location: req.body.location,
        locationDetails: req.body.locationDetails || null,
        userName: req.body.assignedTo || 'System'
      });
    }
    
    // If completed, log completion
    if (req.body.status === 'completed' && oldStatus !== 'completed') {
      await ProgressLog.create({
        taskId: task.id,
        action: 'completed',
        description: 'Task completed successfully',
        location: task.location || 'Not specified',
        userName: req.body.assignedTo || 'System'
      });
    }
    
    // Fetch updated task with logs
    const updatedTask = await Task.findByPk(task.id, {
      include: [{
        model: ProgressLog,
        as: 'ProgressLogs',
        limit: 5,
        order: [['createdAt', 'DESC']]
      }]
    });
    
    res.json(updatedTask);
  } catch (error) {
    console.error('Error in updateTask:', error);
    res.status(400).json({ error: error.message });
  }
};

// Add progress log to a task
exports.addProgressLog = async (req, res) => {
  try {
    const { taskId } = req.params;
    const task = await Task.findByPk(taskId);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    const logData = {
      taskId,
      ...req.body,
      userName: req.body.userName || task.assignedTo || 'System'
    };
    
    const log = await ProgressLog.create(logData);
    
    // Update task progress if progressValue is provided
    if (req.body.progressValue !== undefined) {
      await task.update({ 
        progress: req.body.progressValue,
        lastProgressUpdate: new Date()
      });
    }
    
    // Update task location if location is provided
    if (req.body.location) {
      await task.update({ 
        location: req.body.location,
        locationDetails: req.body.locationDetails || null
      });
    }
    
    res.status(201).json(log);
  } catch (error) {
    console.error('Error in addProgressLog:', error);
    res.status(400).json({ error: error.message });
  }
};

// Get progress logs for a task
exports.getProgressLogs = async (req, res) => {
  try {
    const { taskId } = req.params;
    const logs = await ProgressLog.findAll({
      where: { taskId },
      order: [['createdAt', 'DESC']]
    });
    res.json(logs);
  } catch (error) {
    console.error('Error in getProgressLogs:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get progress summary
exports.getProgressSummary = async (req, res) => {
  try {
    const tasks = await Task.findAll();
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.status === 'completed').length;
    const inProgressTasks = tasks.filter(t => t.status === 'in-progress').length;
    const totalProgress = tasks.reduce((sum, t) => sum + t.progress, 0);
    const averageProgress = totalTasks > 0 ? Math.round(totalProgress / totalTasks) : 0;
    
    // Location-based statistics
    const locationStats = {};
    tasks.forEach(task => {
      if (task.location) {
        locationStats[task.location] = (locationStats[task.location] || 0) + 1;
      }
    });
    
    // Recent activity
    const recentLogs = await ProgressLog.findAll({
      limit: 20,
      order: [['createdAt', 'DESC']],
      include: [{
        model: Task,
        as: 'Task'
      }]
    });
    
    res.json({
      totalTasks,
      completedTasks,
      inProgressTasks,
      averageProgress,
      locationStats,
      recentLogs
    });
  } catch (error) {
    console.error('Error in getProgressSummary:', error);
    res.status(500).json({ error: error.message });
  }
};

// Delete a task
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    // Delete associated progress logs
    await ProgressLog.destroy({ where: { taskId: task.id } });
    await task.destroy();
    
    res.status(204).send();
  } catch (error) {
    console.error('Error in deleteTask:', error);
    res.status(500).json({ error: error.message });
  }
};