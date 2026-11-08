import React, { useState } from 'react';
import {
  Wifi,
  CloudSun,
  Monitor,
  Library,
  Bus,
  Activity,
  CheckCircle2,
  Clock,
  Sparkles,
  ShieldCheck,
  RefreshCw,
  Flame
} from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';

export const CampusPulseWidget: React.FC = () => {
  const { showToast } = useDashboard();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'facilities' | 'transit' | 'biometrics'>('facilities');

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      showToast('Campus telemetry synchronised with Ruaraka IoT Gateway', 'info');
    }, 600);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
      
      {/* Widget Header */}
      <div className="bg-gradient-to-r from-[#002138] to-[#00385F] text-white px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <div>
            <h3 className="text-xs font-bold tracking-tight text-white flex items-center gap-1.5">
              <span>Campus Pulse</span>
              <span className="text-[10px] text-amber-300 font-normal">· Ruaraka Main Campus</span>
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Quick Nairobi Weather Pill */}
          <div className="flex items-center gap-1 text-[11px] text-slate-200 bg-white/10 px-2 py-0.5 rounded-md font-mono">
            <CloudSun className="w-3 h-3 text-amber-400" />
            <span>24°C</span>
          </div>

          <button
            onClick={handleRefresh}
            title="Refresh IoT feeds"
            className="p-1 rounded-md text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Quick Segmented Nav */}
      <div className="flex items-center border-b border-slate-100 bg-slate-50 p-1 text-[11px] font-medium text-slate-600 gap-1">
        <button
          onClick={() => setActiveTab('facilities')}
          className={`flex-1 py-1 rounded-md transition-all text-center ${
            activeTab === 'facilities'
              ? 'bg-white text-[#002138] font-bold shadow-2xs border border-slate-200'
              : 'hover:text-slate-900'
          }`}
        >
          Labs &amp; Library
        </button>
        <button
          onClick={() => setActiveTab('biometrics')}
          className={`flex-1 py-1 rounded-md transition-all text-center ${
            activeTab === 'biometrics'
              ? 'bg-white text-[#002138] font-bold shadow-2xs border border-slate-200'
              : 'hover:text-slate-900'
          }`}
        >
          Biometric Attendance
        </button>
        <button
          onClick={() => setActiveTab('transit')}
          className={`flex-1 py-1 rounded-md transition-all text-center ${
            activeTab === 'transit'
              ? 'bg-white text-[#002138] font-bold shadow-2xs border border-slate-200'
              : 'hover:text-slate-900'
          }`}
        >
          Campus Shuttle
        </button>
      </div>

      {/* Tab Panels */}
      <div className="p-3.5 text-xs space-y-3">
        
        {activeTab === 'facilities' && (
          <div className="space-y-2.5">
            {/* Wi-Fi & Network */}
            <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100">
              <div className="flex items-center gap-2">
                <Wifi className="w-4 h-4 text-emerald-600" />
                <div>
                  <span className="font-semibold text-slate-900 block leading-tight">
                    eduroam / KCA-STUDENT
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">
                    Wi-Fi 6 · 142 Mbps · Latency 11ms
                  </span>
                </div>
              </div>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Optimal
              </span>
            </div>

            {/* Lab 4 Capacity */}
            <div className="p-2 rounded-xl border border-slate-100 hover:border-slate-200 transition-colors">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1.5 font-semibold text-slate-900">
                  <Monitor className="w-3.5 h-3.5 text-[#002138]" />
                  <span>Lab 4 (DBIT Systems Lab)</span>
                </div>
                <span className="font-mono text-[11px] font-bold text-emerald-700">
                  18 / 45 PCs Free
                </span>
              </div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div className="bg-[#002138] h-full rounded-full" style={{ width: '60%' }} />
              </div>
            </div>

            {/* Library Seat Status */}
            <div className="p-2 rounded-xl border border-slate-100 hover:border-slate-200 transition-colors">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1.5 font-semibold text-slate-900">
                  <Library className="w-3.5 h-3.5 text-amber-700" />
                  <span>Martin Oduor Library (2nd Floor)</span>
                </div>
                <span className="font-mono text-[11px] font-bold text-slate-700">
                  42 Study Desks Free
                </span>
              </div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div className="bg-amber-500 h-full rounded-full" style={{ width: '65%' }} />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'biometrics' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200">
              <div>
                <span className="text-[10px] text-emerald-800 font-bold uppercase tracking-wider block">
                  Semester Attendance Rate
                </span>
                <span className="text-xl font-extrabold text-emerald-950 font-mono">
                  94.2%
                </span>
                <span className="text-[10px] text-emerald-700 block mt-0.5">
                  ✓ Meets KCA 75% Examination Threshold
                </span>
              </div>

              <div className="w-12 h-12 rounded-full border-4 border-emerald-600 border-t-transparent flex items-center justify-center font-mono font-bold text-xs text-emerald-900">
                94%
              </div>
            </div>

            <div className="space-y-1.5 text-[11px] text-slate-600">
              <div className="flex items-center justify-between py-1 border-b border-slate-100">
                <span>DBIT 1102 (C++ Programming)</span>
                <span className="font-mono font-bold text-slate-900">10/10 Sessions</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-100">
                <span>DBIT 1103 (Database Systems)</span>
                <span className="font-mono font-bold text-slate-900">9/10 Sessions</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-100">
                <span>DBIT 1105 (Web Technologies)</span>
                <span className="font-mono font-bold text-slate-900">10/10 Sessions</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'transit' && (
          <div className="space-y-2.5">
            <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-200 space-y-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 font-bold text-amber-950">
                  <Bus className="w-4 h-4 text-amber-700" />
                  <span>Main Campus ↔ Roysambu Roundabout</span>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-200 text-amber-900">
                  On Time
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-amber-900 pt-1">
                <span>Next Departure: Gate 2 Terminal</span>
                <span className="font-mono font-bold">14 mins</span>
              </div>
            </div>

            <div className="p-3 rounded-xl border border-slate-100 bg-slate-50 space-y-1 text-slate-600">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-900">Main Campus ↔ Nairobi CBD (Kencom)</span>
                <span className="text-[10px] font-mono text-slate-500">12:30 PM &amp; 4:30 PM</span>
              </div>
              <p className="text-[10px] text-slate-500">
                Students must present digital ID at boarding terminal.
              </p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
