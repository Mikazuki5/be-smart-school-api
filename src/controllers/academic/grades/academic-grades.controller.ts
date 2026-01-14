import { prisma } from "@config/database";
import { sendError, sendSuccess } from "@utils/responseHelper";
import { Request, Response } from "express";

export const getGradeStudent = async (req: Request, res: Response) => {
  const { studentId } = req.params;

  try {
    const grade = await prisma.grade.findMany({
      where: { studentId },
      include: { subject: true }
    });
    
    return sendSuccess(res, "Data nilai siswa berhasil diambil", grade);
  } catch (error: any) {
    return sendError(res, error.message);
  }
}