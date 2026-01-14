import { prisma } from "@config/database";
import { sendError, sendSuccess } from "@utils/responseHelper";
import { Response, Request } from "express";
import { Role } from "../../../prisma/generated/enums";

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
