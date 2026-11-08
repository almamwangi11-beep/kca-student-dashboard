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
  Administrator
} from '../types/database';

export const INITIAL_STUDENTS: Student[] = [
  {
    StudentID: 101,
    RegNumber: '25/03339',
    Name: 'Alma Amani Mwangi',
    Email: 'alma.mwangi@students.kca.ac.ke',
    Password: '$2y$10$e8wE...bcryptHashSample',
    AccountStatus: 'Active',
    CreatedAt: '2025-09-01 08:30:00',
    Programme: 'Diploma in Business Information Technology (DBIT)',
    YearOfStudy: 'Year 1 Semester 2',
    AvatarUrl: '/src/assets/images/student_avatar_alma_1794129494539.jpg',
    Phone: '+254 712 345 678'
  },
  {
    StudentID: 102,
    RegNumber: '25/03340',
    Name: 'Brian Kiprono',
    Email: 'brian.kiprono@students.kca.ac.ke',
    Password: '$2y$10$p3rK...bcryptHashSample',
    AccountStatus: 'Active',
    CreatedAt: '2025-09-01 08:45:00',
    Programme: 'Diploma in Business Information Technology (DBIT)',
    YearOfStudy: 'Year 1 Semester 2',
    Phone: '+254 722 987 654'
  },
  {
    StudentID: 103,
    RegNumber: '25/03341',
    Name: 'Brenda Chebet',
    Email: 'brenda.chebet@students.kca.ac.ke',
    Password: '$2y$10$w9uL...bcryptHashSample',
    AccountStatus: 'Active',
    CreatedAt: '2025-09-01 09:10:00',
    Programme: 'Diploma in Business Information Technology (DBIT)',
    YearOfStudy: 'Year 1 Semester 2',
    Phone: '+254 733 456 789'
  }
];

export const INITIAL_LECTURERS: Lecturer[] = [
  {
    LecturerID: 201,
    Name: 'Dr. John Kamau',
    Email: 'john.kamau@kca.ac.ke',
    Department: 'Department of Computing & IT',
    Office: 'Faculty Office B-12',
    Phone: '+254 720 111 222'
  },
  {
    LecturerID: 202,
    Name: 'Ms. Faith Wanjiku',
    Email: 'faith.wanjiku@kca.ac.ke',
    Department: 'Department of Software Engineering',
    Office: 'Tech Complex Lab Office 04',
    Phone: '+254 721 333 444'
  },
  {
    LecturerID: 203,
    Name: 'Mr. Peter Ochieng',
    Email: 'peter.ochieng@kca.ac.ke',
    Department: 'Department of Information Systems',
    Office: 'Main Campus Tuition Office 208',
    Phone: '+254 722 555 666'
  },
  {
    LecturerID: 204,
    Name: 'Prof. Daniel Kiprono',
    Email: 'daniel.kiprono@kca.ac.ke',
    Department: 'Department of Business & Quantitative Studies',
    Office: 'Faculty of Commerce F-03',
    Phone: '+254 723 777 888'
  },
  {
    LecturerID: 205,
    Name: 'Ms. Sharon Anyango',
    Email: 'sharon.anyango@kca.ac.ke',
    Department: 'Department of Computing & Project Supervision',
    Office: 'School of Technology Supervisors Wing 10',
    Phone: '+254 724 999 000'
  }
];

export const INITIAL_ROOMS: Room[] = [
  {
    RoomID: 301,
    RoomName: 'LR 04',
    Location: 'Main Campus - Tuition Block A, Ground Floor',
    Capacity: 75,
    HasProjector: true
  },
  {
    RoomID: 302,
    RoomName: 'Lab 3 (Programming)',
    Location: 'School of Technology Computing Wing, 2nd Floor',
    Capacity: 45,
    HasProjector: true
  },
  {
    RoomID: 303,
    RoomName: 'Lab 2 (Database Systems)',
    Location: 'IT Complex, 1st Floor East Wing',
    Capacity: 50,
    HasProjector: true
  },
  {
    RoomID: 304,
    RoomName: 'LR 08',
    Location: 'Lecture Hall Complex Block B, 1st Floor',
    Capacity: 80,
    HasProjector: true
  },
  {
    RoomID: 305,
    RoomName: 'IT Complex 02',
    Location: 'Western Innovation Wing, 2nd Floor',
    Capacity: 60,
    HasProjector: true
  }
];

