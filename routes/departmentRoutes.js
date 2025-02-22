const express = require('express');
const router = express.Router();
const { createDepartment, getAllDepartments, departmentLogin, getDepartmentProfile } = require('../controllers/departmentController');
const { protect } = require('../middleware/departmentAuthMiddleware');

// Public routes
router.post('/create', createDepartment);
router.get('/all', getAllDepartments);
router.post('/login', departmentLogin);

// Protected routes
router.get('/profile', protect, getDepartmentProfile);

module.exports = router;
