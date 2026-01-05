import { prisma } from "@config/database";
import { sendError, sendSuccess } from "@utils/responseHelper";
import { Request, Response } from "express";

export const getAllSubjects = async (req: Request, res: Response) => {
  try {
    const subjects = await prisma.subject.findMany();
    return sendSuccess(res, "List of subjects successfully fetching", subjects);
  } catch (error:any) {
    return sendError(res, error.message);
  }
};