export const INITIAL_UNITS: Unit[] = [
  {
    UnitCode: 'DBIT 1101',
    UnitName: 'Introduction to Business Information Technology',
    LecturerID: 201, // Dr. John Kamau
    RoomID: 301, // LR 04
    Credits: 3,
    Color: '#0284c7', // Sky Blue
    Description: 'Foundations of business computing, enterprise systems, organizational information flows, and strategic digital applications in modern enterprises.'
  },
  {
    UnitCode: 'DBIT 1102',
    UnitName: 'Structured Programming in C/C++',
    LecturerID: 202, // Ms. Faith Wanjiku
    RoomID: 302, // Lab 3
    Credits: 4,
    Color: '#7c3aed', // Purple
    Description: 'Algorithmic problem solving, syntax, control structures, pointer mechanics, modular programming, memory management, and practical coding exercises in Lab 3.'
  },
  {
    UnitCode: 'DBIT 1103',
    UnitName: 'Relational Database Systems & MySQL',
    LecturerID: 203, // Mr. Peter Ochieng
    RoomID: 303, // Lab 2
    Credits: 4,
    Color: '#059669', // Emerald Green
    Description: 'Relational database theory, 1NF/2NF/3NF normalization, ER modeling, SQL DDL/DML, and hands-on MariaDB/phpMyAdmin laboratory sessions.'
  },
  {
    UnitCode: 'DBIT 1104',
    UnitName: 'Quantitative Techniques & Business Statistics',
    LecturerID: 204, // Prof. Daniel Kiprono
    RoomID: 304, // LR 08
    Credits: 3,
    Color: '#d97706', // Amber
    Description: 'Statistical measures of dispersion, probability theory, hypothesis testing, linear regression, and decision analysis models for business intelligence.'
  },
  {
    UnitCode: 'DBIT 1105',
    UnitName: 'Internet Technologies & Web Development',
    LecturerID: 205, // Ms. Sharon Anyango
    RoomID: 305, // IT Complex 02
    Credits: 4,
    Color: '#dc2626', // Red / Crimson
    Description: 'Three-tier architecture, HTML5/CSS3 semantic layouts, JavaScript ES6+, PHP 8 server-side request pipelines, AJAX data exchange, and web security.'
  }
];

export const INITIAL_ENROLLMENTS: Enrollment[] = [
  { EnrollmentID: 401, StudentID: 101, UnitCode: 'DBIT 1101', Semester: 'Jan-Apr 2026', AcademicYear: '2025/2026' },
  { EnrollmentID: 402, StudentID: 101, UnitCode: 'DBIT 1102', Semester: 'Jan-Apr 2026', AcademicYear: '2025/2026' },
  { EnrollmentID: 403, StudentID: 101, UnitCode: 'DBIT 1103', Semester: 'Jan-Apr 2026', AcademicYear: '2025/2026' },
  { EnrollmentID: 404, StudentID: 101, UnitCode: 'DBIT 1104', Semester: 'Jan-Apr 2026', AcademicYear: '2025/2026' },
  { EnrollmentID: 405, StudentID: 101, UnitCode: 'DBIT 1105', Semester: 'Jan-Apr 2026', AcademicYear: '2025/2026' }
];

export const INITIAL_TIMETABLE: TimetableSlot[] = [
  // Monday
  {
    TimetableID: 501,
    UnitCode: 'DBIT 1101',
    DayOfWeek: 'Monday',
    StartTime: '08:00',
    EndTime: '11:00',
    RoomID: 301,
    SessionType: 'Lecture'
  },
  {
    TimetableID: 502,
    UnitCode: 'DBIT 1104',
    DayOfWeek: 'Monday',
    StartTime: '12:00',
    EndTime: '15:00',
    RoomID: 304,
    SessionType: 'Lecture'
  },
  // Tuesday
  {
    TimetableID: 503,
    UnitCode: 'DBIT 1102',
    DayOfWeek: 'Tuesday',
    StartTime: '09:00',
    EndTime: '12:00',
    RoomID: 302,
    SessionType: 'Lab Practical'
  },
  {
    TimetableID: 504,
    UnitCode: 'DBIT 1105',
    DayOfWeek: 'Tuesday',
    StartTime: '13:00',
    EndTime: '16:00',
    RoomID: 305,
    SessionType: 'Lecture'
  },
  // Wednesday
  {
    TimetableID: 505,
    UnitCode: 'DBIT 1103',
    DayOfWeek: 'Wednesday',
    StartTime: '08:30',
    EndTime: '11:30',
    RoomID: 303,
    SessionType: 'Lab Practical'
  },
  {
    TimetableID: 506,
    UnitCode: 'DBIT 1101',
    DayOfWeek: 'Wednesday',
    StartTime: '14:00',
    EndTime: '16:00',
    RoomID: 301,
    SessionType: 'Tutorial'
  },
  // Thursday
  {
    TimetableID: 507,
    UnitCode: 'DBIT 1105',
    DayOfWeek: 'Thursday',
    StartTime: '08:30',
    EndTime: '11:30',
    RoomID: 305,
    SessionType: 'Lab Practical'
  },
  {
    TimetableID: 508,
    UnitCode: 'DBIT 1102',
    DayOfWeek: 'Thursday',
    StartTime: '12:00',
    EndTime: '14:00',
    RoomID: 302,
    SessionType: 'Lecture'
  },
  // Friday
  {
    TimetableID: 509,
    UnitCode: 'DBIT 1104',
    DayOfWeek: 'Friday',
    StartTime: '09:00',
    EndTime: '11:00',
    RoomID: 304,
    SessionType: 'Tutorial'
  },
  {
    TimetableID: 510,
    UnitCode: 'DBIT 1103',
    DayOfWeek: 'Friday',
    StartTime: '14:00',
    EndTime: '17:00',
    RoomID: 303,
    SessionType: 'Lecture'
  }
];

