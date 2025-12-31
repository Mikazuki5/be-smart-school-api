import { prisma } from "@config/database";
import { AttendanceStatus } from "@dto/attendance.dto";
import { sendError, sendSuccess } from "@utils/responseHelper";
import { Request, Response } from "express";

const SCHOOL_CONFIG = {
  LAT: -7.0245336, // Contoh: Monas, Jakarta
  LON: 107.5368327,
  RADIUS_METER: 100 // Jarak maksimal siswa boleh absen
};

const handleGetDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 6371e3;
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lon2 - lon1) * Math.PI / 180;

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
};

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