const express = require("express");
const router = express.Router();

const {
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
  getUserTasks,
} = require("../controllers/userController");

const { protect, authorize } = require("../middleware/authMiddleware");
const {
  preventSuperadminAssignment,
  preventSelfRoleChange,
  preventRoleChange,
  validateTargetUser,
} = require("../middleware/roleMiddleware");

// All routes: must be logged in + at least admin
router.use(protect);
router.use(authorize("admin", "superadmin"));

// GET /api/users  — list users
router.get("/", getAllUsers);

// GET /api/users/:id  — get single user
// validateTargetUser: fetches target, blocks if superadmin or outranks caller
router.get("/:id", validateTargetUser({ readOnly: true }), getUser);

// PUT /api/users/:id  — update user
// Chain:
//   1. preventSuperadminAssignment — block role=superadmin in body
//   2. validateTargetUser          — fetch + validate target rank
//   3. preventSelfRoleChange       — block changing own role
//   4. preventRoleChange           — block admin from changing any role
//   5. updateUser controller
router.put(
  "/:id",
  preventSuperadminAssignment,
  validateTargetUser(),
  preventSelfRoleChange,
  preventRoleChange,
  updateUser
);

// DELETE /api/users/:id  — delete user
router.delete("/:id", validateTargetUser(), deleteUser);

// GET /api/users/:id/tasks
router.get("/:id/tasks", validateTargetUser({ readOnly: true }), getUserTasks);

module.exports = router;