// Reference base date helper so timestamps align realistically with "Overdue", "Due Today", and "Upcoming"
const now = new Date();
const formatDate = (date: Date) => date.toISOString().slice(0, 19).replace('T', ' ');

const todayDue = new Date(now);
todayDue.setHours(23, 59, 0, 0);

const overdueDate = new Date(now);
overdueDate.setDate(now.getDate() - 2);
overdueDate.setHours(17, 0, 0, 0);

const upcoming3Days = new Date(now);
upcoming3Days.setDate(now.getDate() + 3);
upcoming3Days.setHours(14, 0, 0, 0);

const upcoming1Week = new Date(now);
upcoming1Week.setDate(now.getDate() + 7);
upcoming1Week.setHours(23, 59, 0, 0);

const upcoming2Weeks = new Date(now);
upcoming2Weeks.setDate(now.getDate() + 12);
upcoming2Weeks.setHours(18, 0, 0, 0);

export const INITIAL_ASSIGNMENTS: Assignment[] = [
  {
    AssignmentID: 601,
    UnitCode: 'DBIT 1102',
    Title: 'Practical 3: C++ Pointer Mechanics & Dynamic Array Allocation',
    Description: 'Implement dynamic 2D matrices in C++ utilizing raw pointers. Submit the well-commented .cpp source code along with a PDF execution log screenshot showing memory leak checks with valgrind.',
    DueDate: formatDate(overdueDate),
    MaxScore: 100,
    WeightPercentage: 15,
    AttachmentName: 'Assignment3_PointerMechanics.pdf'
  },
  {
    AssignmentID: 602,
    UnitCode: 'DBIT 1103',
    Title: 'Lab 4: Database Normalization (1NF, 2NF, 3NF) for KCA Clinic',
    Description: 'Given the unnormalized patient reception log table, apply 1NF, 2NF, and 3NF functional dependency decompositions. Provide the final relational schema and MySQL DDL script with foreign key constraints.',
    DueDate: formatDate(todayDue),
    MaxScore: 50,
    WeightPercentage: 10,
    AttachmentName: 'KCA_Clinic_Unnormalized_Dataset.xlsx'
  },
  {
    AssignmentID: 603,
    UnitCode: 'DBIT 1105',
    Title: 'Coursework 2: Three-Tier Web Architecture Specification & SRS',
    Description: 'Draft a comprehensive 6-page Software Requirements Specification (SRS) for a centralized student academic dashboard. Include use case diagram, 10-table relational schema, and PHPMailer notification workflow.',
    DueDate: formatDate(upcoming3Days),
    MaxScore: 100,
    WeightPercentage: 20,
    AttachmentName: 'SRS_Template_Sharon_Anyango.docx'
  },
  {
    AssignmentID: 604,
    UnitCode: 'DBIT 1104',
    Title: 'Problem Set 4: Hypothesis Testing & ANOVA Variance Analysis',
    Description: 'Solve quantitative questions 1 through 8 in Chapter 7 regarding two-tailed Z-tests, student t-distribution confidence intervals, and one-way ANOVA calculations.',
    DueDate: formatDate(upcoming1Week),
    MaxScore: 50,
    WeightPercentage: 10,
    AttachmentName: 'Quantitative_ProblemSet_4.pdf'
  },
  {
    AssignmentID: 605,
    UnitCode: 'DBIT 1101',
    Title: 'Case Study: Enterprise ERP Migration at Safaricom Kenya',
    Description: 'Analyze the business benefits and cybersecurity challenges encountered when transitioning legacy supply chain management to SAP S/4HANA cloud. Limit write-up to 1,500 words.',
    DueDate: formatDate(upcoming2Weeks),
    MaxScore: 100,
    WeightPercentage: 15,
    AttachmentName: 'Safaricom_CaseStudy_Brief.pdf'
  }
];

