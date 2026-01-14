
import { prisma } from "@config/database";
import { AuthRequest } from "@middleware/authMiddleware";
import { sendError, sendSuccess } from "@utils/responseHelper";
import { Response } from "express";

export const getMySchedule = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;

    const student = await prisma.student.findUnique({
      where: { userId },
      select: { classId: true },
    });

    if (!student)
      return sendError(res, "Student profile not found!", [], 404);

    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const today = days[new Date().getDay()];

    const schedule = await prisma.schedule.findMany({
      where: {
        classId: student.classId,
        day: today,
      },
      include: {
        subject: { select: { name: true } },
        teacher: { select: { firstName: true } },
      },
      orderBy: { startTime: "asc" },
    });

    return sendSuccess(res, "", {today, schedule})
  } catch (error: any) {
    return sendError(res, error.message);
  }
};