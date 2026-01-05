import { prisma } from "@config/database";
import { sendError, sendSuccess } from "@utils/responseHelper";
import { Request, Response } from "express";

export const getTodayAttendanceStats = async (req: Request, res: Response) => {
  try {
    const today = new Date();
    today.setHours(0,0,0,0);

    const stats = await prisma.attendance.groupBy({
      by: ['status'],
      where: { date: today },
      _count: { id: true }
    });

    return sendSuccess(res, "Statistic today attendance", stats);
  } catch (error: any) {
    return sendError(res, error.message);
  }
}