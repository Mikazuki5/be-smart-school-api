import { Request, Response } from "express";

import { prisma } from "@config/database.ts";
import { sendError, sendSuccess } from "@utils/responseHelper";

export const assignTeacherOnSubject = async (req: Request, res: Response) => {
  const { teacherId, subjectId } = req.body;

  try {
    const link = await prisma.teacherOnSubject.create({
      data: {
        teacherId,
        subjectId,
      },
    });
    return sendSuccess(res, "Guru berhasil ditugaskan ke Mapel", link, 201);
  } catch (error: any) {
    return sendError(res, "Gagal menugaskan guru. Mungkin relasi sudah ada.");
  }
};
