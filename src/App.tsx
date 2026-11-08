import React, { useState } from 'react';
import { DashboardProvider, useDashboard } from './context/DashboardContext';
import { Header } from './components/Header';
import { TimeSimulatorBar } from './components/TimeSimulatorBar';
import { HappeningNowBanner } from './components/HappeningNowBanner';
import { CourseList } from './components/CourseList';
import { AssignmentHub } from './components/AssignmentHub';
import { TimetableCalendar } from './components/TimetableCalendar';
import { NotificationModal } from './components/NotificationModal';
import { DatabaseInspector } from './components/DatabaseInspector';
import { AdminPanel } from './components/AdminPanel';
import { LoginModal } from './components/LoginModal';
import { ExamCardModal } from './components/ExamCardModal';
import { ELibraryModal } from './components/ELibraryModal';
import { StudentIDCardModal } from './components/StudentIDCardModal';
import { CampusPulseWidget } from './components/CampusPulseWidget';
import { StudyTimerWidget } from './components/StudyTimerWidget';
import { ToastContainer } from './components/ToastContainer';
import {
  BookOpen,
  Calendar,
  CheckSquare,
  CheckCircle2,
  Clock,
  AlertTriangle,
  GraduationCap,
  User,
  ArrowRight,
  Send,
  FileText,
  MapPin,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Award,
  Sparkles,
  Download,
  CreditCard,
  Flame,
  Activity
} from 'lucide-react';

