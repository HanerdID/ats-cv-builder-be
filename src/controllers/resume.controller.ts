import { Request, Response, NextFunction } from "express";
import Resume from "../models/resume.model";
import { ErrorResponse } from "../middlewares/error.middleware";

// @desc    Get all resumes for logged in user
// @route   GET /api/resumes
// @access  Private
export const getResumes = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const resumes = await Resume.find({ user: req.user.id });

    res.status(200).json({
      success: true,
      count: resumes.length,
      data: resumes,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single resume
// @route   GET /api/resumes/:id
// @access  Private
export const getResume = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const resume = await Resume.findById(req.params.id);

    if (!resume) {
      return next(
        new ErrorResponse(`Resume not found with id of ${req.params.id}`, 404)
      );
    }

    // Make sure user owns the resume
    if (resume.user.toString() !== req.user.id && req.user.role !== "admin") {
      return next(
        new ErrorResponse(
          `User ${req.user.id} is not authorized to access this resume`,
          401
        )
      );
    }

    res.status(200).json({
      success: true,
      data: resume,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new resume
// @route   POST /api/resumes
// @access  Private
export const createResume = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Add user to req.body
    req.body.user = req.user.id;

    const resume = await Resume.create(req.body);

    res.status(201).json({
      success: true,
      data: resume,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update resume
// @route   PUT /api/resumes/:id
// @access  Private
export const updateResume = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let resume = await Resume.findById(req.params.id);

    if (!resume) {
      return next(
        new ErrorResponse(`Resume not found with id of ${req.params.id}`, 404)
      );
    }

    // Make sure user owns the resume
    if (resume.user.toString() !== req.user.id && req.user.role !== "admin") {
      return next(
        new ErrorResponse(
          `User ${req.user.id} is not authorized to update this resume`,
          401
        )
      );
    }

    resume = await Resume.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: resume,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete resume
// @route   DELETE /api/resumes/:id
// @access  Private
export const deleteResume = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const resume = await Resume.findById(req.params.id);

    if (!resume) {
      return next(
        new ErrorResponse(`Resume not found with id of ${req.params.id}`, 404)
      );
    }

    // Make sure user owns the resume
    if (resume.user.toString() !== req.user.id && req.user.role !== "admin") {
      return next(
        new ErrorResponse(
          `User ${req.user.id} is not authorized to delete this resume`,
          401
        )
      );
    }

    await resume.deleteOne();

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Analyze resume for ATS
// @route   POST /api/resumes/:id/analyze-ats
// @access  Private
export const analyzeATS = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const resume = await Resume.findById(req.params.id);

    if (!resume) {
      return next(
        new ErrorResponse(`Resume not found with id of ${req.params.id}`, 404)
      );
    }

    // Make sure user owns the resume
    if (resume.user.toString() !== req.user.id && req.user.role !== "admin") {
      return next(
        new ErrorResponse(
          `User ${req.user.id} is not authorized to analyze this resume`,
          401
        )
      );
    }

    const { jobDescription } = req.body;

    if (!jobDescription) {
      return next(
        new ErrorResponse("Please provide a job description for analysis", 400)
      );
    }

    // Simple mock ATS analysis - in a real implementation, you'd use NLP or similar techniques
    const mockAnalysis = {
      lastScore: Math.floor(Math.random() * 30) + 70, // Random score 70-100
      targetJobTitle: "Job Position",
      jobDescription,
      keywordMatches: ["skill", "experience", "qualification"],
      missedKeywords: ["leadership", "teamwork"],
      suggestions: [
        "Add more specific skills mentioned in the job description",
        "Quantify your achievements with numbers",
        "Include more industry-specific keywords",
      ],
      lastAnalysis: new Date(),
    };

    // Update resume with ATS data
    resume.atsData = mockAnalysis;
    await resume.save();

    res.status(200).json({
      success: true,
      data: mockAnalysis,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Duplicate resume
// @route   POST /api/resumes/:id/duplicate
// @access  Private
export const duplicateResume = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const resume = await Resume.findById(req.params.id);

    if (!resume) {
      return next(
        new ErrorResponse(`Resume not found with id of ${req.params.id}`, 404)
      );
    }

    // Make sure user owns the resume
    if (resume.user.toString() !== req.user.id && req.user.role !== "admin") {
      return next(
        new ErrorResponse(
          `User ${req.user.id} is not authorized to duplicate this resume`,
          401
        )
      );
    }

    // Create new resume object, excluding _id and modifying title
    const resumeData = resume.toObject();
    delete resumeData._id;
    resumeData.title = `${resumeData.title} (Copy)`;
    resumeData.createdAt = new Date();
    resumeData.updatedAt = new Date();

    const newResume = await Resume.create(resumeData);

    res.status(201).json({
      success: true,
      data: newResume,
    });
  } catch (error) {
    next(error);
  }
};
