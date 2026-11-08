import React, { useState } from 'react';
import { useDashboard } from '../context/DashboardContext';
import {
  BookOpen,
  X,
  Search,
  ExternalLink,
  Download,
  FileText,
  Sparkles,
  Bookmark,
  CheckCircle2
} from 'lucide-react';

interface ELibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ResourceItem {
  id: string;
  title: string;
  author: string;
  unitCode: string;
  category: 'Core Textbook' | 'Lecture Notes' | 'IEEE Paper' | 'Past Exam Paper';
  format: 'PDF' | 'ePub' | 'Database Access';
  fileSize: string;
  pages: number;
}

const RESOURCES: ResourceItem[] = [
  {
    id: 'res-1',
    title: 'C++ Primer: Data Structures, Pointers & Algorithms (5th Edition)',
    author: 'Stanley B. Lippman, Josée Lajoie',
    unitCode: 'DBIT 1102',
    category: 'Core Textbook',
    format: 'PDF',
    fileSize: '14.2 MB',
    pages: 976
  },
  {
    id: 'res-2',
    title: 'Modern Database Management & Relational Theory (3NF Decompositions)',
    author: 'Jeffrey A. Hoffer, Ramesh Venkataraman',
    unitCode: 'DBIT 1103',
    category: 'Core Textbook',
    format: 'PDF',
    fileSize: '22.8 MB',
    pages: 624
  },
  {
    id: 'res-3',
    title: 'Web Technologies: TCP/IP to Three-Tier Enterprise Architectures',
    author: 'Uttam K. Roy',
    unitCode: 'DBIT 1105',
    category: 'Core Textbook',
    format: 'PDF',
    fileSize: '18.5 MB',
    pages: 740
  },
  {
    id: 'res-4',
    title: 'Business Statistics & Quantitative Analysis for Information Systems',
    author: 'David R. Anderson, Dennis J. Sweeney',
    unitCode: 'DBIT 1104',
    category: 'Core Textbook',
    format: 'PDF',
    fileSize: '16.1 MB',
    pages: 832
  },
  {
    id: 'res-5',
    title: 'Enterprise Information Systems & Digital Transformation in East Africa',
    author: 'KCA School of Technology Faculty Research',
    unitCode: 'DBIT 1101',
    category: 'IEEE Paper',
    format: 'PDF',
    fileSize: '4.7 MB',
    pages: 28
  },
  {
    id: 'res-6',
    title: 'DBIT 1103: Relational Database Systems Past Papers & Model Answers (2023-2025)',
    author: 'KCA Directorate of Examinations',
    unitCode: 'DBIT 1103',
    category: 'Past Exam Paper',
    format: 'PDF',
    fileSize: '6.3 MB',
    pages: 45
  }
];

export const ELibraryModal: React.FC<ELibraryModalProps> = ({ isOpen, onClose }) => {
  const { showToast } = useDashboard();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  if (!isOpen) return null;

  const filtered = RESOURCES.filter(r => {
    if (selectedCategory !== 'All' && r.category !== selectedCategory) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        r.title.toLowerCase().includes(q) ||
        r.author.toLowerCase().includes(q) ||
        r.unitCode.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleDownload = (item: ResourceItem) => {
    showToast(`Downloading "${item.title.slice(0, 32)}..." (${item.fileSize})`, 'success');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150 max-h-[88vh] flex flex-col">
        
        {/* Header */}
        <div className="bg-[#002B49] text-white px-5 py-4 flex items-center justify-between border-b border-[#001f35]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white tracking-tight">
                KCA University Digital Library (e-Resources)
              </h2>
              <p className="text-[11px] text-amber-300">
                School of Technology e-Book Repository &amp; IEEE / ACM Access
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

        {/* Search and Category Filters */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 space-y-3">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by title, author, or course code (e.g. DBIT 1102)..."
              className="w-full pl-8 pr-3 py-2 text-xs rounded-lg border border-slate-200 bg-white focus:outline-hidden focus:ring-2 focus:ring-[#002B49]"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto text-xs pb-1">
            {['All', 'Core Textbook', 'Past Exam Paper', 'IEEE Paper'].map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 rounded-md whitespace-nowrap transition-colors ${
                  selectedCategory === cat
                    ? 'bg-[#002B49] text-white font-bold'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Resources List */}
        <div className="p-4 overflow-y-auto space-y-3 flex-1 text-xs">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-slate-400">
              No digital resources found matching your query.
            </div>
          ) : (
            filtered.map(item => (
              <div
                key={item.id}
                className="p-3.5 rounded-xl border border-slate-200 hover:border-slate-300 hover:shadow-xs transition-all bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-[10px] font-bold px-1.5 py-0.2 rounded bg-[#002B49] text-white">
                      {item.unitCode}
                    </span>
                    <span className="text-[10px] font-semibold text-amber-800 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200">
                      {item.category}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {item.fileSize} · {item.pages} pages
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-xs sm:text-sm leading-snug">
                    {item.title}
                  </h3>

                  <p className="text-[11px] text-slate-500">
                    Author(s): {item.author}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  <button
                    onClick={() => handleDownload(item)}
                    className="px-3 py-1.5 rounded-lg bg-[#002B49] hover:bg-[#00385F] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>KCA Institutional IP Access Active</span>
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
