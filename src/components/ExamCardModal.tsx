import React from 'react';
import { useDashboard } from '../context/DashboardContext';
import {
  GraduationCap,
  X,
  Printer,
  CheckCircle2,
  ShieldCheck,
  QrCode,
  Calendar,
  Building,
  Download
} from 'lucide-react';

interface ExamCardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExamCardModal: React.FC<ExamCardModalProps> = ({ isOpen, onClose }) => {
  const { currentStudent, enrolledCourses, showToast } = useDashboard();

  if (!isOpen) return null;

  const handlePrint = () => {
    showToast('Examination Card downloaded successfully for printing.', 'success');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] flex flex-col">
        
        {/* Top Action Bar */}
        <div className="bg-[#002B49] text-white px-5 py-3.5 flex items-center justify-between border-b border-[#001f35]">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-bold tracking-wide uppercase">
              KCA University · Official Examination Clearance Pass
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-2.5 py-1 rounded bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-colors flex items-center gap-1 shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Download</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded hover:bg-white/10 text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Card Area */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-800">
          
          {/* Card Letterhead */}
          <div className="border-b-2 border-[#002B49] pb-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-[#002B49] text-amber-400 flex items-center justify-center font-black text-2xl shadow-xs shrink-0">
                KCA
              </div>
              <div>
                <h2 className="font-black text-base tracking-tight text-[#002B49] uppercase">
                  KCA UNIVERSITY
                </h2>
                <p className="text-[11px] font-bold text-amber-800">
                  Directorate of Examinations &amp; Academic Affairs
                </p>
                <p className="text-[10px] text-slate-500">
                  Semester Examination Card · Academic Year 2025/2026
                </p>
              </div>
            </div>

            <div className="text-right">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px] uppercase border border-emerald-300">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                Cleared for Exams
              </span>
              <div className="font-mono text-[10px] text-slate-400 mt-1">
                Ref: EXAM-{currentStudent.RegNumber.replace('/', '')}-2026
              </div>
            </div>
          </div>

          {/* Student Profile Info */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div className="sm:col-span-3 flex justify-center">
              <div className="w-24 h-24 rounded-lg overflow-hidden border-2 border-slate-300 bg-slate-200 shrink-0">
                {currentStudent.AvatarUrl ? (
                  <img
                    src={currentStudent.AvatarUrl}
                    alt={currentStudent.Name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center font-bold text-xl text-slate-500">
                    {currentStudent.Name.slice(0, 2)}
                  </div>
                )}
              </div>
            </div>

            <div className="sm:col-span-9 grid grid-cols-2 gap-y-2 gap-x-4 text-xs">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Student Name</span>
                <span className="font-bold text-slate-900 text-sm">{currentStudent.Name}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Registration Number</span>
                <span className="font-mono font-bold text-[#002B49] text-sm">{currentStudent.RegNumber}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Academic Programme</span>
                <span className="font-semibold text-slate-800">{currentStudent.Programme}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Stage / Semester</span>
                <span className="font-semibold text-slate-800">{currentStudent.YearOfStudy} (Jan–Apr 2026)</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Campus / Center</span>
                <span className="text-slate-700">Main Campus, Ruaraka, Nairobi</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Finance Clearance</span>
                <span className="text-emerald-700 font-bold">100% Cleared (Zero Balance)</span>
              </div>
            </div>
          </div>

          {/* Authorized Exam Units Table */}
          <div className="space-y-2">
            <h3 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
              Authorized Examination Course Units
            </h3>
            
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-[#002B49] text-white text-[11px]">
                  <tr>
                    <th className="p-2.5 font-mono">Code</th>
                    <th className="p-2.5">Course Unit Title</th>
                    <th className="p-2.5">Venue</th>
                    <th className="p-2.5 text-center">Invigilator Sign</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 font-mono text-[11px]">
                  {enrolledCourses.map((item, idx) => (
                    <tr key={item.unit.UnitCode} className="hover:bg-slate-50">
                      <td className="p-2.5 font-bold text-[#002B49]">{item.unit.UnitCode}</td>
                      <td className="p-2.5 font-sans font-semibold text-slate-800">{item.unit.UnitName}</td>
                      <td className="p-2.5 text-slate-600">{item.room.RoomName}</td>
                      <td className="p-2.5 text-center text-slate-300">_________________</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Instructions and Security Watermark */}
          <div className="bg-amber-50/70 border border-amber-200 p-3.5 rounded-xl text-[11px] text-amber-900 space-y-1">
            <div className="font-bold flex items-center gap-1.5 text-amber-950">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
              <span>Examination Regulations:</span>
            </div>
            <p>1. Students must present this valid examination pass alongside their official KCA Student ID card at the examination room entrance.</p>
            <p>2. Unauthorized materials, smart watches, and cellular devices are strictly prohibited inside the examination halls.</p>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs">
          <span className="text-slate-400 font-mono text-[10px]">
            Officially verified by KCA Student Portal Security System
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-[#002B49] text-white font-semibold hover:bg-[#00385F] transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
