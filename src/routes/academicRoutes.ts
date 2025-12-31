import { assignTeacherOnSubject, createClass, createDepartment, createSchedule, getAllDepartment, getClassByDepartment, getDashboardStats, studentGradeInput } from '@controllers/academicController';
import { authorizeRole, verifyToken } from '@middleware/authMiddleware';
import { Router } from 'express';
import { Role } from '../../prisma/generated/enums';
import { validationMiddleware } from '@middleware/validationMiddleware';
import { CreateClassDTO, CreateDepartmentDTO } from '@dto/academic.dto';

const router = Router();

router.use(verifyToken)

// Admin: Mengatur relasi pengampu dan jadwal
router.post('/assign-teacher', authorizeRole([Role.ADMIN]), assignTeacherOnSubject);
router.post('/schedule', authorizeRole([Role.ADMIN]), createSchedule);

// Guru: Mengisi nilai (Hanya untuk Role GURU)
router.post('/grade-input', authorizeRole([Role.TEACHER]), studentGradeInput);

router.get('/dashboard-stats', authorizeRole([Role.TEACHER, Role.ADMIN]), getDashboardStats);

router.get('/department', authorizeRole([Role.ADMIN, Role.TEACHER]), getAllDepartment);
router.post('/department', validationMiddleware(CreateDepartmentDTO), authorizeRole([Role.ADMIN]), createDepartment);

router.post('/class',validationMiddleware(CreateClassDTO), authorizeRole([Role.ADMIN]), createClass);
router.get('/class/department/:departmentId', authorizeRole([Role.ADMIN]), getClassByDepartment);

export default router;