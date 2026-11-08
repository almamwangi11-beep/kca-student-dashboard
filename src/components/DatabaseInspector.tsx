import React, { useState } from 'react';
import { useDashboard } from '../context/DashboardContext';
import {
  Database,
  Table,
  Key,
  Layers,
  Download,
  Search,
  Code,
  CheckCircle2,
  Share2,
  FileSpreadsheet,
  Info
} from 'lucide-react';

type TableKey =
  | 'STUDENT'
  | 'LECTURER'
  | 'ROOM'
  | 'UNIT'
  | 'ENROLLMENT'
  | 'ASSIGNMENT'
  | 'SUBMISSION'
  | 'TIMETABLE'
  | 'NOTIFICATION'
  | 'ADMINISTRATOR';

interface TableMeta {
  name: TableKey;
  description: string;
  primaryKey: string;
  foreignKeys: string[];
}

const TABLE_METAS: TableMeta[] = [
  {
    name: 'STUDENT',
    description: 'Stores student credentials, enrollment status, and profile records.',
    primaryKey: 'StudentID',
    foreignKeys: []
  },
  {
    name: 'LECTURER',
    description: 'Stores faculty teaching staff and departmental contacts.',
    primaryKey: 'LecturerID',
    foreignKeys: []
  },
  {
    name: 'ROOM',
    description: 'Stores lecture theaters and specialized computing laboratory venues.',
    primaryKey: 'RoomID',
    foreignKeys: []
  },
  {
    name: 'UNIT',
    description: 'Defines academic courses linked to assigned lecturer and primary room.',
    primaryKey: 'UnitCode',
    foreignKeys: ['LecturerID -> LECTURER', 'RoomID -> ROOM']
  },
  {
    name: 'ENROLLMENT',
    description: 'Resolves M:N relationship between student cohort and enrolled course units.',
    primaryKey: 'EnrollmentID',
    foreignKeys: ['StudentID -> STUDENT', 'UnitCode -> UNIT']
  },
  {
    name: 'ASSIGNMENT',
    description: 'Stores course task briefs, weightings, and submission due dates.',
    primaryKey: 'AssignmentID',
    foreignKeys: ['UnitCode -> UNIT']
  },
  {
    name: 'SUBMISSION',
    description: 'Tracks student completion flags, submitted timestamps, and grading feedback.',
    primaryKey: 'SubmissionID',
    foreignKeys: ['AssignmentID -> ASSIGNMENT', 'StudentID -> STUDENT']
  },
  {
    name: 'TIMETABLE',
    description: 'Stores weekly lecture schedule slots, room assignments, and session types.',
    primaryKey: 'TimetableID',
    foreignKeys: ['UnitCode -> UNIT', 'RoomID -> ROOM']
  },
  {
    name: 'NOTIFICATION',
    description: 'Audit log of automated PHPMailer reminder emails (3-day, 1-day, 3-hour).',
    primaryKey: 'NotificationID',
    foreignKeys: ['StudentID -> STUDENT', 'AssignmentID -> ASSIGNMENT']
  },
  {
    name: 'ADMINISTRATOR',
    description: 'Credentials and permissions for department administrators and supervisors.',
    primaryKey: 'AdminID',
    foreignKeys: []
  }
];

