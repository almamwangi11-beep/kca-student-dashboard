import React, { useState } from 'react';
import { useDashboard } from '../context/DashboardContext';
import {
  ShieldAlert,
  UserCheck,
  UserX,
  PlusCircle,
  Mail,
  Send,
  Calendar,
  Clock,
  BookOpen,
  CheckCircle2,
  FileText
} from 'lucide-react';

export const AdminPanel: React.FC = () => {
  const {
    students,
    units,
    assignments,
    notifications,
    updateStudentStatus,
    createAssignment,
    currentAdmin,
    triggerMailerCronCheck,
    setSelectedEmailForModal,
    showToast
  } = useDashboard();

  const [activeAdminSubTab, setActiveAdminSubTab] = useState<'students' | 'assignments' | 'mail_logs'>('students');

  // New assignment form state
  const [newTitle, setNewTitle] = useState('');
  const [newUnitCode, setNewUnitCode] = useState(units[0]?.UnitCode || 'DBIT 1101');
  const [newDescription, setNewDescription] = useState('');
  const [newDueDate, setNewDueDate] = useState('2026-11-15 23:59:00');
  const [newMaxScore, setNewMaxScore] = useState(100);
  const [newWeight, setNewWeight] = useState(15);
  const [formSuccess, setFormSuccess] = useState(false);

  const handleCreateAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDescription.trim()) return;

    createAssignment({
      UnitCode: newUnitCode,
      Title: newTitle,
      Description: newDescription,
      DueDate: newDueDate,
      MaxScore: Number(newMaxScore),
      WeightPercentage: Number(newWeight)
    });

    setFormSuccess(true);
    setNewTitle('');
    setNewDescription('');
    setTimeout(() => setFormSuccess(false), 4000);
  };

  return (
    <div className="space-y-4">
      {/* Admin Header */}
      <div className="bg-gradient-to-r from-slate-900 to-[#002B49] text-white p-5 rounded-2xl border border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold text-xs uppercase tracking-wider border border-amber-400/30">
              Role: {currentAdmin.Role}
            </span>
            <span className="text-xs text-slate-300">
              Department: {currentAdmin.Department}
            </span>
          </div>
          <h2 className="text-xl font-bold mt-1 text-white">
            Administrative Control Panel (admin.php)
          </h2>
          <p className="text-xs text-slate-300 mt-0.5">
            Logged in as <strong>{currentAdmin.Name}</strong> ({currentAdmin.Email})
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              const res = triggerMailerCronCheck();
              showToast(`Notification Check: ${res.messages.join(' · ')}`, 'info');
            }}
            className="px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Trigger Mailer Dispatch</span>
          </button>
        </div>
      </div>

      {/* Admin Subtabs */}
      <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg text-xs font-medium">
        <button
          onClick={() => setActiveAdminSubTab('students')}
          className={`px-3 py-1.5 rounded-md transition-colors ${
            activeAdminSubTab === 'students' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600'
          }`}
        >
          Student Accounts ({students.length})
        </button>
        <button
          onClick={() => setActiveAdminSubTab('assignments')}
          className={`px-3 py-1.5 rounded-md transition-colors ${
            activeAdminSubTab === 'assignments' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600'
          }`}
        >
          Publish New Assignment
        </button>
        <button
          onClick={() => setActiveAdminSubTab('mail_logs')}
          className={`px-3 py-1.5 rounded-md transition-colors ${
            activeAdminSubTab === 'mail_logs' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600'
          }`}
        >
          PHPMailer Audit Logs ({notifications.length})
        </button>
      </div>

      {/* Tab: Student Accounts */}
      {activeAdminSubTab === 'students' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm">
              Enrolled DBIT Students Directory
            </h3>
            <span className="text-xs text-slate-500 font-mono">
              STUDENT table (bcrypt security enabled)
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="p-3">Student Name</th>
                  <th className="p-3 font-mono">Reg Number</th>
                  <th className="p-3">Email Address</th>
                  <th className="p-3">Programme</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {students.map(s => (
                  <tr key={s.StudentID} className="hover:bg-slate-50/60">
                    <td className="p-3 font-bold text-slate-900">
                      {s.Name}
                    </td>
                    <td className="p-3 font-mono text-slate-700">
                      {s.RegNumber}
                    </td>
                    <td className="p-3 font-mono text-slate-600">
                      {s.Email}
                    </td>
                    <td className="p-3 text-slate-600">
                      {s.Programme} ({s.YearOfStudy})
                    </td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          s.AccountStatus === 'Active'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {s.AccountStatus}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() =>
                          updateStudentStatus(
                            s.StudentID,
                            s.AccountStatus === 'Active' ? 'Suspended' : 'Active'
                          )
                        }
                        className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-colors ${
                          s.AccountStatus === 'Active'
                            ? 'bg-red-50 text-red-700 hover:bg-red-100'
                            : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                        }`}
                      >
                        {s.AccountStatus === 'Active' ? 'Suspend' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: Publish New Assignment */}
      {activeAdminSubTab === 'assignments' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs max-w-2xl space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-900 text-base">
              Publish New Coursework Assignment
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Instantly inserts into the KCA ASSIGNMENT table and broadcasts alert to enrolled DBIT students.
            </p>
          </div>

          {formSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Assignment published successfully and added to student dashboards!</span>
            </div>
          )}

          <form onSubmit={handleCreateAssignment} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Target Course Unit</label>
                <select
                  value={newUnitCode}
                  onChange={e => setNewUnitCode(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-200 bg-white"
                >
                  {units.map(u => (
                    <option key={u.UnitCode} value={u.UnitCode}>
                      {u.UnitCode} - {u.UnitName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Submission Deadline (YYYY-MM-DD HH:MM:SS)</label>
                <input
                  type="text"
                  value={newDueDate}
                  onChange={e => setNewDueDate(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-200 font-mono"
                  placeholder="2026-11-15 23:59:00"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Assignment Title</label>
              <input
                type="text"
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                className="w-full p-2 rounded-lg border border-slate-200"
                placeholder="e.g. Lab 5: Normalizing University Clinic Records"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Instructions & Rubric Brief</label>
              <textarea
                rows={3}
                value={newDescription}
                onChange={e => setNewDescription(e.target.value)}
                className="w-full p-2 rounded-lg border border-slate-200"
                placeholder="Describe deliverables, submission format, and marking criteria..."
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Maximum Points</label>
                <input
                  type="number"
                  value={newMaxScore}
                  onChange={e => setNewMaxScore(Number(e.target.value))}
                  className="w-full p-2 rounded-lg border border-slate-200"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Weight in Final Grade (%)</label>
                <input
                  type="number"
                  value={newWeight}
                  onChange={e => setNewWeight(Number(e.target.value))}
                  className="w-full p-2 rounded-lg border border-slate-200"
                />
              </div>
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 rounded-lg bg-[#002B49] hover:bg-[#00385F] text-white font-bold text-xs shadow-xs transition-colors flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Publish Coursework Assignment</span>
            </button>
          </form>
        </div>
      )}

      {/* Tab: PHPMailer Logs */}
      {activeAdminSubTab === 'mail_logs' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm">
              PHPMailer SMTP Dispatch Audit Logs (NOTIFICATION Table)
            </h3>
            <span className="text-xs text-slate-500 font-mono">
              3-day, 1-day, 3-hour automated reminders
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="p-3 font-mono">ID</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Sent Timestamp</th>
                  <th className="p-3">Subject</th>
                  <th className="p-3">Delivery Status</th>
                  <th className="p-3 text-right">View Email</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                {notifications.map(n => (
                  <tr key={n.NotificationID} className="hover:bg-slate-50">
                    <td className="p-3 font-bold text-slate-700">#{n.NotificationID}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded font-sans font-bold text-[10px] bg-slate-100 text-slate-800">
                        {n.Type}
                      </span>
                    </td>
                    <td className="p-3 text-slate-600">{n.SentDate}</td>
                    <td className="p-3 font-sans font-semibold text-slate-900 max-w-sm truncate">
                      {n.Subject}
                    </td>
                    <td className="p-3">
                      <span className="text-emerald-700 font-bold flex items-center gap-1 font-sans text-xs">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        {n.DeliveryStatus}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => setSelectedEmailForModal(n)}
                        className="px-2.5 py-1 rounded bg-slate-100 hover:bg-[#002B49] hover:text-white font-sans text-xs font-semibold transition-colors"
                      >
                        Inspect Preview →
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
