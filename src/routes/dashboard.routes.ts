import { authorizeRole, verifyToken } from "@middleware/authMiddleware";
import { Router } from "express";
import { Role } from "../../prisma/generated/enums";
import { getDashboardStats, getTeacherDashboard } from "@controllers/index";

const router = Router();

router.use(verifyToken);

router.get('/teacher', authorizeRole([Role.TEACHER]), getTeacherDashboard);
router.get('/academic', authorizeRole([Role.TEACHER, Role.ADMIN]), getDashboardStats);

export default router;