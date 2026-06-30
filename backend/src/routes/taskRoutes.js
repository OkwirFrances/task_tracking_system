const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');

router.get('/', taskController.getAllTasks);
router.get('/:id', taskController.getTaskById);
router.post('/', taskController.createTask);
router.put('/:id', taskController.updateTask);
router.delete('/:id', taskController.deleteTask);
router.get('/:taskId/logs', taskController.getProgressLogs);
router.post('/:taskId/logs', taskController.addProgressLog);
router.get('/summary', taskController.getProgressSummary);

module.exports = router;
