export interface Student {
  studentId: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  email: string;
  phoneNumber: string;
  avatar: string;
}

export interface Teacher {
  teacherId: string;
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  hireDate: string;
  avatar: string;
}

export interface Subject {
  subjectId: string;
  subjectName: string;
  description: string;
  credits: number;
}

export interface Class {
  classId: string;
  subjectId: string;
  teacherId: string;
  className: string;
  schedule: string;
  roomNumber: string;
}

export interface Enrollment {
  enrollmentId: string;
  studentId: string;
  classId: string;
  enrollmentDate: string;
  status: 'Active' | 'Completed' | 'Dropped';
}

export interface Grade {
  gradeId: string;
  enrollmentId: string;
  assessmentType: string;
  score: number; // score out of 100
  gradeDate: string;
}

export interface Attendance {
  attendanceId: string;
  enrollmentId: string;
  date: string;
  status: 'Present' | 'Absent' | 'Excused';
  notes?: string;
}

// Full State for the local simulated DB
export interface AcademicDB {
  students: Student[];
  teachers: Teacher[];
  subjects: Subject[];
  classes: Class[];
  enrollments: Enrollment[];
  grades: Grade[];
  attendance: Attendance[];
}
