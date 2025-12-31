import { authorizeRole, verifyToken } from "@middleware/authMiddleware";
import { Router } from "express";
import { Role } from "../../prisma/generated/enums";
import { createStudent, deleteStudentData, getAllStudentData, getDetailStudent, getMyPaymentStatus, getMyReportCard, getMySchedule, updateStudentData } from "@controllers/studentController";
import { validationMiddleware } from "@middleware/validationMiddleware";
import { CreateStudentDTO, UpdateStudentDTO } from "@dto/student.dto";

const router = Router();

router.get('/', verifyToken, authorizeRole([Role.ADMIN, Role.TEACHER]), getAllStudentData);
router.get('/:studentId', verifyToken, authorizeRole([Role.ADMIN, Role.TEACHER, Role.STUDENT]), getDetailStudent);
router.post('/register', verifyToken, validationMiddleware(CreateStudentDTO), authorizeRole([Role.ADMIN]), createStudent);
router.patch('/:id', verifyToken, validationMiddleware(UpdateStudentDTO), authorizeRole([Role.ADMIN, Role.TEACHER, Role.STUDENT]), updateStudentData);
router.delete('/:id', verifyToken, authorizeRole([Role.ADMIN, Role.TEACHER]), deleteStudentData)

router.get('/todaySchedule', verifyToken, authorizeRole([Role.STUDENT]), getMySchedule);
router.get('/reportCard', verifyToken, authorizeRole([Role.STUDENT]), getMyReportCard);
router.get('/invoice', verifyToken, authorizeRole([Role.STUDENT]), getMyPaymentStatus);

export default router;
