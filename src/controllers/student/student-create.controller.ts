import { prisma } from "@config/database";
import { sendError, sendSuccess } from "@utils/responseHelper";
import { Response, Request } from "express";
import bcrypt from "bcrypt";
import { Role } from "../../../prisma/generated/enums";

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
