import { prisma } from "@config/database";
import { sendError, sendSuccess } from "@utils/responseHelper";
import { Request, Response } from "express";

export const createSubjectWithAssigmentTeacher = async (req: Request, res: Response) => {
  const { name, code, teacherIds } = req.body;

  try {
    const existingTeachers = await prisma.teacher.findMany({
      where: { id: { in: teacherIds } }
    });

    if (existingTeachers.length !== teacherIds.length) {
      const foundIds = existingTeachers.map(t => t.id);
      const missingIds = teacherIds.filter((id: string) => !foundIds.includes(id));
      
      return sendError(res, `Beberapa ID Guru tidak ditemukan: ${missingIds.join(', ')}`, [], 400);
    }
    const subject = await prisma.subject.create({
      data: {
        name,
        code,
        teachers: {
          create: teacherIds.map((id: string) => ({
            teacher: { connect: { id } }
          }))
        }
      },
      include: { teachers: { include: { teacher: true } } }
    });

    return sendSuccess(res, "Subject and tutor successfully registered", subject);
  } catch (error:any) {
    return sendError(res, error.message);
  }
}