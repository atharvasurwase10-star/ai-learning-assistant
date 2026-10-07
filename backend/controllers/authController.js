const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { JWT_SECRET } = require('../middleware/auth');
const { DEMO_USER_EMAIL } = require('../utils/seedData');

// Helper to generate token
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      name: user.name,
      email: user.email,
      branch: user.branch,
      year: user.year,
      learningLevel: user.learningLevel,
    },
    JWT_SECRET,
    { expiresIn: '30d' }
  );
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
  try {
    const { name, email, password, college, branch, year, interests, learningLevel } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and password',
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email',
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      college: college || 'College of Engineering',
      branch: branch || 'Computer Engineering',
      year: year || '2nd Year',
      interests: Array.isArray(interests) ? interests : ['General Engineering'],
      learningLevel: learningLevel || 'Intermediate',
    });

    const token = generateToken(user);

    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        college: user.college,
        branch: user.branch,
        year: user.year,
        interests: user.interests,
        learningLevel: user.learningLevel,
      },
    });
  } catch (error) {
    console.error('[Auth Register Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error during registration',
      error: error.message,
    });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password',
      });
    }

    const user = await User.findOne({ email });

    // Handle demo account fallback gracefully
    if (!user) {
      if (email === DEMO_USER_EMAIL && password === 'password123') {
        const demoUser = {
          _id: '66554433221100aabbccddee',
          name: 'Atharva Deshmukh',
          email: DEMO_USER_EMAIL,
          college: 'MIT Academy of Engineering',
          branch: 'Artificial Intelligence & Machine Learning',
          year: '2nd Year',
          interests: ['Machine Learning', 'Data Structures', 'Python', 'Algorithms'],
          learningLevel: 'Intermediate',
        };
        const token = generateToken(demoUser);
        return res.json({
          success: true,
          message: 'Logged in as Demo Student',
          token,
          user: demoUser,
        });
      }
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    const token = generateToken(user);

    return res.json({
      success: true,
      message: 'Logged in successfully',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        college: user.college,
        branch: user.branch,
        year: user.year,
        interests: user.interests,
        learningLevel: user.learningLevel,
      },
    });
  } catch (error) {
    console.error('[Auth Login Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error during login',
      error: error.message,
    });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.json({
        success: true,
        user: req.user,
      });
    }
    return res.json({
      success: true,
      user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error fetching profile',
      error: error.message,
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const { name, college, branch, year, interests, learningLevel } = req.body;
    if (name) user.name = name;
    if (college) user.college = college;
    if (branch) user.branch = branch;
    if (year) user.year = year;
    if (interests) user.interests = interests;
    if (learningLevel) user.learningLevel = learningLevel;

    await user.save();

    return res.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        college: user.college,
        branch: user.branch,
        year: user.year,
        interests: user.interests,
        learningLevel: user.learningLevel,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error updating profile',
      error: error.message,
    });
  }
};

module.exports = {
  register,
  login,
  getMe,
  updateProfile,
};
