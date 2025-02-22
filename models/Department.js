const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const DepartmentSchema = new mongoose.Schema({
    dept_id: {
        type: String,
        required: true,
        unique: true,
    },
    dept_name: {
        type: String,
        required: true,
    },
    hod_name: {
        type: String,
        required: true,
    },
    dept_email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
    },
}, {
    timestamps: true
});

// Hash Password Before Saving
DepartmentSchema.pre('save', async function (next) {
    if(!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Compare Password
DepartmentSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("Department", DepartmentSchema);
