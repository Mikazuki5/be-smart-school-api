import { prisma } from "@config/database";
import { sendError, sendSuccess } from "@utils/responseHelper";
import { Request, Response } from "express";

export const teacherInputAttendance = async (req: Request, res: Response) => {
  const { data } = req.body;

  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const dateStr = today.toISOString().split('T')[0];

    const result = await prisma.$transaction(data.map((items: any) => {
      const attendanceId = `${dateStr}-${items.studentId}`;
      return prisma.attendance.upsert({
        where: { id: attendanceId },
        update: { status: items.status },
        create: {
          id: attendanceId,
          studentId: items.studentId,
          status: items.status,
          date: today
        }
      });
    }));
    return sendSuccess(res, `Successfully recorded attendance for ${result.length} students`, result);
  } catch (error: any) {
    return sendError(res, "Gagal mencatat presensi", [error.message]);
  }
}