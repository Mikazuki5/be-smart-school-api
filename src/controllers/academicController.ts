import { Request, Response } from "express";

import { prisma } from "@config/database.ts";
import { AuthRequest } from "@middleware/authMiddleware";
import { sendError, sendSuccess } from "@utils/responseHelper";

export const assignTeacherOnSubject = async (req: Request, res: Response) => {
  const { teacherId, subjectId } = req.body;

  try {
    const link = await prisma.teacherOnSubject.create({
      data: {
        teacherId,
        subjectId,
      },
    });
    res
      .status(201)
      .json({ message: "Guru berhasil ditugaskan ke Mapel", data: link });
  } catch (error: any) {
    res
      .status(500)
      .json({ error: "Gagal menugaskan guru. Mungkin relasi sudah ada." });
  }
};

export const createSchedule = async (req: Request, res: Response) => {
  const { day, startTime, endTime, classId, subjectId, teacherId } = req.body;

  try {
    const jadwal = await prisma.schedule.create({
      data: { day, startTime, endTime, classId, subjectId, teacherId },
    });
    res.status(201).json(jadwal);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const studentGradeInput = async (req: AuthRequest, res: Response) => {
  const {
    studentId,
    subjectId,
    assignment,
    midtermExam,
    finalExam,
    practicalExam,
    semester,
  } = req.body;
  const userId = req.user?.id;

  try {
    // 1. Cari Profil Guru berdasarkan User ID yang sedang login
    const teacher = await prisma.teacher.findUnique({ where: { userId } });
    if (!teacher)
      return res.status(404).json({ message: "Profil guru tidak ditemukan" });

    // 2. VALIDASI: Apakah guru ini mengampu mapel tersebut? (Many-to-Many Check)
    const isSubjectTeacher = await prisma.teacherOnSubject.findUnique({
      where: {
        teacherId_subjectId: {
          teacherId: teacher.id,
          subjectId: subjectId,
        },
      },
    });

    if (!isSubjectTeacher) {
      return res
        .status(403)
        .json({ message: "Anda tidak berhak memberi nilai pada Mapel ini" });
    }

    // 3. Simpan atau Update Nilai (Upsert)
    const nilai = await prisma.grade.create({
      data: {
        studentId,
        subjectId,
        assignment,
        midtermExam,
        finalExam,
        practicalExam,
        semester,
      },
    });

    res.status(201).json({ message: "Nilai berhasil disimpan", data: nilai });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const createDepartment = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    const department = await prisma.department.create({ data: { name } });
    return sendSuccess(
      res,
      "The department was successfully created",
      department,
      201
    );
  } catch (error: any) {
    return sendError(res, error.message);
  }
};

export const getAllDepartment = async (req: Request, res: Response) => {
  try {
    const department = await prisma.department.findMany({
      include: { _count: { select: { classes: true } } },
    });
    return sendSuccess(
      res,
      "List of department successfully taken",
      department
    );
  } catch (error: any) {
    return sendError(res, error.message);
  }
};

export const createClass = async (req: Request, res: Response) => {
  try {
    const { name, gradeLevel, departmentId } = req.body;
    const classData = await prisma.class.create({
      data: { name, gradeLevel, departmentId },
      include: { department: true },
    });

    return sendSuccess(res, "Class created successfully", classData);
  } catch (error: any) {
    return sendError(res, error.message);
  }
};

export const getClassByDepartment = async (req: Request, res: Response) => {
  try {
    const { departmentId } = req.params;
    const classes = await prisma.class.findMany({
      where: { departmentId },
      include: { _count: { select: { students: true } } },
    });

    return sendSuccess(res, "Class list successfully retrieved", classes);
  } catch (error: any) {
    return sendError(res, error.message);
  }
};

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
