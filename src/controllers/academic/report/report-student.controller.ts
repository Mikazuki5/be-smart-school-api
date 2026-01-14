import { prisma } from "@config/database";
import { AuthRequest } from "@middleware/authMiddleware";
import { sendError, sendSuccess } from "@utils/responseHelper";
import { Response } from "express";

export const getMyReportCard = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const reportCard = await prisma.grade.findMany({
      where: {
        student: { userId },
      },
      include: {
        subject: {
          select: { name: true },
        },
      },
    });

    const finalResult = reportCard.map((value) => {
      const finalScore =
        value.assignment * 0.2 +
        value.midtermExam * 0.25 +
        value.finalExam * 0.3 +
        value.practicalExam * 0.25;

      let predicate = "D";
      if (finalScore >= 85) predicate = "A";
      else if (finalScore >= 75) predicate = "B";
      else if (finalScore >= 65) predicate = "C";

      return {
        subject: value.subject.name,
        details: {
          assigment: value.assignment,
          midtermExam: value.midtermExam,
          finalExam: value.finalExam,
          practicalExam: value.practicalExam,
        },
        finalScore: finalScore.toFixed(2),
        predicate,
      };
    });

    return sendSuccess(res, "", finalResult);
  } catch (error: any) {
    return sendError(res, error.message);
  }
};
