const express = require('express');
const router = express.Router();
const { addStudent, getDepartmentStudents } = require('../controllers/studentController');
const { protect } = require('../middleware/departmentAuthMiddleware');

// All routes are protected with department authentication
router.use(protect);

router.post('/add', addStudent);
router.get('/all', getDepartmentStudents);

module.exports = router;
