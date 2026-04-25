const express = require("express");
const router = express.Router();
const { register, login, getMe, logout } = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");
const { registerValidator, loginValidator } = require("../middleware/validationMiddleware");
const { preventSuperadminAssignment } = require("../middleware/roleMiddleware");

// @route   POST /api/auth/register
router.post("/register", preventSuperadminAssignment, registerValidator, register);

// @route   POST /api/auth/login
router.post("/login", loginValidator, login);

// @route   GET /api/auth/me
router.get("/me", protect, getMe);

// @route   POST /api/auth/logout
router.post("/logout", protect, logout);

module.exports = router;
