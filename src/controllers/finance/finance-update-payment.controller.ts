import { prisma } from "@config/database";
import { sendError, sendSuccess } from "@utils/responseHelper";
import { Response, Request } from "express";

export const updatePaymentStatus = async (req: Request, res: Response) => {
  const { paymentId } = req.params;
  const { paidOff } = req.body;

  try {
    const update = await prisma.payment.update({
      where: { id: paymentId },
      data: {
        isPaid: paidOff,
        ...(paidOff ? { paymentDate: new Date() } : { paymentDate: null }),
      },
    });
    
    return sendSuccess(res, "Successfully update payment invoice", update);
  } catch (error: any) {
    return sendError(res, error.message);
  }
};
