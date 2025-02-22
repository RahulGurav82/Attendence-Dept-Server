const express = require('express');
const { register, login, getUser } = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');
const { getDashboardData } = require('../controllers/authController');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/user', authMiddleware, getUser);
router.get('/dashboard', authMiddleware, getDashboardData);

module.exports = router;