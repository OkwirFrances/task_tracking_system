const Task = require('./Task');
const ProgressLog = require('./ProgressLog');
const User = require('./User');

// Define associations
Task.hasMany(ProgressLog, {
  foreignKey: 'taskId',
  as: 'ProgressLogs',
});

ProgressLog.belongsTo(Task, {
  foreignKey: 'taskId',
});

Task.belongsTo(User, {
  foreignKey: 'userId',
  as: 'creator',
});

User.hasMany(Task, {
  foreignKey: 'userId',
  as: 'createdTasks',
});

module.exports = {
  Task,
  ProgressLog,
  User,
};
