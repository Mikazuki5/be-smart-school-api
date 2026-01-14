import { prisma } from "@config/database";
import { Response } from "express";
import { Role } from "../../../../prisma/generated/enums";
import { sendError, sendSuccess } from "@utils/responseHelper";

export const getAnnouncementForUser = async (req: any, res: Response) => {
  const { role } = req.user;

  try {
    const announcement = await prisma.announcement.findMany({
      where: {
        OR: [
          { target: 'ALL' },
          { target: role === Role.TEACHER ? 'TEACHER' : 'STUDENT' }
        ]
      },
      include: {
        author: { select: { username: true, email: true } }
      },
      orderBy: { createdAt: 'desc' },
      take: 5
    });

    return sendSuccess(res, "Announcement list successfully retrieved", announcement);
  } catch (error: any) {
    return sendError(res, error.message);
  }
}