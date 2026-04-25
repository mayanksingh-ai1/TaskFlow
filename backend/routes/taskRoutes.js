const express = require("express");
const router = express.Router();
const {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  updateTaskStatus,
} = require("../controllers/taskController");
const { protect } = require("../middleware/authMiddleware");
const {
  createTaskValidator,
  updateTaskValidator,
} = require("../middleware/validationMiddleware");
const { validateTaskAccess } = require("../middleware/roleMiddleware");

// All task routes require authentication
router.use(protect);

// POST /api/tasks — create task
router.route("/").get(getTasks).post(createTaskValidator, createTask);

// GET /api/tasks/:id  — read-only, ownership checked inside controller
router.get("/:id", getTask);

// PUT /api/tasks/:id  — validateTaskAccess enforces ownership before controller
router.put("/:id", validateTaskAccess(), updateTaskValidator, updateTask);

// DELETE /api/tasks/:id  — validateTaskAccess enforces ownership before controller
router.delete("/:id", validateTaskAccess(), deleteTask);

// PATCH /api/tasks/:id/status — validateTaskAccess enforces ownership before controller
router.patch("/:id/status", validateTaskAccess(), updateTaskStatus);

module.exports = router;
