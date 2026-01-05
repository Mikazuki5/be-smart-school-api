import { prisma } from "@config/database";
import { sendError, sendSuccess } from "@utils/responseHelper";
import { Request, Response } from "express";

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