export const DatabaseInspector: React.FC = () => {
  const {
    students,
    lecturers,
    rooms,
    units,
    enrollments,
    assignments,
    submissions,
    timetable,
    notifications,
    administrators
  } = useDashboard();

  const [activeTable, setActiveTable] = useState<TableKey>('STUDENT');
  const [activeViewMode, setActiveViewMode] = useState<'records' | 'schema' | 'erd'>('records');
  const [searchQuery, setSearchQuery] = useState('');

  // Map table key to array of data
  const getTableData = (name: TableKey): any[] => {
    switch (name) {
      case 'STUDENT': return students;
      case 'LECTURER': return lecturers;
      case 'ROOM': return rooms;
      case 'UNIT': return units;
      case 'ENROLLMENT': return enrollments;
      case 'ASSIGNMENT': return assignments;
      case 'SUBMISSION': return submissions;
      case 'TIMETABLE': return timetable;
      case 'NOTIFICATION': return notifications;
      case 'ADMINISTRATOR': return administrators;
    }
  };

  const currentMeta = TABLE_METAS.find(t => t.name === activeTable)!;
  const rawRecords = getTableData(activeTable);

  const filteredRecords = rawRecords.filter(row => {
    if (!searchQuery.trim()) return true;
    return JSON.stringify(row).toLowerCase().includes(searchQuery.toLowerCase());
  });

  const columns = rawRecords.length > 0 ? Object.keys(rawRecords[0]) : [];

  const handleExportSQL = () => {
    let sql = `-- KCA University Student Academic Dashboard (student_academic_dashboard)\n-- Export generated on ${new Date().toISOString()}\n\n`;
    TABLE_METAS.forEach(meta => {
      const rows = getTableData(meta.name);
      sql += `-- --------------------------------------------------------\n-- Table structure & data for table \`${meta.name}\`\n-- --------------------------------------------------------\n`;
      rows.forEach(r => {
        const keys = Object.keys(r).join(', ');
        const vals = Object.values(r)
          .map(v => (v === null ? 'NULL' : typeof v === 'string' ? `'${v.replace(/'/g, "''")}'` : v))
          .join(', ');
        sql += `INSERT INTO \`${meta.name}\` (${keys}) VALUES (${vals});\n`;
      });
      sql += '\n';
    });

    const blob = new Blob([sql], { type: 'text/sql;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'student_academic_dashboard_kca.sql');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4">
      {/* Module Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              MySQL Data Tier · 10 InnoDB Tables
            </h2>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-mono">
              student_academic_dashboard
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Interactive relational database browser implementing Alma Amani Mwangi's System Design Specification (SDS).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportSQL}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#002B49] hover:bg-[#00385F] text-white text-xs font-semibold shadow-xs transition-colors"
            title="Download SQL dump of all 10 InnoDB tables"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export SQL Dump</span>
          </button>
        </div>
      </div>

      {/* View Mode Switcher (Records / Schema / ERD) */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        
        {/* Table selector buttons */}
        <div className="flex items-center gap-1 overflow-x-auto p-1 bg-slate-100 rounded-lg max-w-full">
          {TABLE_METAS.map(meta => {
            const count = getTableData(meta.name).length;
            const isSelected = activeTable === meta.name;
            return (
              <button
                key={meta.name}
                onClick={() => setActiveTable(meta.name)}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-white text-[#002B49] shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>{meta.name}</span>
                <span className="text-[10px] font-mono text-slate-400">({count})</span>
              </button>
            );
          })}
        </div>

        {/* View mode toggle */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg text-xs">
          <button
            onClick={() => setActiveViewMode('records')}
            className={`px-3 py-1 rounded-md font-medium transition-colors ${
              activeViewMode === 'records' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600'
            }`}
          >
            Live Records
          </button>
          <button
            onClick={() => setActiveViewMode('schema')}
            className={`px-3 py-1 rounded-md font-medium transition-colors ${
              activeViewMode === 'schema' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600'
            }`}
          >
            Schema Spec
          </button>
          <button
            onClick={() => setActiveViewMode('erd')}
            className={`px-3 py-1 rounded-md font-medium transition-colors ${
              activeViewMode === 'erd' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600'
            }`}
          >
            PlantUML ERD
          </button>
        </div>
      </div>

      {/* Table Information Strip */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono font-bold text-sm text-[#002B49]">
              `{currentMeta.name}`
            </span>
            <span className="text-slate-400">·</span>
            <span className="text-slate-600">{currentMeta.description}</span>
          </div>
          <div className="flex items-center gap-3 text-[11px] text-slate-500 font-mono mt-1 flex-wrap">
            <span>Primary Key: <strong className="text-slate-800">{currentMeta.primaryKey}</strong></span>
            {currentMeta.foreignKeys.length > 0 && (
              <>
                <span>·</span>
                <span>Foreign Keys: <strong className="text-amber-700">{currentMeta.foreignKeys.join(', ')}</strong></span>
              </>
            )}
            <span>·</span>
            <span>Total Rows: <strong className="text-slate-800">{rawRecords.length}</strong></span>
          </div>
        </div>

        {activeViewMode === 'records' && (
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder={`Filter in ${activeTable}...`}
              className="w-full pl-8 pr-3 py-1 text-xs rounded-lg border border-slate-200 bg-white"
            />
          </div>
        )}
      </div>

      {/* Tab Content: Live Records */}
      {activeViewMode === 'records' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto max-h-[500px]">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 sticky top-0 z-10">
                <tr>
                  {columns.map(col => (
                    <th key={col} className="p-3 font-mono text-[11px] whitespace-nowrap">
                      {col === currentMeta.primaryKey ? (
                        <span className="flex items-center gap-1 text-[#002B49] font-bold">
                          <Key className="w-3 h-3 text-amber-500" />
                          {col} (PK)
                        </span>
                      ) : col.endsWith('ID') || col.endsWith('Code') ? (
                        <span className="text-amber-800 font-bold">{col} (FK)</span>
                      ) : (
                        col
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono text-[11px] text-slate-700">
                {filteredRecords.length === 0 ? (
                  <tr>
                    <td colSpan={columns.length} className="p-8 text-center text-slate-400">
                      No records match the filter query.
                    </td>
                  </tr>
                ) : (
                  filteredRecords.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                      {columns.map(col => {
                        const val = row[col];
                        return (
                          <td key={col} className="p-3 whitespace-nowrap max-w-xs truncate">
                            {val === null || val === undefined ? (
                              <span className="text-slate-300 italic">NULL</span>
                            ) : typeof val === 'boolean' ? (
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                  val ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                                }`}
                              >
                                {val ? 'TRUE (1)' : 'FALSE (0)'}
                              </span>
                            ) : (
                              String(val)
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab Content: Schema Specification */}
      {activeViewMode === 'schema' && (
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4 text-xs">
          <h3 className="font-bold text-slate-900 text-sm">
            DDL Schema Definition for `{activeTable}`
          </h3>

          <div className="bg-slate-900 text-slate-100 p-4 rounded-xl font-mono text-[12px] overflow-x-auto">
            <pre>
{`CREATE TABLE \`${activeTable}\` (
${columns
  .map(col => {
    let type = 'VARCHAR(255)';
    if (col.endsWith('ID')) type = 'INT NOT NULL AUTO_INCREMENT';
    if (col === 'SubmittedFlag' || col === 'HasProjector' || col === 'Read') type = 'BOOLEAN DEFAULT FALSE';
    if (col.includes('Date') || col === 'CreatedAt') type = 'DATETIME NOT NULL';
    if (col.includes('Time')) type = 'TIME NOT NULL';
    if (col === 'Description' || col === 'Body') type = 'TEXT';
    if (col === 'Credits' || col === 'Capacity' || col === 'MaxScore' || col === 'Grade') type = 'INT';
    
    const isPK = col === currentMeta.primaryKey ? ' PRIMARY KEY' : '';
    return `  \`${col}\` ${type}${isPK}`;
  })
  .join(',\n')}
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`}
            </pre>
          </div>

          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200 text-blue-900">
            <strong>Security &amp; Architecture Protocol (Alma&apos;s SDS):</strong> All PHP queries execute against this table using PDO prepared statements (<code>$stmt = $pdo-&gt;prepare(...)</code>) with bound parameters to eliminate SQL injection vectors.
          </div>
        </div>
      )}

      {/* Tab Content: PlantUML ERD Diagram */}
      {activeViewMode === 'erd' && (
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm">
              PlantUML Entity-Relationship Diagram (10 Relational Tables)
            </h3>
            <span className="text-xs text-slate-500">3NF Normalized Relational Model</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {TABLE_METAS.map(meta => (
              <div key={meta.name} className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/50 space-y-2">
                <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
                  <span className="font-mono font-bold text-xs text-[#002B49]">{meta.name}</span>
                  <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.2 rounded font-mono">
                    InnoDB
                  </span>
                </div>
                <div className="text-[11px] font-mono space-y-1">
                  <div className="text-amber-700 font-semibold flex items-center gap-1">
                    <Key className="w-3 h-3 text-amber-500" />
                    <span>+ {meta.primaryKey} [PK]</span>
                  </div>
                  {meta.foreignKeys.map(fk => (
                    <div key={fk} className="text-blue-700">
                      <span># {fk}</span>
                    </div>
                  ))}
                  <div className="text-slate-500 text-[10px] pt-1">
                    {meta.description}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-slate-900 text-slate-300 p-4 rounded-xl font-mono text-[11px] overflow-x-auto">
            <div className="text-amber-400 font-bold mb-1">// PlantUML Relational Cardinality</div>
            <div>STUDENT ||--o&#123; ENROLLMENT : registers</div>
            <div>UNIT ||--o&#123; ENROLLMENT : contains</div>
            <div>LECTURER ||--o&#123; UNIT : instructs</div>
            <div>ROOM ||--o&#123; UNIT : hosts</div>
            <div>UNIT ||--o&#123; ASSIGNMENT : issues</div>
            <div>ASSIGNMENT ||--o&#123; SUBMISSION : receives</div>
            <div>STUDENT ||--o&#123; SUBMISSION : submits</div>
            <div>UNIT ||--o&#123; TIMETABLE : scheduled_in</div>
            <div>ROOM ||--o&#123; TIMETABLE : venue_for</div>
            <div>STUDENT ||--o&#123; NOTIFICATION : alerts</div>
          </div>
        </div>
      )}

    </div>
  );
};
