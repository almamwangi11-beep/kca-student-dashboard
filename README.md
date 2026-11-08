# 🎓 KCA University Student Academic Dashboard

A centralized, responsive, and production-grade web dashboard for KCA University students (Diploma in Business Information Technology - DBIT). Built to eliminate academic information fragmentation by unifying enrolled courses, assignment deadlines, real-time weekly timetables, exam clearance, and university announcements into a single, intuitive interface.

![KCA University](https://img.shields.io/badge/KCA%20University-Virtual%20Campus-003366?style=for-the-badge)
![React 19](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

🌐 **Live Website**: [https://almamwangi11-beep.github.io/kca-student-dashboard/](https://almamwangi11-beep.github.io/kca-student-dashboard/)

---

## ✨ Features

- **🏛️ Official KCA Branding & Portal Experience**: Authentic KCA Navy & Gold styling with quick links to Student Portal, Virtual Campus, and Staff Directory.
- **📚 Zero-Manual-Entry Course Units**: Displays enrolled courses with unit codes, lecturers, venue rooms, and semester credits.
- **⚡ Centralized Assignment Hub**:
  - Filter by status: *All*, *Pending*, *Submitted*, *Overdue*.
  - Direct file submission simulation with drag-and-drop file upload.
  - Urgency indicators (Overdue, Due Today, Upcoming).
- **📅 Interactive Timetable Calendar**:
  - **Day, Week, and Agenda Views**.
  - Color-coded units matching each course.
  - "Happening Now" dynamic banner computing current session based on day and hour.
- **🎫 Official Examination Clearance Card**:
  - Generates verifiable KCA Student Examination Attendance Card with student registration number (`25/03339`), passport photo, fee clearance verification (100%), and one-click printing/PDF export.
- **📖 e-Library Digital Portal**:
  - Searchable digital textbooks, research papers, and IEEE references for DBIT curriculum.
- **⚙️ Administrator & Database Tools**:
  - Built-in Faculty Admin toggle to add assignments, adjust timetable sessions, or inspect the 10-table MySQL relational schema.
- **🔔 Real-Time Campus Notification Drawer**:
  - Live alerts for newly posted coursework, upcoming quizzes, and venue adjustments with "Mark all as read".

---

## 🛠️ Tech Stack

- **Framework**: [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Animations**: [Motion](https://motion.dev/)

---

## 🚀 Getting Started

### Prerequisites

Ensure you have [Node.js](https://nodejs.org/) (version 18+ or 20+) installed on your machine.

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/almamwangi11-beep/kca-student-dashboard.git
   cd kca-student-dashboard
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Open in browser**:
   Navigate to `http://localhost:5173` (or the port specified in terminal).

### Production Build

```bash
npm run build
npm run preview
```

---

## 📂 Project Structure

```
├── public/                 # Static assets
├── src/
│   ├── components/         # Modular UI components
│   │   ├── Header.tsx             # Official KCA header & notification drawer
│   │   ├── HappeningNowBanner.tsx # Current class banner
│   │   ├── CourseList.tsx         # Enrolled course unit cards
│   │   ├── AssignmentHub.tsx      # Filterable assignment submission feed
│   │   ├── TimetableCalendar.tsx  # Interactive schedule calendar
│   │   ├── ExamCardModal.tsx      # Printable examination card
│   │   ├── ELibraryModal.tsx      # Digital library textbook viewer
│   │   ├── AdminPanel.tsx         # Academic coordinator management
│   │   ├── DatabaseInspector.tsx  # Relational schema viewer
│   │   └── ToastContainer.tsx     # Modern feedback notification toasts
│   ├── context/
│   │   └── DashboardContext.tsx   # Global state, timetable evaluation & persistence
│   ├── data/
│   │   └── seedData.ts            # Realistic DBIT curriculum records
│   ├── types/
│   │   └── database.ts            # TypeScript definitions for all 10 schema entities
│   ├── App.tsx                    # Main layout and tab orchestrator
│   ├── main.tsx                   # React root entry
│   └── index.css                  # Tailwind CSS v4 styling rules
├── .gitignore
├── package.json
└── README.md
```

---

## 🤝 Student & Programme Information

- **Institution**: KCA University (Ruaraka Main Campus, Nairobi, Kenya)
- **Programme**: Diploma in Business Information Technology (DBIT)
- **Target Audience**: KCA University Students, Faculty, and Academic Administrators

---

## 📄 License

This project is licensed under the [Apache-2.0 License](LICENSE).
