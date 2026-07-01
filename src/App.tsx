import React, { useState, useEffect } from 'react';
import { initialDB } from './initialData';
import { AcademicDB } from './types';
import StudentDashboard from './components/StudentDashboard';
import TeacherDashboard from './components/TeacherDashboard';
import DatabaseAdmin from './components/DatabaseAdmin';
import { Sparkles, Database, Users, GraduationCap } from 'lucide-react';

export default function App() {
  const [db, setDb] = useState<AcademicDB>(() => {
    const saved = localStorage.getItem('academic_precision_db');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved database state', e);
      }
    }
    return initialDB;
  });

  const [activeView, setActiveView] = useState<'student' | 'teacher' | 'admin'>('student');

  // Sync state to local storage whenever database updates
  useEffect(() => {
    localStorage.setItem('academic_precision_db', JSON.stringify(db));
  }, [db]);

  return (
    <div className="min-h-screen bg-[#f7f9fb] text-[#191c1e] relative">
      {/* Dynamic Persisted Role Selector Panel (Floating helper to switch easily across screens) */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-black/90 text-white backdrop-blur-md px-4 py-2.5 rounded-full shadow-2xl flex items-center gap-3 border border-white/10 text-xs font-semibold">
        <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400 border-r border-white/10 pr-2.5">
          Role
        </span>
        <div className="flex gap-1">
          <button 
            onClick={() => setActiveView('student')}
            className={`px-3 py-1.5 rounded-full transition-all flex items-center gap-1 ${
              activeView === 'student' 
                ? 'bg-[#d0e1fb] text-[#0b1c30] shadow-xs' 
                : 'hover:bg-white/10 text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Student Portal</span>
          </button>
          
          <button 
            onClick={() => setActiveView('teacher')}
            className={`px-3 py-1.5 rounded-full transition-all flex items-center gap-1 ${
              activeView === 'teacher' 
                ? 'bg-[#d0e1fb] text-[#0b1c30] shadow-xs' 
                : 'hover:bg-white/10 text-white'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Faculty View</span>
          </button>
          
          <button 
            onClick={() => setActiveView('admin')}
            className={`px-3 py-1.5 rounded-full transition-all flex items-center gap-1 ${
              activeView === 'admin' 
                ? 'bg-[#d0e1fb] text-[#0b1c30] shadow-xs' 
                : 'hover:bg-white/10 text-white'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>Database Admin</span>
          </button>
        </div>
      </div>

      {/* Render Active View */}
      {activeView === 'student' && (
        <StudentDashboard db={db} setDb={setDb} onNavigate={setActiveView} />
      )}
      {activeView === 'teacher' && (
        <TeacherDashboard db={db} setDb={setDb} onNavigate={setActiveView} />
      )}
      {activeView === 'admin' && (
        <DatabaseAdmin db={db} setDb={setDb} onNavigate={setActiveView} />
      )}
    </div>
  );
}
