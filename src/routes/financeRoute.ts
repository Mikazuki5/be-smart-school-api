import { authorizeRole, verifyToken } from "@middleware/authMiddleware";
import { Router } from "express";
import { Role } from "../../prisma/generated/enums";
import { generateMonthlyInvoice, getFinancialSummary, updatePaymentStatus } from "@controllers/financeController";

const router = Router();

router.post('/generate', verifyToken, authorizeRole([Role.ADMIN]), generateMonthlyInvoice);
router.patch('/update/:paymentId', verifyToken, authorizeRole([Role.ADMIN]), updatePaymentStatus);
router.get('/summary', verifyToken, authorizeRole([Role.ADMIN]), getFinancialSummary);

export default router;