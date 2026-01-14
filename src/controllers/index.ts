export { getTeacherDashboard } from "./dashboard/dashboard-teacher.controller";
export { getDashboardStats } from "./dashboard/dashboard-stats.controller";

export { getAtttendanceRecapPerClass } from "./attendance/attendance-recap.controller";
export { getAttendanceByClass } from "./attendance/attendance-by-class.controller";
export { getTodayAttendanceStats } from "./attendance/attendance-today.controller";
export { studentSelfAttendance } from "./attendance/attendance-student.controller";
export { bulkCreateAttendance } from "./attendance/attendance-bulk.controller";
export { teacherInputAttendance } from "./attendance/attendance-input-by-teacher.controller";

export { bulkGradeInput } from "./academic/grades/academic-grades-input.controller";
export { getGradeStudent } from "./academic/grades/academic-grades.controller";
export { studentGradeInput } from "./academic/grades/academic-student-input.controller";

export { createSchedules } from "./academic/schedules/schedules-create.controller";
export { getSchedulesByClass } from "./academic/schedules/schedules-class.controller";
export { getMySchedule } from "./academic/schedules/schedules-student.controller";

export { createClass } from "./academic/class/class-create.controller";
export { getClassByDepartment } from "./academic/class/class-by-department.controller";
export { getRankByClass } from "./academic/class/class-ranking.controller";

export { createDepartment } from "./academic/department/department-create.controller";
export { getAllDepartment } from "./academic/department/department.controller";

export { assignTeacherOnSubject } from "./academic/teacher/teacher-assignment.controller";

export { createSubjects } from "./academic/subject/subject-create.controller";
export { getAllSubjects } from "./academic/subject/subject.controller";
export { createSubjectWithAssigmentTeacher } from "./academic/subject/subject-create-teacher-assignment.controller";

export { login } from "./auth/auth-login.controller";

export { getAnnouncementForUser } from "./admin/announcement/announcement.controller";
export { createAnnouncement } from "./admin/announcement/announcement-create.controller";

export { getFinancialSummary } from "./finance/finance-get-summary.controller";
export { generateMonthlyInvoice } from "./finance/finance-generate-invoice.controller";
export { updatePaymentStatus } from "./finance/finance-update-payment.controller";
