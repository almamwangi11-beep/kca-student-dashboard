import React, { useState } from 'react';
import {
  X,
  Download,
  Copy,
  Check,
  ExternalLink,
  Code2,
  FolderArchive,
  Terminal,
  Globe,
  GitBranch,
  Sparkles
} from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';

interface VSCodeExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VSCodeExportModal: React.FC<VSCodeExportModalProps> = ({ isOpen, onClose }) => {
  const { showToast } = useDashboard();
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedGitCmd, setCopiedGitCmd] = useState(false);

  if (!isOpen) return null;

  const liveAppUrl = 'https://ais-pre-ueg7bnitkg3dkpb3lwahqq-52234824752.europe-west1.run.app';
  const gitCommands = `git remote add origin https://github.com/YOUR_USERNAME/kca-student-dashboard.git\ngit branch -M main\ngit push -u origin main`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(liveAppUrl);
    setCopiedLink(true);
    showToast('Live link copied to clipboard!', 'success');
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleCopyGitCmd = () => {
    navigator.clipboard.writeText(gitCommands);
    setCopiedGitCmd(true);
    showToast('GitHub terminal commands copied!', 'success');
    setTimeout(() => setCopiedGitCmd(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150 max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="bg-[#002B49] text-white px-5 py-4 flex items-center justify-between border-b border-[#001f35]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-white tracking-tight">
                Export &amp; Open in Visual Studio Code
              </h2>
              <p className="text-[11px] text-amber-300">
                Download all source files, run locally in VS Code, or share the live link
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-white/10 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-6 text-xs flex-1">
          
          {/* Method 1: Immediate Direct ZIP Download (Easiest & Fastest) */}
          <div className="p-4 rounded-xl border-2 border-emerald-500/40 bg-emerald-50/40 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-xs">
                  1
                </span>
                <h3 className="font-bold text-slate-900 text-sm">
                  Download All Code as a ZIP File (Instant)
                </h3>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                No Git Required
              </span>
            </div>

            <p className="text-slate-600 leading-relaxed text-xs">
              Click the button below to download <strong>kca-student-dashboard.zip</strong> directly to your computer. It includes all React components, TypeScript files, styling, and database seed records.
            </p>

            <a
              href="/kca-student-dashboard.zip"
              download="kca-student-dashboard.zip"
              onClick={() => showToast('Downloading project ZIP file...', 'success')}
              className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-sm hover:shadow-md active:scale-[0.99]"
            >
              <Download className="w-4 h-4" />
              <span>Download kca-student-dashboard.zip (1.9 MB)</span>
            </a>
          </div>

          {/* How to Open in VS Code (3 Simple Steps) */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
            <div className="flex items-center gap-2">
              <FolderArchive className="w-4 h-4 text-[#002B49]" />
              <h3 className="font-bold text-slate-900 text-sm">
                How to Open in VS Code (After Downloading)
              </h3>
            </div>

            <ol className="space-y-2.5 text-slate-700 list-decimal list-inside pl-1">
              <li className="leading-snug">
                <strong>Extract the ZIP:</strong> Find <code>kca-student-dashboard.zip</code> in your Downloads folder, right-click it, and choose <strong>"Extract All"</strong>.
              </li>
              <li className="leading-snug">
                <strong>Open in VS Code:</strong> Launch VS Code, click <strong>File → Open Folder...</strong>, and choose the extracted <code>kca-student-dashboard</code> folder.
              </li>
              <li className="leading-snug">
                <strong>Run the App:</strong> Open the VS Code terminal (<kbd className="px-1.5 py-0.5 bg-slate-200 rounded font-mono text-[10px]">Ctrl</kbd> + <kbd className="px-1.5 py-0.5 bg-slate-200 rounded font-mono text-[10px]">`</kbd>) and type:
                <div className="mt-1.5 bg-slate-900 text-slate-100 p-2.5 rounded-lg font-mono text-[11px] space-y-1">
                  <div>npm install</div>
                  <div>npm run dev</div>
                </div>
              </li>
            </ol>
          </div>

          {/* Live Link without AI Studio */}
          <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/50 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-blue-700" />
                <h3 className="font-bold text-slate-900 text-sm">
                  Live Web Link (Works anywhere without AI Studio)
                </h3>
              </div>
              <span className="text-[10px] text-blue-700 font-bold bg-blue-100 px-2 py-0.5 rounded">
                Live 24/7
              </span>
            </div>

            <p className="text-slate-600 text-xs">
              Anyone can open this link directly in any browser on a computer or smartphone:
            </p>

            <div className="flex items-center gap-2 bg-white p-2 rounded-lg border border-blue-200">
              <input
                type="text"
                readOnly
                value={liveAppUrl}
                className="w-full text-xs font-mono text-slate-800 bg-transparent outline-none truncate"
              />
              <button
                onClick={handleCopyLink}
                className="px-2.5 py-1 bg-[#002B49] text-white rounded-md text-xs font-semibold flex items-center gap-1 shrink-0 hover:bg-[#003c66] transition-colors"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedLink ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>

          {/* Push to GitHub */}
          <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <GitBranch className="w-4 h-4 text-slate-800" />
                <h3 className="font-bold text-slate-900 text-sm">
                  Publish to GitHub Repository
                </h3>
              </div>
              <a
                href="https://github.com/new"
                target="_blank"
                rel="noreferrer"
                className="text-[11px] font-bold text-blue-600 hover:underline flex items-center gap-1"
              >
                <span>Create repo on GitHub</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <p className="text-slate-600 text-xs">
              Create an empty repository on GitHub named <code>kca-student-dashboard</code>, then run these commands:
            </p>

            <div className="relative">
              <pre className="bg-slate-900 text-slate-100 p-3 rounded-xl font-mono text-[11px] overflow-x-auto">
                {gitCommands}
              </pre>
              <button
                onClick={handleCopyGitCmd}
                className="absolute top-2.5 right-2.5 px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] font-medium flex items-center gap-1 transition-colors border border-slate-700"
              >
                {copiedGitCmd ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedGitCmd ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>KCA University DBIT Programme Repository</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
