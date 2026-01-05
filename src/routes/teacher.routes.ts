import { authorizeRole, verifyToken } from "@middleware/authMiddleware";
import { Router } from "express";
import { Role } from "../../prisma/generated/enums";
import { createTeacher, deleteTeacher, getAllTeacher, getDetailTeacher, updateTeacher } from "@controllers/teacherController";
import { validationMiddleware } from "@middleware/validationMiddleware";
import { CreateTeacherDTO, UpdateTeacherDTO } from "@dto/teacher.dto";

const router = Router();

router.use(verifyToken, authorizeRole([Role.ADMIN, Role.TEACHER]));

router.get('/', getAllTeacher);
router.get('/:id', getDetailTeacher);
router.post('/register', validationMiddleware(CreateTeacherDTO), createTeacher);
router.patch('/:id', validationMiddleware(UpdateTeacherDTO), updateTeacher);
router.delete('/:id', deleteTeacher);

export default router;
