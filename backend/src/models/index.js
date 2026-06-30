const sequelize = require('../config/database');
const Task = require('./Task');
const ProgressLog = require('./ProgressLog');

// Define associations
Task.hasMany(ProgressLog, { 
  foreignKey: 'taskId',
  as: 'ProgressLogs'
});
ProgressLog.belongsTo(Task, { 
  foreignKey: 'taskId',
  as: 'Task'
});

module.exports = {
  sequelize,
  Task,
  ProgressLog
};
