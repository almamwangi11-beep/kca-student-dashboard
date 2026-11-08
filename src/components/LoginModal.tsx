import React, { useState } from 'react';
import { useDashboard } from '../context/DashboardContext';
import {
  GraduationCap,
  Shield,
  User,
  Lock,
  ArrowRight,
  Info,
  CheckCircle2
} from 'lucide-react';

export const LoginModal: React.FC = () => {
  const { isLoggedIn, loginAsStudent, loginAsAdmin, switchPersona } = useDashboard();
  const [authMode, setAuthMode] = useState<'student' | 'admin'>('student');
  const [credentialInput, setCredentialInput] = useState('25/03339');
  const [passwordInput, setPasswordInput] = useState('password123');
  const [loginError, setLoginError] = useState<string | null>(null);

  if (isLoggedIn) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    if (authMode === 'student') {
      const success = loginAsStudent(credentialInput);
      if (!success) {
        setLoginError('Invalid Student Registration Number. Try 25/03339 for Alma Amani Mwangi.');
      }
    } else {
      const success = loginAsAdmin(credentialInput);
      if (!success) {
        setLoginError('Invalid Administrator Email. Try sharon.anyango@kca.ac.ke or admin@kca.ac.ke.');
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Banner with KCA Campus Photo */}
        <div className="relative h-36 bg-[#002B49] overflow-hidden">
          <img
            src="/src/assets/images/kca_university_campus_1794129494753.jpg"
            alt="KCA University Campus"
            className="w-full h-full object-cover opacity-35"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#002B49] via-[#002B49]/70 to-transparent" />
          
          <div className="absolute bottom-4 left-5 right-5 text-white flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-400 font-bold text-xl shrink-0">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-extrabold text-base tracking-tight text-white leading-tight">
                KCA UNIVERSITY
              </h2>
              <p className="text-xs text-amber-300 font-medium">
                Virtual Campus · Student Academic Dashboard
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 text-xs text-slate-700">
          
          {/* Mode Switcher */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
            <button
              type="button"
              onClick={() => {
                setAuthMode('student');
                setCredentialInput('25/03339');
                setLoginError(null);
              }}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                authMode === 'student' ? 'bg-white text-[#002B49] shadow-xs' : 'text-slate-600'
              }`}
            >
              Student Portal
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthMode('admin');
                setCredentialInput('sharon.anyango@kca.ac.ke');
                setLoginError(null);
              }}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                authMode === 'admin' ? 'bg-white text-[#002B49] shadow-xs' : 'text-slate-600'
              }`}
            >
              Faculty / Admin
            </button>
          </div>

          {loginError && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-xs">
              {loginError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block font-bold text-slate-800 mb-1">
                {authMode === 'student' ? 'Student Registration Number' : 'Institutional Email Address'}
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type={authMode === 'student' ? 'text' : 'email'}
                  value={credentialInput}
                  onChange={e => setCredentialInput(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-200 bg-white focus:outline-hidden focus:ring-2 focus:ring-[#002B49]"
                  placeholder={authMode === 'student' ? 'e.g. 25/03339' : 'e.g. sharon.anyango@kca.ac.ke'}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-800 mb-1">
                Portal Password (bcrypt encrypted)
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={passwordInput}
                  onChange={e => setPasswordInput(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-200 bg-white focus:outline-hidden focus:ring-2 focus:ring-[#002B49]"
                  placeholder="••••••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-lg bg-[#002B49] hover:bg-[#00385F] text-white font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Authenticate & Access Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Pre-fills */}
          <div className="pt-2 border-t border-slate-100 space-y-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Quick Demo Access
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => switchPersona('alma')}
                className="p-2 text-left rounded-lg border border-slate-200 hover:border-[#002B49] hover:bg-slate-50 transition-colors"
              >
                <div className="font-bold text-slate-900 text-xs">Alma Amani Mwangi</div>
                <div className="text-[10px] text-slate-500 font-mono">25/03339 (DBIT)</div>
              </button>

              <button
                type="button"
                onClick={() => switchPersona('admin')}
                className="p-2 text-left rounded-lg border border-slate-200 hover:border-amber-600 hover:bg-slate-50 transition-colors"
              >
                <div className="font-bold text-slate-900 text-xs">Sharon Anyango</div>
                <div className="text-[10px] text-amber-700 font-medium">Supervisor (Faculty)</div>
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
