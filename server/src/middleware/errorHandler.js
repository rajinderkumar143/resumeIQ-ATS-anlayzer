import multer from 'multer';
import { errorResponse } from '../utils/apiResponse.js';

export const errorHandler = (err, req, res, next) => {
  console.error('🚨 Global Error Handler Caught Exception:');
  console.error(err);

  // Multer File Upload Errors
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return errorResponse(res, 'File size exceeds the 5MB maximum limit.', 400);
    }
    return errorResponse(res, `Upload error: ${err.message}`, 400);
  }

  // Prisma Database Specific Errors
  if (err.code === 'P2002') {
    return errorResponse(res, 'A record with this unique identifier already exists.', 409);
  }
  if (err.code === 'P2025') {
    return errorResponse(res, 'Record not found in the database.', 404);
  }

  // Custom Application Errors
  const statusCode = err.statusCode || 500;
  const message = err.message || 'An unexpected internal server error occurred.';

  return errorResponse(res, message, statusCode, process.env.NODE_ENV === 'development' ? err.stack : null);
};
