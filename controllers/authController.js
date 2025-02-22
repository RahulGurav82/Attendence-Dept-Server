const User = require("../models/Users");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "User Already Exists" });

    user = new User({ name, email, password });
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(201).json({ message: "User Register Successfully", token });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

exports.login = async (req, res) => {
  let { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invaild Email" });

    const isMatch = await user.matchPassword(password);
    if (!isMatch) return res.status(400).json({ message: "Invalid Password" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

exports.getUser = async (req, res) => {
  try {
    console.log(req.user)
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

exports.getDashboardData = async (req, res) => {
  try {
    console.log("user : ", req.user)
    const user = await User.findById(req.user.id).select("-password");
    
    // You can add more dashboard data here based on your requirements
    const dashboardData = {
      user: {
        name: user.name,
        email: user.email
      },
      stats: {
        // Add your dashboard statistics here
        totalItems: 0,
        recentActivity: []
      }
    };

    res.json(dashboardData);
  } catch (error) {
    console.error("Dashboard Error:", error);
    res.status(500).json({ message: "Error fetching dashboard data" });
  }
};