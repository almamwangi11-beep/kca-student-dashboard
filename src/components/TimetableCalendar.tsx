import React, { useState } from 'react';
import { useDashboard } from '../context/DashboardContext';
import { TimetableSlot, DayOfWeek, Unit, Room, Lecturer } from '../types/database';
import {
  Calendar,
  Clock,
  MapPin,
  User,
  ChevronLeft,
  ChevronRight,
  List,
  Grid,
  Columns,
  Info,
  X,
  ExternalLink
} from 'lucide-react';

const DAYS: DayOfWeek[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const HOURS = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'];

export const TimetableCalendar: React.FC = () => {
  const {
    timetable,
    units,
    rooms,
    lecturers,
    currentDayOfWeek,
    currentTimeString,
    activeHappeningNowSession
  } = useDashboard();

  const [calendarView, setCalendarView] = useState<'week' | 'day' | 'agenda'>('week');
  const [selectedDay, setSelectedDay] = useState<DayOfWeek>(
    DAYS.includes(currentDayOfWeek) ? currentDayOfWeek : 'Monday'
  );
  const [selectedSlotModal, setSelectedSlotModal] = useState<{
    slot: TimetableSlot;
    unit: Unit;
    room: Room;
    lecturer: Lecturer;
  } | null>(null);

  // Helper to parse time to minutes from 08:00
  const timeToMinutesFromStart = (timeStr: string) => {
    const [h, m] = timeStr.split(':').map(Number);
    return (h - 8) * 60 + m;
  };

  // Convert minutes into CSS top and height in percentage of 10-hour day (08:00 to 18:00 = 600 min)
  const getSlotPosition = (start: string, end: string) => {
    const startMin = timeToMinutesFromStart(start);
    const endMin = timeToMinutesFromStart(end);
    const totalDayMin = 10 * 60; // 600 min
    const topPct = (startMin / totalDayMin) * 100;
    const heightPct = ((endMin - startMin) / totalDayMin) * 100;
    return { top: `${topPct}%`, height: `${heightPct}%` };
  };

  return (
    <div className="space-y-4">
      {/* Header & View Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              Interactive Timetable
            </h2>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-[#002B49]">
              Google Calendar Style
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Synchronized schedule for DBIT Semester 2. Color-coded by course unit with lecture room venues.
          </p>
        </div>

        {/* View Switch Buttons (Day / Week / Agenda) */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg self-start sm:self-center">
          <button
            onClick={() => setCalendarView('week')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              calendarView === 'week'
                ? 'bg-white text-slate-900 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Columns className="w-3.5 h-3.5" />
            <span>Week View</span>
          </button>

          <button
            onClick={() => setCalendarView('day')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              calendarView === 'day'
                ? 'bg-white text-slate-900 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Grid className="w-3.5 h-3.5" />
            <span>Day View</span>
          </button>

          <button
            onClick={() => setCalendarView('agenda')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              calendarView === 'agenda'
                ? 'bg-white text-slate-900 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <List className="w-3.5 h-3.5" />
            <span>Agenda View</span>
          </button>
        </div>
      </div>

      {/* Week View */}
      {calendarView === 'week' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-x-auto">
          <div className="min-w-[640px]">
            {/* Day Headers */}
            <div className="grid grid-cols-6 border-b border-slate-200 bg-slate-50 text-xs font-semibold text-slate-700">
              <div className="py-2.5 px-3 text-center text-slate-400 font-mono border-r border-slate-200">
                Time
              </div>
              {DAYS.map(day => {
                const isToday = day === currentDayOfWeek;
                return (
                  <div
                    key={day}
                    className={`py-2.5 px-2 text-center border-r border-slate-200 last:border-r-0 ${
                      isToday ? 'bg-amber-50/70 text-amber-900 font-bold' : ''
                    }`}
                  >
                    <span className="block">{day}</span>
                    {isToday && (
                      <span className="inline-block text-[10px] text-amber-700 font-normal">
                        (Today)
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Time Grid with Slots */}
            <div className="relative grid grid-cols-6 h-[560px] overflow-y-auto">
            
            {/* Hours column */}
            <div className="border-r border-slate-200 bg-slate-50/50 flex flex-col justify-between py-2 text-right pr-2 text-[11px] font-mono text-slate-400 select-none">
              {HOURS.map(hour => (
                <div key={hour} className="h-14">
                  {hour}
                </div>
              ))}
            </div>

            {/* Days columns */}
            {DAYS.map(day => {
              const daySlots = timetable.filter(s => s.DayOfWeek === day);
              const isToday = day === currentDayOfWeek;

              return (
                <div
                  key={day}
                  className={`relative border-r border-slate-200 last:border-r-0 ${
                    isToday ? 'bg-amber-50/20' : ''
                  }`}
                >
                  {/* Subtle horizontal hour lines */}
                  {HOURS.map(hour => (
                    <div
                      key={hour}
                      className="h-14 border-b border-slate-100 pointer-events-none"
                    />
                  ))}

                  {/* Render Lectures / Labs inside this day column */}
                  {daySlots.map(slot => {
                    const unit = units.find(u => u.UnitCode === slot.UnitCode) || units[0];
                    const room = rooms.find(r => r.RoomID === slot.RoomID) || rooms[0];
                    const lecturer = lecturers.find(l => l.LecturerID === unit.LecturerID) || lecturers[0];
                    const pos = getSlotPosition(slot.StartTime, slot.EndTime);

                    const isHappeningNow =
                      activeHappeningNowSession?.slot.TimetableID === slot.TimetableID;

                    return (
                      <div
                        key={slot.TimetableID}
                        onClick={() => setSelectedSlotModal({ slot, unit, room, lecturer })}
                        style={{
                          top: pos.top,
                          height: pos.height,
                          backgroundColor: `${unit.Color}15`,
                          borderColor: unit.Color
                        }}
                        className={`absolute inset-x-1 border rounded-lg p-2 overflow-hidden cursor-pointer transition-all hover:scale-[1.02] hover:z-20 hover:shadow-md flex flex-col justify-between ${
                          isHappeningNow
                            ? 'ring-2 ring-red-500 ring-offset-1 shadow-md bg-amber-50'
                            : ''
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between gap-1 mb-0.5">
                            <span
                              className="font-mono text-[10px] font-bold px-1.5 py-0.2 rounded text-white"
                              style={{ backgroundColor: unit.Color }}
                            >
                              {slot.UnitCode}
                            </span>
                            <span className="text-[10px] font-mono text-slate-500">
                              {slot.StartTime}
                            </span>
                          </div>

                          <h4 className="text-[11px] font-bold text-slate-900 leading-tight line-clamp-2">
                            {unit.UnitName}
                          </h4>
                        </div>

                        <div className="text-[10px] text-slate-600 mt-1 space-y-0.5">
                          <div className="flex items-center gap-1 font-semibold text-slate-800">
                            <MapPin className="w-2.5 h-2.5 text-slate-400 shrink-0" />
                            <span className="truncate">{room.RoomName}</span>
                          </div>
                          <div className="flex items-center gap-1 text-slate-500">
                            <User className="w-2.5 h-2.5 text-slate-400 shrink-0" />
                            <span className="truncate">{lecturer.Name}</span>
                          </div>
                        </div>

                        {isHappeningNow && (
                          <div className="text-[9px] font-bold text-red-600 uppercase tracking-wider flex items-center gap-1 mt-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-ping" />
                            <span>In Session</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>
      )}

      {/* Day View */}
      {calendarView === 'day' && (
        <div className="space-y-3">
          {/* Day selection tabs */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1">
            {DAYS.map(day => (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                  selectedDay === day
                    ? 'bg-[#002B49] text-white'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                {day}
                {day === currentDayOfWeek && ' (Today)'}
              </button>
            ))}
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center justify-between">
              <span>{selectedDay} Schedule</span>
              <span className="text-xs text-slate-500 font-normal">
                {timetable.filter(s => s.DayOfWeek === selectedDay).length} Scheduled Sessions
              </span>
            </h3>

            {timetable.filter(s => s.DayOfWeek === selectedDay).length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-500">
                No classes scheduled for {selectedDay}.
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {timetable
                  .filter(s => s.DayOfWeek === selectedDay)
                  .sort((a, b) => a.StartTime.localeCompare(b.StartTime))
                  .map(slot => {
                    const unit = units.find(u => u.UnitCode === slot.UnitCode) || units[0];
                    const room = rooms.find(r => r.RoomID === slot.RoomID) || rooms[0];
                    const lecturer = lecturers.find(l => l.LecturerID === unit.LecturerID) || lecturers[0];

                    const isHappeningNow =
                      activeHappeningNowSession?.slot.TimetableID === slot.TimetableID;

                    return (
                      <div
                        key={slot.TimetableID}
                        onClick={() => setSelectedSlotModal({ slot, unit, room, lecturer })}
                        className={`py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50 px-2 rounded-lg cursor-pointer transition-colors ${
                          isHappeningNow ? 'bg-amber-50/80' : ''
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className="w-1.5 self-stretch rounded-full shrink-0"
                            style={{ backgroundColor: unit.Color }}
                          />
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span
                                className="font-mono text-xs font-bold px-2 py-0.5 rounded text-white"
                                style={{ backgroundColor: unit.Color }}
                              >
                                {slot.UnitCode}
                              </span>
                              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                                {slot.SessionType}
                              </span>
                              {isHappeningNow && (
                                <span className="text-xs font-bold text-red-600 bg-red-100 px-2 py-0.5 rounded animate-pulse">
                                  ● Happening Now
                                </span>
                              )}
                            </div>
                            <h4 className="text-sm font-bold text-slate-900 mt-1">
                              {unit.UnitName}
                            </h4>
                            <div className="flex items-center gap-4 text-xs text-slate-500 mt-1 flex-wrap">
                              <div className="flex items-center gap-1">
                                <User className="w-3.5 h-3.5 text-slate-400" />
                                <span>{lecturer.Name} ({lecturer.Office})</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                                <span className="font-semibold text-slate-700">{room.RoomName}</span>
                                <span>· {room.Location}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="text-right sm:self-center font-mono text-xs font-bold text-slate-800 bg-slate-100 px-3 py-1.5 rounded-lg shrink-0">
                          {slot.StartTime} – {slot.EndTime}
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Agenda View */}
      {calendarView === 'agenda' && (
        <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
            Weekly Lecture Agenda (Monday to Friday)
          </h3>

          <div className="space-y-6">
            {DAYS.map(day => {
              const daySlots = timetable
                .filter(s => s.DayOfWeek === day)
                .sort((a, b) => a.StartTime.localeCompare(b.StartTime));

              if (daySlots.length === 0) return null;

              return (
                <div key={day} className="space-y-2">
                  <div className="text-xs font-bold text-[#002B49] uppercase tracking-wider flex items-center gap-2">
                    <span>{day}</span>
                    {day === currentDayOfWeek && (
                      <span className="text-amber-700 font-semibold">(Today)</span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {daySlots.map(slot => {
                      const unit = units.find(u => u.UnitCode === slot.UnitCode) || units[0];
                      const room = rooms.find(r => r.RoomID === slot.RoomID) || rooms[0];
                      const lecturer = lecturers.find(l => l.LecturerID === unit.LecturerID) || lecturers[0];

                      return (
                        <div
                          key={slot.TimetableID}
                          onClick={() => setSelectedSlotModal({ slot, unit, room, lecturer })}
                          className="p-3.5 rounded-lg border border-slate-200 hover:border-slate-300 hover:shadow-xs transition-all cursor-pointer bg-white flex items-center justify-between gap-3"
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <span
                                className="w-2.5 h-2.5 rounded-full shrink-0"
                                style={{ backgroundColor: unit.Color }}
                              />
                              <span className="font-mono text-xs font-bold text-slate-900">
                                {slot.UnitCode}
                              </span>
                              <span className="text-[11px] text-slate-500 font-medium">
                                ({slot.SessionType})
                              </span>
                            </div>
                            <h4 className="text-xs font-bold text-slate-800 line-clamp-1 mt-0.5">
                              {unit.UnitName}
                            </h4>
                            <div className="text-[11px] text-slate-500 mt-0.5">
                              {room.RoomName} · {lecturer.Name}
                            </div>
                          </div>

                          <div className="font-mono text-xs font-bold text-[#002B49] bg-slate-50 px-2.5 py-1 rounded border border-slate-200 shrink-0">
                            {slot.StartTime} – {slot.EndTime}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Session Details Modal */}
      {selectedSlotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div
              className="p-4 text-white flex items-start justify-between"
              style={{ backgroundColor: selectedSlotModal.unit.Color }}
            >
              <div>
                <span className="font-mono text-xs font-bold uppercase tracking-wider opacity-90">
                  {selectedSlotModal.slot.DayOfWeek} · {selectedSlotModal.slot.StartTime} to {selectedSlotModal.slot.EndTime}
                </span>
                <h3 className="text-base font-bold mt-1 text-white">
                  {selectedSlotModal.unit.UnitCode}: {selectedSlotModal.unit.UnitName}
                </h3>
              </div>
              <button
                onClick={() => setSelectedSlotModal(null)}
                className="p-1 rounded hover:bg-white/20 text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs text-slate-700">
              <div className="space-y-2">
                <div>
                  <span className="text-slate-400 block font-medium">Session Type</span>
                  <span className="text-sm font-bold text-slate-900">{selectedSlotModal.slot.SessionType}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Venue & Location</span>
                  <span className="text-sm font-bold text-slate-900">{selectedSlotModal.room.RoomName}</span>
                  <p className="text-slate-500 mt-0.5">{selectedSlotModal.room.Location}</p>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Instructor</span>
                  <span className="text-sm font-bold text-slate-900">{selectedSlotModal.lecturer.Name}</span>
                  <p className="text-blue-600 font-mono mt-0.5">{selectedSlotModal.lecturer.Email}</p>
                  <p className="text-slate-500">Office: {selectedSlotModal.lecturer.Office}</p>
                </div>
              </div>

              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-[11px] font-mono text-slate-600">
                <div>Database Ref: TIMETABLE ID #{selectedSlotModal.slot.TimetableID}</div>
                <div>Course Credits: {selectedSlotModal.unit.Credits} hrs/week</div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setSelectedSlotModal(null)}
                  className="px-4 py-2 rounded-lg bg-[#002B49] text-white font-semibold hover:bg-[#00385F] transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
