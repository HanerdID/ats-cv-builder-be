import express from "express";
import {
  getResumes,
  getResume,
  createResume,
  updateResume,
  deleteResume,
  analyzeATS,
  duplicateResume,
} from "../controllers/resume.controller";
import { protect, checkOwnership } from "../middlewares/auth.middleware";

const router = express.Router();

// All resume routes require authentication
router.use(protect);

// Basic CRUD routes
router.route("/").get(getResumes).post(createResume);

router
  .route("/:id")
  .get(checkOwnership("Resume"), getResume)
  .put(checkOwnership("Resume"), updateResume)
  .delete(checkOwnership("Resume"), deleteResume);

// Special resume operations
router.post("/:id/analyze-ats", checkOwnership("Resume"), analyzeATS);
router.post("/:id/duplicate", checkOwnership("Resume"), duplicateResume);

export default router;
