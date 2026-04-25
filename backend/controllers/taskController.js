const Task = require("../models/Task");
const User = require("../models/User");
const AppError = require("../utils/AppError");

//          Admin: sees ALL tasks | User: sees only their own tasks
const getTasks = async (req, res, next) => {
  try {
    let query;
    const { status, priority, page = 1, limit = 10 } = req.query;

    const filter = {};
    if (status) filter.status = status;
    if (priority) filter.priority = priority;

    if (req.user.role === "admin" || req.user.role === "superadmin") {
      // Admin/Superadmin sees all tasks
      query = Task.find(filter)
        .populate("assignedTo", "name email role")
        .populate("createdBy", "name email");
    } else {
      // Regular user sees only their tasks
      filter.assignedTo = req.user.id;
      query = Task.find(filter)
        .populate("assignedTo", "name email role")
        .populate("createdBy", "name email");
    }

    // Pagination
    const skip = (Number(page) - 1) * Number(limit);
    query = query.sort({ createdAt: -1 }).skip(skip).limit(Number(limit));

    const tasks = await query;
    const total = await Task.countDocuments(
      (req.user.role === "admin" || req.user.role === "superadmin") ? filter : { ...filter, assignedTo: req.user.id }
    );

    res.status(200).json({
      success: true,
      count: tasks.length,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
      tasks,
    });
  } catch (error) {
    next(error);
  }
};

const getTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate("assignedTo", "name email role")
      .populate("createdBy", "name email");

    if (!task) {
      return next(new AppError("Task not found.", 404));
    }

    //  admin: can view own tasks + tasks of users they manage (role="user")
    const callerId   = req.user.id;
    const callerRole = req.user.role;
    const assignedId = task.assignedTo?._id?.toString();
    const assignedRole = task.assignedTo?.role;

    if (callerRole !== "superadmin") {
      if (callerRole === "admin") {
        // Admin cannot view tasks belonging to other admins
        if (assignedId !== callerId && (assignedRole === "admin" || assignedRole === "superadmin")) {
          return next(new AppError("You are not authorized to view this task.", 403));
        }
      } else {
        // Regular user: own tasks only
        if (assignedId !== callerId) {
          return next(new AppError("You are not authorized to view this task.", 403));
        }
      }
    }

    res.status(200).json({ success: true, task });
  } catch (error) {
    next(error);
  }
};


const createTask = async (req, res, next) => {
  try {
    const { title, description, status, priority, dueDate, assignedTo } = req.body;

    // Determine who the task is assigned to
    let taskAssignee = req.user.id; // default: assign to self

    if (assignedTo) {
      if (req.user.role === "admin" || req.user.role === "superadmin") {
        // Verify target user exists
        const targetUser = await User.findById(assignedTo);
        if (!targetUser) {
          return next(new AppError("Assigned user not found.", 404));
        }
        // Admin cannot assign tasks to other admins or superadmin
        if (
          req.user.role === "admin" &&
          (targetUser.role === "admin" || targetUser.role === "superadmin") &&
          targetUser._id.toString() !== req.user.id
        ) {
          return next(
            new AppError("Admins can only assign tasks to users with role 'user'.", 403)
          );
        }
        taskAssignee = assignedTo;
      } else {
        // Regular users can only assign to themselves
        if (assignedTo !== req.user.id) {
          return next(
            new AppError("You can only create tasks assigned to yourself.", 403)
          );
        }
      }
    }

    const task = await Task.create({
      title,
      description,
      status,
      priority,
      dueDate,
      assignedTo: taskAssignee,
      createdBy: req.user.id,
    });

    const populatedTask = await Task.findById(task._id)
      .populate("assignedTo", "name email role")
      .populate("createdBy", "name email");

    res.status(201).json({
      success: true,
      message: "Task created successfully",
      task: populatedTask,
    });
  } catch (error) {
    next(error);
  }
};

const updateTask = async (req, res, next) => {
  try {
    let task = req.task;

    if (req.user.role === "user" && req.body.assignedTo) {
      delete req.body.assignedTo;
    }

    task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
      .populate("assignedTo", "name email role")
      .populate("createdBy", "name email");

    res.status(200).json({
      success: true,
      message: "Task updated successfully",
      task,
    });
  } catch (error) {
    next(error);
  }
};


const deleteTask = async (req, res, next) => {
  try {
    await Task.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Task deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};


const updateTaskStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!status) {
      return next(new AppError("Status field is required.", 400));
    }

    const validStatuses = ["Pending", "In Progress", "Completed"];
    if (!validStatuses.includes(status)) {
      return next(
        new AppError("Status must be Pending, In Progress, or Completed.", 400)
      );
    }

    let task = req.task;
    task = await Task.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    )
      .populate("assignedTo", "name email role")
      .populate("createdBy", "name email");

    res.status(200).json({
      success: true,
      message: `Task status updated to '${status}'`,
      task,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getTasks, getTask, createTask, updateTask, deleteTask, updateTaskStatus };
