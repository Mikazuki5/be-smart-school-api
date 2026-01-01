import { assignTeacherOnSubject, createClass, createDepartment, getAllDepartment, getClassByDepartment, studentGradeInput } from '@controllers/academicController';
import { authorizeRole, verifyToken } from '@middleware/authMiddleware';
import { Router } from 'express';
import { Role } from '../../prisma/generated/enums';
import { validationMiddleware } from '@middleware/validationMiddleware';
import { CreateClassDTO, CreateDepartmentDTO } from '@dto/academic.dto';
import { createSchedules, getSchedulesByClass } from '@controllers/schedules.controller';
import { CreateSchedulesDTO } from '@dto/schedules.dto';
import { createSubjects, createSubjectWithAssigmentTeacher, getAllSubjects } from '@controllers/subjects.controller';
import { CreateSubjectsDTO, CreateSubjectsWithTeacherDTO } from '@dto/subjects.dto';

const router = Router();

router.use(verifyToken)

// Admin: Mengatur relasi pengampu dan jadwal
router.post('/assign-teacher', authorizeRole([Role.ADMIN]), assignTeacherOnSubject);

router.get('/schedule/:classId', authorizeRole([Role.ADMIN, Role.STUDENT, Role.STUDENT]), getSchedulesByClass)
router.post('/schedule', authorizeRole([Role.ADMIN]), validationMiddleware(CreateSchedulesDTO), createSchedules);

router.get('/subject', authorizeRole([Role.ADMIN, Role.STUDENT, Role.STUDENT]), getAllSubjects);
router.post('/subject', authorizeRole([Role.ADMIN]), validationMiddleware(CreateSubjectsDTO), createSubjects);
router.post('/subject-teacher', authorizeRole([Role.ADMIN]), validationMiddleware(CreateSubjectsWithTeacherDTO), createSubjectWithAssigmentTeacher);

// Guru: Mengisi nilai (Hanya untuk Role GURU)
router.post('/grade-input', authorizeRole([Role.TEACHER]), studentGradeInput);

router.get('/department', authorizeRole([Role.ADMIN, Role.TEACHER]), getAllDepartment);
router.post('/department', validationMiddleware(CreateDepartmentDTO), authorizeRole([Role.ADMIN]), createDepartment);

router.post('/class',validationMiddleware(CreateClassDTO), authorizeRole([Role.ADMIN]), createClass);
router.get('/class/department/:departmentId', authorizeRole([Role.ADMIN]), getClassByDepartment);

export default router;