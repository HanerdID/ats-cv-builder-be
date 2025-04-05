import express from "express";
import {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  updateProfile,
  updatePassword,
} from "../controllers/user.controller";
import { protect, authorize } from "../middlewares/auth.middleware";

const router = express.Router();

// Protected routes
router.use(protect);

// User profile routes
router.put("/profile", updateProfile);
router.put("/password", updatePassword);

// Admin only routes
router.use(authorize(["admin"]));
router.route("/").get(getUsers).post(createUser);

router.route("/:id").get(getUser).put(updateUser).delete(deleteUser);

export default router;
