import { prisma } from "@config/database";
import { sendError, sendSuccess } from "@utils/responseHelper";
import { Request, Response } from "express";

export const createSchedules = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const schedules = await prisma.schedule.create({
      data,
      include: {
        class: true,
        teacher: true,
        subject: true
      }
    });
    return sendSuccess(res, "Schedule successfully arranged", schedules, 201);
  } catch (error: any) {
    return sendError(res, error.message);
  }
};

export const getSchedulesByClass = async (req: Request, res: Response) => {
  const { classId } = req.params;

  try {
    const schedules = await prisma.schedule.findMany({
      where: { classId },
      include: {
        teacher: { select: { firstName: true, lastName: true } },
        subject: { select: { name: true, code: true } }
      },
      orderBy: [
        { day: 'asc' },
        { startTime: 'asc' }
      ]
    });

    return sendSuccess(res, "Class schedule successfully retrieved", schedules)
  } catch (error:any) {
    return sendError(res, error.message);
  }
}