export const INITIAL_SUBMISSIONS: Submission[] = [
  {
    SubmissionID: 701,
    AssignmentID: 601,
    StudentID: 101, // Alma
    SubmittedFlag: false,
    SubmittedDate: null,
    Grade: null,
    Feedback: null
  },
  {
    SubmissionID: 702,
    AssignmentID: 602,
    StudentID: 101, // Alma
    SubmittedFlag: false,
    SubmittedDate: null,
    Grade: null,
    Feedback: null
  },
  {
    SubmissionID: 703,
    AssignmentID: 603,
    StudentID: 101, // Alma
    SubmittedFlag: false,
    SubmittedDate: null,
    Grade: null,
    Feedback: null
  },
  {
    SubmissionID: 704,
    AssignmentID: 604,
    StudentID: 101, // Alma
    SubmittedFlag: true,
    SubmittedDate: '2026-11-06 14:22:10',
    Grade: 47,
    Feedback: 'Well structured hypothesis steps and clear ANOVA tables.',
    FileName: 'Alma_Mwangi_25-03339_Quantitative_PS4.pdf'
  },
  {
    SubmissionID: 705,
    AssignmentID: 605,
    StudentID: 101, // Alma
    SubmittedFlag: false,
    SubmittedDate: null,
    Grade: null,
    Feedback: null
  }
];

export const INITIAL_NOTIFICATIONS: NotificationLog[] = [
  {
    NotificationID: 801,
    StudentID: 101,
    AssignmentID: 602,
    Type: '3-hour',
    SentDate: '2026-11-08 09:00:00',
    DeliveryStatus: 'Delivered',
    Subject: 'URGENT: Lab 4 (DBIT 1103) is Due Today at 23:59',
    Body: 'Dear Alma Amani Mwangi, this is an automated alert from KCA Virtual Campus. Your submission for "Lab 4: Database Normalization" is due tonight. Please upload before 23:59 to avoid late penalties.',
    Read: false
  },
  {
    NotificationID: 802,
    StudentID: 101,
    AssignmentID: 603,
    Type: '3-day',
    SentDate: '2026-11-07 14:00:00',
    DeliveryStatus: 'Delivered',
    Subject: 'Upcoming Deadline Alert: DBIT 1105 SRS Specification',
    Body: 'Dear Alma Amani Mwangi, your course assignment "Coursework 2: Three-Tier Web Architecture Specification & SRS" supervised by Ms. Sharon Anyango is due in 3 days. Check requirements and rubric.',
    Read: true
  },
  {
    NotificationID: 803,
    StudentID: 101,
    AssignmentID: 601,
    Type: '1-day',
    SentDate: '2026-11-05 17:00:00',
    DeliveryStatus: 'Delivered',
    Subject: 'Deadline Reminder: C++ Pointer Mechanics (DBIT 1102)',
    Body: 'Dear Alma Amani Mwangi, only 24 hours remain until the deadline for C++ Practical 3. Contact Ms. Faith Wanjiku during office hours if you require clarification.',
    Read: true
  },
  {
    NotificationID: 804,
    StudentID: 101,
    AssignmentID: 604,
    Type: 'Submission Receipt',
    SentDate: '2026-11-06 14:22:15',
    DeliveryStatus: 'Delivered',
    Subject: 'Receipt: Submission Recorded for Problem Set 4 (DBIT 1104)',
    Body: 'Your submission for Quantitative Techniques Problem Set 4 was successfully received by KCA University portal system on 2026-11-06 14:22:10.',
    Read: true
  }
];

export const INITIAL_ADMINISTRATORS: Administrator[] = [
  {
    AdminID: 901,
    Name: 'Ms. Sharon Anyango',
    Email: 'sharon.anyango@kca.ac.ke',
    Role: 'Academic Supervisor',
    Department: 'School of Technology'
  },
  {
    AdminID: 902,
    Name: 'Dr. Vincent Omwenga',
    Email: 'admin@kca.ac.ke',
    Role: 'System Administrator',
    Department: 'ICT Services & Virtual Campus Directorate'
  }
];
