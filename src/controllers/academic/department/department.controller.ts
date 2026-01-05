import { prisma } from "@config/database";
import { sendError, sendSuccess } from "@utils/responseHelper";
import { Request, Response } from "express";

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