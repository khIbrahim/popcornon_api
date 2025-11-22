import { StatusCodes } from "http-status-codes";
import { AppError } from "../utils/errors.js";

/**
 * Global error handling middleware
 * Must be placed after all routes
 */
export function errorHandler(err, req, res, next) {
  console.error('Error:', err); // Add logging for debugging

  // Operational errors (AppError instances)
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err.errors || null,
    });
  }

  // Mongoose validation errors
  if (err.name === "ValidationError") {
    return res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: "Validation error",
      errors: Object.values(err.errors).map((e) => e.message), // Changed from error to errors
    });
  }

  // Mongoose duplicate key errors
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    return res.status(StatusCodes.CONFLICT).json({
      success: false,
      message: `Duplicate value for ${field}`,
    });
  }

  // Mongoose cast errors (invalid ObjectId)
  if (err.name === "CastError") {
    return res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: `Invalid ${err.path}: ${err.value}`,
    });
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      success: false,
      message: "Invalid token",
    });
  }

  if (err.name === "TokenExpiredError") {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      success: false,
      message: "Token expired",
    });
  }

  // Zod validation errors
  if (err.name === "ZodError") {
    return res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: "Validation error",
      errors: err.errors.map(e => e.message),
    });
  }

  // Default to 500 server error
  const statusCode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
  res.status(statusCode).json({
    success: false,
    message: process.env.NODE_ENV === "development" ? err.message : "Internal server error",
    ...(process.env.NODE_ENV === "development" && { 
      stack: err.stack,
      errors: err.errors || null 
    })
  });
}

/**
 * Not found middleware
 */
export function notFoundHandler(req, res) {
  res.status(StatusCodes.NOT_FOUND).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
}