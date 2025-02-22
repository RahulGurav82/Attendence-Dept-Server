const mongoose = require("mongoose");

const StudentSchema = new mongoose.Schema({
    roll_no: {
        type: String,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    department: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Department',
        required: true
    },
    dept_id: {
        type: String,
        required: true
    },
    class: {
        type: String,
        required: true
    },
    fingerprint1: {
        type: String,
        required: true
    },
    fingerprint2: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("Student", StudentSchema);
