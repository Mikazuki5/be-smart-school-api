import { prisma } from "@config/database";
import { sendSuccess, sendError } from "@utils/responseHelper";
import { Request, Response } from "express";

export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const [
      totalStudents,
      totalTeacher,
      totalClass,
      totalDepartment,
      paymentsStats,
      totalSubjects,
      attendanceStats,
    ] = await Promise.all([
      prisma.student.count(),
      prisma.teacher.count(),
      prisma.class.count(),
      prisma.department.count(),
      prisma.payment.groupBy({
        by: ["isPaid"],
        _count: { id: true },
        _sum: { amount: true },
      }),
      prisma.subject.count(),
      prisma.attendance.groupBy({
        by: ["status"],
        _count: { id: true },
      }),
    ]);

    const financeSummary = {
      paid: paymentsStats.find((data) => data.isPaid === true)?._count.id || 0,
      notPaid: paymentsStats.find((data) => data.isPaid !== true)?._count.id || 0,
      totalIncomes: paymentsStats.find((data) => data.isPaid === true)?._sum.amount || 0
    }

    const attendanceSummary = {
      present: attendanceStats.find((data) => data.status === 'PRESENT')?._count.id || 0,
      sick: attendanceStats.find((data) => data.status === 'SICK')?._count.id || 0,
      alpha: attendanceStats.find((data) => data.status === 'ALPHA')?._count.id || 0,
      permission: attendanceStats.find((data) => data.status === 'PERMISSION')?._count.id || 0,
    };

    const statsSummary = {
      counts: {
        teacher: totalTeacher,
        student: totalStudents,
        class: totalClass,
        department: totalDepartment,
        subject: totalSubjects
      },
      finance: financeSummary,
      attendance: attendanceSummary
    };

    return sendSuccess(res, "Dashboard statistics successfully retrieved", statsSummary);
  } catch (error:any) {
    return sendError(res, "Failed to fetch statistics", [error.message]);
  }
};