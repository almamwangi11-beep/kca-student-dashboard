import React, { useState } from 'react';
import { useDashboard } from '../context/DashboardContext';
import { AssignmentWithContext, UrgencyCategory } from '../types/database';
import {
  CheckSquare,
  Square,
  Clock,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Search,
  Filter,
  FileText,
  Download,
  Upload,
  Sparkles,
  Info,
  X,
  ExternalLink
} from 'lucide-react';

interface AssignmentHubProps {
  filterUnitCode?: string | null;
  onClearUnitFilter?: () => void;
}

export const AssignmentHub: React.FC<AssignmentHubProps> = ({
  filterUnitCode,
  onClearUnitFilter
}) => {
  const {
    assignmentsWithContext,
    toggleSubmission,
    currentStudent,
    units,
    simulatedDate,
    showToast
  } = useDashboard();

  const [activeFilterTab, setActiveFilterTab] = useState<'all' | 'due_today' | 'overdue' | 'upcoming' | 'submitted'>('all');
  const [selectedUnit, setSelectedUnit] = useState<string>(filterUnitCode || 'all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeModalAssignment, setActiveModalAssignment] = useState<AssignmentWithContext | null>(null);
  const [submissionNote, setSubmissionNote] = useState<string>('');
  const [uploadFileName, setUploadFileName] = useState<string>('');

  const openAssignmentModal = (item: AssignmentWithContext) => {
    setActiveModalAssignment(item);
    setSubmissionNote(item.submission?.StudentNotes || '');
    setUploadFileName(item.submission?.FileName || '');
  };

  // Update selectedUnit if parent prop changes
  React.useEffect(() => {
    if (filterUnitCode) {
      setSelectedUnit(filterUnitCode);
    }
  }, [filterUnitCode]);

  // Counts for tabs
  const overdueCount = assignmentsWithContext.filter(a => a.urgency === 'Overdue' && !a.isSubmitted).length;
  const dueTodayCount = assignmentsWithContext.filter(a => a.urgency === 'Due Today' && !a.isSubmitted).length;
  const upcomingCount = assignmentsWithContext.filter(a => a.urgency === 'Upcoming' && !a.isSubmitted).length;
  const submittedCount = assignmentsWithContext.filter(a => a.isSubmitted).length;

  // Filtered list
  const filteredAssignments = assignmentsWithContext.filter(item => {
    // Tab filter
    if (activeFilterTab === 'due_today' && (item.urgency !== 'Due Today' || item.isSubmitted)) return false;
    if (activeFilterTab === 'overdue' && (item.urgency !== 'Overdue' || item.isSubmitted)) return false;
    if (activeFilterTab === 'upcoming' && (item.urgency !== 'Upcoming' || item.isSubmitted)) return false;
    if (activeFilterTab === 'submitted' && !item.isSubmitted) return false;

    // Unit filter
    if (selectedUnit !== 'all' && item.UnitCode !== selectedUnit) return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = item.Title.toLowerCase().includes(q);
      const matchUnit = item.UnitCode.toLowerCase().includes(q);
      const matchDesc = item.Description.toLowerCase().includes(q);
      if (!matchTitle && !matchUnit && !matchDesc) return false;
    }

    return true;
  });

  const getUrgencyDisplay = (item: AssignmentWithContext) => {
    if (item.isSubmitted) {
      return (
        <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
          <CheckCircle2 className="w-3.5 h-3.5" />
          Submitted
        </span>
      );
    }

    if (item.urgency === 'Overdue') {
      return (
        <span className="inline-flex items-center gap-1 text-xs font-bold text-red-700 bg-red-50 px-2.5 py-0.5 rounded border border-red-200 animate-pulse">
          <AlertTriangle className="w-3.5 h-3.5" />
          Overdue
        </span>
      );
    }

    if (item.urgency === 'Due Today') {
      return (
        <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded border border-amber-300">
          <Clock className="w-3.5 h-3.5 text-amber-600" />
          Due Today
        </span>
      );
    }

    return (
      <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
        <Calendar className="w-3 h-3 text-slate-400" />
        Upcoming
      </span>
    );
  };

  return (
    <div className="space-y-4">
      {/* Hub Header & Status Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              Centralized Assignment Hub
            </h2>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
              Aggregated Course Feed
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Consolidated deadline tracker for all enrolled units. Click the checkbox to record task completion.
          </p>
        </div>

        {/* Quick summary stats */}
        <div className="flex items-center gap-2 flex-wrap text-xs">
          {overdueCount > 0 && (
            <span className="px-2.5 py-1 rounded bg-red-100 text-red-800 font-bold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-red-600" />
              {overdueCount} Overdue
            </span>
          )}
          {dueTodayCount > 0 && (
            <span className="px-2.5 py-1 rounded bg-amber-100 text-amber-900 font-bold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-amber-600" />
              {dueTodayCount} Due Today
            </span>
          )}
          <span className="px-2.5 py-1 rounded bg-emerald-100 text-emerald-800 font-medium">
            {submittedCount}/{assignmentsWithContext.length} Submitted
          </span>
        </div>
      </div>

      {/* Filter Tabs & Search Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
        
        {/* Urgency Filter Tabs */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg overflow-x-auto">
          <button
            onClick={() => setActiveFilterTab('all')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
              activeFilterTab === 'all'
                ? 'bg-white text-slate-900 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Tasks ({assignmentsWithContext.length})
          </button>
          
          <button
            onClick={() => setActiveFilterTab('due_today')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeFilterTab === 'due_today'
                ? 'bg-white text-amber-900 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>Due Today</span>
            {dueTodayCount > 0 && (
              <span className="px-1.5 py-0.2 rounded bg-amber-200 text-amber-900 font-bold text-[10px] tabular-nums">
                {dueTodayCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveFilterTab('overdue')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeFilterTab === 'overdue'
                ? 'bg-white text-red-900 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>Overdue</span>
            {overdueCount > 0 && (
              <span className="px-1.5 py-0.2 rounded bg-red-200 text-red-900 font-bold text-[10px] tabular-nums">
                {overdueCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveFilterTab('upcoming')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
              activeFilterTab === 'upcoming'
                ? 'bg-white text-slate-900 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Upcoming ({upcomingCount})
          </button>

          <button
            onClick={() => setActiveFilterTab('submitted')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
              activeFilterTab === 'submitted'
                ? 'bg-white text-emerald-800 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Submitted ({submittedCount})
          </button>
        </div>

        {/* Search & Course Dropdown */}
        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          <div className="relative flex-1 sm:w-56">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search assignments..."
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-white focus:outline-hidden focus:ring-1 focus:ring-[#002B49]"
            />
          </div>

          <div className="relative">
            <select
              value={selectedUnit}
              onChange={e => {
                setSelectedUnit(e.target.value);
                if (e.target.value === 'all' && onClearUnitFilter) {
                  onClearUnitFilter();
                }
              }}
              className="text-xs rounded-lg border border-slate-200 py-1.5 px-3 bg-white text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-[#002B49]"
            >
              <option value="all">All Units (5)</option>
              {units.map(u => (
                <option key={u.UnitCode} value={u.UnitCode}>
                  {u.UnitCode} - {u.UnitName.slice(0, 20)}...
                </option>
              ))}
            </select>
          </div>

          {selectedUnit !== 'all' && onClearUnitFilter && (
            <button
              onClick={() => {
                setSelectedUnit('all');
                onClearUnitFilter();
              }}
              className="p-1 text-slate-400 hover:text-slate-700"
              title="Clear unit filter"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

      </div>

      {/* Assignment List Feed */}
      <div className="space-y-3">
        {filteredAssignments.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-slate-500">
            <FileText className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-700">No assignments match this filter.</p>
            <p className="text-xs text-slate-400 mt-1">Try resetting the status tab or search query.</p>
          </div>
        ) : (
          filteredAssignments.map(item => {
            const isSub = item.isSubmitted;

            return (
              <div
                key={item.AssignmentID}
                className={`bg-white rounded-xl border transition-all p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                  item.urgency === 'Overdue' && !isSub
                    ? 'border-red-300 bg-red-50/20 shadow-xs'
                    : item.urgency === 'Due Today' && !isSub
                    ? 'border-amber-300 bg-amber-50/20 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 shadow-xs'
                }`}
              >
                {/* Left Section: Checkbox & Assignment Info */}
                <div className="flex items-start gap-3.5 flex-1">
                  
                  {/* Interactive Submission Checkbox (update_submission.php) */}
                  <button
                    onClick={() => toggleSubmission(item.AssignmentID)}
                    className="mt-0.5 text-slate-400 hover:text-slate-700 transition-colors shrink-0"
                    title={isSub ? 'Mark as Unsubmitted' : 'Click to Mark as Submitted'}
                  >
                    {isSub ? (
                      <CheckSquare className="w-5 h-5 text-emerald-600 fill-emerald-50" />
                    ) : (
                      <Square className="w-5 h-5 text-slate-400 hover:text-slate-600" />
                    )}
                  </button>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className="font-mono text-xs font-bold px-2 py-0.5 rounded text-white"
                        style={{ backgroundColor: item.unit.Color }}
                      >
                        {item.UnitCode}
                      </span>
                      <span className="text-xs text-slate-400 font-medium">
                        {item.unit.UnitName}
                      </span>
                      <span className="text-slate-300">·</span>
                      {getUrgencyDisplay(item)}
                    </div>

                    <h3
                      onClick={() => openAssignmentModal(item)}
                      className={`text-sm sm:text-base font-bold cursor-pointer hover:text-[#002B49] transition-colors ${
                        isSub ? 'text-slate-600 line-through' : 'text-slate-900'
                      }`}
                    >
                      {item.Title}
                    </h3>

                    <p className="text-xs text-slate-500 line-clamp-1">
                      {item.Description}
                    </p>

                    <div className="flex items-center gap-4 text-xs text-slate-500 pt-1 flex-wrap font-mono">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>Deadline: <strong className="text-slate-800">{item.DueDate}</strong></span>
                      </div>
                      <div>
                        Weight: <strong className="text-slate-800">{item.WeightPercentage || 15}%</strong> ({item.MaxScore} pts)
                      </div>
                      {item.submission?.SubmittedDate && (
                        <div className="text-emerald-700 font-sans font-medium">
                          Submitted on {item.submission.SubmittedDate}
                        </div>
                      )}
                    </div>
                  </div>

                </div>

                {/* Right Section: View & Action buttons */}
                <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                  <button
                    onClick={() => openAssignmentModal(item)}
                    className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition-colors whitespace-nowrap flex items-center gap-1.5"
                  >
                    <Info className="w-3.5 h-3.5" />
                    <span>View & Submit</span>
                  </button>

                  <button
                    onClick={() => toggleSubmission(item.AssignmentID)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap ${
                      isSub
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
                        : 'bg-[#002B49] text-white hover:bg-[#00385F]'
                    }`}
                  >
                    {isSub ? 'Mark Unsubmitted' : 'Quick Submit'}
                  </button>
                </div>

              </div>
            );
          })
        )}
      </div>

      {/* Assignment Details & Submission Modal */}
      {activeModalAssignment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            
            {/* Modal Header */}
            <div
              className="p-5 text-white flex items-start justify-between"
              style={{ backgroundColor: activeModalAssignment.unit.Color }}
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-black/20 text-white">
                    {activeModalAssignment.UnitCode}
                  </span>
                  <span className="text-xs opacity-90">
                    {activeModalAssignment.unit.UnitName}
                  </span>
                </div>
                <h3 className="text-lg font-bold mt-1 text-white">
                  {activeModalAssignment.Title}
                </h3>
                <div className="text-xs opacity-90 mt-1 flex items-center gap-3">
                  <span>Due: {activeModalAssignment.DueDate}</span>
                  <span>·</span>
                  <span>Max Score: {activeModalAssignment.MaxScore} pts</span>
                </div>
              </div>

              <button
                onClick={() => setActiveModalAssignment(null)}
                className="p-1 rounded-lg hover:bg-white/20 text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4 text-xs text-slate-700 max-h-[75vh] overflow-y-auto">
              
              <div>
                <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] mb-1">
                  Task Instructions & Description
                </h4>
                <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  {activeModalAssignment.Description}
                </p>
              </div>

              {activeModalAssignment.AttachmentName && (
                <div>
                  <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] mb-1.5">
                    Coursework Attachment
                  </h4>
                  <div className="flex items-center justify-between p-3 rounded-lg border border-slate-200 bg-white">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-amber-600" />
                      <span className="font-mono text-slate-800 font-medium">
                        {activeModalAssignment.AttachmentName}
                      </span>
                    </div>
                    <button
                      onClick={() => showToast(`Downloading ${activeModalAssignment.AttachmentName} from KCA Courseware repository...`, 'info')}
                      className="flex items-center gap-1 text-[#002B49] font-semibold hover:underline"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Submission State in Database */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/80 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
                    Submission &amp; Evaluation Status
                  </h4>
                  {getUrgencyDisplay(activeModalAssignment)}
                </div>

                <div className="grid grid-cols-2 gap-3 text-[11px] font-mono">
                  <div>
                    <span className="text-slate-400 block">Student:</span>
                    <span className="font-semibold text-slate-800">{currentStudent.Name} ({currentStudent.RegNumber})</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Submission Status:</span>
                    <span className={activeModalAssignment.isSubmitted ? 'text-emerald-700 font-bold' : 'text-amber-700 font-bold'}>
                      {activeModalAssignment.isSubmitted ? 'Submitted' : 'Pending Submission'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Logged Timestamp:</span>
                    <span className="text-slate-800">
                      {activeModalAssignment.submission?.SubmittedDate || 'Not yet submitted'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Attached File:</span>
                    <span className="text-slate-800 truncate block">
                      {activeModalAssignment.submission?.FileName || uploadFileName || 'No file attached'}
                    </span>
                  </div>
                </div>

                {activeModalAssignment.submission?.Feedback && (
                  <div className="mt-2 pt-2 border-t border-slate-200 text-xs">
                    <span className="text-slate-500 font-medium">Lecturer Feedback:</span>
                    <p className="text-slate-800 italic mt-0.5">&quot;{activeModalAssignment.submission.Feedback}&quot;</p>
                  </div>
                )}
              </div>

              {/* Upload Assignment Solution */}
              <div>
                <label className="block font-bold text-slate-900 uppercase tracking-wider text-[11px] mb-1.5">
                  Upload Assignment File (PDF, ZIP, SQL, DOCX)
                </label>
                <div className="border border-dashed border-slate-300 rounded-xl p-3 text-center bg-slate-50 hover:bg-slate-100 transition-colors">
                  <input
                    type="file"
                    id="assignment-file-upload"
                    className="hidden"
                    onChange={e => {
                      if (e.target.files && e.target.files[0]) {
                        const file = e.target.files[0];
                        setUploadFileName(file.name);
                        showToast(`File selected: ${file.name}`, 'info');
                      }
                    }}
                  />
                  <label
                    htmlFor="assignment-file-upload"
                    className="cursor-pointer flex flex-col items-center justify-center gap-1"
                  >
                    <Upload className="w-5 h-5 text-slate-500" />
                    <span className="font-semibold text-[#002B49] text-xs">
                      {uploadFileName ? `Selected: ${uploadFileName}` : 'Click to choose coursework solution file'}
                    </span>
                    <span className="text-[10px] text-slate-400">Max size 25MB · PDF, ZIP, SQL, DOCX</span>
                  </label>
                </div>
              </div>

              {/* Submission Notes / Comments */}
              <div>
                <label className="block font-bold text-slate-900 uppercase tracking-wider text-[11px] mb-1">
                  Submission Remarks or Repository Link
                </label>
                <textarea
                  rows={2}
                  value={submissionNote}
                  onChange={e => setSubmissionNote(e.target.value)}
                  placeholder="Optional notes for lecturer (e.g. GitHub repository link or execution notes)..."
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-200 bg-white focus:outline-hidden focus:ring-1 focus:ring-[#002B49]"
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                <button
                  onClick={() => setActiveModalAssignment(null)}
                  className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold transition-colors"
                >
                  Close
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      const finalFile = uploadFileName || activeModalAssignment.submission?.FileName || `${currentStudent.Name.replace(/\s+/g, '_')}_${activeModalAssignment.UnitCode.replace(/\s+/g, '')}_Solution.pdf`;
                      toggleSubmission(activeModalAssignment.AssignmentID, submissionNote, finalFile);
                      setActiveModalAssignment(null);
                    }}
                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors shadow-sm flex items-center gap-1.5 ${
                      activeModalAssignment.isSubmitted
                        ? 'bg-amber-600 hover:bg-amber-700 text-white'
                        : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    }`}
                  >
                    <CheckSquare className="w-4 h-4" />
                    <span>
                      {activeModalAssignment.isSubmitted ? 'Unmark Submission' : 'Confirm Submission'}
                    </span>
                  </button>
                </div>
              </div>

            </div>

          </div>
        </div>
      )}
    </div>
  );
};
