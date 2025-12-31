import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Role } from "../../prisma/generated/enums.js";
import { prisma } from "@config/database.ts";

export const teacherRegister = async (req: Request, res: Response) => {
  const { username, password, firstName, lastName, subject, email } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await prisma.$transaction(async (data) => {
      const teacherAccount = await data.user.create({
        data: {
          username,
          password: hashedPassword,
          role: Role.TEACHER,
          email
        },
      });

      const teacherProfile = await data.teacher.create({
        data: {
          userId: teacherAccount.id,
          firstName,
          lastName,
          subjects: {
            create: subject,
          },
        },
      });

      return { teacherAccount, teacherProfile };
    });

    res
      .status(201)
      .json({ message: "Guru berhasil didaftarkan", data: result });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  const { identifier, password } = req.body;

  try {
    const user = await prisma.user.findFirst({
      where: { OR: [{ username: identifier }, { email: identifier }] },
    });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Username atau password salah" });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: "1d" }
    );

    res.json({ token, role: user.role });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
