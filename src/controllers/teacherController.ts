import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { prisma } from "@config/database";
import { Role } from "../../prisma/generated/enums";
import { sendError, sendSuccess } from "@utils/responseHelper";

export const createTeacher = async (req: Request, res: Response) => {
  const { email, username, password, subjectIds, firstName, lastName } =
    req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await prisma.$transaction(async (data) => {
      const teacher = await data.user.create({
        data: { username, email, password: hashedPassword, role: Role.TEACHER },
      });

      return await data.teacher.create({
        data: {
          userId: teacher.id,
          firstName,
          lastName,
          subjects: {
            create: subjectIds?.map((id: string) => ({ subjectId: id })),
          },
        },
        include: {
          user: { select: { email: true, username: true } },
          subjects: { include: { subject: true } },
        },
      });
    });

    return sendSuccess(res, "Teacher has successfully registered", result, 201);
  } catch (error: any) {
    if (error.code === "P2002")
      return sendError(res, "Username/Email has been register", [], 400);
    return sendError(res, error.message);
  }
};

export const getAllTeacher = async (req: Request, res: Response) => {
  try {
    const { page = "1", limit = "10", search } = req.query;
    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);

    const whereCondition: any = search
      ? {
          OR: [
            {
              firstName: {
                contains: String(search),
                mode: "insensitive" as const,
              },
            },
          ],
        }
      : {};

    const [teachers, totalData] = await Promise.all([
      prisma.teacher.findMany({
        where: whereCondition,
        skip,
        take,
        include: {
          subjects: { include: { subject: true } },
          user: { select: { email: true } },
        },
        orderBy: { createdAt: "desc" },
      }),

      prisma.teacher.count({ where: whereCondition }),
    ]);

    const meta = {
      totalData,
      totalPage: Math.ceil(totalData / take),
      currentPage: Number(page),
      limit: take,
    };
    return sendSuccess(
      res,
      "Teacher list successfully retrieved",
      teachers,
      200,
      meta
    );
  } catch (error: any) {
    return sendError(res, error.message);
  }
};

export const getDetailTeacher = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await prisma.teacher.findUnique({
      where: { id },
      omit: { userId: true },
      include: {
        subjects: {
          select: {
            subject: {
              select: {
                id: true,
                name: true,
                schedules: {
                  select: {
                    id: true,
                    startTime: true,
                    endTime: true,
                    class: {
                      select: {
                        id: true,
                        name: true,
                        department: { select: { id: true, name: true } },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!result) return sendError(res, "Teacher data's not found!", [], 404);

    return sendSuccess(res, "Teacher data's found!", result);
  } catch (error: any) {
    return sendError(res, error.message);
  }
};

export const updateTeacher = async (req: Request, res: Response) => {
  const { id } = req.params;
  const {
    subjectIds,
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
    status,
  } = req.body;
  try {
    const result = await prisma.$transaction(async (data) => {
      const currentTeacher = await data.teacher.findUnique({ where: { id } });
      if (!currentTeacher) throw new Error("Teacher data's not found!");

      if (email || username || password)
        await data.user.update({
          where: { id: currentTeacher.userId },
          data: {
            ...(email && { email }),
            ...(username && { username }),
            ...(password && { password: await bcrypt.hash(password, 10) }),
          },
        });

      if (subjectIds) {
        await data.teacherOnSubject.deleteMany({ where: { teacherId: id } });
      }

      return await data.teacher.update({
        where: { id },
        data: {
          ...(firstName && { firstName }),
          ...(lastName && { lastName }),
          ...(address && { address }),
          ...(gender && { gender }),
          ...(pictureProfile && { pictureProfile }),
          ...(religion && { religion }),
          ...(status && { status }),
          ...(subjectIds && {
            subjects: subjectIds
              ? {
                  create: subjectIds.map((sId: string) => ({ subjectId: sId })),
                }
              : undefined,
          }),
        },
        include: { subjects: { include: { subject: true } } },
      });
    });

    return sendSuccess(
      res,
      "Teacher data has been successfully updated",
      result
    );
  } catch (error: any) {
    return sendError(res, error.message);
  }
};

export const deleteTeacher = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const teacher = await prisma.teacher.findUnique({ where: { id } });
    if (!teacher) return sendError(res, "Teacher data's not found!", [], 404);

    await prisma.user.delete({ where: { id: teacher.userId } });
    return sendSuccess(res, "Teacher successfully deleted");
  } catch (error: any) {
    return sendError(res, error.message);
  }
};
