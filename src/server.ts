import 'reflect-metadata';

import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import authRoutes from '@routes/authRoutes.ts'
import academicRoutes from '@routes/academicRoutes.ts'
import studentRoutes from '@routes/studentRoute.ts'
import financeRoutes from '@routes/financeRoute.ts'
import teacherRoutes from '@routes/teacherRoutes.ts'
import attendanceRoutes from '@routes/attendanceRoutes';
import { DashboardRoutes } from '@routes/index';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.json({ message: "SIS-SMART API (Node 22 + Prisma 6) is running!" });
});

app.use('/api/dashboard', DashboardRoutes)

app.use('/api/auth', authRoutes);
app.use('/api/academic', academicRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/finance', financeRoutes);
app.use('/api/teacher', teacherRoutes);
app.use('/api/attendance', attendanceRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server ready at http://localhost:${PORT}`);
});