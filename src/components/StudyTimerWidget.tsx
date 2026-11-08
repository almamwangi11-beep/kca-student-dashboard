import React, { useState, useEffect } from 'react';
import {
  Timer,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  BookOpen,
  CheckCircle,
  Flame
} from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';

export const StudyTimerWidget: React.FC = () => {
  const { enrolledCourses, showToast } = useDashboard();
  const [selectedUnit, setSelectedUnit] = useState<string>(enrolledCourses[0]?.unit.UnitCode || 'DBIT 1102');
  const [secondsLeft, setSecondsLeft] = useState<number>(25 * 60);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [completedSessions, setCompletedSessions] = useState<number>(3);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isActive && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft(prev => prev - 1);
      }, 1000);
    } else if (secondsLeft === 0 && isActive) {
      setIsActive(false);
      setCompletedSessions(prev => prev + 1);
      showToast(`🎯 Great job! 25-minute study sprint for ${selectedUnit} completed!`, 'success');
      setSecondsLeft(25 * 60);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, secondsLeft, selectedUnit, showToast]);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setSecondsLeft(25 * 60);
  };

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const timeFormatted = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  const progressPercent = ((25 * 60 - secondsLeft) / (25 * 60)) * 100;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-4 space-y-3.5">
      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            <Timer className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-xs">
              Smart Study Sprint
            </h3>
            <p className="text-[10px] text-slate-400">
              Deep Work Focus Session
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full font-semibold border border-amber-200">
          <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
          <span>{completedSessions} Sprints Done</span>
        </div>
      </div>

      {/* Course Unit Selector */}
      <div className="flex items-center gap-2">
        <label className="text-[11px] text-slate-500 font-medium shrink-0">Focus on:</label>
        <select
          value={selectedUnit}
          onChange={e => setSelectedUnit(e.target.value)}
          className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-800 font-semibold focus:outline-hidden focus:ring-1 focus:ring-[#002138]"
        >
          {enrolledCourses.map(c => (
            <option key={c.unit.UnitCode} value={c.unit.UnitCode}>
              {c.unit.UnitCode} - {c.unit.UnitName}
            </option>
          ))}
        </select>
      </div>

      {/* Futuristic Timer Display */}
      <div className="relative bg-gradient-to-br from-[#001D33] to-[#043354] text-white rounded-xl p-4 flex items-center justify-between overflow-hidden shadow-inner">
        
        {/* Ambient progress glow bar */}
        <div
          className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-amber-400 to-emerald-400 transition-all duration-1000"
          style={{ width: `${progressPercent}%` }}
        />

        <div className="space-y-0.5 z-10">
          <span className="text-[10px] font-mono uppercase tracking-widest text-amber-300">
            {isActive ? '● SESSION ACTIVE' : '○ PAUSED'}
          </span>
          <div className="text-3xl font-black font-mono tracking-tight text-white tabular-nums">
            {timeFormatted}
          </div>
        </div>

        <div className="flex items-center gap-2 z-10">
          <button
            onClick={toggleTimer}
            className={`w-10 h-10 rounded-xl flex items-center justify-center text-white transition-all shadow-md active:scale-95 ${
              isActive
                ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold'
                : 'bg-emerald-600 hover:bg-emerald-500'
            }`}
            title={isActive ? 'Pause Sprint' : 'Start Sprint'}
          >
            {isActive ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
          </button>

          <button
            onClick={resetTimer}
            className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 flex items-center justify-center transition-colors"
            title="Reset to 25 mins"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
