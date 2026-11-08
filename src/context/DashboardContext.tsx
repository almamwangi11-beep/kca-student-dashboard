import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import confetti from 'canvas-confetti';
import {
  Student,
  Lecturer,
  Room,
  Unit,
  Enrollment,
  Assignment,
  Submission,
  TimetableSlot,
  NotificationLog,
  Administrator,
  EnrolledCourseWithDetails,
  AssignmentWithContext,
  UrgencyCategory,
  DayOfWeek
} from '../types/database';
import {
  INITIAL_STUDENTS,
  INITIAL_LECTURERS,
  INITIAL_ROOMS,
  INITIAL_UNITS,
  INITIAL_ENROLLMENTS,
  INITIAL_TIMETABLE,
  INITIAL_ASSIGNMENTS,
  INITIAL_SUBMISSIONS,
  INITIAL_NOTIFICATIONS,
  INITIAL_ADMINISTRATORS
} from '../data/seedData';

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning';
}

interface DashboardContextType {
  // Current user & Auth
  currentRole: 'student' | 'admin';
  currentStudent: Student;
  currentAdmin: Administrator;
  isLoggedIn: boolean;
  loginAsStudent: (regNumber: string) => boolean;
  loginAsAdmin: (email: string) => boolean;
  logout: () => void;
  switchPersona: (type: 'alma' | 'peer' | 'admin') => void;
  sessionMinutesLeft: number;
  refreshSession: () => void;

  // Active Simulated Clock
  simulatedDate: Date;
  setSimulatedDate: (d: Date) => void;
  simulatedTimePreset: string;
  applyPresetTime: (preset: 'live' | 'mon_morning' | 'tue_lab' | 'wed_db' | 'thu_web' | 'fri_afternoon' | 'weekend') => void;
  currentDayOfWeek: DayOfWeek;
  currentTimeString: string; // "HH:MM"

  // 10 Tables Data
  students: Student[];
  lecturers: Lecturer[];
  rooms: Room[];
  units: Unit[];
  enrollments: Enrollment[];
  timetable: TimetableSlot[];
  assignments: Assignment[];
  submissions: Submission[];
  notifications: NotificationLog[];
  administrators: Administrator[];

  // Aggregated Views
  enrolledCourses: EnrolledCourseWithDetails[];
  assignmentsWithContext: AssignmentWithContext[];
  activeHappeningNowSession: {
    slot: TimetableSlot;
    unit: Unit;
    lecturer: Lecturer;
    room: Room;
    minutesLeft: number;
  } | null;

  // Toast notifications
  toasts: Toast[];
  showToast: (message: string, type?: 'success' | 'info' | 'warning') => void;
  dismissToast: (id: string) => void;

  // Actions
  toggleSubmission: (assignmentId: number, notes?: string, fileName?: string) => void;
  createAssignment: (newAssignment: Omit<Assignment, 'AssignmentID'>) => void;
  updateStudentStatus: (studentId: number, status: 'Active' | 'Suspended') => void;
  markNotificationAsRead: (notificationId: number) => void;
  markAllNotificationsAsRead: () => void;
  triggerMailerCronCheck: () => { newAlertsCount: number; messages: string[] };
  selectedEmailForModal: NotificationLog | null;
  setSelectedEmailForModal: (notification: NotificationLog | null) => void;
  resetDatabaseToDefault: () => void;
}

const DashboardContext = createContext<DashboardContextType | null>(null);

