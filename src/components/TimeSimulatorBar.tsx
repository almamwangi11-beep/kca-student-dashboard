import React, { useState } from 'react';
import { useDashboard } from '../context/DashboardContext';
import {
  Bell,
  Clock,
  Calendar,
  ChevronDown,
  Sparkles,
  MapPin,
  SlidersHorizontal,
  X
} from 'lucide-react';

export const TimeSimulatorBar: React.FC = () => {
  const {
    simulatedDate,
    simulatedTimePreset,
    applyPresetTime,
    currentDayOfWeek,
    currentTimeString,
    activeHappeningNowSession
  } = useDashboard();

  const [isOpenSettings, setIsOpenSettings] = useState(false);

  return (
    <div className="bg-[#001f35] text-slate-200 border-b border-[#001728] py-2 px-4 sm:px-6 lg:px-8 text-xs relative">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2.5">
        
        {/* Left: Authentic University Campus Notice */}
        <div className="flex items-center gap-2.5 text-slate-300">
          <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold text-[10px] tracking-wide uppercase border border-amber-400/30 shrink-0">
            Campus Notice
          </span>
          <span className="line-clamp-1 text-xs text-slate-300">
            Jan–Apr 2026 Semester: Continuous Assessment Tests (CAT 1) commence next week. Verify room venues on your timetable.
          </span>
        </div>

        {/* Right: Real Campus Time & Subtle Time Shift */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-2 text-slate-400 font-mono text-[11px]">
            <MapPin className="w-3 h-3 text-amber-400" />
            <span className="text-slate-200">Main Campus, Nairobi</span>
            <span>·</span>
            <span className="text-amber-300 font-bold">{currentDayOfWeek}, {currentTimeString}</span>
          </div>

          {/* Discreet Time Selector Button */}
          <div className="relative">
            <button
              onClick={() => setIsOpenSettings(!isOpenSettings)}
              className="flex items-center gap-1 px-2 py-0.5 rounded bg-white/10 hover:bg-white/20 text-slate-300 text-[11px] transition-colors"
              title="Switch schedule time or day"
            >
              <Clock className="w-3 h-3 text-amber-400" />
              <span className="hidden sm:inline">Schedule Time</span>
              <ChevronDown className="w-3 h-3" />
            </button>

            {/* Subtle dropdown to test different schedule times */}
            {isOpenSettings && (
              <div className="absolute right-0 mt-2 w-72 bg-white text-slate-900 rounded-xl shadow-2xl border border-slate-200 p-3 z-50 animate-in fade-in slide-in-from-top-1 text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <span className="font-bold text-slate-900 text-xs">Select Timetable Day / Hour</span>
                  <button
                    onClick={() => setIsOpenSettings(false)}
                    className="p-1 text-slate-400 hover:text-slate-600 rounded"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                <p className="text-[11px] text-slate-500 my-2">
                  Preview your dashboard and &quot;Happening Now&quot; lecture status at different hours of the academic week:
                </p>

                <div className="space-y-1">
                  <button
                    onClick={() => {
                      applyPresetTime('live');
                      setIsOpenSettings(false);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between ${
                      simulatedTimePreset === 'live' ? 'bg-[#002B49] text-white font-bold' : 'hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <span>Current Live Clock</span>
                    <span className="font-mono text-[10px] opacity-75">Real Time</span>
                  </button>

                  <button
                    onClick={() => {
                      applyPresetTime('mon_morning');
                      setIsOpenSettings(false);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between ${
                      simulatedTimePreset === 'mon_morning' ? 'bg-[#002B49] text-white font-bold' : 'hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <span>Monday 08:30 (DBIT 1101 Lecture)</span>
                    <span className="font-mono text-[10px] opacity-75">LR 04</span>
                  </button>

                  <button
                    onClick={() => {
                      applyPresetTime('wed_db');
                      setIsOpenSettings(false);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between ${
                      simulatedTimePreset === 'wed_db' ? 'bg-[#002B49] text-white font-bold' : 'hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <span>Wednesday 09:15 (Database Lab)</span>
                    <span className="font-mono text-[10px] opacity-75">Lab 2</span>
                  </button>

                  <button
                    onClick={() => {
                      applyPresetTime('thu_web');
                      setIsOpenSettings(false);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between ${
                      simulatedTimePreset === 'thu_web' ? 'bg-[#002B49] text-white font-bold' : 'hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <span>Thursday 09:30 (Web Tech Lab)</span>
                    <span className="font-mono text-[10px] opacity-75">IT Complex</span>
                  </button>

                  <button
                    onClick={() => {
                      applyPresetTime('weekend');
                      setIsOpenSettings(false);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between ${
                      simulatedTimePreset === 'weekend' ? 'bg-[#002B49] text-white font-bold' : 'hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <span>Saturday / Study Break</span>
                    <span className="font-mono text-[10px] opacity-75">Off Hours</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
