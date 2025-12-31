import { sendError } from '@utils/responseHelper';
import { Response, NextFunction } from 'express';

export const tenantMiddleware = (req: any, res: Response, next: NextFunction) => {
  const user = req.user;

  if (user.role === 'SUPER_ADMIN') {
    return next();
  }

  if (!user.schoolId) {
    return sendError(res, "Access denied. You are not enrolled in any school.", [], 403);
  }

  req.schoolId = user.schoolId;
  next();
};