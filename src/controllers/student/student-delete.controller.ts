import { prisma } from "@config/database";
import { sendError, sendSuccess } from "@utils/responseHelper";
import { Response, Request } from "express";

export const deleteStudentData = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await prisma.$transaction(async (data) => {
      const student = await data.student.findUnique({ where: { id } });

      if (!student) throw new Error("Student not found");

      await data.student.delete({ where: { id } });
      await data.user.delete({ where: { id: student.userId } });
    });

    return sendSuccess(res, "Student and account successfully deleted", null);
  } catch (error: any) {
    return sendError(res, error.message, [], 404);
  }
};