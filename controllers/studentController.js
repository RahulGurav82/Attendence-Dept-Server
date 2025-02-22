const Student = require('../models/Student');

// Add new student
exports.addStudent = async (req, res) => {
    try {
        const { name, roll_no, email, class: className, fingerprint1, fingerprint2 } = req.body;
        const department = req.department._id;
        const dept_id = req.department.dept_id;

        // Check if student with roll number already exists
        const existingStudent = await Student.findOne({ roll_no });
        if (existingStudent) {
            return res.status(400).json({ message: 'Student with this roll number already exists' });
        }

        // Check if email already exists
        const emailExists = await Student.findOne({ email });
        if (emailExists) {
            return res.status(400).json({ message: 'Student with this email already exists' });
        }

        // Create new student
        const student = await Student.create({
            name,
            roll_no,
            email,
            department,
            dept_id,
            class: className,
            fingerprint1,
            fingerprint2
        });

        res.status(201).json({
            success: true,
            student: {
                name: student.name,
                roll_no: student.roll_no,
                email: student.email,
                dept_id: student.dept_id,
                class: student.class
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get all students of a department
exports.getDepartmentStudents = async (req, res) => {
    try {
        const department = req.department._id;
        const students = await Student.find({ department })
            .select('name roll_no email dept_id class')
            .sort({ roll_no: 1 });
        
        res.status(200).json({ students });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
