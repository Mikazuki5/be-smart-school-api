import { prisma } from "@config/database";
import { sendError, sendSuccess } from "@utils/responseHelper";
import { Request, Response } from "express";

export const bulkGradeInput = async (req: Request, res: Response) => {
  const { subjectId, semester, schoolYear, data } = req.body;

  try {
    const resp = await prisma.$transaction(
      data.map((item: any) => {
        prisma.grade.upsert({
          where: {
            studentId_subjectId_semester_schoolYear: {
              studentId: item.studentId,
              subjectId,
              semester,
              schoolYear
            }
          },
          update: {
            assignment: item.assignment,
            dailyTask: item.dailyTask,
            practicalWork: item.practicalWork,
            midtermExam: item.midtermExam,
            finalExam: item.finalExam,
            practicalExam: item.practicalExam
          },
          create: {
            studentId: item.studentId,
            subjectId,
            semester,
            schoolYear,
            dailyTask: item.dailyTask,
            assignment: item.assignment,
            practicalWork: item.practicalWork,
            midtermExam: item.midtermExam,
            finalExam: item.finalExam,
            practicalExam: item.practicalExam
          }
        });
      })
    );

    return sendSuccess(res, "Grade has successfully update", resp);
  } catch (error: any) {
     return sendError(res, "Gagal input nilai", [error.message]);
  }
}