import { Request, Response } from "express";

import { prisma } from "@config/database.ts";
import { AuthRequest } from "@middleware/authMiddleware";
import { sendError, sendSuccess } from "@utils/responseHelper";

export const studentGradeInput = async (req: AuthRequest, res: Response) => {
  const {
    dailyTask,
    practicalWork,
    studentId,
    subjectId,
    assignment,
    midtermExam,
    finalExam,
    practicalExam,
    semester,
    schoolYear
  } = req.body;
  const userId = req.user?.id;

  try {
    const teacher = await prisma.teacher.findUnique({ where: { userId } });
    if (!teacher)
      return sendError(res, "Teacher profile not found.", [], 404);

    const isSubjectTeacher = await prisma.teacherOnSubject.findUnique({
      where: {
        teacherId_subjectId: {
          teacherId: teacher.id,
          subjectId: subjectId,
        },
      },
    });

    if (!isSubjectTeacher) {
      return sendError(res, "You are not entitled to give a grade to this subject.", [], 404);
    }

    const grade = await prisma.grade.create({
      data: {
        studentId,
        subjectId,
        assignment,
        midtermExam,
        finalExam,
        practicalExam,
        semester,
        dailyTask,
        practicalWork,
        schoolYear
      },
    });

    sendSuccess(res, "Value saved successfully", grade, 201);
  } catch (error: any) {
    sendError(res, error.message);
  }
};