import React, { useState } from 'react';
import { 
  Database, 
  ArrowRight, 
  Plus, 
  Trash2, 
  Edit, 
  Search, 
  Sparkles, 
  Save, 
  X,
  User, 
  School, 
  FileText, 
  BookOpen, 
  ClipboardList,
  RefreshCw,
  Bell
} from 'lucide-react';
import { AcademicDB, Student, Teacher, Subject, Class, Enrollment, Grade, Attendance } from '../types';

interface DatabaseAdminProps {
  db: AcademicDB;
  setDb: React.Dispatch<React.SetStateAction<AcademicDB>>;
  onNavigate: (view: 'student' | 'teacher' | 'admin') => void;
}

type EntityType = 'students' | 'teachers' | 'subjects' | 'classes' | 'enrollments' | 'grades' | 'attendance';

export default function DatabaseAdmin({ db, setDb, onNavigate }: DatabaseAdminProps) {
  const [selectedEntity, setSelectedEntity] = useState<EntityType>('students');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modals / Adding states
  const [showAddModal, setShowAddModal] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);

  // Form State for dynamic additions
  const [studentForm, setStudentForm] = useState<Omit<Student, 'studentId'>>({
    firstName: '',
    lastName: '',
    dateOfBirth: '2004-01-01',
    email: '',
    phoneNumber: '',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'
  });

  const [teacherForm, setTeacherForm] = useState<Omit<Teacher, 'teacherId'>>({
    firstName: '',
    lastName: '',
    email: '',
    department: 'Mathematics',
    hireDate: '2020-01-01',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150'
  });

  const [subjectForm, setSubjectForm] = useState<Omit<Subject, 'subjectId'>>({
    subjectName: '',
    description: '',
    credits: 3
  });

  const [gradeForm, setGradeForm] = useState<Omit<Grade, 'gradeId'>>({
    enrollmentId: '',
    assessmentType: '',
    score: 90,
    gradeDate: new Date().toISOString().split('T')[0]
  });

  // Handle addition
  const handleAddRecord = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedEntity === 'students') {
      const newStudent: Student = {
        ...studentForm,
        studentId: `S-${Date.now()}`
      };
      setDb(prev => ({ ...prev, students: [newStudent, ...prev.students] }));
    } else if (selectedEntity === 'teachers') {
      const newTeacher: Teacher = {
        ...teacherForm,
        teacherId: `T-${Date.now()}`
      };
      setDb(prev => ({ ...prev, teachers: [newTeacher, ...prev.teachers] }));
    } else if (selectedEntity === 'subjects') {
      const newSubject: Subject = {
        ...subjectForm,
        subjectId: `SUB-${Date.now()}`
      };
      setDb(prev => ({ ...prev, subjects: [newSubject, ...prev.subjects] }));
    } else if (selectedEntity === 'grades') {
      const newGrade: Grade = {
        ...gradeForm,
        gradeId: `G-${Date.now()}`
      };
      setDb(prev => ({ ...prev, grades: [newGrade, ...prev.grades] }));
    }

    setShowAddModal(false);
    // Reset forms
    setStudentForm({
      firstName: '',
      lastName: '',
      dateOfBirth: '2004-01-01',
      email: '',
      phoneNumber: '',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'
    });
  };

  // Delete a record
  const handleDeleteRecord = (entity: EntityType, idField: string, idVal: string) => {
    if (confirm(`Are you sure you want to delete this ${entity} record?`)) {
      setDb((prev: any) => {
        const filteredList = prev[entity].filter((item: any) => item[idField] !== idVal);
        return {
          ...prev,
          [entity]: filteredList
        };
      });
    }
  };

  const getCount = (entity: EntityType) => {
    return db[entity].length;
  };

  return (
    <div className="min-h-screen bg-[#f7f9fb] text-[#191c1e] pb-32">
      {/* Top Header Bar */}
      <header className="sticky top-0 z-40 bg-white border-b border-[#c6c6cd] shadow-xs">
        <div className="max-w-7xl mx-auto px-4 md:px-10 h-16 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-black text-white flex items-center justify-center">
              <Database className="w-6 h-6 text-[#6ffbbe]" />
            </div>
            <div>
              <h1 className="font-semibold text-lg text-black tracking-tight flex items-center gap-1.5">
                Academic Precision
                <span className="text-xs font-normal text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-100 font-mono">DB Console</span>
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex gap-1.5 border border-[#c6c6cd] rounded p-0.5 bg-[#eceef0]">
              <button 
                onClick={() => onNavigate('student')}
                className="px-3 py-1 text-xs font-semibold rounded hover:bg-white/50 text-[#505f76]"
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
                className="px-3 py-1 text-xs font-semibold rounded bg-white text-black shadow-xs"
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
            <h2 className="text-2xl md:text-3xl font-bold text-black tracking-tight flex items-center gap-2.5">
              Entity-Relationship Explorer
            </h2>
            <p className="text-gray-500 text-sm md:text-base mt-1">
              Directly manipulate the simulated relational tables below to update the Student and Faculty dashboards instantly.
            </p>
          </div>
          <button 
            onClick={() => {
              if (confirm("Reset database to initial state? This clears additions.")) {
                window.location.reload();
              }
            }}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded border border-[#c6c6cd] text-[#505f76] hover:bg-gray-100 active:scale-95 transition-all self-start lg:self-auto"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Reset DB
          </button>
        </div>

        {/* Visual ERD Entity Selectors */}
        <div className="bg-white border border-[#c6c6cd] rounded-xl p-6 mb-8">
          <h3 className="text-xs font-bold text-[#505f76] uppercase tracking-widest mb-6">Interactive Schema Graph</h3>
          
          {/* ERD Nodes layout */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            
            {/* STUDENTS Node */}
            <div 
              onClick={() => setSelectedEntity('students')}
              className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                selectedEntity === 'students' 
                  ? 'border-black bg-[#eceef0] ring-1 ring-black' 
                  : 'border-[#c6c6cd] hover:border-[#76777d] bg-gray-50/50'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold text-gray-500">PK: Student_ID</span>
                <User className="w-4 h-4 text-[#505f76]" />
              </div>
              <div className="mt-4">
                <h4 className="font-bold text-sm text-black">STUDENTS</h4>
                <p className="text-xs text-gray-400 mt-1">{getCount('students')} records</p>
              </div>
            </div>

            {/* TEACHERS Node */}
            <div 
              onClick={() => setSelectedEntity('teachers')}
              className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                selectedEntity === 'teachers' 
                  ? 'border-black bg-[#eceef0] ring-1 ring-black' 
                  : 'border-[#c6c6cd] hover:border-[#76777d] bg-gray-50/50'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold text-gray-500">PK: Teacher_ID</span>
                <School className="w-4 h-4 text-[#505f76]" />
              </div>
              <div className="mt-4">
                <h4 className="font-bold text-sm text-black">TEACHERS</h4>
                <p className="text-xs text-gray-400 mt-1">{getCount('teachers')} records</p>
              </div>
            </div>

            {/* SUBJECTS Node */}
            <div 
              onClick={() => setSelectedEntity('subjects')}
              className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                selectedEntity === 'subjects' 
                  ? 'border-black bg-[#eceef0] ring-1 ring-black' 
                  : 'border-[#c6c6cd] hover:border-[#76777d] bg-gray-50/50'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold text-gray-500">PK: Subject_ID</span>
                <BookOpen className="w-4 h-4 text-[#505f76]" />
              </div>
              <div className="mt-4">
                <h4 className="font-bold text-sm text-black">SUBJECTS</h4>
                <p className="text-xs text-gray-400 mt-1">{getCount('subjects')} records</p>
              </div>
            </div>

            {/* CLASSES Node */}
            <div 
              onClick={() => setSelectedEntity('classes')}
              className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                selectedEntity === 'classes' 
                  ? 'border-black bg-[#eceef0] ring-1 ring-black' 
                  : 'border-[#c6c6cd] hover:border-[#76777d] bg-gray-50/50'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold text-gray-500">FK: Teacher, Subject</span>
                <ClipboardList className="w-4 h-4 text-[#505f76]" />
              </div>
              <div className="mt-4">
                <h4 className="font-bold text-sm text-black">CLASSES</h4>
                <p className="text-xs text-gray-400 mt-1">{getCount('classes')} classes</p>
              </div>
            </div>

            {/* ENROLLMENTS Node */}
            <div 
              onClick={() => setSelectedEntity('enrollments')}
              className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                selectedEntity === 'enrollments' 
                  ? 'border-black bg-[#eceef0] ring-1 ring-black' 
                  : 'border-[#c6c6cd] hover:border-[#76777d] bg-gray-50/50'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold text-gray-500">FK: Student, Class</span>
                <Sparkles className="w-4 h-4 text-[#505f76]" />
              </div>
              <div className="mt-4">
                <h4 className="font-bold text-sm text-black">ENROLLMENTS</h4>
                <p className="text-xs text-gray-400 mt-1">{getCount('enrollments')} enrollments</p>
              </div>
            </div>

            {/* GRADES Node */}
            <div 
              onClick={() => setSelectedEntity('grades')}
              className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                selectedEntity === 'grades' 
                  ? 'border-black bg-[#eceef0] ring-1 ring-black' 
                  : 'border-[#c6c6cd] hover:border-[#76777d] bg-gray-50/50'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold text-gray-500">FK: Enrollment</span>
                <FileText className="w-4 h-4 text-[#505f76]" />
              </div>
              <div className="mt-4">
                <h4 className="font-bold text-sm text-black">GRADES</h4>
                <p className="text-xs text-gray-400 mt-1">{getCount('grades')} results</p>
              </div>
            </div>

            {/* ATTENDANCE Node */}
            <div 
              onClick={() => setSelectedEntity('attendance')}
              className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                selectedEntity === 'attendance' 
                  ? 'border-black bg-[#eceef0] ring-1 ring-black' 
                  : 'border-[#c6c6cd] hover:border-[#76777d] bg-gray-50/50'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold text-gray-500">FK: Enrollment</span>
                <ClipboardList className="w-4 h-4 text-[#505f76]" />
              </div>
              <div className="mt-4">
                <h4 className="font-bold text-sm text-black">ATTENDANCE</h4>
                <p className="text-xs text-gray-400 mt-1">{getCount('attendance')} entries</p>
              </div>
            </div>

            {/* QUICK LINK TO INTERACTIVE PORTAL VIEWS */}
            <div 
              className="p-4 rounded-xl border border-dashed border-[#76777d] bg-gray-50/20 flex flex-col justify-between hover:bg-gray-100/50 transition-all cursor-pointer"
              onClick={() => onNavigate('student')}
            >
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded uppercase">Live Portals</span>
                <ArrowRight className="w-4 h-4 text-[#009668]" />
              </div>
              <div className="mt-4">
                <h4 className="font-bold text-sm text-black">LAUNCH PORTALS</h4>
                <p className="text-xs text-gray-400 mt-1">Go to student &amp; teacher view</p>
              </div>
            </div>

          </div>
        </div>

        {/* Console / Table View of the selected table */}
        <div className="bg-white border border-[#c6c6cd] rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-[#c6c6cd] bg-gray-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-base text-black uppercase tracking-wider font-mono">
                SELECT * FROM {selectedEntity.toUpperCase()}
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">Showing {db[selectedEntity].length} records matching schemas</p>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                <input 
                  type="text" 
                  placeholder={`Search ${selectedEntity}...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-4 py-1.5 border border-[#c6c6cd] rounded text-xs bg-white focus:outline-hidden focus:ring-1 focus:ring-black"
                />
              </div>

              {/* Only allow adding for editable entities */}
              {['students', 'teachers', 'subjects', 'grades'].includes(selectedEntity) && (
                <button 
                  onClick={() => setShowAddModal(true)}
                  className="flex items-center gap-1 bg-black text-white hover:bg-gray-800 text-xs font-semibold px-4 py-2 rounded transition-all active:scale-95 whitespace-nowrap"
                >
                  <Plus className="w-4 h-4" />
                  Insert Row
                </button>
              )}
            </div>
          </div>

          {/* Table renderer based on selected entity */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#c6c6cd] bg-gray-50/50">
                  {selectedEntity === 'students' && (
                    <>
                      <th className="p-4 text-xs font-bold text-gray-600 font-mono">Student_ID</th>
                      <th className="p-4 text-xs font-bold text-gray-600">First Name</th>
                      <th className="p-4 text-xs font-bold text-gray-600">Last Name</th>
                      <th className="p-4 text-xs font-bold text-gray-600">Email</th>
                      <th className="p-4 text-xs font-bold text-gray-600">Phone Number</th>
                      <th className="p-4 text-xs font-bold text-gray-600 text-right font-mono">Actions</th>
                    </>
                  )}
                  {selectedEntity === 'teachers' && (
                    <>
                      <th className="p-4 text-xs font-bold text-gray-600 font-mono">Teacher_ID</th>
                      <th className="p-4 text-xs font-bold text-gray-600">First Name</th>
                      <th className="p-4 text-xs font-bold text-gray-600">Last Name</th>
                      <th className="p-4 text-xs font-bold text-gray-600">Email</th>
                      <th className="p-4 text-xs font-bold text-gray-600">Department</th>
                      <th className="p-4 text-xs font-bold text-gray-600 text-right font-mono">Actions</th>
                    </>
                  )}
                  {selectedEntity === 'subjects' && (
                    <>
                      <th className="p-4 text-xs font-bold text-gray-600 font-mono">Subject_ID</th>
                      <th className="p-4 text-xs font-bold text-gray-600">Subject Name</th>
                      <th className="p-4 text-xs font-bold text-gray-600">Description</th>
                      <th className="p-4 text-xs font-bold text-gray-600">Credits</th>
                      <th className="p-4 text-xs font-bold text-gray-600 text-right font-mono">Actions</th>
                    </>
                  )}
                  {selectedEntity === 'classes' && (
                    <>
                      <th className="p-4 text-xs font-bold text-gray-600 font-mono">Class_ID</th>
                      <th className="p-4 text-xs font-bold text-gray-600">Class Name</th>
                      <th className="p-4 text-xs font-bold text-gray-600 font-mono">Subject_ID</th>
                      <th className="p-4 text-xs font-bold text-gray-600 font-mono">Teacher_ID</th>
                      <th className="p-4 text-xs font-bold text-gray-600">Schedule</th>
                      <th className="p-4 text-xs font-bold text-gray-600">Room Number</th>
                    </>
                  )}
                  {selectedEntity === 'enrollments' && (
                    <>
                      <th className="p-4 text-xs font-bold text-gray-600 font-mono">Enrollment_ID</th>
                      <th className="p-4 text-xs font-bold text-gray-600 font-mono">Student_ID</th>
                      <th className="p-4 text-xs font-bold text-gray-600 font-mono">Class_ID</th>
                      <th className="p-4 text-xs font-bold text-gray-600">Enrollment Date</th>
                      <th className="p-4 text-xs font-bold text-gray-600">Status</th>
                    </>
                  )}
                  {selectedEntity === 'grades' && (
                    <>
                      <th className="p-4 text-xs font-bold text-gray-600 font-mono">Grade_ID</th>
                      <th className="p-4 text-xs font-bold text-gray-600 font-mono">Enrollment_ID</th>
                      <th className="p-4 text-xs font-bold text-gray-600">Assessment Type</th>
                      <th className="p-4 text-xs font-bold text-gray-600">Score</th>
                      <th className="p-4 text-xs font-bold text-gray-600">Date</th>
                      <th className="p-4 text-xs font-bold text-gray-600 text-right font-mono">Actions</th>
                    </>
                  )}
                  {selectedEntity === 'attendance' && (
                    <>
                      <th className="p-4 text-xs font-bold text-gray-600 font-mono">Attendance_ID</th>
                      <th className="p-4 text-xs font-bold text-gray-600 font-mono">Enrollment_ID</th>
                      <th className="p-4 text-xs font-bold text-gray-600">Date</th>
                      <th className="p-4 text-xs font-bold text-gray-600">Status</th>
                      <th className="p-4 text-xs font-bold text-gray-600">Notes</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#c6c6cd]">
                
                {/* Students Entity Rendering */}
                {selectedEntity === 'students' && (db.students as Student[])
                  .filter(s => `${s.firstName} ${s.lastName} ${s.email}`.toLowerCase().includes(searchQuery.toLowerCase()))
                  .map((s) => (
                    <tr key={s.studentId} className="hover:bg-gray-50/50">
                      <td className="p-4 text-xs font-mono font-bold text-gray-500">{s.studentId}</td>
                      <td className="p-4 text-sm font-semibold text-black">{s.firstName}</td>
                      <td className="p-4 text-sm text-gray-700">{s.lastName}</td>
                      <td className="p-4 text-sm text-gray-500">{s.email}</td>
                      <td className="p-4 text-sm text-gray-500">{s.phoneNumber}</td>
                      <td className="p-4 text-right">
                        <button 
                          onClick={() => handleDeleteRecord('students', 'studentId', s.studentId)}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                ))}

                {/* Teachers Entity Rendering */}
                {selectedEntity === 'teachers' && (db.teachers as Teacher[])
                  .filter(t => `${t.firstName} ${t.lastName} ${t.department}`.toLowerCase().includes(searchQuery.toLowerCase()))
                  .map((t) => (
                    <tr key={t.teacherId} className="hover:bg-gray-50/50">
                      <td className="p-4 text-xs font-mono font-bold text-gray-500">{t.teacherId}</td>
                      <td className="p-4 text-sm font-semibold text-black">{t.firstName}</td>
                      <td className="p-4 text-sm text-gray-700">{t.lastName}</td>
                      <td className="p-4 text-sm text-gray-500">{t.email}</td>
                      <td className="p-4 text-xs bg-gray-50 rounded font-medium px-2 py-1 inline-block mt-3">{t.department}</td>
                      <td className="p-4 text-right">
                        <button 
                          onClick={() => handleDeleteRecord('teachers', 'teacherId', t.teacherId)}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                ))}

                {/* Subjects Entity Rendering */}
                {selectedEntity === 'subjects' && (db.subjects as Subject[])
                  .filter(sub => `${sub.subjectName} ${sub.description}`.toLowerCase().includes(searchQuery.toLowerCase()))
                  .map((sub) => (
                    <tr key={sub.subjectId} className="hover:bg-gray-50/50">
                      <td className="p-4 text-xs font-mono font-bold text-gray-500">{sub.subjectId}</td>
                      <td className="p-4 text-sm font-semibold text-black">{sub.subjectName}</td>
                      <td className="p-4 text-xs text-gray-500 max-w-xs truncate">{sub.description}</td>
                      <td className="p-4 text-sm font-bold text-purple-600">{sub.credits} Credits</td>
                      <td className="p-4 text-right">
                        <button 
                          onClick={() => handleDeleteRecord('subjects', 'subjectId', sub.subjectId)}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                ))}

                {/* Classes Entity Rendering */}
                {selectedEntity === 'classes' && (db.classes as Class[])
                  .filter(c => c.className.toLowerCase().includes(searchQuery.toLowerCase()))
                  .map((c) => (
                    <tr key={c.classId} className="hover:bg-gray-50/50">
                      <td className="p-4 text-xs font-mono font-bold text-gray-500">{c.classId}</td>
                      <td className="p-4 text-sm font-semibold text-black">{c.className}</td>
                      <td className="p-4 text-xs font-mono text-gray-400">{c.subjectId}</td>
                      <td className="p-4 text-xs font-mono text-gray-400">{c.teacherId}</td>
                      <td className="p-4 text-sm text-gray-500">{c.schedule}</td>
                      <td className="p-4 text-sm text-gray-500">{c.roomNumber}</td>
                    </tr>
                ))}

                {/* Enrollments Entity Rendering */}
                {selectedEntity === 'enrollments' && (db.enrollments as Enrollment[])
                  .filter(e => e.studentId.toLowerCase().includes(searchQuery.toLowerCase()))
                  .map((e) => (
                    <tr key={e.enrollmentId} className="hover:bg-gray-50/50">
                      <td className="p-4 text-xs font-mono font-bold text-gray-500">{e.enrollmentId}</td>
                      <td className="p-4 text-xs font-mono text-gray-600 font-bold">{e.studentId}</td>
                      <td className="p-4 text-xs font-mono text-gray-600">{e.classId}</td>
                      <td className="p-4 text-sm text-gray-500">{e.enrollmentDate}</td>
                      <td className="p-4 text-sm font-semibold text-emerald-600">{e.status}</td>
                    </tr>
                ))}

                {/* Grades Entity Rendering */}
                {selectedEntity === 'grades' && (db.grades as Grade[])
                  .filter(g => g.assessmentType.toLowerCase().includes(searchQuery.toLowerCase()))
                  .map((g) => (
                    <tr key={g.gradeId} className="hover:bg-gray-50/50">
                      <td className="p-4 text-xs font-mono font-bold text-gray-500">{g.gradeId}</td>
                      <td className="p-4 text-xs font-mono text-gray-600">{g.enrollmentId}</td>
                      <td className="p-4 text-sm font-semibold text-black">{g.assessmentType}</td>
                      <td className="p-4 text-sm">
                        {g.score === -1 ? (
                          <span className="text-red-500 bg-red-50 border border-red-100 rounded px-2 py-0.5 text-xs font-bold uppercase">Pending Review</span>
                        ) : (
                          <span className="text-emerald-600 bg-emerald-50 border border-emerald-100 rounded px-2 py-0.5 text-xs font-bold">{g.score}%</span>
                        )}
                      </td>
                      <td className="p-4 text-xs text-gray-500">{g.gradeDate}</td>
                      <td className="p-4 text-right">
                        <button 
                          onClick={() => handleDeleteRecord('grades', 'gradeId', g.gradeId)}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                ))}

                {/* Attendance Entity Rendering */}
                {selectedEntity === 'attendance' && (db.attendance as Attendance[])
                  .filter(a => a.date.includes(searchQuery))
                  .map((a) => (
                    <tr key={a.attendanceId} className="hover:bg-gray-50/50">
                      <td className="p-4 text-xs font-mono font-bold text-gray-500">{a.attendanceId}</td>
                      <td className="p-4 text-xs font-mono text-gray-600">{a.enrollmentId}</td>
                      <td className="p-4 text-sm text-gray-600">{a.date}</td>
                      <td className="p-4">
                        <span className={`px-2.5 py-0.5 rounded text-xs font-bold ${
                          a.status === 'Present' ? 'bg-emerald-100 text-[#009668]' : 'bg-red-100 text-[#ba1a1a]'
                        }`}>
                          {a.status}
                        </span>
                      </td>
                      <td className="p-4 text-xs text-gray-400 italic">{a.notes || 'No comments'}</td>
                    </tr>
                ))}

              </tbody>
            </table>
          </div>
        </div>

      </main>

      {/* Insert Row Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-white border border-[#c6c6cd] rounded-xl shadow-lg max-w-md w-full overflow-hidden">
            <div className="p-6 border-b border-[#c6c6cd]">
              <h3 className="font-bold text-lg text-black">Insert Relational Tuple</h3>
              <p className="text-xs text-gray-500 mt-1">Table: {selectedEntity.toUpperCase()}</p>
            </div>
            
            <form onSubmit={handleAddRecord} className="p-6 space-y-4">
              
              {/* Student form fields */}
              {selectedEntity === 'students' && (
                <>
                  <div>
                    <label className="block text-xs font-bold uppercase text-[#505f76] mb-1">First Name</label>
                    <input 
                      type="text" required
                      value={studentForm.firstName}
                      onChange={e => setStudentForm(p => ({ ...p, firstName: e.target.value }))}
                      className="w-full border border-[#c6c6cd] rounded px-3 py-2 text-sm focus:outline-hidden focus:ring-1 focus:ring-black"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-[#505f76] mb-1">Last Name</label>
                    <input 
                      type="text" required
                      value={studentForm.lastName}
                      onChange={e => setStudentForm(p => ({ ...p, lastName: e.target.value }))}
                      className="w-full border border-[#c6c6cd] rounded px-3 py-2 text-sm focus:outline-hidden focus:ring-1 focus:ring-black"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-[#505f76] mb-1">Email</label>
                    <input 
                      type="email" required
                      value={studentForm.email}
                      onChange={e => setStudentForm(p => ({ ...p, email: e.target.value }))}
                      className="w-full border border-[#c6c6cd] rounded px-3 py-2 text-sm focus:outline-hidden focus:ring-1 focus:ring-black"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-[#505f76] mb-1">Phone Number</label>
                    <input 
                      type="text" placeholder="+1 (555) 000-0000"
                      value={studentForm.phoneNumber}
                      onChange={e => setStudentForm(p => ({ ...p, phoneNumber: e.target.value }))}
                      className="w-full border border-[#c6c6cd] rounded px-3 py-2 text-sm focus:outline-hidden focus:ring-1 focus:ring-black"
                    />
                  </div>
                </>
              )}

              {/* Teacher form fields */}
              {selectedEntity === 'teachers' && (
                <>
                  <div>
                    <label className="block text-xs font-bold uppercase text-[#505f76] mb-1">First Name</label>
                    <input 
                      type="text" required
                      value={teacherForm.firstName}
                      onChange={e => setTeacherForm(p => ({ ...p, firstName: e.target.value }))}
                      className="w-full border border-[#c6c6cd] rounded px-3 py-2 text-sm focus:outline-hidden focus:ring-1 focus:ring-black"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-[#505f76] mb-1">Last Name</label>
                    <input 
                      type="text" required
                      value={teacherForm.lastName}
                      onChange={e => setTeacherForm(p => ({ ...p, lastName: e.target.value }))}
                      className="w-full border border-[#c6c6cd] rounded px-3 py-2 text-sm focus:outline-hidden focus:ring-1 focus:ring-black"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-[#505f76] mb-1">Email</label>
                    <input 
                      type="email" required
                      value={teacherForm.email}
                      onChange={e => setTeacherForm(p => ({ ...p, email: e.target.value }))}
                      className="w-full border border-[#c6c6cd] rounded px-3 py-2 text-sm focus:outline-hidden focus:ring-1 focus:ring-black"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-[#505f76] mb-1">Department</label>
                    <input 
                      type="text" required
                      value={teacherForm.department}
                      onChange={e => setTeacherForm(p => ({ ...p, department: e.target.value }))}
                      className="w-full border border-[#c6c6cd] rounded px-3 py-2 text-sm focus:outline-hidden focus:ring-1 focus:ring-black"
                    />
                  </div>
                </>
              )}

              {/* Subject form fields */}
              {selectedEntity === 'subjects' && (
                <>
                  <div>
                    <label className="block text-xs font-bold uppercase text-[#505f76] mb-1">Subject Name</label>
                    <input 
                      type="text" required
                      value={subjectForm.subjectName}
                      onChange={e => setSubjectForm(p => ({ ...p, subjectName: e.target.value }))}
                      className="w-full border border-[#c6c6cd] rounded px-3 py-2 text-sm focus:outline-hidden focus:ring-1 focus:ring-black"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-[#505f76] mb-1">Description</label>
                    <textarea 
                      value={subjectForm.description}
                      onChange={e => setSubjectForm(p => ({ ...p, description: e.target.value }))}
                      className="w-full border border-[#c6c6cd] rounded px-3 py-2 text-sm focus:outline-hidden focus:ring-1 focus:ring-black"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-[#505f76] mb-1">Credits</label>
                    <input 
                      type="number" min={1} max={5}
                      value={subjectForm.credits}
                      onChange={e => setSubjectForm(p => ({ ...p, credits: Number(e.target.value) }))}
                      className="w-full border border-[#c6c6cd] rounded px-3 py-2 text-sm focus:outline-hidden focus:ring-1 focus:ring-black"
                    />
                  </div>
                </>
              )}

              {/* Grade form fields */}
              {selectedEntity === 'grades' && (
                <>
                  <div>
                    <label className="block text-xs font-bold uppercase text-[#505f76] mb-1">Enrollment ID</label>
                    <select 
                      value={gradeForm.enrollmentId}
                      onChange={e => setGradeForm(p => ({ ...p, enrollmentId: e.target.value }))}
                      className="w-full border border-[#c6c6cd] rounded px-3 py-2 text-sm bg-white focus:outline-hidden focus:ring-1 focus:ring-black"
                      required
                    >
                      <option value="">-- Choose enrollment --</option>
                      {db.enrollments.map(en => {
                        const stu = db.students.find(s => s.studentId === en.studentId);
                        const cls = db.classes.find(c => c.classId === en.classId);
                        return (
                          <option key={en.enrollmentId} value={en.enrollmentId}>
                            {stu ? `${stu.firstName} ${stu.lastName}` : en.studentId} - {cls?.className || en.classId}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-[#505f76] mb-1">Assessment Type</label>
                    <input 
                      type="text" required placeholder="e.g. Midterm Correction, Lab Report #4"
                      value={gradeForm.assessmentType}
                      onChange={e => setGradeForm(p => ({ ...p, assessmentType: e.target.value }))}
                      className="w-full border border-[#c6c6cd] rounded px-3 py-2 text-sm focus:outline-hidden focus:ring-1 focus:ring-black"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-[#505f76] mb-1">Score (0 - 100)</label>
                    <input 
                      type="number" min={0} max={100} required
                      value={gradeForm.score}
                      onChange={e => setGradeForm(p => ({ ...p, score: Number(e.target.value) }))}
                      className="w-full border border-[#c6c6cd] rounded px-3 py-2 text-sm focus:outline-hidden focus:ring-1 focus:ring-black"
                    />
                  </div>
                </>
              )}

              <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
                <button 
                  type="button" 
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-sm font-semibold rounded border border-[#c6c6cd] text-[#505f76] hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 text-sm font-semibold rounded bg-black text-white hover:bg-gray-800"
                >
                  Execute Insert
                </button>
              </div>

            </form>
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
            className="flex flex-col items-center justify-center text-gray-500 hover:text-black"
          >
            <School className="w-5 h-5 mb-1" />
            <span className="text-[10px] font-medium">Teacher</span>
          </button>

          <button 
            onClick={() => onNavigate('admin')}
            className="flex flex-col items-center justify-center text-black"
          >
            <div className="bg-[#d0e1fb] text-black px-4 py-1 rounded-full mb-1">
              <Database className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-semibold">Database</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
