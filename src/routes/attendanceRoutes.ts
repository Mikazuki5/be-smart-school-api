import { authorizeRole, verifyToken } from "@middleware/authMiddleware";
import { Router } from "express";
import { Role } from "../../prisma/generated/enums";
import { validationMiddleware } from "@middleware/validationMiddleware";
import { BulkAttendanceStudent } from "@dto/attendance.dto";
import { bulkCreateAttendance, studentSelfAttendance, getAttendanceByClass, getTodayAttendanceStats, teacherInputAttendance, getAtttendanceRecapPerClass } from "@controllers/index";

const routes = Router();

routes.use(verifyToken);

routes.post('/bulk', validationMiddleware(BulkAttendanceStudent), authorizeRole([Role.ADMIN, Role.TEACHER]), bulkCreateAttendance);

routes.get('/recap/monts/:classId', authorizeRole([Role.ADMIN, Role.TEACHER]), getAtttendanceRecapPerClass);
routes.post('/student', authorizeRole([Role.STUDENT]), studentSelfAttendance);
routes.post('/teacher-submit', validationMiddleware(BulkAttendanceStudent), authorizeRole([Role.TEACHER]), teacherInputAttendance);

routes.get('/class/:classId', authorizeRole([Role.ADMIN, Role.TEACHER]), getAttendanceByClass);
routes.get('/stats/today', authorizeRole([Role.ADMIN]), getTodayAttendanceStats);

export default routes;