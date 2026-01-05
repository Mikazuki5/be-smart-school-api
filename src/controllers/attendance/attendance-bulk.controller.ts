import { prisma } from "@config/database";
import { sendError, sendSuccess } from "@utils/responseHelper";
import { Request, Response } from "express";

export const bulkCreateAttendance = async (req: Request, res: Response) => {
  const { data } = req.body;
  const today = new Date();
  today.setHours(0,0,0,0);

  try {
    const result = await prisma.$transaction(
      data.map((items: any) => {
        prisma.attendance.upsert({
          where: {
            id: `${today.toISOString()}-${items.studentId}`
          },
          update: { status: items.status },
          create: {
            id: `${today.toISOString()}-${items.studentId}`,
            studentId: items.studentId,
            status: items.status,
            date: today
          }
        })
      })
    );

    return sendSuccess(res, "Attendance successfuly created", result);
  } catch (error: any) {
    return sendError(res, "Gagal mencatat absensi", [error.message]);
  }
};