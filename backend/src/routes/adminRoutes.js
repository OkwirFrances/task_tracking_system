const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { verifyAdmin } = require('../middleware/authMiddleware');

// All admin routes require admin role
router.use(verifyAdmin);

router.get('/users', adminController.getAllUsers);
router.get('/users/:id', adminController.getUserById);
router.put('/users/:id/role', adminController.updateUserRole);
router.put('/users/:id/deactivate', adminController.deactivateUser);
router.get('/stats', adminController.getDashboardStats);
router.get('/activity-logs', adminController.getActivityLogs);

module.exports = router;
