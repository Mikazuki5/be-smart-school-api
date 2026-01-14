import { prisma } from "@config/database";
import { AttendanceStatus } from "@dto/attendance.dto";
import { handleGetDistance, SCHOOL_CONFIG } from "@utils/calculateDistance";
import { sendError, sendSuccess } from "@utils/responseHelper";
import { Request, Response } from "express";

export const studentSelfAttendance = async (req: any, res: Response) => {
  const userId = req.user.id;
  const { latitude, longitude } = req.body;

  try {
    const distance = handleGetDistance(latitude, longitude, SCHOOL_CONFIG.LAT, SCHOOL_CONFIG.LON);

    if (distance > SCHOOL_CONFIG.RADIUS_METER) {
      return sendError(res, `You are outside the school radius (${Math.round(distance)} meters)`, [], 403);
    }

    const student = await prisma.student.findUnique({
      where: { userId }
    })

    if (!student) {
      return sendError(res, "Student data not found", [], 404);
    }

    const today = new Date();
    today.setHours(0,0,0,0);

    const attendanceId = `${today.toISOString().split(`T`)[0]}-${student.id}`;
    const result = await prisma.attendance.upsert({
      where: { id: attendanceId },
      update: { status: AttendanceStatus.PRESENT },
      create: {
        id: attendanceId,
        studentId: student.id,
        status: AttendanceStatus.PRESENT,
        date: today
      }
    });

    return sendSuccess(res, "Independent attendance successful!", result);
  } catch (error: any) {
    return sendError(res, error.message);
  }
}