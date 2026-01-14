import { prisma } from "@config/database";
import { sendError, sendSuccess } from "@utils/responseHelper";
import { Request, Response } from "express";

export const getAtttendanceRecapPerClass = async (req: Request, res: Response) => {
  const { classId } = req.params;
  const { month, year } = req.query;

  try {
    const m = parseInt(month as string) || new Date().getMonth() + 1;
    const y = parseInt(year as string) || new Date().getFullYear();

    const startDate = new Date(y, m - 1, 1);
    const endDate = new Date(y, m, 0, 23, 59, 59);

    const recap = await prisma.student.findMany({
      where: { classId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        attendance: {
          where: {
            date: {
              gte: startDate,
              lte: endDate
            }
          },
          select: {
            status: true
          }
        }
      }
    });
    
    const formattedRecap = recap.map((data) => {
      const counts = {
        PRESENT: 0,
        SICK: 0,
        ALPHA: 0,
        PERMISSION: 0
      };

      data.attendance.forEach((a) => {
        if (a.status in counts) {
          counts[a.status as keyof typeof counts]++;
        };
      });

      return {
        studentId: data.id,
        fullname: `${data.firstName} ${data.lastName}`,
        recap: counts,
        totalDays: data.attendance.length
      };
    });

    return sendSuccess(res, `Rekap absensi periode ${m}-${y} berhasil diambil`, formattedRecap);
  } catch (error: any) {
    return sendError(res, "Gagal mengambil rekap absensi", [error.message]);
  }
}