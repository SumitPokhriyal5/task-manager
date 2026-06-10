import ActivityLog from "../models/ActivityLog.js";

const logActivity = async (userId, action, detail = "") => {
  try {
    await ActivityLog.create({ user: userId, action, detail });
  } catch (error) {
    console.error("Failed to log activity:", error.message);
  }
};

export default logActivity;
