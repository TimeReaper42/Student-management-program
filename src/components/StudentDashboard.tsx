import React, { useState } from 'react';
import { 
  Bell, 
  ChevronRight, 
  GraduationCap, 
  Calendar, 
  User, 
  LayoutDashboard, 
  Plus, 
  FileText, 
  CreditCard, 
  Library, 
  X,
  TrendingUp,
  BookOpen,
  Sparkles,
  ClipboardList,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { AcademicDB, Student, Grade } from '../types';

interface StudentDashboardProps {
  db: AcademicDB;
  setDb: React.Dispatch<React.SetStateAction<AcademicDB>>;
  onNavigate: (view: 'student' | 'teacher' | 'admin') => void;
}

export default function StudentDashboard({ db, setDb, onNavigate }: StudentDashboardProps) {
  const [showToast, setShowToast] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newAssignment, setNewAssignment] = useState({
    title: '',
    classId: db.classes[0]?.classId || '',
    studentId: 'S-101'
  });
  const [successMsg, setSuccessMsg] = useState('');

  // Target Student: Jordan Smith (S-101)
  const student = db.students.find(s => s.studentId === 'S-101') || db.students[0];

  // Calculate GPA based on graded enrollments
  const jordanEnrollmentIds = db.enrollments
    .filter(e => e.studentId === student.studentId)
    .map(e => e.enrollmentId);

  const jordanGrades = db.grades.filter(
    g => jordanEnrollmentIds.includes(g.enrollmentId) && g.score >= 0
  );

  const avgScore = jordanGrades.length > 0 
    ? jordanGrades.reduce((sum, g) => sum + g.score, 0) / jordanGrades.length
    : 94; // Default to 94 if no grades graded yet

  // Convert 100-scale average to 4.0 scale GPA
  const gpa = Number((avgScore / 25).toFixed(2));

  // Assignment submissions count
  const pendingSubmissionsCount = db.grades.filter(
    g => jordanEnrollmentIds.includes(g.enrollmentId) && g.score === -1
  ).length;

  const handleSubmitAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAssignment.title) return;

    // Find enrollment for chosen class
    const enrollment = db.enrollments.find(
      e => e.studentId === student.studentId && e.classId === newAssignment.classId
    );

    if (!enrollment) {
      alert("Error: You are not enrolled in this class.");
      return;
    }

    // Insert new grade record as pending (score = -1)
    const newGrade: Grade = {
      gradeId: `G-${Date.now()}`,
      enrollmentId: enrollment.enrollmentId,
      assessmentType: newAssignment.title,
      score: -1,
      gradeDate: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
    };

    setDb(prev => ({
      ...prev,
      grades: [newGrade, ...prev.grades]
    }));

    setSuccessMsg('Assignment submitted successfully to Faculty for review!');
    setNewAssignment({
      title: '',
      classId: db.classes[0]?.classId || '',
      studentId: 'S-101'
    });

    setTimeout(() => {
      setSuccessMsg('');
      setShowModal(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#f7f9fb] text-[#191c1e] pb-32">
      {/* Top Header Bar */}
      <header className="sticky top-0 z-40 bg-white border-b border-[#c6c6cd] shadow-xs">
        <div className="max-w-7xl mx-auto px-4 md:px-10 h-16 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden border border-[#c6c6cd]">
              <img 
                className="w-full h-full object-cover" 
                src={student.avatar} 
                alt={`${student.firstName} headshot`}
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <h1 className="font-semibold text-lg text-black tracking-tight flex items-center gap-1.5">
                Academic Precision
                <span className="text-xs font-normal text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">Student Portal</span>
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setShowToast(true)}
              className="relative p-2 rounded-full hover:bg-[#e0e3e5] transition-colors active:scale-95"
              title="Show Notifications"
            >
              <Bell className="w-5 h-5 text-black" />
              {showToast && <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-[#ba1a1a] rounded-full border-2 border-white"></span>}
            </button>
            <div className="hidden sm:flex gap-1.5 border border-[#c6c6cd] rounded p-0.5 bg-[#eceef0]">
              <button 
                onClick={() => onNavigate('student')}
                className="px-3 py-1 text-xs font-semibold rounded bg-white text-black shadow-xs"
              >
                Student
              </button>
              <button 
                onClick={() => onNavigate('teacher')}
                className="px-3 py-1 text-xs font-semibold rounded hover:bg-white/50 text-[#505f76]"
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

      <main className="max-w-7xl mx-auto px-4 md:px-10 py-8">
        {/* Welcome Section */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-black tracking-tight">
              Good Morning, {student.firstName}
            </h2>
            <p className="text-gray-500 text-sm md:text-base mt-1">
              Here is what's happening with your academics today.
            </p>
          </div>

          {/* Toast Notification */}
          {showToast && (
            <div className="flex items-center gap-3 bg-[#d0e1fb] border border-[#c6c6cd] p-4 rounded-xl shadow-xs max-w-md w-full animate-fadeIn">
              <div className="bg-black text-white w-10 h-10 rounded-lg flex items-center justify-center shrink-0">
                <Sparkles className="w-5 h-5 text-[#6ffbbe]" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-sm text-[#0b1c30]">New Grade Posted</p>
                <p className="text-xs text-[#38485d]">Advanced Calculus: A- (91%)</p>
              </div>
              <button 
                onClick={() => setShowToast(false)} 
                className="text-[#38485d] hover:text-black p-1 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Stats Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* GPA Card */}
          <div className="bg-white border border-[#c6c6cd] rounded-xl p-6 flex flex-col justify-between hover:shadow-sm transition-shadow">
            <div className="flex justify-between items-start">
              <span className="text-xs font-bold text-[#505f76] uppercase tracking-widest">Academic Standing</span>
              <TrendingUp className="w-5 h-5 text-black" />
            </div>
            <div className="mt-8">
              <p className="text-4xl font-bold text-black">{gpa}</p>
              <p className="text-xs text-gray-500 mt-1">Current GPA • Cumulative</p>
            </div>
            <div className="mt-6 h-1.5 w-full bg-[#e0e3e5] rounded-full overflow-hidden">
              <div 
                className="h-full bg-black transition-all duration-500" 
                style={{ width: `${(gpa / 4.0) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Attendance Card */}
          <div className="bg-white border border-[#c6c6cd] rounded-xl p-6 flex flex-col justify-between hover:shadow-sm transition-shadow">
            <div className="flex justify-between items-start">
              <span className="text-xs font-bold text-[#505f76] uppercase tracking-widest">Participation</span>
              <Calendar className="w-5 h-5 text-black" />
            </div>
            <div className="mt-8">
              <p className="text-4xl font-bold text-black">95%</p>
              <p className="text-xs text-gray-500 mt-1">Attendance Rate • Semester</p>
            </div>
            <div className="mt-6 flex gap-1">
              <div className="h-1.5 flex-1 bg-black rounded-full"></div>
              <div className="h-1.5 flex-1 bg-black rounded-full"></div>
              <div className="h-1.5 flex-1 bg-black rounded-full"></div>
              <div className="h-1.5 flex-1 bg-black rounded-full"></div>
              <div className="h-1.5 flex-1 bg-[#e0e3e5] rounded-full"></div>
            </div>
          </div>

          {/* Featured Card */}
          <div className="relative rounded-xl overflow-hidden min-h-[180px] border border-[#c6c6cd] shadow-xs">
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{ 
                backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuCwDj49QYKxJnKR91mAbxZcXgdYTJXBg0EQlH5EfEPr4II7AKFueZNgGrYne5b3YnyHP3o7WcON-Cw43rIO42UV4XllMB3vS3ah6SVpo4gaXog3YsjQjm1-bS6OhQGdTI3Br4xdCWg5fzk9Qp6hUjmBKtsERCfl2atF9uKNsH1bV6oEwj0s0gExP3FwFpvK5BrbmsuwtwvaM85bshPK9ob_NHF5P3NztFFGJXuJokLuP99N6GH-Iswpo_H4oT95Akj10ajETyqibTM')` 
              }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent flex flex-col justify-end p-6">
              <p className="text-[10px] font-bold text-white/75 uppercase tracking-wider">Department Update</p>
              <h3 className="text-lg font-bold text-white mt-0.5">Dean's List Reception</h3>
              <p className="text-xs text-white/85 mt-1">Friday, 4:00 PM • Great Hall</p>
            </div>
          </div>
        </div>

        {/* Content Section: Assignments & Quick Info */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Upcoming Assignments */}
          <div className="lg:col-span-2 bg-white border border-[#c6c6cd] rounded-xl overflow-hidden">
            <div className="p-6 border-b border-[#c6c6cd] flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold text-black">Upcoming Assignments</h3>
                <p className="text-xs text-gray-500 mt-0.5">Pending coursework and deliverables</p>
              </div>
              <span className="text-xs bg-gray-100 text-[#505f76] px-2.5 py-1 rounded border border-[#c6c6cd]">
                {pendingSubmissionsCount} Pending Review
              </span>
            </div>
            
            <div className="divide-y divide-[#c6c6cd]">
              {/* Assignment Item 1 */}
              <div className="p-6 hover:bg-gray-50/50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-lg bg-[#eceef0] flex items-center justify-center text-black">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-black">Macroeconomics Research Paper</h4>
                    <p className="text-xs text-gray-500">ECON-302 • Dr. Sterling</p>
                  </div>
                </div>
                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2">
                  <span className="bg-[#ffdad6] text-[#93000a] px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider">
                    Due in 2 days
                  </span>
                  <p className="text-[11px] text-gray-400">Oct 24, 2023</p>
                </div>
              </div>

              {/* Assignment Item 2 */}
              <div className="p-6 hover:bg-gray-50/50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-lg bg-[#eceef0] flex items-center justify-center text-black">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-black">Calculus Problem Set 8</h4>
                    <p className="text-xs text-gray-500">MATH-210 • Prof. David Chen</p>
                  </div>
                </div>
                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2">
                  <span className="bg-[#eceef0] text-[#45464d] px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider">
                    Due in 5 days
                  </span>
                  <p className="text-[11px] text-gray-400">Oct 27, 2023</p>
                </div>
              </div>

              {/* Assignment Item 3 */}
              <div className="p-6 hover:bg-gray-50/50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-lg bg-[#eceef0] flex items-center justify-center text-black">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-black">Organic Chemistry Lab Report</h4>
                    <p className="text-xs text-gray-500">CHEM-105 • Dr. Aris Adler</p>
                  </div>
                </div>
                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2">
                  <span className="bg-[#eceef0] text-[#45464d] px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider">
                    Due in 1 week
                  </span>
                  <p className="text-[11px] text-gray-400">Oct 30, 2023</p>
                </div>
              </div>

              {/* Dynamic list of student's other graded records */}
              {jordanGrades.length > 0 && (
                <div className="p-6 bg-gray-50/30">
                  <h4 className="text-xs font-bold uppercase text-gray-400 tracking-wider mb-3">Recently Graded</h4>
                  <div className="space-y-3">
                    {jordanGrades.map((g) => {
                      const enrollment = db.enrollments.find(e => e.enrollmentId === g.enrollmentId);
                      const cls = db.classes.find(c => c.classId === enrollment?.classId);
                      return (
                        <div key={g.gradeId} className="flex justify-between items-center text-xs">
                          <span className="text-[#191c1e] font-medium">{g.assessmentType} ({cls?.className || 'Course'})</span>
                          <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                            {g.score}%
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Quick Info & Quick Access */}
          <div className="space-y-6">
            {/* Spring Registration Alert Card */}
            <div className="bg-black text-white rounded-xl p-6 relative overflow-hidden shadow-sm">
              <div className="relative z-10">
                <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-[#6ffbbe]" />
                  Course Registration
                </h3>
                <p className="text-xs text-gray-300 mt-2 leading-relaxed">
                  Spring 2024 registration opens in 14 days. Prepare your course cart in the database now.
                </p>
                <button 
                  onClick={() => onNavigate('admin')}
                  className="mt-5 text-black bg-white hover:bg-gray-100 text-xs font-semibold px-4 py-2 rounded shadow-xs transition-all active:scale-95"
                >
                  Open Registrar (DB View)
                </button>
              </div>
              <div className="absolute right-[-20px] bottom-[-20px] opacity-10">
                <GraduationCap className="w-40 h-40 text-white" />
              </div>
            </div>

            {/* Quick Access Portal links */}
            <div className="bg-white border border-[#c6c6cd] rounded-xl p-6">
              <h3 className="text-xs font-bold text-[#505f76] uppercase tracking-widest mb-4">Quick Access Portal</h3>
              <ul className="space-y-2">
                <li>
                  <button 
                    onClick={() => alert("Simulating download of your Official Transcript...")}
                    className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 border border-transparent hover:border-[#c6c6cd] transition-all text-left"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="w-4 h-4 text-[#505f76]" />
                      <span className="text-sm font-medium text-[#191c1e]">Official Transcript</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => alert("Current outstanding tuition balance is $0.00. Thank you!")}
                    className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 border border-transparent hover:border-[#c6c6cd] transition-all text-left"
                  >
                    <div className="flex items-center gap-3">
                      <CreditCard className="w-4 h-4 text-[#505f76]" />
                      <span className="text-sm font-medium text-[#191c1e]">Tuition &amp; Fees</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => alert("Redirecting to online libraries and scholarly assets...")}
                    className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 border border-transparent hover:border-[#c6c6cd] transition-all text-left"
                  >
                    <div className="flex items-center gap-3">
                      <Library className="w-4 h-4 text-[#505f76]" />
                      <span className="text-sm font-medium text-[#191c1e]">Library Resources</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      {/* Floating Action Button (FAB) */}
      <button 
        onClick={() => setShowModal(true)}
        className="fixed bottom-24 right-6 sm:bottom-8 sm:right-8 bg-black hover:bg-gray-800 text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-transform hover:scale-105 active:scale-95 z-40"
        title="Submit Coursework"
      >
        <Plus className="w-6 h-6" />
      </button>

      {/* Submit coursework Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-white border border-[#c6c6cd] rounded-xl shadow-lg max-w-md w-full overflow-hidden">
            <div className="p-6 border-b border-[#c6c6cd] flex justify-between items-center">
              <h3 className="font-bold text-lg text-black">Submit New Coursework</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-black">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmitAssignment} className="p-6 space-y-4">
              {successMsg ? (
                <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                  <p className="text-sm font-medium">{successMsg}</p>
                </div>
              ) : (
                <>
                  <div>
                    <label className="block text-xs font-bold uppercase text-[#505f76] mb-1.5">Assignment / Deliverable Title</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Final Calculus Paper, Project Proposal, Lab report"
                      value={newAssignment.title}
                      onChange={(e) => setNewAssignment(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full border border-[#c6c6cd] rounded px-3 py-2 text-sm focus:outline-hidden focus:ring-1 focus:ring-black focus:border-black"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-[#505f76] mb-1.5">Select Class</label>
                    <select 
                      value={newAssignment.classId}
                      onChange={(e) => setNewAssignment(prev => ({ ...prev, classId: e.target.value }))}
                      className="w-full border border-[#c6c6cd] rounded px-3 py-2 text-sm bg-white focus:outline-hidden focus:ring-1 focus:ring-black focus:border-black"
                    >
                      {db.classes.map(c => (
                        <option key={c.classId} value={c.classId}>{c.className}</option>
                      ))}
                    </select>
                  </div>

                  <div className="pt-2 flex justify-end gap-3">
                    <button 
                      type="button" 
                      onClick={() => setShowModal(false)}
                      className="px-4 py-2 text-sm font-semibold rounded border border-[#c6c6cd] text-[#505f76] hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      className="px-4 py-2 text-sm font-semibold rounded bg-black text-white hover:bg-gray-800"
                    >
                      Submit Paper
                    </button>
                  </div>
                </>
              )}
            </form>
          </div>
        </div>
      )}

      {/* Bottom Nav (Mobile Only) */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-[#c6c6cd] md:hidden shadow-lg">
        <div className="flex justify-around items-center h-16 px-4">
          <button 
            onClick={() => onNavigate('student')}
            className="flex flex-col items-center justify-center text-black"
          >
            <div className="bg-[#d0e1fb] text-black px-4 py-1 rounded-full mb-1">
              <LayoutDashboard className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-semibold">Student</span>
          </button>
          
          <button 
            onClick={() => onNavigate('teacher')}
            className="flex flex-col items-center justify-center text-gray-500 hover:text-black"
          >
            <User className="w-5 h-5 mb-1" />
            <span className="text-[10px] font-medium">Teacher</span>
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
