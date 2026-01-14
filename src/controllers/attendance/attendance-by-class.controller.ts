import { prisma } from "@config/database";
import { sendError, sendSuccess } from "@utils/responseHelper";
import { Request, Response } from "express";

export const getAttendanceByClass = async (req: Request, res: Response) => {
  const { classId } = req.params;
  const { dateAttendance } = req.query;

  try {
    const targetDate = dateAttendance ? new Date(String(dateAttendance)) : new Date();
    targetDate.setHours(0,0,0,0);

    const attendance = await prisma.attendance.findMany({
      where: {
        date: targetDate,
        student: { classId }
      },
      include: {
        student: { select: { firstName: true, lastName: true } }
      }
    });

    return sendSuccess(res, `Data attendance with date ${targetDate.toLocaleDateString()} has succesfuly fetching`, attendance);
  } catch (error: any) {
    return sendError(res, error.message);
  }
}