import React, { useState } from 'react';
import { useDashboard } from '../context/DashboardContext';
import { EnrolledCourseWithDetails, Unit } from '../types/database';
import {
  BookOpen,
  User,
  MapPin,
  Calendar,
  CheckCircle,
  Clock,
  FileText,
  Mail,
  Building,
  Info,
  X,
  ExternalLink
} from 'lucide-react';

interface CourseListProps {
  onSelectUnitAssignments?: (unitCode: string) => void;
}

export const CourseList: React.FC<CourseListProps> = ({ onSelectUnitAssignments }) => {
  const { enrolledCourses, assignmentsWithContext, currentStudent } = useDashboard();
  const [selectedCourse, setSelectedCourse] = useState<EnrolledCourseWithDetails | null>(null);

  return (
    <div className="space-y-4">
      {/* Module Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              Enrolled Course Units
            </h2>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-[#002B49]">
              Jan–Apr 2026 Semester
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Registered courses, assigned faculty, and scheduled lecture venues for {currentStudent.Name} ({currentStudent.RegNumber})
          </p>
        </div>

        <div className="text-xs text-slate-600 flex items-center gap-3">
          <span>Semester: <strong className="text-slate-900">{enrolledCourses[0]?.enrollment.Semester || 'Jan-Apr 2026'}</strong></span>
          <span>·</span>
          <span>Total Units: <strong className="text-[#002B49] font-mono">{enrolledCourses.length}</strong></span>
          <span>·</span>
          <span>Total Credits: <strong className="text-[#002B49] font-mono">18 hrs</strong></span>
        </div>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {enrolledCourses.map(item => {
          const { unit, lecturer, room, totalAssignments, pendingAssignments, nextSession } = item;

          return (
            <div
              key={unit.UnitCode}
              className="bg-white rounded-xl border border-slate-200 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between overflow-hidden group"
            >
              {/* Unit Card Header with distinctive colored top bar */}
              <div
                className="h-2 w-full"
                style={{ backgroundColor: unit.Color }}
              />

              <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
                
                {/* Unit Identifiers */}
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span
                      className="font-mono text-xs font-bold px-2 py-0.5 rounded text-white"
                      style={{ backgroundColor: unit.Color }}
                    >
                      {unit.UnitCode}
                    </span>
                    <span className="text-xs text-slate-500 font-mono">
                      {unit.Credits} Credits
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 group-hover:text-[#002B49] transition-colors leading-snug">
                    {unit.UnitName}
                  </h3>

                  <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                    {unit.Description}
                  </p>
                </div>

                {/* Faculty & Venue Metadata */}
                <div className="space-y-2 pt-2 border-t border-slate-100 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="font-medium text-slate-800">{lecturer.Name}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="text-slate-700">{room.RoomName}</span>
                    <span className="text-slate-400">· {room.Location.split('-')[1]?.trim() || room.Location}</span>
                  </div>

                  {nextSession && (
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="text-slate-600">
                        {nextSession.DayOfWeek} {nextSession.StartTime}–{nextSession.EndTime} ({nextSession.SessionType})
                      </span>
                    </div>
                  )}
                </div>

                {/* Assignment Status and Action */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div>
                    {pendingAssignments > 0 ? (
                      <span className="text-amber-700 font-semibold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                        {pendingAssignments} task{pendingAssignments > 1 ? 's' : ''} pending
                      </span>
                    ) : (
                      <span className="text-emerald-700 font-medium flex items-center gap-1">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                        All submitted
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedCourse(item)}
                      className="px-2.5 py-1 text-xs font-semibold text-[#002B49] hover:bg-slate-100 rounded transition-colors"
                    >
                      Details
                    </button>
                    {onSelectUnitAssignments && (
                      <button
                        onClick={() => onSelectUnitAssignments(unit.UnitCode)}
                        className="px-2.5 py-1 text-xs font-semibold bg-slate-100 hover:bg-[#002B49] hover:text-white rounded transition-colors"
                      >
                        Tasks →
                      </button>
                    )}
                  </div>
                </div>

              </div>
            </div>
          );
        })}
      </div>

      {/* Unit Details Modal */}
      {selectedCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            
            <div
              className="p-5 text-white flex items-start justify-between"
              style={{ backgroundColor: selectedCourse.unit.Color }}
            >
              <div>
                <span className="text-xs font-mono font-bold tracking-wide uppercase opacity-90">
                  {selectedCourse.unit.UnitCode} · {selectedCourse.unit.Credits} Credit Hours
                </span>
                <h3 className="text-xl font-bold mt-1 text-white">
                  {selectedCourse.unit.UnitName}
                </h3>
                <p className="text-xs opacity-90 mt-1">
                  KCA University Department of Computing & IT · {selectedCourse.enrollment.Semester}
                </p>
              </div>
              <button
                onClick={() => setSelectedCourse(null)}
                className="p-1 rounded-lg hover:bg-white/20 text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5 text-xs text-slate-700">
              
              <div>
                <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] mb-1">
                  Course Synopsis & Objectives
                </h4>
                <p className="text-slate-600 leading-relaxed text-sm">
                  {selectedCourse.unit.Description}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div>
                  <span className="text-slate-400 font-medium block mb-1">Assigned Lecturer</span>
                  <div className="font-bold text-slate-900 text-sm">
                    {selectedCourse.lecturer.Name}
                  </div>
                  <div className="text-slate-600 mt-0.5">{selectedCourse.lecturer.Department}</div>
                  <div className="text-blue-600 mt-1 font-mono">{selectedCourse.lecturer.Email}</div>
                  <div className="text-slate-500 mt-0.5">Office: {selectedCourse.lecturer.Office}</div>
                </div>

                <div>
                  <span className="text-slate-400 font-medium block mb-1">Lecture & Lab Venue</span>
                  <div className="font-bold text-slate-900 text-sm">
                    {selectedCourse.room.RoomName}
                  </div>
                  <div className="text-slate-600 mt-0.5">{selectedCourse.room.Location}</div>
                  <div className="text-slate-500 mt-1">Capacity: {selectedCourse.room.Capacity} Seats</div>
                  <div className="text-emerald-700 mt-0.5 font-medium">Equipped with Multimedia Projector</div>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] mb-2">
                  Confirmed Course Registration Record
                </h4>
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 font-mono text-[11px] space-y-1">
                  <div>EnrollmentID: <span className="font-semibold">{selectedCourse.enrollment.EnrollmentID}</span></div>
                  <div>Student: <span className="font-semibold">{currentStudent.Name} ({currentStudent.RegNumber})</span></div>
                  <div>Academic Year: <span className="font-semibold">{selectedCourse.enrollment.AcademicYear}</span></div>
                  <div>Status: <span className="text-emerald-600 font-semibold">Active & Confirmed</span></div>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  onClick={() => setSelectedCourse(null)}
                  className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold transition-colors"
                >
                  Close
                </button>
                {onSelectUnitAssignments && (
                  <button
                    onClick={() => {
                      const code = selectedCourse.unit.UnitCode;
                      setSelectedCourse(null);
                      onSelectUnitAssignments(code);
                    }}
                    className="px-4 py-2 rounded-lg bg-[#002B49] hover:bg-[#00385F] text-white font-semibold transition-colors flex items-center gap-1.5"
                  >
                    <span>View Unit Assignments</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

            </div>

          </div>
        </div>
      )}
    </div>
  );
};
