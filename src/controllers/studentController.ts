import { prisma } from "@config/database";
import { AuthRequest } from "@middleware/authMiddleware";
import { sendError, sendSuccess } from "@utils/responseHelper";
import { Response, Request } from "express";
import { StudentQuery } from "types/student";
import bcrypt from "bcrypt";
import { Role } from "../../prisma/generated/enums";

export const createStudent = async (req: Request, res: Response) => {
  const { username, password, firstName, lastName, classId, email } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await prisma.$transaction(async (data) => {
      const student = await data.user.create({
        data: { username, password: hashedPassword, role: Role.STUDENT, email },
      });

      return await data.student.create({
        data: {
          firstName,
          lastName,
          userId: student.id,
          classId,
        },
        include: {
          user: { select: { email: true, username: true } },
          class: true,
        },
      });
    });

    return sendSuccess(res, "Student successfully registered", result, 201);
  } catch (error: any) {
    if (error.code === "P2002")
      return sendError(res, "Username or Email is already registered", [], 400);
    return sendError(res, error.message);
  }
};

export const getAllStudentData = async (req: Request, res: Response) => {
  try {
    const {
      page = "1",
      limit = "10",
      search,
      departmentId,
      classId,
    } = req.query as StudentQuery;

    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);

    const whereCondition: any = {
      AND: [
        search
          ? {
              OR: [
                { firstName: { contains: search, mode: "insensitive" } },
                { user: { email: { contains: search, mode: "insensitive" } } },
              ],
            }
          : {},
        departmentId ? { class: { classId } } : {},
        classId ? { classId } : {},
      ],
    };

    const [students, totalData] = await Promise.all([
      prisma.student.findMany({
        where: whereCondition,
        skip,
        take,
        include: {
          class: {
            omit: { departmentId: true, createdAt: true, updatedAt: true },
          },
        },
        omit: {
          userId: true,
          classId: true,
          address: true,
          gender: true,
          pictureProfile: true,
          phoneNumber: true,
          religion: true,
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.student.count({ where: whereCondition }),
    ]);

    const meta = {
      totalData,
      totalPage: Math.ceil(totalData / take),
      currentPage: Number(page),
      limit: take,
    };

    return sendSuccess(res, "", students, 200, meta);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getDetailStudent = async (req: Request, res: Response) => {
  try {
    const { studentId } = req.params;
    const details = await prisma.student.findUnique({
      where: {
        id: studentId,
      },
      omit: {
        userId: true,
        classId: true,
      },
      include: {
        user: { select: { email: true } },
        class: {
          include: { department: { select: { id: true, name: true } } },
          omit: { departmentId: true, createdAt: true, updatedAt: true },
        },
        grades: {
          include: { subject: { select: { id: true, name: true } } },
          omit: { studentId: true, subjectId: true },
        },
        payments: { omit: { studentId: true } },
        attendance: { omit: { studentId: true } },
      },
    });

    if (!details) return sendError(res, "Student not found", [], 404);
    return sendSuccess(res, "Data student found", details);
  } catch (error: any) {
    return sendError(res, error.message);
  }
};

export const updateStudentData = async (req: Request, res: Response) => {
  const { id } = req.params;
  const {
    classId,
    email,
    username,
    firstName,
    lastName,
    password,
    address,
    gender,
    pictureProfile,
    religion,
    phoneNumber,
  } = req.body;

  try {
    const updateStudent = await prisma.$transaction(async (data) => {
      const studentId = await data.student.findUnique({ where: { id } });

      if (!studentId) throw new Error("Student not found");
      if (email || username || password)
        await data.user.update({
          where: { id: studentId.userId },
          data: {
            ...(email && { email }),
            ...(username && { username }),
            ...(password && { password }),
          },
        });

      return await data.student.update({
        where: { id: studentId.id },
        data: {
          ...(Role.ADMIN && classId && { classId }),
          ...(firstName && { firstName }),
          ...(lastName && { lastName }),
          ...(address && { address }),
          ...(gender && { gender }),
          ...(pictureProfile && { pictureProfile }),
          ...(religion && { religion }),
          ...(phoneNumber && { phoneNumber }),
        },
        include: {
          user: { select: { email: true, username: true } },
          class: true,
        },
      });
    });

    return sendSuccess(
      res,
      "Student data has been successfully updated",
      updateStudent
    );
  } catch (error: any) {
    return sendError(
      res,
      error.message,
      [],
      error.message === "Student not found" ? 404 : 500
    );
  }
};

export const deleteStudentData = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await prisma.$transaction(async (data) => {
      const student = await data.student.findUnique({ where: { id } });

      if (!student) throw new Error("Student not found");

      await data.student.delete({ where: { id } });
      await data.user.delete({ where: { id: student.userId } });
    });

    return sendSuccess(res, "Student and account successfully deleted", null);
  } catch (error: any) {
    return sendError(res, error.message, [], 404);
  }
};

export const getMyReportCard = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const reportCard = await prisma.grade.findMany({
      where: {
        student: { userId },
      },
      include: {
        subject: {
          select: { name: true },
        },
      },
    });

    const finalResult = reportCard.map((value) => {
      const finalScore =
        value.assignment * 0.2 +
        value.midtermExam * 0.25 +
        value.finalExam * 0.3 +
        value.practicalExam * 0.25;

      let predicate = "D";
      if (finalScore >= 85) predicate = "A";
      else if (finalScore >= 75) predicate = "B";
      else if (finalScore >= 65) predicate = "C";

      return {
        subject: value.subject.name,
        details: {
          assigment: value.assignment,
          midtermExam: value.midtermExam,
          finalExam: value.finalExam,
          practicalExam: value.practicalExam,
        },
        finalScore: finalScore.toFixed(2),
        predicate,
      };
    });

    res.json({ data: finalResult });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getMyPaymentStatus = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const userInvoice = await prisma.payment.findMany({
      where: {
        student: { userId },
      },
      orderBy: [{ year: "desc" }, { month: "asc" }],
    });

    res.json({ error: false, data: userInvoice });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
