const User = require("../models/User");
const Task = require("../models/Task");
const AppError = require("../utils/AppError");


const getAllUsers = async (req, res, next) => {
  try {
    const { role, page = 1, limit = 10 } = req.query;

    const filter = {};

    if (req.user.role === "admin") {
      // Admin sees only "user" role — never admins or superadmin
      filter.role = "user";
    } else if (role) {
      // Superadmin can filter by any role EXCEPT superadmin is hidden from list
      filter.role = role === "superadmin" ? { $ne: "superadmin" } : role;
    } else {
      // Superadmin default: exclude superadmin accounts from list view
      filter.role = { $ne: "superadmin" };
    }

    const skip = (Number(page) - 1) * Number(limit);

    const users = await User.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await User.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: users.length,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
      users,
    });
  } catch (error) {
    next(error);
  }
};

const getUser = async (req, res, next) => {
  try {
    res.status(200).json({ success: true, user: req.targetUser });
  } catch (error) {
    next(error);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const allowedUpdates = {};

    // isActive: both admin and superadmin can update
    if (req.body.isActive !== undefined) {
      allowedUpdates.isActive = req.body.isActive;
    }

    // role: only superadmin can update (preventRoleChange middleware guards this)
    if (req.body.role !== undefined) {
      allowedUpdates.role = req.body.role;
    }

    if (Object.keys(allowedUpdates).length === 0) {
      return next(new AppError("No valid fields provided to update.", 400));
    }

    if (
      req.params.id === req.user._id.toString() &&
      allowedUpdates.isActive === false
    ) {
      return next(new AppError("You cannot deactivate your own account.", 400));
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      allowedUpdates,
      { new: true, runValidators: true }
    );

    if (!user) {
      return next(new AppError("User not found.", 404));
    }

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      user,
    });
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    if (req.params.id === req.user._id.toString()) {
      return next(new AppError("You cannot delete your own account.", 400));
    }

    await Task.deleteMany({ assignedTo: req.params.id });
    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "User and their tasks deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

const getUserTasks = async (req, res, next) => {
  try {
    const user = req.targetUser;

    const tasks = await Task.find({ assignedTo: req.params.id })
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: tasks.length,
      user: { id: user._id, name: user.name, email: user.email },
      tasks,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAllUsers, getUser, updateUser, deleteUser, getUserTasks };
