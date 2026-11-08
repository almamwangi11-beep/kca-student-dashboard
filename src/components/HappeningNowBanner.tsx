import React from 'react';
import { useDashboard } from '../context/DashboardContext';
import {
  MapPin,
  User,
  Clock,
  Calendar,
  Sparkles,
  ArrowRight,
  Radio,
  AlertCircle,
  Building
} from 'lucide-react';

interface HappeningNowBannerProps {
  onViewTimetable: () => void;
}

export const HappeningNowBanner: React.FC<HappeningNowBannerProps> = ({ onViewTimetable }) => {
  const {
    activeHappeningNowSession,
    currentDayOfWeek,
    currentTimeString,
    timetable,
    units,
    rooms,
    lecturers
  } = useDashboard();

  // If no class is happening now, find the next upcoming session today or this week
  const upcomingTodaySession = React.useMemo(() => {
    if (activeHappeningNowSession) return null;

    const [curH, curM] = currentTimeString.split(':').map(Number);
    const curMinutes = curH * 60 + curM;

    const todaySlots = timetable
      .filter(s => s.DayOfWeek === currentDayOfWeek)
      .map(slot => {
        const [startH, startM] = slot.StartTime.split(':').map(Number);
        return {
          slot,
          startMinutes: startH * 60 + startM
        };
      })
      .filter(item => item.startMinutes > curMinutes)
      .sort((a, b) => a.startMinutes - b.startMinutes);

    if (todaySlots.length > 0) {
      const next = todaySlots[0].slot;
      const unit = units.find(u => u.UnitCode === next.UnitCode);
      const room = rooms.find(r => r.RoomID === next.RoomID);
      const lecturer = lecturers.find(l => l.LecturerID === unit?.LecturerID);
      return { slot: next, unit, room, lecturer };
    }

    return null;
  }, [activeHappeningNowSession, currentDayOfWeek, currentTimeString, timetable, units, rooms, lecturers]);

  if (activeHappeningNowSession) {
    const { unit, lecturer, room, slot, minutesLeft } = activeHappeningNowSession;

    return (
      <div className="bg-gradient-to-r from-[#002B49] via-[#00385F] to-[#0B446D] text-white rounded-xl shadow-md border border-amber-400/40 p-4 sm:p-5 mb-6 relative overflow-hidden">
        {/* Subtle decorative gold glow */}
        <div className="absolute -right-12 -top-12 w-48 h-48 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
          
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-600/90 text-white font-bold text-xs uppercase tracking-wider animate-pulse">
                <span className="w-2 h-2 rounded-full bg-white" />
                Happening Now
              </span>
              <span className="text-xs text-amber-300 font-medium">
                {currentDayOfWeek} · {slot.StartTime} – {slot.EndTime}
              </span>
              <span className="text-xs text-slate-300">
                ({minutesLeft} minutes remaining)
              </span>
            </div>

            <div className="flex items-baseline gap-2.5 flex-wrap">
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                {unit.UnitCode}: {unit.UnitName}
              </h2>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-white/20 text-slate-100">
                {slot.SessionType}
              </span>
            </div>

            <div className="flex items-center gap-5 text-xs text-slate-200 flex-wrap pt-1">
              <div className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-amber-400" />
                <span className="font-medium text-white">{lecturer.Name}</span>
                <span className="text-slate-400">({lecturer.Office})</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                <span className="font-semibold text-amber-200">{room.RoomName}</span>
                <span className="text-slate-400">· {room.Location}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start lg:self-center shrink-0">
            <button
              onClick={onViewTimetable}
              className="px-3.5 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-xs transition-colors flex items-center gap-1.5 shadow-sm whitespace-nowrap"
            >
              <span>Full Schedule</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      </div>
    );
  }

  // If no class right now, show helpful status banner
  return (
    <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-4 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 shrink-0">
          <Clock className="w-4 h-4 text-[#002B49]" />
        </div>
        <div>
          <div className="font-semibold text-slate-900 flex items-center gap-2">
            <span>No Lecture in Session Currently</span>
            <span className="text-[11px] text-slate-500 font-normal">
              ({currentDayOfWeek} {currentTimeString})
            </span>
          </div>
          {upcomingTodaySession ? (
            <p className="text-slate-600 mt-0.5">
              Next today:{' '}
              <strong className="text-[#002B49]">
                {upcomingTodaySession.unit?.UnitCode}
              </strong>{' '}
              at {upcomingTodaySession.slot.StartTime} in{' '}
              <strong className="text-slate-900">{upcomingTodaySession.room?.RoomName}</strong>{' '}
              with {upcomingTodaySession.lecturer?.Name}.
            </p>
          ) : (
            <p className="text-slate-500 mt-0.5">
              All scheduled lectures for this day have concluded or this is an off-period. Use the presets above to simulate class sessions.
            </p>
          )}
        </div>
      </div>

      <button
        onClick={onViewTimetable}
        className="text-[#002B49] font-semibold hover:text-amber-700 flex items-center gap-1 shrink-0 self-end sm:self-center"
      >
        <span>View Weekly Timetable</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
