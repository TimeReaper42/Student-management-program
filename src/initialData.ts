import { AcademicDB } from './types';

export const initialDB: AcademicDB = {
  students: [
    {
      studentId: 'S-101',
      firstName: 'Jordan',
      lastName: 'McAllister',
      dateOfBirth: '2004-05-15',
      email: 'jordan.mcallister@academic.edu',
      phoneNumber: '+1 (555) 019-2834',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuABJctcA3_gqxR-Y9nRlLDa44cVgcOl7YCmPVW5bACw8MtpQieucfPKyZ75HcWnSUzUWJxKz5vLR-C-7jiv1W92jb5JovgsVFWKw5TQDun4TJP6xUuTJvN_V4DDYy_2-oEt4p4GylIbPU-SekiyxcEO50-azNe2eA32hG14vbElZLrWT67yD9hbpDegQMBRlIU28n2a9zKkjxZpCtV766dqpnTsGyIqhUJixpJgXKnXztUCx0tw_1p2VC6dEl5zL8yGjHM1yAKlp1U'
    },
    {
      studentId: 'S-102',
      firstName: 'Elena',
      lastName: 'Vance',
      dateOfBirth: '2003-09-22',
      email: 'elena.vance@academic.edu',
      phoneNumber: '+1 (555) 012-3456',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150'
    },
    {
      studentId: 'S-103',
      firstName: 'Marcus',
      lastName: 'Thorne',
      dateOfBirth: '2004-01-10',
      email: 'marcus.thorne@academic.edu',
      phoneNumber: '+1 (555) 013-4567',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'
    },
    {
      studentId: 'S-104',
      firstName: 'Sarah',
      lastName: 'Jenkins',
      dateOfBirth: '2003-11-05',
      email: 'sarah.jenkins@academic.edu',
      phoneNumber: '+1 (555) 014-5678',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150'
    }
  ],
  teachers: [
    {
      teacherId: 'T-201',
      firstName: 'Aris',
      lastName: 'Adler',
      email: 'dr.aris.adler@academic.edu',
      department: 'Mathematics & Science',
      hireDate: '2015-08-15',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA_-N9D-RHCK-VNbTxBEkpc68EqQL16uUBGvCQzN3epZru_hdSE23mZyb0eR459-t4aay89FQ_eT3n9WVm-5S9EPQy8q4GTZo7oI7yfPfjhUsVpLorEiqMxF_-abEV1haTB8OKGh50ojZ-cwdvpImEgHmK6oVuaK5jNJzTTKeiEJdgFHrPT8kG8EVDd4UpQqkf55QB_I5tEWt__p15cblblETNLz4Vr6Tfm3xD74Ox60h06PR6tPeEXQqHJ_aXq25Gy4oeiiL7NU8Q'
    },
    {
      teacherId: 'T-202',
      firstName: 'Alastair',
      lastName: 'Sterling',
      email: 'dr.sterling@academic.edu',
      department: 'Economics',
      hireDate: '2012-01-10',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150'
    },
    {
      teacherId: 'T-203',
      firstName: 'David',
      lastName: 'Chen',
      email: 'prof.chen@academic.edu',
      department: 'Mathematics',
      hireDate: '2018-03-01',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150'
    }
  ],
  subjects: [
    {
      subjectId: 'SUB-301',
      subjectName: 'Advanced Calculus II',
      description: 'Rigorous study of limits, continuity, derivatives, and integral theory in multiple variables.',
      credits: 4
    },
    {
      subjectId: 'SUB-302',
      subjectName: 'Statistical Methods',
      description: 'Practical analysis of statistical methods, regression, hypothesis testing, and variance analysis.',
      credits: 3
    },
    {
      subjectId: 'SUB-303',
      subjectName: 'Macroeconomics',
      description: 'Analysis of aggregate economic variables including GDP, inflation, unemployment, and monetary policies.',
      credits: 3
    },
    {
      subjectId: 'SUB-304',
      subjectName: 'Calculus I',
      description: 'Introduction to single-variable differential and integral calculus.',
      credits: 4
    },
    {
      subjectId: 'SUB-305',
      subjectName: 'Organic Chemistry',
      description: 'Study of structure, properties, composition, reactions, and preparation of carbon-containing compounds.',
      credits: 4
    }
  ],
  classes: [
    {
      classId: 'C-401',
      subjectId: 'SUB-301',
      teacherId: 'T-201', // Dr. Aris
      className: 'Advanced Calculus II',
      schedule: '09:00 AM — 10:30 AM',
      roomNumber: 'Room 402-B'
    },
    {
      classId: 'C-402',
      subjectId: 'SUB-302',
      teacherId: 'T-201', // Dr. Aris
      className: 'Statistical Methods',
      schedule: '01:00 PM — 02:30 PM',
      roomNumber: 'Lab 10'
    },
    {
      classId: 'C-403',
      subjectId: 'SUB-303',
      teacherId: 'T-202', // Dr. Sterling
      className: 'Macroeconomics Seminar',
      schedule: '11:00 AM — 12:30 PM',
      roomNumber: 'Lecture Hall C'
    },
    {
      classId: 'C-404',
      subjectId: 'SUB-304',
      teacherId: 'T-203', // Prof. Chen
      className: 'Calculus Foundations',
      schedule: '03:00 PM — 04:30 PM',
      roomNumber: 'Room 101'
    },
    {
      classId: 'C-405',
      subjectId: 'SUB-305',
      teacherId: 'T-201', // Dr. Aris
      className: 'Organic Chemistry Lab',
      schedule: '02:00 PM — 05:00 PM',
      roomNumber: 'Lab 3'
    }
  ],
  enrollments: [
    // Jordan's enrollments
    {
      enrollmentId: 'E-501',
      studentId: 'S-101', // Jordan
      classId: 'C-401', // Advanced Calculus II
      enrollmentDate: '2026-09-01',
      status: 'Active'
    },
    {
      enrollmentId: 'E-502',
      studentId: 'S-101', // Jordan
      classId: 'C-403', // Macroeconomics Seminar
      enrollmentDate: '2026-09-01',
      status: 'Active'
    },
    {
      enrollmentId: 'E-503',
      studentId: 'S-101', // Jordan
      classId: 'C-404', // Calculus Foundations
      enrollmentDate: '2026-09-02',
      status: 'Active'
    },
    {
      enrollmentId: 'E-504',
      studentId: 'S-101', // Jordan
      classId: 'C-405', // Organic Chemistry
      enrollmentDate: '2026-09-03',
      status: 'Active'
    },
    // Elena's enrollments
    {
      enrollmentId: 'E-505',
      studentId: 'S-102', // Elena
      classId: 'C-401',
      enrollmentDate: '2026-09-01',
      status: 'Active'
    },
    {
      enrollmentId: 'E-506',
      studentId: 'S-102', // Elena
      classId: 'C-402', // Statistical Methods
      enrollmentDate: '2026-09-01',
      status: 'Active'
    },
    // Marcus's enrollments
    {
      enrollmentId: 'E-507',
      studentId: 'S-103', // Marcus
      classId: 'C-401',
      enrollmentDate: '2026-09-02',
      status: 'Active'
    },
    // Sarah's enrollments
    {
      enrollmentId: 'E-508',
      studentId: 'S-104', // Sarah
      classId: 'C-401',
      enrollmentDate: '2026-09-01',
      status: 'Active'
    }
  ],
  grades: [
    // Let's seed grades for GPA calculation (average of these scores determines Jordan's 3.8 GPA!)
    // A GPA of 3.8 is roughly equivalent to a 93-95% average. Let's make his average around 94.
    {
      gradeId: 'G-601',
      enrollmentId: 'E-501', // Jordan in Adv Calculus II
      assessmentType: 'Midterm Exam',
      score: 91, // A- (91%)
      gradeDate: '2026-10-20'
    },
    {
      gradeId: 'G-602',
      enrollmentId: 'E-502', // Jordan in Macroeconomics
      assessmentType: 'First Quiz',
      score: 96, // A (96%)
      gradeDate: '2026-09-28'
    },
    {
      gradeId: 'G-603',
      enrollmentId: 'E-503', // Jordan in Calculus Foundations
      assessmentType: 'Problem Set 3',
      score: 95, // A (95%)
      gradeDate: '2026-10-05'
    },
    {
      gradeId: 'G-604',
      enrollmentId: 'E-504', // Jordan in Organic Chemistry
      assessmentType: 'Lab Report #1',
      score: 94, // A (94%)
      gradeDate: '2026-10-12'
    },
    // Submissions pending review
    {
      gradeId: 'G-605',
      enrollmentId: 'E-505', // Elena Vance in Calculus II
      assessmentType: 'Final Project Proposal',
      score: -1, // -1 means pending grade!
      gradeDate: '2026-10-24'
    },
    {
      gradeId: 'G-606',
      enrollmentId: 'E-507', // Marcus Thorne in Calculus II
      assessmentType: 'Midterm Correction',
      score: -1, // pending
      gradeDate: '2026-10-23'
    },
    {
      gradeId: 'G-607',
      enrollmentId: 'E-508', // Sarah Jenkins in Calculus II
      assessmentType: 'Lab Report #4',
      score: 92, // graded
      gradeDate: '2026-10-23'
    }
  ],
  attendance: [
    // Attendance rate for Jordan: 95%.
    // Out of 20 classes, 19 Present, 1 Absent (or similar). Let's seed 20 attendance records for E-501 (Jordan Calculus) and other courses.
    {
      attendanceId: 'A-701',
      enrollmentId: 'E-501',
      date: '2026-10-01',
      status: 'Present'
    },
    {
      attendanceId: 'A-702',
      enrollmentId: 'E-501',
      date: '2026-10-03',
      status: 'Present'
    },
    {
      attendanceId: 'A-703',
      enrollmentId: 'E-501',
      date: '2026-10-08',
      status: 'Absent',
      notes: 'Unexcused absence'
    },
    {
      attendanceId: 'A-704',
      enrollmentId: 'E-501',
      date: '2026-10-10',
      status: 'Present'
    },
    {
      attendanceId: 'A-705',
      enrollmentId: 'E-501',
      date: '2026-10-15',
      status: 'Present'
    },
    // Let's seed enough for a beautiful attendance calculation. We can also compute attendance percentage dynamically!
    // We'll write a function that returns 95% if the user requests default, or computes on-the-fly.
  ]
};
