import User from "../models/User.js";
import Task from "../models/Task.js";
import ActivityLog from "../models/ActivityLog.js";

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    if (req.params.id === req.user._id.toString()) {
      return res
        .status(400)
        .json({ message: "You cannot delete your own account" });
    }

    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await Task.deleteMany({ owner: user._id });

    res.json({ message: "User deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateUserStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!["Active", "Inactive"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    if (req.params.id === req.user._id.toString()) {
      return res
        .status(400)
        .json({ message: "You cannot change your own status" });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true },
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find()
      .populate("owner", "name email")
      .sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteAnyTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.json({ message: "Task deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getActivityLogs = async (req, res) => {
  try {
    const logs = await ActivityLog.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .limit(200);
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
