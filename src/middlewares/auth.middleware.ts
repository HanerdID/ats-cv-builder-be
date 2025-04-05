import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/user.model";
import mongoose from "mongoose";

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let token;

  // Check if auth header exists and starts with Bearer
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    // Set token from Bearer token
    token = req.headers.authorization.split(" ")[1];
  }
  // Check for token in cookies
  else if (req.cookies.token) {
    token = req.cookies.token;
  }

  // Make sure token exists
  if (!token) {
    return res.status(401).json({
      success: false,
      error: "Not authorized to access this route",
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      id: string;
    };

    // Check if user exists
    req.user = await User.findById(decoded.id);

    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: "User not found",
      });
    }

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: "Not authorized to access this route",
    });
  }
};

// Grant access to admin users
export const authorize = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user.role || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: `User role ${req.user.role} is not authorized to access this route`,
      });
    }
    next();
  };
};

// Check if user owns a resource or is an admin
export const checkOwnership = (model: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res
          .status(400)
          .json({ success: false, error: "Invalid ID format" });
      }

      const resource = await mongoose.model(model).findById(req.params.id);

      if (!resource) {
        return res
          .status(404)
          .json({ success: false, error: "Resource not found" });
      }

      // Check if user is the owner or an admin
      if (
        resource.user?.toString() !== req.user._id.toString() &&
        req.user.role !== "admin"
      ) {
        return res
          .status(403)
          .json({
            success: false,
            error: "Not authorized to access this resource",
          });
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};
