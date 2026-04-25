const User = require("../models/User");
const AppError = require("../utils/AppError");

// Numeric hierarchy map — higher = more privileged
const ROLE_RANK = {
  user: 1,
  admin: 2,
  superadmin: 3,
};

const getRank = (role) => ROLE_RANK[role] ?? 0;

const preventSuperadminAssignment = (req, res, next) => {
  if (req.body.role && req.body.role === "superadmin") {
    return next(
      new AppError("Role 'superadmin' cannot be assigned via API.", 403)
    );
  }
  next();
};

const preventSelfRoleChange = (req, res, next) => {
  const targetId = req.params.id;
  const callerId = req.user._id.toString();

  if (targetId === callerId && req.body.role !== undefined) {
    return next(new AppError("You cannot change your own role.", 403));
  }
  next();
};

const validateTargetUser = ({ readOnly = false } = {}) => async (req, res, next) => {
  try {
    const target = await User.findById(req.params.id);

    if (!target) {
      return next(new AppError("User not found.", 404));
    }

    const callerRole  = req.user.role;
    const targetRole  = target.role;
    const callerRank  = getRank(callerRole);
    const targetRank  = getRank(targetRole);

    if (targetRole === "superadmin" && !readOnly) {
      return next(
        new AppError("The superadmin account cannot be modified or deleted via API.", 403)
      );
    }

    if (targetRole === "superadmin" && callerRole !== "superadmin") {
      return next(
        new AppError("You do not have permission to access this account.", 403)
      );
    }

    if (!readOnly && callerRank <= targetRank && callerRole !== "superadmin") {
      return next(
        new AppError(
          `You do not have permission to manage a user with role '${targetRole}'.`,
          403
        )
      );
    }

    if (callerRole === "admin" && targetRole !== "user") {
      return next(
        new AppError("Admins can only manage users with role 'user'.", 403)
      );
    }

    req.targetUser = target;
    next();
  } catch (error) {
    next(error);
  }
};

const preventRoleChange = (req, res, next) => {
  if (req.user.role !== "superadmin" && req.body.role !== undefined) {
    return next(
      new AppError("Only superadmin can change user roles.", 403)
    );
  }
  next();
};

const superadminOnly = (req, res, next) => {
  if (req.user.role !== "superadmin") {
    return next(
      new AppError("This action is restricted to superadmin only.", 403)
    );
  }
  next();
};


const Task = require('../models/Task');

const validateTaskAccess = () => async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id).populate('assignedTo', 'role');

    if (!task) {
      return next(new AppError('Task not found.', 404));
    }

    const callerId   = req.user._id.toString();
    const callerRole = req.user.role;

    if (callerRole === 'superadmin') {
      req.task = task;
      return next();
    }

    const assignedId  = task.assignedTo?._id?.toString() || task.assignedTo?.toString();
    const createdById = task.createdBy?.toString();

    if (callerRole === 'admin') {
      const assignedUserRole = task.assignedTo?.role;

      if (
        (assignedUserRole === 'admin' || assignedUserRole === 'superadmin') &&
        assignedId !== callerId
      ) {
        return next(
          new AppError('Admins cannot modify tasks belonging to other admins.', 403)
        );
      }

      req.task = task;
      return next();
    }

    if (assignedId !== callerId) {
      return next(
        new AppError('You are not authorized to modify this task.', 403)
      );
    }

    req.task = task;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  preventSuperadminAssignment,
  preventSelfRoleChange,
  preventRoleChange,
  validateTargetUser,
  validateTaskAccess,
  superadminOnly,
  getRank,
};