export const DashboardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Local storage keys
  const getInitial = <T,>(key: string, fallback: T): T => {
    try {
      const saved = localStorage.getItem(`kca_dash_${key}`);
      return saved ? JSON.parse(saved) : fallback;
    } catch {
      return fallback;
    }
  };

  const [students, setStudents] = useState<Student[]>(() => getInitial('students', INITIAL_STUDENTS));
  const [lecturers] = useState<Lecturer[]>(INITIAL_LECTURERS);
  const [rooms] = useState<Room[]>(INITIAL_ROOMS);
  const [units] = useState<Unit[]>(INITIAL_UNITS);
  const [enrollments] = useState<Enrollment[]>(INITIAL_ENROLLMENTS);
  const [timetable, setTimetable] = useState<TimetableSlot[]>(() => getInitial('timetable', INITIAL_TIMETABLE));
  const [assignments, setAssignments] = useState<Assignment[]>(() => getInitial('assignments', INITIAL_ASSIGNMENTS));
  const [submissions, setSubmissions] = useState<Submission[]>(() => getInitial('submissions', INITIAL_SUBMISSIONS));
  const [notifications, setNotifications] = useState<NotificationLog[]>(() => getInitial('notifications', INITIAL_NOTIFICATIONS));
  const [administrators] = useState<Administrator[]>(INITIAL_ADMINISTRATORS);

  // Authentication state
  const [currentRole, setCurrentRole] = useState<'student' | 'admin'>('student');
  const [currentStudentId, setCurrentStudentId] = useState<number>(101); // Default to Alma Amani Mwangi
  const [currentAdminId, setCurrentAdminId] = useState<number>(901); // Default to Sharon Anyango
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);
  const [sessionMinutesLeft, setSessionMinutesLeft] = useState<number>(30);

  // Simulation Clock state - defaults to a Wednesday morning during term so dynamic items show instantly
  // but users can switch to live or any day/time
  const [simulatedDate, setSimulatedDate] = useState<Date>(() => {
    // Set to Wednesday 09:15 AM
    const d = new Date();
    // find day difference to Wednesday (3)
    const currentDay = d.getDay(); // 0 is Sun, 3 is Wed
    const diff = 3 - currentDay;
    d.setDate(d.getDate() + diff);
    d.setHours(9, 15, 0, 0);
    return d;
  });
  const [simulatedTimePreset, setSimulatedTimePreset] = useState<string>('wed_db');
  const [selectedEmailForModal, setSelectedEmailForModal] = useState<NotificationLog | null>(null);

  // Toast notifications state
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: 'success' | 'info' | 'warning' = 'success') => {
    const id = Date.now().toString() + Math.random().toString().slice(2, 6);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3800);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem('kca_dash_students', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem('kca_dash_assignments', JSON.stringify(assignments));
  }, [assignments]);

  useEffect(() => {
    localStorage.setItem('kca_dash_submissions', JSON.stringify(submissions));
  }, [submissions]);

  useEffect(() => {
    localStorage.setItem('kca_dash_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('kca_dash_timetable', JSON.stringify(timetable));
  }, [timetable]);

  // Session countdown timer (30 min timeout specification from SDS)
  useEffect(() => {
    const timer = setInterval(() => {
      setSessionMinutesLeft(prev => {
        if (prev <= 1) {
          return 30; // Auto-refresh for demonstration smoothness
        }
        return prev - 1;
      });
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const refreshSession = () => setSessionMinutesLeft(30);

  // Active student object
  const currentStudent = useMemo(() => {
    return students.find(s => s.StudentID === currentStudentId) || students[0];
  }, [students, currentStudentId]);

  // Active admin object
  const currentAdmin = useMemo(() => {
    return administrators.find(a => a.AdminID === currentAdminId) || administrators[0];
  }, [administrators, currentAdminId]);

  // Helper: Get day of week name from simulated date
  const currentDayOfWeek: DayOfWeek = useMemo(() => {
    const days: DayOfWeek[] = ['Sunday' as DayOfWeek, 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[simulatedDate.getDay()] || 'Wednesday';
  }, [simulatedDate]);

  const currentTimeString = useMemo(() => {
    const hrs = String(simulatedDate.getHours()).padStart(2, '0');
    const mins = String(simulatedDate.getMinutes()).padStart(2, '0');
    return `${hrs}:${mins}`;
  }, [simulatedDate]);

  // Apply preset times to easily demo timetable & "Happening Now"
  const applyPresetTime = useCallback((preset: 'live' | 'mon_morning' | 'tue_lab' | 'wed_db' | 'thu_web' | 'fri_afternoon' | 'weekend') => {
    setSimulatedTimePreset(preset);
    const d = new Date();

    const setDayAndHour = (targetDay: number, hours: number, minutes: number) => {
      const currentDay = d.getDay();
      const diff = targetDay - currentDay;
      d.setDate(d.getDate() + diff);
      d.setHours(hours, minutes, 0, 0);
      setSimulatedDate(new Date(d));
    };

    switch (preset) {
      case 'live':
        setSimulatedDate(new Date());
        break;
      case 'mon_morning':
        // Monday 08:30 (DBIT 1101 Lecture in LR 04)
        setDayAndHour(1, 8, 30);
        break;
      case 'tue_lab':
        // Tuesday 10:00 (DBIT 1102 Lab Practical in Lab 3)
        setDayAndHour(2, 10, 0);
        break;
      case 'wed_db':
        // Wednesday 09:15 (DBIT 1103 Database Lab in Lab 2)
        setDayAndHour(3, 9, 15);
        break;
      case 'thu_web':
        // Thursday 09:30 (DBIT 1105 Web Dev Practical in IT Complex 02)
        setDayAndHour(4, 9, 30);
        break;
      case 'fri_afternoon':
        // Friday 15:00 (DBIT 1103 Lecture in Lab 2)
        setDayAndHour(5, 15, 0);
        break;
      case 'weekend':
        // Saturday 14:00 (No classes scheduled)
        setDayAndHour(6, 14, 0);
        break;
    }
  }, []);

  // Login as student
  const loginAsStudent = (regNumber: string) => {
    const found = students.find(s => s.RegNumber.trim().toLowerCase() === regNumber.trim().toLowerCase());
    if (found) {
      setCurrentStudentId(found.StudentID);
      setCurrentRole('student');
      setIsLoggedIn(true);
      setSessionMinutesLeft(30);
      return true;
    }
    return false;
  };

  // Login as admin
  const loginAsAdmin = (email: string) => {
    const found = administrators.find(a => a.Email.trim().toLowerCase() === email.trim().toLowerCase());
    if (found) {
      setCurrentAdminId(found.AdminID);
      setCurrentRole('admin');
      setIsLoggedIn(true);
      setSessionMinutesLeft(30);
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsLoggedIn(false);
  };

  const switchPersona = (type: 'alma' | 'peer' | 'admin') => {
    setIsLoggedIn(true);
    setSessionMinutesLeft(30);
    if (type === 'alma') {
      setCurrentStudentId(101); // Alma
      setCurrentRole('student');
    } else if (type === 'peer') {
      setCurrentStudentId(102); // Brian Kiprono
      setCurrentRole('student');
    } else {
      setCurrentAdminId(901); // Sharon Anyango
      setCurrentRole('admin');
    }
  };

  // Course Display Module (Zero manual entry): Enrolled Units for active student
  const enrolledCourses: EnrolledCourseWithDetails[] = useMemo(() => {
    const studentEnrollments = enrollments.filter(e => e.StudentID === currentStudent.StudentID);

    return studentEnrollments.map(enr => {
      const unit = units.find(u => u.UnitCode === enr.UnitCode) || {
        UnitCode: enr.UnitCode,
        UnitName: 'Enrolled Unit',
        LecturerID: 201,
        RoomID: 301,
        Credits: 3,
        Color: '#0284c7'
      };

      const lecturer = lecturers.find(l => l.LecturerID === unit.LecturerID) || lecturers[0];
      const room = rooms.find(r => r.RoomID === unit.RoomID) || rooms[0];

      // Find unit assignments
      const unitAssignments = assignments.filter(a => a.UnitCode === unit.UnitCode);
      const pendingCount = unitAssignments.filter(a => {
        const sub = submissions.find(s => s.AssignmentID === a.AssignmentID && s.StudentID === currentStudent.StudentID);
        return !sub || !sub.SubmittedFlag;
      }).length;

      // Find next scheduled lecture
      const unitSlots = timetable.filter(t => t.UnitCode === unit.UnitCode);
      const nextSession = unitSlots[0];

      return {
        unit,
        lecturer,
        room,
        enrollment: enr,
        totalAssignments: unitAssignments.length,
        pendingAssignments: pendingCount,
        nextSession
      };
    });
  }, [currentStudent.StudentID, enrollments, units, lecturers, rooms, assignments, submissions, timetable]);

  // Centralized Assignment Hub Module:
  // Aggregates assignments from enrolled courses, evaluates dynamic urgency relative to simulatedDate
  const assignmentsWithContext: AssignmentWithContext[] = useMemo(() => {
    const enrolledUnitCodes = new Set(
      enrollments.filter(e => e.StudentID === currentStudent.StudentID).map(e => e.UnitCode)
    );

    const relevantAssignments = assignments.filter(a => enrolledUnitCodes.has(a.UnitCode));

    const simulatedEpoch = simulatedDate.getTime();
    const simDayStart = new Date(simulatedDate);
    simDayStart.setHours(0, 0, 0, 0);
    const simDayEnd = new Date(simulatedDate);
    simDayEnd.setHours(23, 59, 59, 999);

    const enriched = relevantAssignments.map(assignment => {
      const unit = units.find(u => u.UnitCode === assignment.UnitCode) || units[0];
      const submission = submissions.find(
        s => s.AssignmentID === assignment.AssignmentID && s.StudentID === currentStudent.StudentID
      );
      const isSubmitted = submission ? submission.SubmittedFlag : false;

      const dueEpoch = new Date(assignment.DueDate.replace(' ', 'T')).getTime();
      const diffMs = dueEpoch - simulatedEpoch;
      const hoursRemaining = Math.round(diffMs / (1000 * 60 * 60));

      let urgency: UrgencyCategory = 'Upcoming';
      if (dueEpoch < simulatedEpoch && !isSubmitted) {
        urgency = 'Overdue';
      } else if (dueEpoch >= simDayStart.getTime() && dueEpoch <= simDayEnd.getTime()) {
        urgency = 'Due Today';
      } else if (dueEpoch < simulatedEpoch && isSubmitted) {
        // If submitted already, keep classified as upcoming or completed context
        urgency = 'Upcoming';
      } else {
        urgency = 'Upcoming';
      }

      return {
        ...assignment,
        unit,
        submission,
        urgency,
        isSubmitted,
        hoursRemaining
      };
    });

    // Sort by urgency priority: Overdue first, then Due Today, then Upcoming
    const priorityWeight: Record<UrgencyCategory, number> = {
      'Overdue': 1,
      'Due Today': 2,
      'Upcoming': 3
    };

    return enriched.sort((a, b) => {
      // If one is submitted and the other is not, show pending first
      if (a.isSubmitted !== b.isSubmitted) {
        return a.isSubmitted ? 1 : -1;
      }
      if (priorityWeight[a.urgency] !== priorityWeight[b.urgency]) {
        return priorityWeight[a.urgency] - priorityWeight[b.urgency];
      }
      return new Date(a.DueDate).getTime() - new Date(b.DueDate).getTime();
    });
  }, [assignments, enrollments, currentStudent.StudentID, units, submissions, simulatedDate]);

  // Timetable Module: Detect "Happening Now"
  const activeHappeningNowSession = useMemo(() => {
    const studentUnitCodes = new Set(
      enrollments.filter(e => e.StudentID === currentStudent.StudentID).map(e => e.UnitCode)
    );

    const todaySlots = timetable.filter(
      slot => slot.DayOfWeek === currentDayOfWeek && studentUnitCodes.has(slot.UnitCode)
    );

    const simMinutes = simulatedDate.getHours() * 60 + simulatedDate.getMinutes();

    for (const slot of todaySlots) {
      const [startH, startM] = slot.StartTime.split(':').map(Number);
      const [endH, endM] = slot.EndTime.split(':').map(Number);
      const slotStart = startH * 60 + startM;
      const slotEnd = endH * 60 + endM;

      if (simMinutes >= slotStart && simMinutes < slotEnd) {
        const unit = units.find(u => u.UnitCode === slot.UnitCode) || units[0];
        const lecturer = lecturers.find(l => l.LecturerID === unit.LecturerID) || lecturers[0];
        const room = rooms.find(r => r.RoomID === slot.RoomID) || rooms[0];
        const minutesLeft = slotEnd - simMinutes;

        return {
          slot,
          unit,
          lecturer,
          room,
          minutesLeft
        };
      }
    }
    return null;
  }, [currentDayOfWeek, simulatedDate, timetable, enrollments, currentStudent.StudentID, units, lecturers, rooms]);

  // Assignment Tracking Module: Update submission flag & trigger celebration
  const toggleSubmission = useCallback((assignmentId: number, notes?: string, fileName?: string) => {
    const nowIso = new Date().toISOString().slice(0, 19).replace('T', ' ');

    setSubmissions(prev => {
      const existing = prev.find(s => s.AssignmentID === assignmentId && s.StudentID === currentStudent.StudentID);

      let updatedList: Submission[];
      let newlySubmitted = false;

      if (existing) {
        newlySubmitted = !existing.SubmittedFlag;
        updatedList = prev.map(s => {
          if (s.SubmissionID === existing.SubmissionID) {
            return {
              ...s,
              SubmittedFlag: !s.SubmittedFlag,
              SubmittedDate: !s.SubmittedFlag ? nowIso : null,
              StudentNotes: notes !== undefined ? notes : s.StudentNotes,
              FileName: fileName !== undefined ? fileName : s.FileName
            };
          }
          return s;
        });
      } else {
        newlySubmitted = true;
        const newSubmission: Submission = {
          SubmissionID: Date.now(),
          AssignmentID: assignmentId,
          StudentID: currentStudent.StudentID,
          SubmittedFlag: true,
          SubmittedDate: nowIso,
          Grade: null,
          Feedback: null,
          StudentNotes: notes || null,
          FileName: fileName || null
        };
        updatedList = [...prev, newSubmission];
      }

      const assignment = assignments.find(a => a.AssignmentID === assignmentId);
      const title = assignment?.Title || 'Assignment';

      // If marked as submitted, celebrate with confetti & log receipt
      if (newlySubmitted) {
        try {
          confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.6 },
            colors: ['#002B49', '#D97706', '#059669', '#3B82F6']
          });
        } catch {
          // ignore if canvas not supported
        }

        // Add confirmation notification
        const receiptNotif: NotificationLog = {
          NotificationID: Date.now(),
          StudentID: currentStudent.StudentID,
          AssignmentID: assignmentId,
          Type: 'Submission Receipt',
          SentDate: nowIso,
          DeliveryStatus: 'Delivered',
          Subject: `Submission Receipt: ${assignment?.UnitCode || ''} - ${title.slice(0, 30)}...`,
          Body: `Receipt #${Date.now().toString().slice(-6)}: Your submission for "${title}" was logged at ${nowIso}. Submission file: ${fileName || 'Digital submission confirmed'}.`,
          Read: false
        };
        setNotifications(n => [receiptNotif, ...n]);
        showToast(`"${title.slice(0, 30)}..." marked as submitted! Receipt logged.`, 'success');
      } else {
        showToast(`"${title.slice(0, 30)}..." marked as unsubmitted.`, 'info');
      }

      return updatedList;
    });
  }, [currentStudent.StudentID, assignments, showToast]);

  // Admin action: Create assignment
  const createAssignment = (newAssignmentData: Omit<Assignment, 'AssignmentID'>) => {
    const newId = Math.max(...assignments.map(a => a.AssignmentID), 600) + 1;
    const assignment: Assignment = {
      ...newAssignmentData,
      AssignmentID: newId
    };
    setAssignments(prev => [assignment, ...prev]);

    // Send broadcast notification to enrolled students
    const nowIso = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const newNotif: NotificationLog = {
      NotificationID: Date.now(),
      StudentID: 101, // Alma
      AssignmentID: newId,
      Type: 'System Notice',
      SentDate: nowIso,
      DeliveryStatus: 'Delivered',
      Subject: `New Coursework Published: ${assignment.UnitCode}`,
      Body: `A new assignment "${assignment.Title}" has been added by your department. Due date: ${assignment.DueDate}.`,
      Read: false
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  // Admin action: Update student account status
  const updateStudentStatus = (studentId: number, status: 'Active' | 'Suspended') => {
    setStudents(prev => prev.map(s => s.StudentID === studentId ? { ...s, AccountStatus: status } : s));
  };

  // Notification actions
  const markNotificationAsRead = (notificationId: number) => {
    setNotifications(prev => prev.map(n => n.NotificationID === notificationId ? { ...n, Read: true } : n));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, Read: true })));
  };

  // Notification Module (mailer.php simulation):
  // Evaluates assignments due in 3 days, 1 day, or 3 hours
  const triggerMailerCronCheck = useCallback(() => {
    const nowIso = simulatedDate.toISOString().slice(0, 19).replace('T', ' ');
    const simEpoch = simulatedDate.getTime();
    const generatedAlerts: string[] = [];
    const newNotificationsToAdd: NotificationLog[] = [];

    assignmentsWithContext.forEach(item => {
      if (item.isSubmitted) return;

      const dueEpoch = new Date(item.DueDate.replace(' ', 'T')).getTime();
      const diffHours = (dueEpoch - simEpoch) / (1000 * 60 * 60);

      // Check 3-hour window (between 0 and 3.5 hours remaining)
      if (diffHours > 0 && diffHours <= 3.5) {
        const alreadySent = notifications.some(
          n => n.StudentID === currentStudent.StudentID && n.AssignmentID === item.AssignmentID && n.Type === '3-hour'
        );
        if (!alreadySent) {
          const alert: NotificationLog = {
            NotificationID: Date.now() + Math.floor(Math.random() * 1000),
            StudentID: currentStudent.StudentID,
            AssignmentID: item.AssignmentID,
            Type: '3-hour',
            SentDate: nowIso,
            DeliveryStatus: 'Delivered',
            Subject: `FINAL CALL: ${item.UnitCode} assignment closes in ${Math.round(diffHours)} hours!`,
            Body: `Automated PHPMailer Alert: Your assignment "${item.Title}" is due at ${item.DueDate}. Only ${Math.round(diffHours)} hours remaining. Please finalize and submit.`,
            Read: false
          };
          newNotificationsToAdd.push(alert);
          generatedAlerts.push(`Dispatched 3-Hour Alert for ${item.UnitCode}`);
        }
      }
      // Check 1-day window (between 3.5 and 26 hours remaining)
      else if (diffHours > 3.5 && diffHours <= 26) {
        const alreadySent = notifications.some(
          n => n.StudentID === currentStudent.StudentID && n.AssignmentID === item.AssignmentID && n.Type === '1-day'
        );
        if (!alreadySent) {
          const alert: NotificationLog = {
            NotificationID: Date.now() + Math.floor(Math.random() * 1000),
            StudentID: currentStudent.StudentID,
            AssignmentID: item.AssignmentID,
            Type: '1-day',
            SentDate: nowIso,
            DeliveryStatus: 'Delivered',
            Subject: `24-Hour Reminder: ${item.Title}`,
            Body: `Reminder from KCA Virtual Campus: You have 1 day remaining until the deadline for "${item.Title}" (${item.UnitCode}). Contact lecturer if you need help.`,
            Read: false
          };
          newNotificationsToAdd.push(alert);
          generatedAlerts.push(`Dispatched 24-Hour Alert for ${item.UnitCode}`);
        }
      }
      // Check 3-day window (between 26 and 75 hours remaining)
      else if (diffHours > 26 && diffHours <= 75) {
        const alreadySent = notifications.some(
          n => n.StudentID === currentStudent.StudentID && n.AssignmentID === item.AssignmentID && n.Type === '3-day'
        );
        if (!alreadySent) {
          const alert: NotificationLog = {
            NotificationID: Date.now() + Math.floor(Math.random() * 1000),
            StudentID: currentStudent.StudentID,
            AssignmentID: item.AssignmentID,
            Type: '3-day',
            SentDate: nowIso,
            DeliveryStatus: 'Delivered',
            Subject: `3-Day Advance Notice: ${item.UnitCode} Coursework`,
            Body: `Academic Notice: "${item.Title}" is due in 3 days (${item.DueDate}). Please review the rubric and start your preparation.`,
            Read: false
          };
          newNotificationsToAdd.push(alert);
          generatedAlerts.push(`Dispatched 3-Day Notice for ${item.UnitCode}`);
        }
      }
    });

    if (newNotificationsToAdd.length > 0) {
      setNotifications(prev => [...newNotificationsToAdd, ...prev]);
    }

    return {
      newAlertsCount: newNotificationsToAdd.length,
      messages: generatedAlerts.length > 0 ? generatedAlerts : ['No new trigger thresholds met at this simulated timestamp.']
    };
  }, [simulatedDate, assignmentsWithContext, notifications, currentStudent.StudentID]);

  // Reset database back to default seed
  const resetDatabaseToDefault = () => {
    localStorage.removeItem('kca_dash_students');
    localStorage.removeItem('kca_dash_assignments');
    localStorage.removeItem('kca_dash_submissions');
    localStorage.removeItem('kca_dash_notifications');
    localStorage.removeItem('kca_dash_timetable');

    setStudents(INITIAL_STUDENTS);
    setAssignments(INITIAL_ASSIGNMENTS);
    setSubmissions(INITIAL_SUBMISSIONS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setTimetable(INITIAL_TIMETABLE);
    setCurrentStudentId(101);
    setCurrentRole('student');
    setIsLoggedIn(true);
    setSessionMinutesLeft(30);
  };

  return (
    <DashboardContext.Provider
      value={{
        currentRole,
        currentStudent,
        currentAdmin,
        isLoggedIn,
        loginAsStudent,
        loginAsAdmin,
        logout,
        switchPersona,
        sessionMinutesLeft,
        refreshSession,

        simulatedDate,
        setSimulatedDate,
        simulatedTimePreset,
        applyPresetTime,
        currentDayOfWeek,
        currentTimeString,

        students,
        lecturers,
        rooms,
        units,
        enrollments,
        timetable,
        assignments,
        submissions,
        notifications,
        administrators,

        enrolledCourses,
        assignmentsWithContext,
        activeHappeningNowSession,

        toasts,
        showToast,
        dismissToast,

        toggleSubmission,
        createAssignment,
        updateStudentStatus,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        triggerMailerCronCheck,
        selectedEmailForModal,
        setSelectedEmailForModal,
        resetDatabaseToDefault
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
};
