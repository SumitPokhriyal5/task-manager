import express from "express";
import {
  getAllUsers,
  deleteUser,
  updateUserStatus,
  getAllTasks,
  deleteAnyTask,
  getActivityLogs,
} from "../controllers/adminController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect, adminOnly);

router.get("/users", getAllUsers);
router.delete("/users/:id", deleteUser);
router.put("/users/:id/status", updateUserStatus);

router.get("/tasks", getAllTasks);
router.delete("/tasks/:id", deleteAnyTask);

router.get("/logs", getActivityLogs);

export default router;
