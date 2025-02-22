const Department = require('../models/Department');
const jwt = require('jsonwebtoken');

// Generate unique department ID
const generateDeptId = () => {
    const timestamp = Date.now().toString();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `DEPT${timestamp.slice(-6)}${random}`;
};

// Create new department
exports.createDepartment = async (req, res) => {
    try {
        const { dept_name, hod_name, dept_email, password } = req.body;

        // Check if department email already exists
        const existingDepartment = await Department.findOne({ dept_email });
        if (existingDepartment) {
            return res.status(400).json({ message: 'Department with this email already exists' });
        }

        // Generate unique department ID
        const dept_id = generateDeptId();

        // Create new department
        const department = await Department.create({
            dept_id,
            dept_name,
            hod_name,
            dept_email,
            password
        });

        res.status(201).json({
            success: true,
            department: {
                dept_id: department.dept_id,
                dept_name: department.dept_name,
                hod_name: department.hod_name
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get all departments
exports.getAllDepartments = async (req, res) => {
    try {
        const departments = await Department.find({})
            .select('dept_id dept_name hod_name');
        res.status(200).json({ departments });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Department login
exports.departmentLogin = async (req, res) => {
    try {
        const { dept_email, password } = req.body;

        // Check if department exists
        const department = await Department.findOne({ dept_email });
        if (!department) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Check password
        const isMatch = await department.matchPassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: department._id, dept_id: department.dept_id },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.status(200).json({
            success: true,
            token,
            department: {
                dept_id: department.dept_id,
                dept_name: department.dept_name,
                hod_name: department.hod_name
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get department profile
exports.getDepartmentProfile = async (req, res) => {
    try {
        // req.department is set by the auth middleware
        const department = await Department.findById(req.department._id)
            .select('dept_id dept_name hod_name dept_email');

        if (!department) {
            return res.status(404).json({ message: 'Department not found' });
        }

        res.status(200).json({
            success: true,
            department
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
