const User = require("../models/User");
const AppError = require("../utils/AppError");
const { sendTokenResponse } = require("../utils/tokenUtils");



// @route   POST /api/auth/register
const register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(new AppError("User with this email already exists.", 409));
    }

    // preventSuperadminAssignment middleware also blocks it at the route level.
    const safeRole = role === 'superadmin' ? 'user' : role;

    // Create user (password hashing handled in model pre-save hook)
    const user = await User.create({ name, email, password, role: safeRole });

    sendTokenResponse(user, 201, res, "Registration successful");
  } catch (error) {
    next(error);
  }
};


const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await user.matchPassword(password))) {
      return next(new AppError("Invalid email or password.", 401));
    }

    if (!user.isActive) {
      return next(
        new AppError("Your account has been deactivated. Contact admin.", 403)
      );
    }

    sendTokenResponse(user, 200, res, "Login successful");
  } catch (error) {
    next(error);
  }
};


// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};


// @route   POST /api/auth/logout
// @access  Private
const logout = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      message: "Logged out successfully. Please remove the token on client side.",
      token: null,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login, getMe, logout };
