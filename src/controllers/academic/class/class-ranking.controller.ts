import { prisma } from "@config/database";
import { sendError, sendSuccess } from "@utils/responseHelper";
import { Request, Response } from "express";

export const getRankByClass = async (req: Request, res: Response) => {
  const { classId } = req.params;
  const { semester, schoolYear } = req.query;

  try {
    const studentList = await prisma.student.findMany({
      where: { classId },
      include: {
        grades: {
          where: {
            semester: Number(semester),
            schoolYear: String(schoolYear),
          },
        },
      },
    });

    const rankData = studentList.map((data) => {
      let totalValueOfStudent = 0;
      const totalSubject = data.grades.length;

      data.grades.forEach((v) => {
        const avgSubjects =
          v.dailyTask +
          v.assignment +
          v.finalExam +
          v.midtermExam +
          v.practicalExam +
          v.practicalExam +
          v.practicalWork;
        totalValueOfStudent += avgSubjects;
      });

      const avgFinal =
        totalSubject > 0 ? totalValueOfStudent / totalSubject : 0;

      return {
        studentId: data.id,
        fullname: `${data.firstName} ${data.lastName}`,
        totalValue: totalValueOfStudent.toFixed(2),
        average: avgFinal.toFixed(2),
        totalSubject,
      };
    });

    const sortRank = rankData
      .sort(
        (a, b) => Number(parseFloat(b.average)) - Number(parseFloat(a.average))
      )
      .map((items, index) => ({
        rank: index + 1,
        ...items,
      }));

    return sendSuccess(res, "Class ranking successfully calculated", sortRank);
  } catch (error: any) {
    return sendError(res, "Failed to calculate ranking", [error.message]);
  }
};
