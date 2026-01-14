import { prisma } from "@config/database";
import { sendError, sendSuccess } from "@utils/responseHelper";
import { Response, Request } from "express";

export const getDetailStudent = async (req: Request, res: Response) => {
  try {
    const { studentId } = req.params;
    const details = await prisma.student.findUnique({
      where: {
        id: studentId,
      },
      omit: {
        userId: true,
        classId: true,
      },
      include: {
        user: { select: { email: true } },
        class: {
          include: { department: { select: { id: true, name: true } } },
          omit: { departmentId: true, createdAt: true, updatedAt: true },
        },
        grades: {
          include: { subject: { select: { id: true, name: true } } },
          omit: { studentId: true, subjectId: true },
        },
        payments: { omit: { studentId: true } },
        attendance: { omit: { studentId: true } },
      },
    });

    if (!details) return sendError(res, "Student not found", [], 404);
    return sendSuccess(res, "Data student found", details);
  } catch (error: any) {
    return sendError(res, error.message);
  }
};