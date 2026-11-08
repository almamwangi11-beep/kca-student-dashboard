import React from 'react';
import { useDashboard } from '../context/DashboardContext';
import {
  Mail,
  X,
  Clock,
  Calendar,
  CheckCircle,
  GraduationCap,
  ExternalLink,
  ShieldCheck,
  Send
} from 'lucide-react';

export const NotificationModal: React.FC = () => {
  const {
    selectedEmailForModal,
    setSelectedEmailForModal,
    currentStudent,
    units,
    assignments,
    markNotificationAsRead
  } = useDashboard();

  if (!selectedEmailForModal) return null;

  const notif = selectedEmailForModal;
  const assignment = assignments.find(a => a.AssignmentID === notif.AssignmentID);
  const unit = assignment ? units.find(u => u.UnitCode === assignment.UnitCode) : null;

  const handleClose = () => {
    markNotificationAsRead(notif.NotificationID);
    setSelectedEmailForModal(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Email Client Header bar */}
        <div className="bg-[#002B49] text-white px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-semibold tracking-wide">
              KCA University Student Notification
            </span>
          </div>
          <button
            onClick={handleClose}
            className="p-1 rounded hover:bg-white/10 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Email Envelope Metadata */}
        <div className="p-5 border-b border-slate-200 bg-slate-50 space-y-1.5 text-xs">
          <div className="flex items-baseline justify-between">
            <span className="font-bold text-slate-900 text-sm">{notif.Subject}</span>
            <span className="font-mono text-slate-500 text-[11px]">{notif.SentDate}</span>
          </div>

          <div className="text-slate-600 space-y-0.5 pt-1">
            <div className="flex gap-2">
              <span className="text-slate-400 w-12 shrink-0">From:</span>
              <span className="font-medium text-slate-800">
                KCA Virtual Campus Notifications &lt;virtualcampus-noreply@kca.ac.ke&gt;
              </span>
            </div>
            <div className="flex gap-2">
              <span className="text-slate-400 w-12 shrink-0">To:</span>
              <span className="font-medium text-slate-800">
                {currentStudent.Name} &lt;{currentStudent.Email}&gt;
              </span>
            </div>
            <div className="flex gap-2 font-mono text-[11px]">
              <span className="text-slate-400 w-12 shrink-0">Status:</span>
              <span className="text-emerald-700 font-medium">
                Delivered to student inbox (Notice #{notif.NotificationID})
              </span>
            </div>
          </div>
        </div>

        {/* Rendered HTML Email Body */}
        <div className="p-6 text-xs text-slate-800 space-y-4 max-h-[60vh] overflow-y-auto">
          
          {/* Institutional Header with crest representation */}
          <div className="flex items-center gap-3 pb-4 border-b border-slate-200">
            <div className="w-10 h-10 rounded-xl bg-[#002B49] text-amber-400 flex items-center justify-center font-bold text-xl shadow-xs">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-extrabold text-sm text-[#002B49] tracking-tight">
                KCA UNIVERSITY VIRTUAL CAMPUS
              </h2>
              <p className="text-[11px] text-amber-700 font-medium">
                Automated Academic Deadline Notification System
              </p>
            </div>
          </div>

          {/* Salutation */}
          <p className="text-sm">
            Dear <strong>{currentStudent.Name}</strong> (Reg No: <span className="font-mono">{currentStudent.RegNumber}</span>),
          </p>

          {/* Message Callout */}
          <div className={`p-4 rounded-xl border ${
            notif.Type === '3-hour'
              ? 'bg-red-50 border-red-200 text-red-900'
              : notif.Type === '1-day'
              ? 'bg-amber-50 border-amber-300 text-amber-950'
              : 'bg-blue-50 border-blue-200 text-blue-950'
          }`}>
            <div className="font-bold text-xs mb-1 flex items-center gap-1.5">
              <span>Alert Type:</span>
              <span className="uppercase tracking-wider">
                {notif.Type === '3-hour' ? 'Critical 3-Hour Notice' : notif.Type === '1-day' ? '24-Hour Final Reminder' : notif.Type === '3-day' ? '3-Day Advance Notification' : 'Course Receipt'}
              </span>
            </div>
            <p className="text-sm leading-relaxed">{notif.Body}</p>
          </div>

          {/* Assignment Summary Box */}
          {assignment && (
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Assignment Details
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-slate-400 block">Course Unit:</span>
                  <span className="font-bold text-slate-900">{assignment.UnitCode} - {unit?.UnitName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Deadline:</span>
                  <span className="font-bold text-red-700 font-mono">{assignment.DueDate}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Assessment Weight:</span>
                  <span className="text-slate-800 font-mono">{assignment.WeightPercentage || 15}% ({assignment.MaxScore} pts)</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Submission State:</span>
                  <span className="text-amber-700 font-medium">Pending upload in student portal</span>
                </div>
              </div>
            </div>
          )}

          <p className="text-xs text-slate-600">
            Please log into your KCA Student Academic Dashboard to mark this task as submitted or review feedback once evaluated.
          </p>

          {/* Email Footer */}
          <div className="pt-4 border-t border-slate-200 text-[11px] text-slate-400 space-y-1">
            <p>KCA University Directorate of Virtual Campus & E-Learning</p>
            <p>Main Campus, Thika Road, Ruaraka, Nairobi, Kenya · Support: elearning@kca.ac.ke</p>
            <p className="text-[10px] text-slate-400 italic">
              This is an automated notification from KCA University Virtual Campus Academic Systems.
            </p>
          </div>

        </div>

        {/* Modal Action Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-slate-500 font-mono text-[11px]">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Delivered via TLS/SSL</span>
          </div>

          <button
            onClick={handleClose}
            className="px-4 py-2 rounded-lg bg-[#002B49] text-white font-semibold hover:bg-[#00385F] transition-colors"
          >
            Mark as Read & Close
          </button>
        </div>

      </div>
    </div>
  );
};
