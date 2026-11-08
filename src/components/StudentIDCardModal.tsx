import React, { useState } from 'react';
import {
  X,
  CreditCard,
  QrCode,
  ShieldCheck,
  Printer,
  Sparkles,
  Wifi,
  CheckCircle2,
  Lock,
  Building2,
  Calendar,
  Share2
} from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';

interface StudentIDCardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StudentIDCardModal: React.FC<StudentIDCardModalProps> = ({ isOpen, onClose }) => {
  const { currentStudent, showToast } = useDashboard();
  const [activeSide, setActiveSide] = useState<'front' | 'back'>('front');

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleCopyVerification = () => {
    navigator.clipboard.writeText(`https://verify.kca.ac.ke/student/25-03339`);
    showToast('Encrypted Student Verification link copied!', 'success');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md print:p-0 print:bg-white animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col print:shadow-none print:border-none print:max-w-none">
        
        {/* Modal Top Bar */}
        <div className="bg-[#001D33] text-white px-5 py-3.5 flex items-center justify-between border-b border-white/10 print:hidden">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-400/20 text-amber-400 flex items-center justify-center">
              <CreditCard className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white tracking-tight">
                KCA University Smart Digital Student ID
              </h2>
              <p className="text-[11px] text-amber-300">
                NFC &amp; Biometric Clearance · Valid 2025–2027
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center bg-white/10 rounded-lg p-0.5 text-xs">
              <button
                onClick={() => setActiveSide('front')}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  activeSide === 'front' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-300 hover:text-white'
                }`}
              >
                Front
              </button>
              <button
                onClick={() => setActiveSide('back')}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  activeSide === 'back' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-300 hover:text-white'
                }`}
              >
                Back
              </button>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-white/10 text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Card Display Stage */}
        <div className="p-6 bg-slate-100/80 flex flex-col items-center justify-center">
          
          {/* THE SMART ID CARD */}
          <div className="relative w-full max-w-[390px] aspect-[1.586/1] rounded-2xl overflow-hidden shadow-xl border border-slate-700/20 bg-gradient-to-br from-[#002138] via-[#002B49] to-[#043E6B] text-white p-5 flex flex-col justify-between select-none">
            
            {/* Holographic Security Overlay / Ambient Glow */}
            <div className="absolute inset-0 bg-gradient-to-tr from-amber-400/10 via-transparent to-cyan-400/15 pointer-events-none" />
            <div className="absolute -right-12 -top-12 w-44 h-44 rounded-full bg-amber-400/10 blur-2xl pointer-events-none" />

            {activeSide === 'front' ? (
              <>
                {/* Front Header */}
                <div className="relative z-10 flex items-center justify-between border-b border-white/15 pb-2.5">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-amber-500 text-[#002138] flex items-center justify-center font-extrabold text-xs shadow-xs">
                      KCA
                    </div>
                    <div>
                      <h3 className="text-xs font-black tracking-wider uppercase text-white leading-tight">
                        KCA UNIVERSITY
                      </h3>
                      <p className="text-[9px] text-amber-300 font-medium tracking-wide">
                        STUDENT IDENTITY CARD
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 text-amber-400">
                    <Wifi className="w-4 h-4 rotate-90 opacity-90" />
                    <span className="text-[9px] font-mono font-bold tracking-widest uppercase">NFC</span>
                  </div>
                </div>

                {/* Front Body */}
                <div className="relative z-10 grid grid-cols-12 gap-3.5 items-center my-auto">
                  {/* Photo with holographic border */}
                  <div className="col-span-4 flex flex-col items-center">
                    <div className="relative w-22 h-26 rounded-xl overflow-hidden border-2 border-amber-400/80 shadow-md bg-slate-800">
                      {currentStudent.AvatarUrl ? (
                        <img
                          src={currentStudent.AvatarUrl}
                          alt={currentStudent.Name}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center font-bold text-2xl text-amber-400">
                          {currentStudent.Name.slice(0, 2)}
                        </div>
                      )}
                      <div className="absolute bottom-0 inset-x-0 bg-[#001D33]/90 py-0.5 text-center text-[8px] font-mono text-emerald-300 font-bold tracking-tight">
                        VERIFIED
                      </div>
                    </div>
                  </div>

                  {/* Student Details */}
                  <div className="col-span-8 space-y-1">
                    <div>
                      <span className="text-[9px] text-amber-300/80 uppercase font-bold tracking-wider block">
                        Full Name
                      </span>
                      <h4 className="text-sm font-extrabold text-white leading-tight">
                        {currentStudent.Name}
                      </h4>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-0.5">
                      <div>
                        <span className="text-[8px] text-slate-300 uppercase font-semibold block">
                          Reg No
                        </span>
                        <span className="font-mono text-xs font-black text-amber-300">
                          {currentStudent.RegNumber}
                        </span>
                      </div>
                      <div>
                        <span className="text-[8px] text-slate-300 uppercase font-semibold block">
                          Cohort
                        </span>
                        <span className="text-[11px] font-bold text-white">
                          2025/2026
                        </span>
                      </div>
                    </div>

                    <div className="pt-0.5">
                      <span className="text-[8px] text-slate-300 uppercase font-semibold block">
                        Academic Programme
                      </span>
                      <p className="text-[10px] font-semibold text-slate-100 leading-snug">
                        {currentStudent.Programme}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Front Footer */}
                <div className="relative z-10 flex items-end justify-between border-t border-white/15 pt-2 text-[9px] font-mono">
                  <div className="space-y-0.5">
                    <span className="text-slate-300 text-[8px] block">DIRECTORATE OF ACADEMIC AFFAIRS</span>
                    <span className="text-amber-300 font-bold">EXPIRES: 31 DEC 2027</span>
                  </div>

                  {/* Micro Chip Graphic */}
                  <div className="flex items-center gap-1.5 bg-white/10 px-2 py-0.5 rounded border border-white/10">
                    <ShieldCheck className="w-3 h-3 text-emerald-400" />
                    <span className="text-[8px] font-bold tracking-wider text-emerald-300">ACTIVE CHIP</span>
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Back of Card */}
                <div className="relative z-10 flex flex-col justify-between h-full space-y-3">
                  
                  {/* Magnetic Strip */}
                  <div className="-mx-5 -mt-5 h-8 bg-slate-950 border-b border-slate-800" />

                  {/* Conditions & Signature */}
                  <div className="space-y-1.5 text-[8.5px] text-slate-200 leading-tight">
                    <p>
                      1. This card is the property of KCA University and must be produced upon demand by authorized campus officials.
                    </p>
                    <p>
                      2. If found, please return to KCA University Ruaraka Main Campus Security Office, P.O. Box 56808-00200 Nairobi.
                    </p>
                  </div>

                  {/* Barcode & Signature Strip */}
                  <div className="grid grid-cols-12 gap-2 items-center bg-slate-900/40 p-2 rounded-xl border border-white/10">
                    <div className="col-span-8 space-y-1">
                      {/* Stylized Barcode */}
                      <div className="h-7 w-full flex items-center gap-0.5 overflow-hidden">
                        {[4, 2, 6, 2, 8, 3, 2, 5, 2, 7, 3, 2, 4, 2, 6, 3, 5, 2, 8, 4, 3, 2, 6, 3, 4, 2, 5, 3, 7, 2, 4].map((h, i) => (
                          <div
                            key={i}
                            className="bg-white flex-1"
                            style={{ height: `${h * 10}%`, minWidth: '2px' }}
                          />
                        ))}
                      </div>
                      <div className="text-center font-mono text-[8px] text-slate-300 tracking-widest">
                        *25-03339-DBIT-KCAU*
                      </div>
                    </div>

                    {/* QR Code */}
                    <div className="col-span-4 flex justify-center">
                      <div className="w-13 h-13 bg-white p-1 rounded-lg shadow-sm flex items-center justify-center">
                        <QrCode className="w-11 h-11 text-slate-950" />
                      </div>
                    </div>
                  </div>

                  {/* Back Footer */}
                  <div className="flex items-center justify-between text-[8px] font-mono text-slate-300">
                    <span>TEL: +254 (020) 8070408</span>
                    <span>kca.ac.ke</span>
                  </div>
                </div>
              </>
            )}

          </div>

          {/* Quick Access Badges Under Card */}
          <div className="w-full max-w-[390px] mt-4 grid grid-cols-3 gap-2 text-center text-xs">
            <div className="p-2 rounded-xl bg-white border border-slate-200 shadow-2xs">
              <span className="text-[10px] text-slate-400 block font-medium">Main Gate</span>
              <span className="text-emerald-700 font-bold text-xs flex items-center justify-center gap-1 mt-0.5">
                <CheckCircle2 className="w-3 h-3" />
                Cleared
              </span>
            </div>
            <div className="p-2 rounded-xl bg-white border border-slate-200 shadow-2xs">
              <span className="text-[10px] text-slate-400 block font-medium">Library NFC</span>
              <span className="text-emerald-700 font-bold text-xs flex items-center justify-center gap-1 mt-0.5">
                <CheckCircle2 className="w-3 h-3" />
                Active
              </span>
            </div>
            <div className="p-2 rounded-xl bg-white border border-slate-200 shadow-2xs">
              <span className="text-[10px] text-slate-400 block font-medium">Computer Labs</span>
              <span className="text-emerald-700 font-bold text-xs flex items-center justify-center gap-1 mt-0.5">
                <CheckCircle2 className="w-3 h-3" />
                24/7 Access
              </span>
            </div>
          </div>

        </div>

        {/* Modal Actions */}
        <div className="p-4 bg-white border-t border-slate-200 flex items-center justify-between gap-2 print:hidden">
          <button
            onClick={handleCopyVerification}
            className="px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium text-xs flex items-center gap-1.5 transition-colors"
          >
            <Share2 className="w-3.5 h-3.5 text-slate-500" />
            <span>Copy Verification URL</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print ID Card</span>
            </button>
            <button
              onClick={onClose}
              className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors"
            >
              Close
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
