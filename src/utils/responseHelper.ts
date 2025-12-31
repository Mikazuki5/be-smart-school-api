import { Response } from 'express';

export const sendSuccess = (res: Response, message?: string, data?: any, statusCode = 200, meta?: any) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    meta,
  });
};

export const sendError = (res: Response, message?: string | string[], errors?: string[], statusCode = 500, meta?: any) => {
  return res.status(statusCode).json({
    success: false,
    message,
    errors,
    meta,
  });
};