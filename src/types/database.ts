/**
 * Database Schema Definitions matching the 10 MySQL Tables
 * from Alma Amani Mwangi's System Design Specification (SDS)
 * for KCA University Student Academic Dashboard (DBIT).
 */

export interface Student {
  StudentID: number;
  RegNumber: string; // e.g. "25/03339"
  Name: string;
  Email: string;
  Password?: string; // bcrypt hash representation
  AccountStatus: 'Active' | 'Suspended' | 'Pending';
  CreatedAt: string;
  Programme: string; // e.g. "Diploma in Business Information Technology (DBIT)"
  YearOfStudy: string; // e.g. "Year 1 Semester 2"
  AvatarUrl?: string;
  Phone?: string;
}

export interface Lecturer {
  LecturerID: number;
  Name: string;
  Email: string;
  Department: string;
  Office: string;
  Phone?: string;
}

export interface Room {
  RoomID: number;
  RoomName: string; // e.g. "LR 04", "Lab 2"
  Location: string; // e.g. "Main Campus - Tuition Block A, 1st Floor"
  Capacity?: number;
  HasProjector?: boolean;
}

export interface Unit {
  UnitCode: string; // PK e.g. "DBIT 1101"
  UnitName: string;
  LecturerID: number;
  RoomID: number;
  Credits: number;
  Color: string; // Distinct theme color for calendar & tags
  Description?: string;
}

export interface Enrollment {
  EnrollmentID: number;
  StudentID: number;
  UnitCode: string;
  Semester: string; // e.g. "Jan-Apr 2026"
  AcademicYear: string; // e.g. "2025/2026"
}

export type UrgencyCategory = 'Overdue' | 'Due Today' | 'Upcoming';

export interface Assignment {
  AssignmentID: number;
  UnitCode: string;
  Title: string;
  Description: string;
  DueDate: string; // ISO 8601 string or "YYYY-MM-DDTHH:mm:ss"
  MaxScore: number;
  WeightPercentage?: number;
  AttachmentName?: string;
}

export interface Submission {
  SubmissionID: number;
  AssignmentID: number;
  StudentID: number;
  SubmittedFlag: boolean;
  SubmittedDate: string | null;
  Grade?: number | null;
  Feedback?: string | null;
  FileName?: string | null;
  StudentNotes?: string | null;
}

export type DayOfWeek = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';

export interface TimetableSlot {
  TimetableID: number;
  UnitCode: string;
  DayOfWeek: DayOfWeek;
  StartTime: string; // "08:00"
  EndTime: string; // "10:00"
  RoomID: number;
  SessionType: 'Lecture' | 'Lab Practical' | 'Tutorial';
}

export type NotificationType = '3-day' | '1-day' | '3-hour' | 'Submission Receipt' | 'System Notice';
export type DeliveryStatus = 'Delivered' | 'Pending' | 'Queued';

export interface NotificationLog {
  NotificationID: number;
  StudentID: number;
  AssignmentID?: number;
  Type: NotificationType;
  SentDate: string;
  DeliveryStatus: DeliveryStatus;
  Subject: string;
  Body: string;
  Read: boolean;
}

export interface Administrator {
  AdminID: number;
  Name: string;
  Email: string;
  Password?: string;
  Role: 'System Administrator' | 'Academic Supervisor' | 'HOD Computing';
  Department: string;
}

// Aggregated View Models for Student Dashboard
export interface EnrolledCourseWithDetails {
  unit: Unit;
  lecturer: Lecturer;
  room: Room;
  enrollment: Enrollment;
  totalAssignments: number;
  pendingAssignments: number;
  nextSession?: TimetableSlot;
}

export interface AssignmentWithContext extends Assignment {
  unit: Unit;
  submission?: Submission;
  urgency: UrgencyCategory;
  isSubmitted: boolean;
  hoursRemaining: number;
}
