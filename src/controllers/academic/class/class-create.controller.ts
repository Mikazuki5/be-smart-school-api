import { prisma } from "@config/database";
import { sendError, sendSuccess } from "@utils/responseHelper";
import { Request, Response } from "express";

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