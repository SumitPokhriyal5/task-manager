import mongoose from "mongoose";

const activityLogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    action: {
      type: String,
      enum: ["LOGIN", "TASK_CREATE", "TASK_UPDATE", "TASK_DELETE"],
      required: true,
    },
    detail: {
      type: String,
      default: "",
    },
  },
  { timestamps: true },
);

const ActivityLog = mongoose.model("ActivityLog", activityLogSchema);
export default ActivityLog;
