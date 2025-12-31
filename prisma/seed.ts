import { prisma } from '@config/database';
import bcrypt from 'bcrypt';
import { Role } from './generated/enums';

async function main() {
  console.log('🚀 Starting SIS-SMART Data Seeding...');

  // --- 0. CLEAN DATABASE (Order is critical due to Foreign Key constraints) ---
  await prisma.attendance.deleteMany();
  await prisma.grade.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.schedule.deleteMany();
  await prisma.teacherOnSubject.deleteMany();
  await prisma.student.deleteMany();
  await prisma.teacher.deleteMany();
  await prisma.class.deleteMany();
  await prisma.department.deleteMany();
  await prisma.user.deleteMany();
  await prisma.subject.deleteMany();

  const salt = await bcrypt.genSalt(10);
  const commonPassword = await bcrypt.hash('password123', salt);

  // --- 1. SEED USER (ADMIN) ---
  await prisma.user.create({
    data: {
      username: 'admin',
      email: 'admin@gmail.com',
      password: commonPassword,
      role: Role.ADMIN,
    },
  });

  // --- 2. SEED DEPARTMENTS ---
  const se = await prisma.department.create({ data: { name: 'Software Engineering' } });
  const ho = await prisma.department.create({ data: { name: 'Hospitality' } });
  const ac = await prisma.department.create({ data: { name: 'Accountancy' } });

  // --- 3. SEED CLASSES ---
  const class12Se1 = await prisma.class.create({
    data: { name: 'XII Software Engineering 1', gradeLevel: 12, departmentId: se.id },
  });
  const class10Ho1 = await prisma.class.create({
    data: { name: 'X Hospitality 1', gradeLevel: 10, departmentId: ho.id },
  });
  const class11Ac1 = await prisma.class.create({
    data: { name: 'XI Accountancy 1', gradeLevel: 11, departmentId: ac.id },
  });

  // --- 4. SEED SUBJECTS ---
  const webSubject = await prisma.subject.create({ data: { name: 'Web Programming' } });
  const dbSubject = await prisma.subject.create({ data: { name: 'Database Systems' } });
  const ddp = await prisma.subject.create({ data: { name: 'Hospitality Basics' } });
  const acs = await prisma.subject.create({ data: { name: 'Fundamentals of Accounting and Institutional Finance' } });

  // --- 5. SEED TEACHERS & MANY-TO-MANY SUBJECTS ---
  const teacherUser1 = await prisma.user.create({
    data: { username: 'budi12', email: 'budi@gmail.com', password: commonPassword, role: Role.TEACHER },
  });
  const teacherBudi = await prisma.teacher.create({
    data: {
      firstName: 'Budi',
      lastName: 'Hartono, S.Kom',
      userId: teacherUser1.id,
      subjects: {
        create: [
          { subjectId: webSubject.id },
          { subjectId: dbSubject.id },
        ],
      },
    },
  });

  const teacherUser2 = await prisma.user.create({
    data: { username: 'Arrprmth', email: 'aurora.paramita@gmail.com', password: commonPassword, role: Role.TEACHER },
  });

  const teacherArr = await prisma.teacher.create({
    data: {
      firstName: 'Aurora Paramita',
      lastName: 'S, S.Pd',
      userId: teacherUser2.id,
      subjects: {
        create: [{ subjectId: ddp.id }],
      },
    },
  });

  const teacherUser3 = await prisma.user.create({
    data: { username: 'siti01', email: 'siti@gmail.com', password: commonPassword, role: Role.TEACHER },
  });
  
  const teacher3 = await prisma.teacher.create({
    data: {
      firstName: 'Siti',
      lastName: 'Aminah, S.Pd',
      userId: teacherUser3.id,
      subjects: {
        create: [{ subjectId: acs.id }],
      },
    },
  });

  // --- 6. SEED STUDENTS ---
  const studentUser1 = await prisma.user.create({
    data: { username: 'joni_student', email: 'jhon@gmail.com', password: commonPassword, role: Role.STUDENT },
  });
  const joni = await prisma.student.create({
    data: {
      firstName: 'Jhon',
      lastName: 'Aminah',
      userId: studentUser1.id,
      classId: class10Ho1.id,
    },
  });

  const studentUser2 = await prisma.user.create({
    data: { username: 'dvnl', email: 'davin@gmail.com', password: commonPassword, role: Role.STUDENT },
  });
  const ani = await prisma.student.create({
    data: {
      firstName: 'Davin',
      lastName: 'Aminah',
      userId: studentUser2.id,
      classId: class12Se1.id,
    },
  });

  const studentUser3 = await prisma.user.create({
    data: { username: 'mads', email: 'ahmad@gmail.com', password: commonPassword, role: Role.STUDENT },
  });
  const an = await prisma.student.create({
    data: {
      firstName: 'Ahmad',
      lastName: 'WK',
      userId: studentUser3.id,
      classId: class11Ac1.id,
    },
  });

  // --- 7. SEED SCHEDULES ---
  await prisma.schedule.createMany({
    data: [
      {
        day: 'Monday',
        startTime: '07:00',
        endTime: '09:00',
        classId: class12Se1.id,
        subjectId: webSubject.id,
        teacherId: teacherBudi.id,
      },
      {
        day: 'Monday',
        startTime: '09:30',
        endTime: '11:00',
        classId: class12Se1.id,
        subjectId: dbSubject.id,
        teacherId: teacherBudi.id,
      },
      {
        day: 'Tuesday',
        startTime: '07:30',
        endTime: '11:00',
        classId: class10Ho1.id,
        subjectId: ddp.id,
        teacherId: teacherArr.id,
      },
       {
        day: 'Tuesday',
        startTime: '11:00',
        endTime: '12:00',
        classId: class11Ac1.id,
        subjectId: acs.id,
        teacherId: teacher3.id,
      },
    ],
  });

  // --- 8. SEED GRADES (E-REPORT) ---
  await prisma.grade.create({
    data: {
      studentId: joni.id,
      subjectId: ddp.id,
      assignment: 85,
      midtermExam: 80,
      finalExam: 90,
      practicalExam: 88,
      semester: 1,
    },
  });

  await prisma.grade.create({
    data: {
      studentId: ani.id,
      subjectId: webSubject.id,
      assignment: 85,
      midtermExam: 80,
      finalExam: 90,
      practicalExam: 88,
      semester: 1,
    },
  });

  await prisma.grade.create({
    data: {
      studentId: an.id,
      subjectId: acs.id,
      assignment: 90,
      midtermExam: 80,
      finalExam: 78,
      practicalExam: 80,
      semester: 1,
    },
  });

  // --- 9. SEED TUITION PAYMENTS ---
  await prisma.payment.createMany({
    data: [
      { studentId: joni.id, month: 'Desember', year: 2025, amount: 500000, isPaid: true },
      { studentId: an.id, month: 'Desember', year: 2025, amount: 500000, isPaid: false },
      { studentId: ani.id, month: 'Desember', year: 2025, amount: 500000, isPaid: false },
    ],
  });

  // --- 10. SEED ATTENDANCE ---
  await prisma.attendance.create({
    data: {
      studentId: joni.id,
      status: 'PRESENT',
      date: new Date(),
    },
  });

  console.log('✅ Seeding Complete!');
  console.log(`
    Login Access:
    - Admin: admin / password123
    - Teacher: budi_teacher / password123
    - Student: joni_student / password123
  `);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });