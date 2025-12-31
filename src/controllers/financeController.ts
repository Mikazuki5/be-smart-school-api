import { prisma } from "@config/database";
import { Response, Request } from "express";

export const generateMonthlyInvoice = async (req: Request, res: Response) => {
  const { month, year, amount } = req.body;

  try {
    const allStudent = await prisma.student.findMany({
      select: { id:  true }
    });

    const createInvoice = await prisma.$transaction(
      allStudent.map((student) => 
        prisma.payment.create({
          data: {
            studentId: student.id,
            year: parseInt(year),
            amount: parseFloat(amount),
            isPaid: true,
            month
          }
        })
      )
    )

    res.status(201).json({ error: false, message: `Success generate ${createInvoice.length} invoices for ${month}` })
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

export const updatePaymentStatus = async (req: Request, res: Response) => {
  const { paymentId } = req.params;
  const { paidOff } = req.body;

  try {
    const update = await prisma.payment.update({
      where: { id:  paymentId },
      data: {
        isPaid: paidOff,
        ...(paidOff ? { paymentDate: new Date() } : { paymentDate: null })
      }
    });

    res.json({ error: false, message: `Successfully update payment invoice`, data: update });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

export const getFinancialSummary = async (res: Response) => {
  try {
    const summary = await prisma.payment.groupBy({
      by: ['isPaid'],
      _sum: { amount: true },
      _count: { id: true }
    });

    res.json(summary);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};