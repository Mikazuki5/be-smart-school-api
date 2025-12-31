import { authorizeRole, verifyToken } from "@middleware/authMiddleware";
import { Router } from "express";
import { Role } from "../../prisma/generated/enums";
import { bulkCreateAttendance, getAttendanceByClass, getTodayAttendanceStats, studentSelfAttendance } from "@controllers/attendanceController";
import { validationMiddleware } from "@middleware/validationMiddleware";
import { BulkAttendanceStudent } from "@dto/attendance.dto";

const routes = Router();

routes.use(verifyToken);

routes.post('/bulk', validationMiddleware(BulkAttendanceStudent), authorizeRole([Role.ADMIN, Role.TEACHER]), bulkCreateAttendance);

routes.post('/student', authorizeRole([Role.STUDENT]), studentSelfAttendance)

routes.get('/class/:classId', authorizeRole([Role.ADMIN, Role.TEACHER]), getAttendanceByClass);
routes.get('/stats/today', authorizeRole([Role.ADMIN]), getTodayAttendanceStats);

export default routes;