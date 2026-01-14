import { prisma } from "@config/database";
import { sendError, sendSuccess } from "@utils/responseHelper";
import { Request, Response } from "express";

export const createSubjects = async (req: Request, res: Response) => {
  try {
    const { name, code } = req.body;
    const subject = await prisma.subject.create({ data: { name, code } });

    return sendSuccess(res, "Subject added successfully!", subject, 201);
  } catch (error: any) {
    return sendError(res, error.message);
  }
};