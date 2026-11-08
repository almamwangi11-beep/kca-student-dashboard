import React, { useState } from 'react';
import { useDashboard } from '../context/DashboardContext';
import {
  Bell,
  GraduationCap,
  Clock,
  Shield,
  User,
  LogOut,
  Sparkles,
  FileText,
  Database,
  Calendar,
  CheckSquare,
  BookOpen,
  ChevronDown
} from 'lucide-react';

interface HeaderProps {
  activeTab: 'overview' | 'courses' | 'assignments' | 'timetable' | 'database' | 'admin';
  setActiveTab: (tab: 'overview' | 'courses' | 'assignments' | 'timetable' | 'database' | 'admin') => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab }) => {
  const {
    currentRole,
    currentStudent,
    currentAdmin,
    sessionMinutesLeft,
    refreshSession,
    notifications,
    markAllNotificationsAsRead,
    switchPersona,
    logout,
    setSelectedEmailForModal
  } = useDashboard();

  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.Read).length;

  return (
    <header className="sticky top-0 z-40 bg-[#002B49] text-white border-b border-[#001f35] shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-8">
          
          {/* Zone 1: Single text element wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-9 h-9 rounded-lg bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-400 font-bold text-lg">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-bold tracking-tight text-white whitespace-nowrap">
                KCA University
              </span>
              <span className="text-[11px] font-medium text-amber-300 tracking-wide">
                Virtual Campus · Student Portal
              </span>
            </div>
          </div>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2 text-sm font-medium">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-3 py-1.5 rounded-md text-xs lg:text-sm transition-colors whitespace-nowrap ${
                activeTab === 'overview'
                  ? 'bg-white/15 text-white font-semibold'
                  : 'text-slate-200 hover:text-white hover:bg-white/10'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('courses')}
              className={`px-3 py-1.5 rounded-md text-xs lg:text-sm transition-colors whitespace-nowrap ${
                activeTab === 'courses'
                  ? 'bg-white/15 text-white font-semibold'
                  : 'text-slate-200 hover:text-white hover:bg-white/10'
              }`}
            >
              My Units
            </button>
            <button
              onClick={() => setActiveTab('assignments')}
              className={`px-3 py-1.5 rounded-md text-xs lg:text-sm transition-colors whitespace-nowrap relative ${
                activeTab === 'assignments'
                  ? 'bg-white/15 text-white font-semibold'
                  : 'text-slate-200 hover:text-white hover:bg-white/10'
              }`}
            >
              Assignments
              <span className="ml-1.5 px-1.5 py-0.2 bg-amber-500 text-slate-950 font-bold rounded text-[10px] tabular-nums">
                5
              </span>
            </button>
            <button
              onClick={() => setActiveTab('timetable')}
              className={`px-3 py-1.5 rounded-md text-xs lg:text-sm transition-colors whitespace-nowrap ${
                activeTab === 'timetable'
                  ? 'bg-white/15 text-white font-semibold'
                  : 'text-slate-200 hover:text-white hover:bg-white/10'
              }`}
            >
              Timetable
            </button>
            {currentRole === 'admin' && (
              <>
                <button
                  onClick={() => setActiveTab('database')}
                  className={`px-3 py-1.5 rounded-md text-xs lg:text-sm transition-colors whitespace-nowrap ${
                    activeTab === 'database'
                      ? 'bg-white/15 text-white font-semibold'
                      : 'text-slate-200 hover:text-white hover:bg-white/10'
                  }`}
                >
                  System Database
                </button>
                <button
                  onClick={() => setActiveTab('admin')}
                  className={`px-3 py-1.5 rounded-md text-xs lg:text-sm transition-colors whitespace-nowrap bg-amber-500/20 text-amber-300 border border-amber-400/30 font-semibold`}
                >
                  Admin Panel
                </button>
              </>
            )}
          </nav>

          {/* Zone 3: Actions & Quick Persona Switch */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Session Timer (30 min inactivity indicator) */}
            <button
              onClick={refreshSession}
              title="Click to refresh 30-min portal session"
              className="hidden sm:flex items-center gap-1 px-2.5 py-1 text-[11px] rounded bg-slate-800/80 hover:bg-slate-800 text-slate-300 border border-slate-700 font-mono tabular-nums whitespace-nowrap"
            >
              <Clock className="w-3 h-3 text-amber-400" />
              <span>{sessionMinutesLeft}m session</span>
            </button>

            {/* Notification Center Bell */}
            <div className="relative">
              <button
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className="relative p-2 rounded-lg text-slate-200 hover:text-white hover:bg-white/10 transition-colors"
                aria-label="View notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center tabular-nums ring-2 ring-[#002B49]">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Dropdown */}
              {isNotificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white text-slate-900 rounded-xl shadow-2xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                        Academic Notifications
                      </h4>
                      <p className="text-[11px] text-slate-400">
                        Automated Coursework &amp; Deadline Alerts
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {unreadCount > 0 && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            markAllNotificationsAsRead();
                          }}
                          className="text-[10px] text-blue-600 hover:text-blue-800 font-medium hover:underline"
                        >
                          Mark all read
                        </button>
                      )}
                      <span className="text-xs font-semibold text-amber-600">
                        {unreadCount} unread
                      </span>
                    </div>
                  </div>

                  <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                    {notifications.length === 0 ? (
                      <div className="p-6 text-center text-xs text-slate-500">
                        No notifications recorded yet.
                      </div>
                    ) : (
                      notifications.slice(0, 5).map(n => (
                        <div
                          key={n.NotificationID}
                          onClick={() => {
                            setSelectedEmailForModal(n);
                            setIsNotificationsOpen(false);
                          }}
                          className={`p-3 text-left hover:bg-slate-50 cursor-pointer transition-colors ${
                            !n.Read ? 'bg-amber-50/50' : ''
                          }`}
                        >
                          <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
                            <span className="font-semibold text-[#002B49]">
                              {n.Type === '3-hour' ? '🚨 3-Hour Warning' : n.Type === '1-day' ? '⚠️ 1-Day Reminder' : n.Type === '3-day' ? '📅 3-Day Notice' : '📧 Notice'}
                            </span>
                            <span className="font-mono text-[10px] text-slate-400">
                              {n.SentDate.slice(11, 16)}
                            </span>
                          </div>
                          <div className="text-xs font-semibold text-slate-900 line-clamp-1">
                            {n.Subject}
                          </div>
                          <div className="text-[11px] text-slate-600 line-clamp-2 mt-0.5">
                            {n.Body}
                          </div>
                          <div className="mt-1 text-[10px] text-blue-600 font-medium">
                            Click to view full KCA email preview →
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  <div className="px-3 py-2 bg-slate-50 border-t border-slate-100 text-center text-[11px] text-slate-600 flex items-center justify-between">
                    <span>Recipient: {currentStudent.Email}</span>
                    <button
                      onClick={() => {
                        setIsNotificationsOpen(false);
                        setActiveTab('admin');
                      }}
                      className="text-amber-700 font-medium hover:underline"
                    >
                      SMTP Logs →
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* User Profile / Switch Persona Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-white/10 transition-colors text-left"
              >
                <div className="w-8 h-8 rounded-full overflow-hidden border border-amber-400/40 bg-slate-800 shrink-0">
                  {currentRole === 'student' && currentStudent.AvatarUrl ? (
                    <img
                      src={currentStudent.AvatarUrl}
                      alt={currentStudent.Name}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center font-bold text-xs text-amber-400">
                      {currentRole === 'admin' ? 'SA' : currentStudent.Name.slice(0, 2)}
                    </div>
                  )}
                </div>
                <div className="hidden xl:flex flex-col text-left">
                  <span className="text-xs font-bold text-white line-clamp-1 leading-tight">
                    {currentRole === 'admin' ? currentAdmin.Name : currentStudent.Name}
                  </span>
                  <span className="text-[10px] text-slate-300 leading-tight">
                    {currentRole === 'admin' ? 'Academic Supervisor' : currentStudent.RegNumber}
                  </span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-300" />
              </button>

              {/* Profile / Persona Switcher Menu */}
              {isProfileMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white text-slate-900 rounded-xl shadow-2xl border border-slate-200 py-2 z-50">
                  <div className="px-4 py-2.5 border-b border-slate-100">
                    <div className="text-xs font-bold text-slate-900">
                      {currentRole === 'admin' ? currentAdmin.Name : currentStudent.Name}
                    </div>
                    <div className="text-[11px] text-slate-500 font-mono">
                      {currentRole === 'admin' ? currentAdmin.Email : currentStudent.Email}
                    </div>
                    <div className="text-[11px] font-semibold text-[#002B49] mt-0.5">
                      {currentRole === 'admin' ? 'Faculty of Technology' : currentStudent.Programme}
                    </div>
                  </div>

                  <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Switch Account
                  </div>

                  <button
                    onClick={() => {
                      switchPersona('alma');
                      setIsProfileMenuOpen(false);
                      setActiveTab('overview');
                    }}
                    className={`w-full text-left px-4 py-2 text-xs flex items-center justify-between hover:bg-slate-50 ${
                      currentRole === 'student' && currentStudent.StudentID === 101 ? 'bg-amber-50 font-bold text-[#002B49]' : ''
                    }`}
                  >
                    <span>Alma Amani Mwangi</span>
                    <span className="text-[10px] text-slate-500 font-mono">25/03339</span>
                  </button>

                  <button
                    onClick={() => {
                      switchPersona('peer');
                      setIsProfileMenuOpen(false);
                      setActiveTab('overview');
                    }}
                    className={`w-full text-left px-4 py-2 text-xs flex items-center justify-between hover:bg-slate-50 ${
                      currentRole === 'student' && currentStudent.StudentID === 102 ? 'bg-amber-50 font-bold text-[#002B49]' : ''
                    }`}
                  >
                    <span>Brian Kiprono</span>
                    <span className="text-[10px] text-slate-500 font-mono">25/03340</span>
                  </button>

                  <button
                    onClick={() => {
                      switchPersona('admin');
                      setIsProfileMenuOpen(false);
                      setActiveTab('admin');
                    }}
                    className={`w-full text-left px-4 py-2 text-xs flex items-center justify-between hover:bg-slate-50 ${
                      currentRole === 'admin' ? 'bg-amber-50 font-bold text-[#002B49]' : ''
                    }`}
                  >
                    <span>Faculty / Staff Portal</span>
                    <span className="text-[10px] text-amber-700 font-semibold">Staff</span>
                  </button>

                  <div className="border-t border-slate-100 mt-1 pt-1">
                    <button
                      onClick={() => {
                        logout();
                        setIsProfileMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-red-600 hover:bg-red-50 flex items-center gap-2"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Log Out Session</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </header>
  );
};
