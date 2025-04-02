const Admin = require('../models/Admin');
const User = require('../models/user');
const Bet = require('../models/bet');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// Admin Register
exports.registerAdmin = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = new Admin({
      name,
      email,
      password: hashedPassword
    });

    await admin.save();

    res.status(201).json({ message: 'Admin registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error registering admin', error });
  }
};

// Admin Login
exports.loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ token, admin });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Get All Users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch users', error });
  }
};

// Get All Bets
exports.getAllBets = async (req, res) => {
  try {
    const bets = await Bet.find().populate('user', 'email');
    res.status(200).json(bets);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch bets', error });
  }
};

// Delete User
exports.deleteUser = async (req, res) => {
  const { userId } = req.params;

  try {
    await User.findByIdAndDelete(userId);
    res.status(200).json({ message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete user', error });
  }
};
