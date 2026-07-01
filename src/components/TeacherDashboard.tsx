import React, { useState } from 'react';
import { 
  Bell, 
  ChevronRight, 
  GraduationCap, 
  Calendar, 
  User, 
  LayoutDashboard, 
  ArrowRight,
  Sparkles,
  ClipboardList,
  CheckCircle,
  AlertCircle,
  Clock,
  UserCheck,
  Award,
  BookOpen,
  Plus,
  Trash2
} from 'lucide-react';
import { AcademicDB, Enrollment, Grade, Attendance } from '../types';

interface TeacherDashboardProps {
  db: AcademicDB;
  setDb: React.Dispatch<React.SetStateAction<AcademicDB>>;
  onNavigate: (view: 'student' | 'teacher' | 'admin') => void;
}

export default function TeacherDashboard({ db, setDb, onNavigate }: TeacherDashboardProps) {
  const [selectedWeek, setSelectedWeek] = useState<string | null>('W7');
  const [activeTrendTab, setActiveTrendTab] = useState<'gpa' | 'engagement'>('gpa');
  
  // Grading Modal/Drawer State
  const [gradingGrade, setGradingGrade] = useState<Grade | null>(null);
  const [gradeInput, setGradeInput] = useState<number>(90);

  // Attendance Sheet Modal State
  const [showAttendanceModal, setShowAttendanceModal] = useState(false);
  const [attendanceClassId, setAttendanceClassId] = useState<string>('C-401');
  const [attendanceStates, setAttendanceStates] = useState<Record<string, 'Present' | 'Absent' | 'Excused'>>({});

  // Teacher Profile: Dr. Aris (T-201)
  const teacher = db.teachers.find(t => t.teacherId === 'T-201') || db.teachers[0];

  // Assigned classes taught by Dr. Aris
  const teacherClasses = db.classes.filter(c => c.teacherId === teacher.teacherId);

  // Filter out grades that correspond to enrollments of classes taught by Dr. Aris
  const classIdsTaught = teacherClasses.map(c => c.classId);
  const enrollmentsInClasses = db.enrollments.filter(e => classIdsTaught.includes(e.classId));
  const enrollmentIdsInClasses = enrollmentsInClasses.map(e => e.enrollmentId);

  // Submissions (where score === -1 is pending review)
  const submissions = db.grades.filter(g => enrollmentIdsInClasses.includes(g.enrollmentId));
  const pendingSubmissions = submissions.filter(g => g.score === -1);
  const completedSubmissions = submissions.filter(g => g.score !== -1);

  // Helper to find student name for a grade
  const getStudentForGrade = (grade: Grade) => {
    const enrollment = db.enrollments.find(e => e.enrollmentId === grade.enrollmentId);
    return db.students.find(s => s.studentId === enrollment?.studentId);
  };

  // Helper to find class name for a grade
  const getClassForGrade = (grade: Grade) => {
    const enrollment = db.enrollments.find(e => e.enrollmentId === grade.enrollmentId);
    return db.classes.find(c => c.classId === enrollment?.classId);
  };

  // Attendance list for today's modal
  const getEnrolledStudents = (classId: string) => {
    const classEnrollments = db.enrollments.filter(e => e.classId === classId);
    return classEnrollments.map(e => {
      const student = db.students.find(s => s.studentId === e.studentId);
      return {
        enrollmentId: e.enrollmentId,
        studentName: student ? `${student.firstName} ${student.lastName}` : 'Unknown Student',
        studentId: e.studentId
      };
    });
  };

  const handleOpenAttendanceModal = (classId: string) => {
    setAttendanceClassId(classId);
    const enrolled = getEnrolledStudents(classId);
    const initialStates: Record<string, 'Present' | 'Absent' | 'Excused'> = {};
    enrolled.forEach(st => {
      initialStates[st.enrollmentId] = 'Present';
    });
    setAttendanceStates(initialStates);
    setShowAttendanceModal(true);
  };

  const handleSaveAttendance = () => {
    const newRecords: Attendance[] = Object.entries(attendanceStates).map(([enrollmentId, status]) => ({
      attendanceId: `A-${Date.now()}-${enrollmentId}`,
      enrollmentId,
      date: new Date().toISOString().split('T')[0],
      status: status as 'Present' | 'Absent' | 'Excused',
      notes: 'Recorded via Faculty Quick Action'
    }));

    setDb(prev => ({
      ...prev,
      attendance: [...newRecords, ...prev.attendance]
    }));

    setShowAttendanceModal(false);
    alert('Attendance successfully recorded for today!');
  };

  const handleOpenGrading = (grade: Grade) => {
    setGradingGrade(grade);
    setGradeInput(grade.score === -1 ? 90 : grade.score);
  };

  const handleSaveGrade = () => {
    if (!gradingGrade) return;

    setDb(prev => {
      const updatedGrades = prev.grades.map(g => {
        if (g.gradeId === gradingGrade.gradeId) {
          return { ...g, score: Number(gradeInput) };
        }
        return g;
      });
      return { ...prev, grades: updatedGrades };
    });

    setGradingGrade(null);
  };

  // Performance Trend Bar Chart Heights
  const trendData = activeTrendTab === 'gpa' 
    ? [
        { week: 'W1', value: '65%', raw: '2.8 GPA' },
        { week: 'W2', value: '72%', raw: '3.1 GPA' },
        { week: 'W3', value: '85%', raw: '3.5 GPA' },
        { week: 'W4', value: '78%', raw: '3.3 GPA' },
        { week: 'W5', value: '92%', raw: '3.7 GPA' },
        { week: 'W6', value: '88%', raw: '3.6 GPA' },
        { week: 'W7', value: '94%', raw: '3.8 GPA' },
        { week: 'W8', value: '0%', raw: 'TBD' }
      ]
    : [
        { week: 'W1', value: '80%', raw: '80% active' },
        { week: 'W2', value: '85%', raw: '85% active' },
        { week: 'W3', value: '90%', raw: '90% active' },
        { week: 'W4', value: '92%', raw: '92% active' },
        { week: 'W5', value: '95%', raw: '95% active' },
        { week: 'W6', value: '94%', raw: '94% active' },
        { week: 'W7', value: '96%', raw: '96% active' },
        { week: 'W8', value: '0%', raw: 'TBD' }
      ];

  return (
    <div className="min-h-screen bg-[#f7f9fb] text-[#191c1e] pb-32 md:pb-0">
      {/* Top Header Bar */}
      <header className="sticky top-0 z-40 bg-white border-b border-[#c6c6cd] shadow-xs">
        <div className="max-w-7xl mx-auto px-4 md:px-10 h-16 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden border border-[#c6c6cd]">
              <img 
                className="w-full h-full object-cover" 
                src={teacher.avatar} 
                alt={`${teacher.firstName} headshot`}
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <h1 className="font-semibold text-lg text-black tracking-tight flex items-center gap-1.5">
                Academic Precision
                <span className="text-xs font-normal text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">Faculty Portal</span>
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative p-2 rounded-full hover:bg-[#e0e3e5] transition-colors active:scale-95">
              <Bell className="w-5 h-5 text-black" />
              {pendingSubmissions.length > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-[#ba1a1a] rounded-full border-2 border-white"></span>
              )}
            </button>
            <div className="hidden sm:flex gap-1.5 border border-[#c6c6cd] rounded p-0.5 bg-[#eceef0]">
              <button 
                onClick={() => onNavigate('student')}
                className="px-3 py-1 text-xs font-semibold rounded hover:bg-white/50 text-[#505f76]"
              >
                Student
              </button>
              <button 
                onClick={() => onNavigate('teacher')}
                className="px-3 py-1 text-xs font-semibold rounded bg-white text-black shadow-xs"
              >
                Teacher
              </button>
              <button 
                onClick={() => onNavigate('admin')}
                className="px-3 py-1 text-xs font-semibold rounded hover:bg-white/50 text-[#505f76]"
              >
                Database Admin
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex">
        {/* Sidebar Nav - Desktop Only */}
        <aside className="hidden md:block fixed left-0 top-16 bottom-0 w-20 bg-white border-r border-[#c6c6cd] py-8 z-30">
          <div className="flex flex-col items-center gap-6 h-full">
            <button 
              onClick={() => onNavigate('teacher')}
              className="p-3 bg-[#d0e1fb] text-[#0b1c30] rounded-lg transition-all"
              title="Faculty Dashboard"
            >
              <LayoutDashboard className="w-5 h-5" />
            </button>
            <button 
              onClick={() => onNavigate('admin')}
              className="p-3 text-[#505f76] hover:bg-gray-100 hover:text-black rounded-lg transition-all"
              title="Relational Schema Manager"
            >
              <GraduationCap className="w-5 h-5" />
            </button>
            <button 
              onClick={() => handleOpenAttendanceModal('C-401')}
              className="p-3 text-[#505f76] hover:bg-gray-100 hover:text-black rounded-lg transition-all"
              title="Record Quick Attendance"
            >
              <UserCheck className="w-5 h-5" />
            </button>
            <button 
              onClick={() => onNavigate('student')}
              className="p-3 text-[#505f76] hover:bg-gray-100 hover:text-black rounded-lg transition-all"
              title="View Student Dashboard"
            >
              <User className="w-5 h-5" />
            </button>
          </div>
        </aside>

        {/* Dynamic margin adjustment for side navigation on desktop */}
        <main className="flex-1 max-w-7xl mx-auto px-4 md:px-10 py-8 md:pl-28">
          
          {/* Welcome and Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <p className="text-[11px] font-bold text-[#505f76] uppercase tracking-widest">Faculty Dashboard</p>
              <h2 className="text-2xl md:text-3xl font-bold text-black mt-1">Welcome back, Dr. Aris</h2>
            </div>
            
            <button 
              onClick={() => handleOpenAttendanceModal('C-401')}
              className="flex items-center justify-center gap-2 bg-black text-white hover:bg-gray-800 px-6 py-3 rounded text-sm font-semibold shadow-xs transition-all active:scale-95 shrink-0"
            >
              <UserCheck className="w-4 h-4" />
              <span>Record Attendance</span>
            </button>
          </div>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
            
            {/* Assigned Classes Today */}
            <section className="lg:col-span-8 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-black">Assigned Classes Today</h3>
                <span className="text-xs text-gray-500 font-medium">Tuesday, Oct 24</span>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {/* Class Card 1 */}
                <div 
                  onClick={() => handleOpenAttendanceModal('C-401')}
                  className="bg-white border border-[#c6c6cd] p-5 rounded-lg flex items-center justify-between hover:border-black cursor-pointer transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#d0e1fb] text-[#0b1c30] rounded-lg flex items-center justify-center">
                      <BookOpen className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-base text-black">Advanced Calculus II</h4>
                      <p className="text-xs text-gray-500">09:00 AM — 10:30 AM • Room 402-B</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="hidden sm:flex flex-col items-end">
                      <span className="text-xs font-semibold text-black">32 Students</span>
                      <span className="text-[10px] bg-emerald-100 text-[#009668] px-2 py-0.5 rounded font-bold uppercase">
                        In Progress
                      </span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-black transition-colors" />
                  </div>
                </div>

                {/* Class Card 2 */}
                <div 
                  onClick={() => handleOpenAttendanceModal('C-402')}
                  className="bg-white border border-[#c6c6cd] p-5 rounded-lg flex items-center justify-between hover:border-black cursor-pointer transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#d0e1fb] text-[#0b1c30] rounded-lg flex items-center justify-center">
                      <Calendar className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-base text-black">Statistical Methods</h4>
                      <p className="text-xs text-gray-500">01:00 PM — 02:30 PM • Lab 10</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="hidden sm:flex flex-col items-end">
                      <span className="text-xs font-semibold text-black">28 Students</span>
                      <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded font-bold uppercase">
                        Upcoming
                      </span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-black transition-colors" />
                  </div>
                </div>
              </div>
            </section>

            {/* Sidebar Alerts / Insights */}
            <aside className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-6">
              {/* Grading Alerts */}
              <div className="bg-white border border-[#c6c6cd] rounded-lg p-5 flex-1 relative overflow-hidden">
                <div className="absolute top-3 right-3 opacity-5">
                  <ClipboardList className="w-16 h-16 text-black" />
                </div>
                <h3 className="text-[10px] font-bold text-[#505f76] uppercase tracking-wider mb-4">Alerts</h3>
                <div className="flex items-start gap-3 mb-6">
                  <span className="mt-1.5 w-2 h-2 bg-[#ba1a1a] rounded-full shrink-0"></span>
                  <div>
                    <p className="font-bold text-sm text-[#191c1e]">Pending Grades</p>
                    <p className="text-xs text-gray-500 leading-relaxed mt-0.5">
                      {pendingSubmissions.length} Midterm papers/proposals need faculty review and scoring.
                    </p>
                  </div>
                </div>
                <a 
                  href="#submissions"
                  className="block w-full text-center py-2 border border-[#76777d] rounded text-xs font-semibold text-black hover:bg-gray-50 transition-colors"
                >
                  Review Now
                </a>
              </div>

              {/* Attendance quick insight */}
              <div className="bg-black text-white p-5 rounded-lg flex-1">
                <h3 className="text-[10px] font-bold text-[#bec6e0] uppercase tracking-wider mb-3">Quick Insights</h3>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-gray-300">Avg. Attendance</span>
                  <span className="text-lg font-bold text-white">94.2%</span>
                </div>
                <div className="w-full bg-[#3f465c] h-1.5 rounded-full overflow-hidden">
                  <div className="bg-[#4edea3] h-full w-[94.2%]"></div>
                </div>
              </div>
            </aside>
          </div>

          {/* Student Performance Trend Chart */}
          <section className="bg-white border border-[#c6c6cd] rounded-xl p-6 mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="text-base font-bold text-black">Student Performance Trend</h3>
                <p className="text-xs text-gray-500 mt-0.5">Main Class: Advanced Calculus II • Semester Progress</p>
              </div>
              <div className="flex gap-1.5 border border-[#c6c6cd] rounded p-0.5 bg-[#eceef0] self-start sm:self-auto">
                <button 
                  onClick={() => setActiveTrendTab('gpa')}
                  className={`px-3 py-1 text-xs font-semibold rounded transition-all ${
                    activeTrendTab === 'gpa' ? 'bg-white text-black shadow-xs' : 'text-[#505f76] hover:bg-white/30'
                  }`}
                >
                  GPA Avg
                </button>
                <button 
                  onClick={() => setActiveTrendTab('engagement')}
                  className={`px-3 py-1 text-xs font-semibold rounded transition-all ${
                    activeTrendTab === 'engagement' ? 'bg-white text-black shadow-xs' : 'text-[#505f76] hover:bg-white/30'
                  }`}
                >
                  Engagement
                </button>
              </div>
            </div>

            {/* Simulated Chart Rendering */}
            <div className="h-64 w-full flex items-end justify-around gap-2 pt-6 border-b border-[#c6c6cd]">
              {trendData.map((item, idx) => {
                const isSelected = selectedWeek === item.week;
                const isW8 = item.week === 'W8';
                return (
                  <div 
                    key={item.week} 
                    onClick={() => setSelectedWeek(item.week)}
                    className="flex flex-col items-center gap-2 flex-1 max-w-[48px] cursor-pointer group"
                  >
                    <div className="relative w-full flex justify-center">
                      {/* Tooltip on Hover or Select */}
                      {(isSelected || isW8) && (
                        <span className="absolute bottom-full mb-1 bg-black text-white text-[10px] px-1.5 py-0.5 rounded shadow-xs font-semibold whitespace-nowrap">
                          {item.raw}
                        </span>
                      )}
                      
                      {/* Bar container */}
                      <div className="w-full bg-[#eceef0] rounded-t-sm overflow-hidden h-44 flex items-end">
                        <div 
                          className={`w-full transition-all duration-700 ${
                            isW8 ? 'bg-transparent border border-dashed border-[#76777d]' :
                            isSelected ? 'bg-black' : 'bg-[#c6c6cd] group-hover:bg-[#76777d]'
                          }`}
                          style={{ height: item.value }}
                        ></div>
                      </div>
                    </div>
                    <span className={`text-[10px] font-bold ${isSelected ? 'text-black font-extrabold' : 'text-[#505f76]'}`}>
                      {item.week}
                    </span>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Student Submissions Section */}
          <section id="submissions" className="bg-white border border-[#c6c6cd] rounded-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-[#c6c6cd] bg-[#f2f4f6] flex justify-between items-center">
              <div>
                <h3 className="text-sm font-bold text-black uppercase tracking-wider">Recent Student Submissions</h3>
                <p className="text-xs text-gray-500 mt-0.5">Grade student work directly from the database schema</p>
              </div>
              <span className="text-xs font-semibold text-[#505f76]">
                {pendingSubmissions.length} Pending review
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#eceef0]/50 border-b border-[#c6c6cd]">
                    <th className="p-4 text-xs font-bold text-gray-600 uppercase tracking-wider">Student Name</th>
                    <th className="p-4 text-xs font-bold text-gray-600 uppercase tracking-wider">Assignment</th>
                    <th className="p-4 text-xs font-bold text-gray-600 uppercase tracking-wider">Course</th>
                    <th className="p-4 text-xs font-bold text-gray-600 uppercase tracking-wider">Date</th>
                    <th className="p-4 text-xs font-bold text-gray-600 uppercase tracking-wider">Status</th>
                    <th className="p-4 text-xs font-bold text-gray-600 uppercase tracking-wider text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#c6c6cd]">
                  {/* Render Pending Submissions First */}
                  {pendingSubmissions.map((grade) => {
                    const student = getStudentForGrade(grade);
                    const course = getClassForGrade(grade);
                    return (
                      <tr key={grade.gradeId} className="hover:bg-gray-50/50 transition-colors">
                        <td className="p-4 text-sm font-semibold text-black">
                          {student ? `${student.firstName} ${student.lastName}` : 'Elena Vance'}
                        </td>
                        <td className="p-4 text-sm text-gray-600">{grade.assessmentType}</td>
                        <td className="p-4 text-xs text-[#505f76] font-medium">{course?.className || 'Calculus II'}</td>
                        <td className="p-4 text-xs text-[#505f76]">{grade.gradeDate}</td>
                        <td className="p-4">
                          <span className="bg-[#ffdad6] text-[#93000a] px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
                            Pending
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <button 
                            onClick={() => handleOpenGrading(grade)}
                            className="bg-black hover:bg-gray-800 text-white text-xs font-semibold px-3 py-1.5 rounded transition-all"
                          >
                            Grade Now
                          </button>
                        </td>
                      </tr>
                    );
                  })}

                  {/* Render Completed Submissions */}
                  {completedSubmissions.map((grade) => {
                    const student = getStudentForGrade(grade);
                    const course = getClassForGrade(grade);
                    return (
                      <tr key={grade.gradeId} className="hover:bg-gray-50/50 transition-colors opacity-90">
                        <td className="p-4 text-sm text-gray-700">
                          {student ? `${student.firstName} ${student.lastName}` : 'Unknown Student'}
                        </td>
                        <td className="p-4 text-sm text-gray-500">{grade.assessmentType}</td>
                        <td className="p-4 text-xs text-[#505f76]">{course?.className || 'Math'}</td>
                        <td className="p-4 text-xs text-[#505f76]">{grade.gradeDate}</td>
                        <td className="p-4">
                          <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
                            Graded: {grade.score}%
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <button 
                            onClick={() => handleOpenGrading(grade)}
                            className="text-[#505f76] hover:text-black text-xs font-semibold underline"
                          >
                            Edit
                          </button>
                        </td>
                      </tr>
                    );
                  })}

                  {submissions.length === 0 && (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-gray-400 text-sm">
                        No submissions recorded in the database yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </main>
      </div>

      {/* Grading Dialog */}
      {gradingGrade && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-white border border-[#c6c6cd] rounded-xl shadow-lg max-w-md w-full overflow-hidden">
            <div className="p-6 border-b border-[#c6c6cd]">
              <h3 className="font-bold text-lg text-black">Grade Assignment Submission</h3>
              <p className="text-xs text-gray-500 mt-1">
                For {getStudentForGrade(gradingGrade)?.firstName} {getStudentForGrade(gradingGrade)?.lastName} • {gradingGrade.assessmentType}
              </p>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-[#505f76] mb-1.5">Score (Percentage: 0 - 100)</label>
                <div className="flex items-center gap-3">
                  <input 
                    type="number" 
                    min={0}
                    max={100}
                    value={gradeInput}
                    onChange={(e) => setGradeInput(Math.min(100, Math.max(0, Number(e.target.value))))}
                    className="flex-1 border border-[#c6c6cd] rounded px-3 py-2 text-sm focus:outline-hidden focus:ring-1 focus:ring-black"
                  />
                  <span className="text-sm font-semibold text-[#505f76]">%</span>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button 
                  onClick={() => setGradingGrade(null)}
                  className="px-4 py-2 text-sm font-semibold rounded border border-[#c6c6cd] text-[#505f76] hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSaveGrade}
                  className="px-4 py-2 text-sm font-semibold rounded bg-black text-white hover:bg-gray-800"
                >
                  Save Grade Record
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Attendance Modal */}
      {showAttendanceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-white border border-[#c6c6cd] rounded-xl shadow-lg max-w-lg w-full overflow-hidden my-8">
            <div className="p-6 border-b border-[#c6c6cd]">
              <h3 className="font-bold text-lg text-black">Record Class Attendance</h3>
              <p className="text-xs text-gray-500 mt-1">
                {db.classes.find(c => c.classId === attendanceClassId)?.className} • {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
              </p>
            </div>
            
            <div className="p-6 space-y-4 max-h-[400px] overflow-y-auto">
              {getEnrolledStudents(attendanceClassId).map((student) => (
                <div key={student.enrollmentId} className="flex items-center justify-between py-2 border-b border-gray-50">
                  <span className="text-sm font-semibold text-[#191c1e]">{student.studentName}</span>
                  <div className="flex gap-1 bg-[#eceef0] p-0.5 rounded border border-[#c6c6cd]">
                    {(['Present', 'Absent', 'Excused'] as const).map((status) => (
                      <button
                        key={status}
                        onClick={() => setAttendanceStates(prev => ({ ...prev, [student.enrollmentId]: status }))}
                        className={`px-3 py-1 text-xs font-semibold rounded transition-all ${
                          attendanceStates[student.enrollmentId] === status 
                            ? 'bg-black text-white shadow-xs' 
                            : 'text-[#505f76] hover:bg-white/40'
                        }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-6 border-t border-[#c6c6cd] bg-gray-50 flex justify-end gap-3">
              <button 
                onClick={() => setShowAttendanceModal(false)}
                className="px-4 py-2 text-sm font-semibold rounded border border-[#c6c6cd] text-[#505f76] hover:bg-gray-50"
              >
                Cancel
              </button>
              <button 
                onClick={handleSaveAttendance}
                className="px-4 py-2 text-sm font-semibold rounded bg-black text-white hover:bg-gray-800"
              >
                Submit Attendance
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Nav (Mobile Only) */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-[#c6c6cd] md:hidden shadow-lg">
        <div className="flex justify-around items-center h-16 px-4">
          <button 
            onClick={() => onNavigate('student')}
            className="flex flex-col items-center justify-center text-gray-500 hover:text-black"
          >
            <User className="w-5 h-5 mb-1" />
            <span className="text-[10px] font-medium">Student</span>
          </button>
          
          <button 
            onClick={() => onNavigate('teacher')}
            className="flex flex-col items-center justify-center text-black"
          >
            <div className="bg-[#d0e1fb] text-black px-4 py-1 rounded-full mb-1">
              <LayoutDashboard className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-semibold">Teacher</span>
          </button>

          <button 
            onClick={() => onNavigate('admin')}
            className="flex flex-col items-center justify-center text-gray-500 hover:text-black"
          >
            <GraduationCap className="w-5 h-5 mb-1" />
            <span className="text-[10px] font-medium">Database</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
