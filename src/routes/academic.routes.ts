import { authorizeRole, verifyToken } from "@middleware/authMiddleware";
import { Router } from "express";
import { Role } from "../../prisma/generated/enums";
import { validationMiddleware } from "@middleware/validationMiddleware";
import { CreateClassDTO, CreateDepartmentDTO } from "@dto/academic.dto";
import { CreateSchedulesDTO } from "@dto/schedules.dto";
import {
  CreateSubjectsDTO,
  CreateSubjectsWithTeacherDTO,
} from "@dto/subjects.dto";
import { BulkGradeInputDTO } from "@dto/grade.dto";
import {
  assignTeacherOnSubject,
  getSchedulesByClass,
  createSchedules,
  getAllSubjects,
  createSubjects,
  createSubjectWithAssigmentTeacher,
  getGradeStudent,
  studentGradeInput,
  bulkGradeInput,
  getAllDepartment,
  createDepartment,
  createClass,
  getClassByDepartment,
} from "@controllers/index";

const router = Router();

router.use(verifyToken);

// Admin: Mengatur relasi pengampu dan jadwal
router.post(
  "/assign-teacher",
  authorizeRole([Role.ADMIN]),
  assignTeacherOnSubject
);

router.get(
  "/schedule/:classId",
  authorizeRole([Role.ADMIN, Role.STUDENT, Role.STUDENT]),
  getSchedulesByClass
);
router.post(
  "/schedule",
  authorizeRole([Role.ADMIN]),
  validationMiddleware(CreateSchedulesDTO),
  createSchedules
);

router.get(
  "/subject",
  authorizeRole([Role.ADMIN, Role.STUDENT, Role.STUDENT]),
  getAllSubjects
);
router.post(
  "/subject",
  authorizeRole([Role.ADMIN]),
  validationMiddleware(CreateSubjectsDTO),
  createSubjects
);
router.post(
  "/subject-teacher",
  authorizeRole([Role.ADMIN]),
  validationMiddleware(CreateSubjectsWithTeacherDTO),
  createSubjectWithAssigmentTeacher
);

// Guru: Mengisi nilai (Hanya untuk Role GURU)
router.get("/student/:studentId", getGradeStudent);
router.post("/grade-input", authorizeRole([Role.TEACHER]), studentGradeInput);
router.post(
  "/bulk",
  authorizeRole([Role.TEACHER]),
  validationMiddleware(BulkGradeInputDTO),
  bulkGradeInput
);

router.get(
  "/department",
  authorizeRole([Role.ADMIN, Role.TEACHER]),
  getAllDepartment
);
router.post(
  "/department",
  validationMiddleware(CreateDepartmentDTO),
  authorizeRole([Role.ADMIN]),
  createDepartment
);

router.post(
  "/class",
  validationMiddleware(CreateClassDTO),
  authorizeRole([Role.ADMIN]),
  createClass
);
router.get(
  "/class/department/:departmentId",
  authorizeRole([Role.ADMIN]),
  getClassByDepartment
);

export default router;
