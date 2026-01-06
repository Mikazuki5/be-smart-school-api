import "reflect-metadata";

import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";

import {
  AcademicRoutes,
  AnnouncementRoutes,
  AttendanceRoutes,
  AuthRoutes,
  DashboardRoutes,
  FinanceRoutes,
  StudentRoutes,
  TeacherRoutes,
} from "@routes/index";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.json({ message: "SIS-SMART API (Node 22 + Prisma 6) is running!" });
});

app.use("/api/dashboard", DashboardRoutes);

app.use("/api/auth", AuthRoutes);
app.use("/api/academic", AcademicRoutes);
app.use("/api/student", StudentRoutes);
app.use("/api/finance", FinanceRoutes);
app.use("/api/teacher", TeacherRoutes);
app.use("/api/attendance", AttendanceRoutes);
app.use("/api/announcement", AnnouncementRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server ready at http://localhost:${PORT}`);
});
