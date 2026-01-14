import { prisma } from "@config/database";
import { sendError, sendSuccess } from "@utils/responseHelper";
import { Response, Request } from "express";
import { StudentQuery } from "types/student";

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
    return sendError(res, error.message);
  }
};
