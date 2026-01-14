import { prisma } from "@config/database";
import { sendError, sendSuccess } from "@utils/responseHelper";
import { Response } from "express";

export const createAnnouncement = async (req: any, res: Response) => {
  const { title, content, target } = req.body;
  const authorId = req.user.id;

  try {
    const announcement = await prisma.announcement.create({
      data: { title, content, target, authorId }
    });

    return sendSuccess(res, "Announcement successfully published", announcement, 201);
  } catch (error: any) {
    return sendError(res, error.message);
  }
}