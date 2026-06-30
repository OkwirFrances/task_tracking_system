const express = require('express');
const cors = require('cors');
require('dotenv').config();
const sequelize = require('./config/database');
const taskRoutes = require('./routes/taskRoutes');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/tasks', taskRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

const startServer = async (retries = 30, delay = 3000) => {
  console.log(`Attempting to connect to database... (${retries} retries remaining)`);
  
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully.');
    
    // Sync models with database
    await sequelize.sync({ alter: false });
    console.log('✅ Database synchronized');
    
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
      console.log(`📊 API available at: http://localhost:${PORT}/api/tasks`);
      console.log(`🔐 Auth endpoints: http://localhost:${PORT}/api/auth`);
      console.log(`👨‍💼 Admin endpoints: http://localhost:${PORT}/api/admin`);
      console.log(`❤️  Health check: http://localhost:${PORT}/health`);
    });
  } catch (error) {
    if (retries === 0) {
      console.error('❌ Unable to start server after multiple retries:', error);
      process.exit(1);
    }
    
    console.log(`⚠️  Database not ready yet. Waiting ${delay}ms... (${retries} retries left)`);
    console.log(`Error: ${error.message}`);
    
    setTimeout(() => {
      startServer(retries - 1, delay);
    }, delay);
  }
};

startServer();
