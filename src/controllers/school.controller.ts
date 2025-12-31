import { prisma } from "@config/database";
import { sendError, sendSuccess } from "@utils/responseHelper";
import { Request, Response } from "express";

export const createSchool = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const school = await prisma.school.create({ data });

    return sendSuccess(res, "School successfully registered", school, 201);
  } catch (error: any) {
    return sendError(res, error.message);
  }
};

export const getAllSchool = async (req: Request, res: Response) => {
  try {
    const schools = await prisma.school.findMany({
      include: {_count: { select: { students: true, teachers: true } }}
    });
    return sendSuccess(res, "School list successfully retrieved", schools);
  } catch (error: any) {
    return sendError(res, error.message);
  }
}