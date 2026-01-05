import { prisma } from "@config/database";
import { sendError, sendSuccess } from "@utils/responseHelper";
import { Request, Response } from "express";

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