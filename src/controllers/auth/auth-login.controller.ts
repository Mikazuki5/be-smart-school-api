import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "@config/database.ts";
import { sendError, sendSuccess } from "@utils/responseHelper";

export const login = async (req: Request, res: Response) => {
  const { identifier, password } = req.body;

  try {
    const user = await prisma.user.findFirst({
      where: { OR: [{ username: identifier }, { email: identifier }] },
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return sendError(res, "Username atau password salah", [], 401);
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: "1d" }
    );

    return sendSuccess(res, "Login successful", { token, role: user.role });
  } catch (error: any) {
    return sendError(res, error.message);
  }
};