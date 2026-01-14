import { prisma } from "@config/database";
import { sendError, sendSuccess } from "@utils/responseHelper";
import { Request, Response } from "express";

export const getTeacherDashboard = async (req: any, res: Response) => {
  const userId = req.user.id;
  try {
    const teacher = await prisma.teacher.findUnique({
      where: { userId },
      include: {
        subjects: {
          include: {
            subject: true
          }
        },
        schedules: {
          include: {
            class: true,
            subject: true
          }
        }
      }
    });

    if (!teacher) {
      return sendError(res, "Teacher profile not found", [], 404);
    };

    const today = new Date().toLocaleDateString('en-EN', { weekday: 'long' }).toUpperCase();

    const dashboardData = {
      profile: {
        name: `${teacher.firstName} ${teacher.lastName}`,
        nip: teacher.nip || '-'
      },
      statistic: {
        totalSubjects: teacher.subjects.length,
        totalSchedules: teacher.schedules.length
      },
      mySubjects: teacher.schedules.filter((data) => data.day === today).map((items) => ({
        time: `${items.startTime} - ${items.endTime}`,
        subject: items.subject.name,
        class: items.class.name
      }))
    };

    return sendSuccess(res, "Dashboard data retrieved successfully", dashboardData)
  } catch (error: any) {
    return sendError(res, error.message);
  }
}