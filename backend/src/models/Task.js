const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Task = sequelize.define('Task', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  startDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  endDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  progress: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      min: 0,
      max: 100
    }
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'pending'
  },
  priority: {
    type: DataTypes.STRING,
    defaultValue: 'medium'
  },
  assignedTo: {
    type: DataTypes.STRING,
    allowNull: true
  },
  location: {
    type: DataTypes.STRING,
    allowNull: true
  },
  locationDetails: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  dependencies: {
    type: DataTypes.ARRAY(DataTypes.UUID),
    defaultValue: []
  },
  color: {
    type: DataTypes.STRING,
    defaultValue: '#4CAF50'
  },
  estimatedHours: {
    type: DataTypes.FLOAT,
    defaultValue: 0
  },
  actualHours: {
    type: DataTypes.FLOAT,
    defaultValue: 0
  },
  lastProgressUpdate: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  timestamps: true
});

module.exports = Task;
