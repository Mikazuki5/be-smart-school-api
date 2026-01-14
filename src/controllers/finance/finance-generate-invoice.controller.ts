import { prisma } from "@config/database";
import { sendError, sendSuccess } from "@utils/responseHelper";
import { Response, Request } from "express";

export const generateMonthlyInvoice = async (req: Request, res: Response) => {
  const { month, year, amount } = req.body;

  try {
    const allStudent = await prisma.student.findMany({
      select: { id: true },
    });

    const createInvoice = await prisma.$transaction(
      allStudent.map((student) =>
        prisma.payment.create({
          data: {
            studentId: student.id,
            year: parseInt(year),
            amount: parseFloat(amount),
            isPaid: true,
            month,
          },
        })
      )
    );

    return sendSuccess(
      res,
      `Success generate ${createInvoice.length} invoices for ${month}`,
      createInvoice,
      201
    );
  } catch (error: any) {
    return sendError(res, error.message);
  }
};