function DashboardContent() {
  const {
    currentRole,
    currentStudent,
    enrolledCourses,
    assignmentsWithContext,
    notifications,
    timetable,
    currentDayOfWeek,
    currentTimeString,
    toggleSubmission,
    triggerMailerCronCheck,
    setSelectedEmailForModal,
    showToast
  } = useDashboard();

  const [activeTab, setActiveTab] = useState<'overview' | 'courses' | 'assignments' | 'timetable' | 'database' | 'admin'>('overview');
  const [selectedUnitFilter, setSelectedUnitFilter] = useState<string | null>(null);
  const [isExamCardOpen, setIsExamCardOpen] = useState(false);
  const [isELibraryOpen, setIsELibraryOpen] = useState(false);
  const [isStudentIDOpen, setIsStudentIDOpen] = useState(false);

  const pendingAssignments = assignmentsWithContext.filter(a => !a.isSubmitted);
  const overdueAssignments = assignmentsWithContext.filter(a => a.urgency === 'Overdue' && !a.isSubmitted);
  const dueTodayAssignments = assignmentsWithContext.filter(a => a.urgency === 'Due Today' && !a.isSubmitted);

  const handleSelectUnitAssignments = (unitCode: string) => {
    setSelectedUnitFilter(unitCode);
    setActiveTab('assignments');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Campus Notice and Real-Time Bar */}
      <TimeSimulatorBar />

      {/* Primary KCA Portal Navigation Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenStudentID={() => setIsStudentIDOpen(true)}
      />

      {/* Main Page Canvas */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* OVERVIEW / DASHBOARD VIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            
            {/* Student Profile & Academic Summary Banner */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-5">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-amber-400 bg-[#002B49] shrink-0 shadow-xs">
                  {currentStudent.AvatarUrl ? (
                    <img
                      src={currentStudent.AvatarUrl}
                      alt={currentStudent.Name}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center font-bold text-lg text-amber-400">
                      {currentStudent.Name.slice(0, 2)}
                    </div>
                  )}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h1 className="text-xl sm:text-2xl font-extrabold text-[#002B49] tracking-tight">
                      {currentStudent.Name}
                    </h1>
                    <div className="flex items-center gap-2 text-xs font-mono">
                      <span className="font-bold text-[#002B49]">Reg: {currentStudent.RegNumber}</span>
                      <span className="text-slate-300" aria-hidden="true">·</span>
                      <span className="text-emerald-700 font-semibold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        {currentStudent.AccountStatus}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs font-medium text-slate-600">
                    {currentStudent.Programme} · <span className="text-amber-800 font-semibold">{currentStudent.YearOfStudy}</span> · <span className="text-slate-500">School of Technology</span>
                  </p>

                  <div className="flex items-center gap-3 text-xs text-slate-500 pt-0.5 font-mono flex-wrap">
                    <span>{currentStudent.Email}</span>
                    <span className="text-slate-300" aria-hidden="true">·</span>
                    <span>Ruaraka Main Campus, Nairobi</span>
                    <span className="text-slate-300" aria-hidden="true">·</span>
                    <span>Full-Time Regular</span>
                  </div>
                </div>
              </div>

              {/* KPI metrics strip */}
              <div className="grid grid-cols-3 gap-3 border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6 text-center">
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <span className="text-[11px] text-slate-500 font-medium block">Enrolled</span>
                  <span className="text-lg font-extrabold text-[#002B49] font-mono">
                    {enrolledCourses.length} Units
                  </span>
                </div>
                <div className="bg-amber-50 p-2.5 rounded-xl border border-amber-100">
                  <span className="text-[11px] text-amber-700 font-medium block">Pending</span>
                  <span className="text-lg font-extrabold text-amber-900 font-mono">
                    {pendingAssignments.length} Tasks
                  </span>
                </div>
                <div className="bg-red-50 p-2.5 rounded-xl border border-red-100">
                  <span className="text-[11px] text-red-700 font-medium block">Urgent</span>
                  <span className="text-lg font-extrabold text-red-700 font-mono">
                    {overdueAssignments.length + dueTodayAssignments.length} Urgent
                  </span>
                </div>
              </div>
            </div>

            {/* Dynamic Happening Now Banner */}
            <HappeningNowBanner onViewTimetable={() => setActiveTab('timetable')} />

            {/* Two-Column Responsive Workspace */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Left Column (7/12): Assignments Feed & Enrolled Units */}
              <div className="lg:col-span-7 space-y-6">
                
                {/* Centralized Assignment Quick Hub */}
                <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <CheckSquare className="w-4 h-4 text-amber-600" />
                      <h3 className="font-bold text-slate-900 text-sm">
                        High Priority Coursework
                      </h3>
                    </div>
                    <button
                      onClick={() => setActiveTab('assignments')}
                      className="text-xs font-semibold text-[#002B49] hover:underline flex items-center gap-1"
                    >
                      <span>Full Hub ({assignmentsWithContext.length})</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {assignmentsWithContext.slice(0, 4).map(item => (
                    <div
                      key={item.AssignmentID}
                      className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 transition-colors ${
                        item.urgency === 'Overdue' && !item.isSubmitted
                          ? 'border-red-200 bg-red-50/30'
                          : item.urgency === 'Due Today' && !item.isSubmitted
                          ? 'border-amber-200 bg-amber-50/30'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => toggleSubmission(item.AssignmentID)}
                          className="text-slate-400 hover:text-slate-700 transition-colors shrink-0"
                          title="Toggle Submission state in KCA database"
                        >
                          {item.isSubmitted ? (
                            <CheckSquare className="w-5 h-5 text-emerald-600 fill-emerald-50" />
                          ) : (
                            <div className="w-5 h-5 rounded border border-slate-300 hover:border-slate-500 bg-white" />
                          )}
                        </button>

                        <div>
                          <div className="flex items-center gap-2">
                            <span
                              className="font-mono text-[10px] font-bold px-1.5 py-0.2 rounded text-white"
                              style={{ backgroundColor: item.unit.Color }}
                            >
                              {item.UnitCode}
                            </span>
                            {item.isSubmitted ? (
                              <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded">
                                Submitted
                              </span>
                            ) : item.urgency === 'Overdue' ? (
                              <span className="text-[10px] font-bold text-red-700 bg-red-100 px-1.5 py-0.2 rounded">
                                Overdue
                              </span>
                            ) : item.urgency === 'Due Today' ? (
                              <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-1.5 py-0.2 rounded">
                                Due Today
                              </span>
                            ) : (
                              <span className="text-[10px] text-slate-500">Upcoming</span>
                            )}
                          </div>
                          <h4
                            onClick={() => setActiveTab('assignments')}
                            className={`text-xs font-bold mt-0.5 cursor-pointer hover:text-[#002B49] ${
                              item.isSubmitted ? 'line-through text-slate-400' : 'text-slate-900'
                            }`}
                          >
                            {item.Title}
                          </h4>
                          <span className="text-[11px] text-slate-500 font-mono">
                            Due: {item.DueDate}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => toggleSubmission(item.AssignmentID)}
                        className="text-xs font-semibold px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 shrink-0 whitespace-nowrap"
                      >
                        {item.isSubmitted ? 'Unmark' : 'Done'}
                      </button>
                    </div>
                  ))}
                </div>

                {/* Enrolled Courses Preview */}
                <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-[#002B49]" />
                      <h3 className="font-bold text-slate-900 text-sm">
                        Enrolled Units (Zero Manual Entry)
                      </h3>
                    </div>
                    <button
                      onClick={() => setActiveTab('courses')}
                      className="text-xs font-semibold text-[#002B49] hover:underline flex items-center gap-1"
                    >
                      <span>View All (5)</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {enrolledCourses.map(item => (
                      <div
                        key={item.unit.UnitCode}
                        onClick={() => handleSelectUnitAssignments(item.unit.UnitCode)}
                        className="p-3 rounded-xl border border-slate-200 hover:border-slate-300 hover:shadow-xs transition-all cursor-pointer bg-white space-y-2 group"
                      >
                        <div className="flex items-center justify-between">
                          <span
                            className="font-mono text-xs font-bold px-2 py-0.5 rounded text-white"
                            style={{ backgroundColor: item.unit.Color }}
                          >
                            {item.unit.UnitCode}
                          </span>
                          <span className="text-[11px] font-mono text-slate-400">
                            {item.unit.Credits} Credits
                          </span>
                        </div>

                        <h4 className="text-xs font-bold text-slate-900 group-hover:text-[#002B49] line-clamp-1">
                          {item.unit.UnitName}
                        </h4>

                        <div className="text-[11px] text-slate-500 space-y-0.5 font-medium">
                          <div className="truncate">{item.lecturer.Name}</div>
                          <div className="text-slate-700">{item.room.RoomName}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Smart Study Sprint Focus Tool */}
                <StudyTimerWidget />

              </div>

              {/* Right Column (5/12): Today's Schedule & Smart Notifications */}
              <div className="lg:col-span-5 space-y-6">
                
                {/* Today's Timetable Widget */}
                <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-amber-600" />
                      <h3 className="font-bold text-slate-900 text-sm">
                        {currentDayOfWeek} Lecture Sessions
                      </h3>
                    </div>
                    <button
                      onClick={() => setActiveTab('timetable')}
                      className="text-xs font-semibold text-[#002B49] hover:underline"
                    >
                      Calendar →
                    </button>
                  </div>

                  {timetable.filter(s => s.DayOfWeek === currentDayOfWeek).length === 0 ? (
                    <div className="py-6 text-center text-xs text-slate-400">
                      No classes scheduled for {currentDayOfWeek}. Enjoy your study break!
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {timetable
                        .filter(s => s.DayOfWeek === currentDayOfWeek)
                        .map(slot => {
                          const unit = enrolledCourses.find(c => c.unit.UnitCode === slot.UnitCode)?.unit;
                          const room = enrolledCourses.find(c => c.unit.UnitCode === slot.UnitCode)?.room;

                          return (
                            <div
                              key={slot.TimetableID}
                              className="p-3 rounded-xl border border-slate-100 bg-slate-50 flex items-center justify-between gap-3 text-xs"
                            >
                              <div>
                                <div className="flex items-center gap-2">
                                  <span
                                    className="w-2 h-2 rounded-full"
                                    style={{ backgroundColor: unit?.Color || '#002B49' }}
                                  />
                                  <span className="font-bold text-slate-900 font-mono">
                                    {slot.UnitCode}
                                  </span>
                                  <span className="text-[10px] text-slate-500 font-medium">
                                    ({slot.SessionType})
                                  </span>
                                </div>
                                <div className="text-[11px] text-slate-600 font-medium mt-0.5">
                                  {room?.RoomName} · {room?.Location.split('-')[1]?.trim() || room?.Location}
                                </div>
                              </div>

                              <span className="font-mono text-xs font-bold text-[#002B49] bg-white px-2 py-1 rounded border border-slate-200">
                                {slot.StartTime}–{slot.EndTime}
                              </span>
                            </div>
                          );
                        })}
                    </div>
                  )}
                </div>

                {/* Real-Time Ruaraka Campus Pulse Widget */}
                <CampusPulseWidget />

                {/* Smart Deadline Notifications Card (mailer.php simulation) */}
                <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <Send className="w-4 h-4 text-blue-600" />
                      <h3 className="font-bold text-slate-900 text-sm">
                        Smart Deadline Alerts (SMTP)
                      </h3>
                    </div>
                    <button
                      onClick={() => {
                        const res = triggerMailerCronCheck();
                        showToast(`Notification check: ${res.messages.join(' · ')}`, 'info');
                      }}
                      className="text-xs font-semibold text-blue-600 hover:underline"
                    >
                      Run Check ↻
                    </button>
                  </div>

                  <p className="text-xs text-slate-500">
                    PHPMailer cron engine automatically sends reminder emails at 3-day, 1-day, and 3-hour intervals before due dates.
                  </p>

                  <div className="space-y-2">
                    {notifications.slice(0, 3).map(n => (
                      <div
                        key={n.NotificationID}
                        onClick={() => setSelectedEmailForModal(n)}
                        className="p-3 rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/30 transition-all cursor-pointer text-xs space-y-1"
                      >
                        <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono">
                          <span className="font-bold text-[#002B49]">
                            {n.Type === '3-hour' ? '🚨 3-Hour Alert' : n.Type === '1-day' ? '⚠️ 1-Day Reminder' : '📅 3-Day Notice'}
                          </span>
                          <span>{n.SentDate.slice(5, 16)}</span>
                        </div>
                        <div className="font-semibold text-slate-900 line-clamp-1">
                          {n.Subject}
                        </div>
                        <div className="text-[11px] text-blue-600 font-medium">
                          Click to preview email message →
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Academic Standing & Campus Services Card */}
                <div className="bg-gradient-to-br from-[#002B49] to-[#043d66] text-white rounded-2xl p-5 shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-amber-300 font-bold text-xs uppercase tracking-wider">
                      <Award className="w-4 h-4" />
                      <span>Academic Standing</span>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold text-[10px] border border-emerald-400/30">
                      Good Standing
                    </span>
                  </div>

                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-extrabold text-white font-mono">3.78</span>
                      <span className="text-xs text-slate-300 font-medium">/ 4.00 Cumulative GPA</span>
                    </div>
                    <p className="text-xs text-slate-200 mt-1">
                      First Class Honours classification · 18 Credit Units active this semester.
                    </p>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-white/10 text-xs">
                    <div className="flex items-center justify-between text-slate-300">
                      <span>Exam Clearance:</span>
                      <span className="text-emerald-300 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Approved
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-slate-300">
                      <span>Fee Balance:</span>
                      <span className="text-white font-mono font-semibold">KES 0.00</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 pt-1">
                    <button
                      onClick={() => setIsELibraryOpen(true)}
                      className="py-2 px-2 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium text-xs transition-colors flex items-center justify-center gap-1"
                    >
                      <BookOpen className="w-3.5 h-3.5 text-amber-300" />
                      <span>e-Library</span>
                    </button>
                    <button
                      onClick={() => setIsExamCardOpen(true)}
                      className="py-2 px-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors flex items-center justify-center gap-1 shadow-sm"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Exam Card</span>
                    </button>
                    <button
                      onClick={() => setIsStudentIDOpen(true)}
                      className="py-2 px-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1 shadow-sm"
                      title="View Smart Digital Student ID Card"
                    >
                      <CreditCard className="w-3.5 h-3.5 text-amber-300" />
                      <span>Smart ID</span>
                    </button>
                  </div>
                </div>

              </div>

            </div>

          </div>
        )}

        {/* COURSES TAB */}
        {activeTab === 'courses' && (
          <CourseList onSelectUnitAssignments={handleSelectUnitAssignments} />
        )}

        {/* ASSIGNMENTS TAB */}
        {activeTab === 'assignments' && (
          <AssignmentHub
            filterUnitCode={selectedUnitFilter}
            onClearUnitFilter={() => setSelectedUnitFilter(null)}
          />
        )}

        {/* TIMETABLE TAB */}
        {activeTab === 'timetable' && (
          <TimetableCalendar />
        )}

        {/* DATABASE 10-TABLE INSPECTOR TAB */}
        {activeTab === 'database' && (
          <DatabaseInspector />
        )}

        {/* ADMIN TAB */}
        {activeTab === 'admin' && (
          <AdminPanel />
        )}

      </main>

      {/* Institutional Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 mt-12 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded bg-[#002B49] text-amber-400 flex items-center justify-center font-bold text-xs">
              KCA
            </div>
            <div>
              <span className="font-bold text-slate-800">KCA University Virtual Campus</span>
              <span className="hidden sm:inline"> · Diploma in Business Information Technology (DBIT)</span>
            </div>
          </div>

          <div className="flex items-center gap-3 text-[11px] text-slate-400 font-mono">
            <span>© 2026 KCA University</span>
            <span>·</span>
            <span>Directorate of Virtual Campus &amp; E-Learning</span>
            <span>·</span>
            <span>Nairobi, Kenya</span>
          </div>
        </div>
      </footer>

      {/* Modals & In-App Overlays */}
      <NotificationModal />
      <ExamCardModal
        isOpen={isExamCardOpen}
        onClose={() => setIsExamCardOpen(false)}
      />
      <ELibraryModal
        isOpen={isELibraryOpen}
        onClose={() => setIsELibraryOpen(false)}
      />
      <StudentIDCardModal
        isOpen={isStudentIDOpen}
        onClose={() => setIsStudentIDOpen(false)}
      />
      <LoginModal />
      <ToastContainer />
    </div>
  );
}

export default function App() {
  return (
    <DashboardProvider>
      <DashboardContent />
    </DashboardProvider>
  );
}
