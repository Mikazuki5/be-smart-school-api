import { prisma } from "@config/database";
import { sendError, sendSuccess } from "@utils/responseHelper";
import { Response, Request } from "express";

export const getFinancialSummary = async (res: Response) => {
  try {
    const summary = await prisma.payment.groupBy({
      by: ['isPaid'],
      _sum: { amount: true },
      _count: { id: true }
    });

    return sendSuccess(res, "", summary);
  } catch (error: any) {
    return sendError(res, error.message);
  }
};