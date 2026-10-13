# Student Attendance Management System

A modern, responsive, and feature-rich college attendance management application built with **React 19**, **Vite**, **React Router 7**, and **LocalStorage**.

Designed as a college mini-project for professors and academic administrators to record student attendance, monitor defaulters, generate analytics reports, and export CSV logs.

---

## ✨ Features

- **📊 Comprehensive College Dashboard**:
  - Live metric cards: Total Students, Present Today, Absent, Late Arrivals, Approved Leave, and Overall Institutional Attendance.
  - Interactive Date Selector to view attendance records for any date.
  - Attendance Defaulters Alert card highlighting students below the warning threshold (default `< 75%`).
  - Recent classroom attendance activity feed.

- **👨‍🎓 Student Management**:
  - Register new students with automatic Student ID generation (`STU-YYYY-XXX`).
  - Search by Name, Roll Number, or Student ID.
  - Filter by Department, Academic Year, and Class/Section.
  - Sorting by Roll Number and Full Name.
  - Edit and Delete student profiles with confirmation modals.
  - Real-time duplicate Roll Number validation.

- **📝 Attendance Marking**:
  - Session parameters: Date, Department, Academic Year, Class Section, and Subject.
  - Dynamic subjects populated according to the selected engineering department.
  - Individual marking controls: **Present (P)**, **Absent (A)**, **Late (L)**, and **On Leave (OL)**.
  - Quick bulk actions: **Mark All Present** & **Mark All Absent**.
  - Automatic detection and loading of previously saved attendance sessions.
  - Confirmation alert before overwriting existing session records.

- **📐 Accurate Institutional Calculations**:
  $$\text{Attendance Percentage} = \frac{\text{Present Days} + \text{Late Days}}{\text{Total Recorded Days} - \text{Approved Leave Days}} \times 100$$
  - Present & Late count as attended.
  - Absent counts as not attended.
  - Approved leave is excluded from the denominator.
  - Distinct date grouping ensures multiple subjects on the same date do not inflate daily attendance count.
  - Division by zero handled gracefully (`N/A`).

- **📈 Attendance Reports & CSV Export**:
  - **Student-Wise Summary**: Individual attendance counts and percentage standing.
  - **Daily Session Logs**: Detailed chronological log of each lecture session.
  - **Class-Wise Breakdown**: Department and section averages with defaulter counts.
  - Date range filtering (`From Date` to `To Date`).
  - Instant **CSV Export** with formatted headers for spreadsheets.
  - Clean `@media print` layout for physical printing.

- **⚙️ Settings & Administration**:
  - Configurable attendance threshold slider (40% to 95%).
  - Dark Mode & Light Mode theme toggle.
  - Sample demonstration data restoration.
  - JSON database backup export and data wipe tools.

- **🔐 Demonstration Authentication**:
  - Admin login: `admin` / `admin123` (*Vishnu Vardhan*, Administrator)
  - Faculty login: `teacher` / `teacher123` (*Prof. Rajesh Kumar*, Computer Science)
  - One-click credential filler buttons on the login page.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, Vite
- **Routing**: React Router 7 (`react-router-dom`)
- **Icons**: React Icons (Heroicons v2)
- **Styling**: Vanilla CSS with modern CSS custom properties (Tokens, Glassmorphism, Responsive Grid)
- **Data Persistence**: HTML5 LocalStorage (Client-Side)

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- `npm`

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd student-attendance-system
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start development server:
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser.

4. Build for production:
   ```bash
   npm run build
   ```

---

## 🔑 Demo Credentials

| Role | Username | Password |
| :--- | :--- | :--- |
| **College Administrator** | `admin` | `admin123` |
| **Faculty Professor** | `teacher` | `teacher123` |

---

## 📁 Project Structure

```
student-attendance-system/
├── src/
│   ├── components/         # Layout, Navbar, Sidebar, Tables, Modals, Toasts
│   ├── context/            # AuthContext and DataContext providers
│   ├── data/               # Departments, initial students & seed attendance data
│   ├── pages/              # Login, Dashboard, Students, Details, Marking, Reports, Settings
│   ├── utils/              # Calculation algorithms, LocalStorage & CSV downloaders
│   ├── App.jsx             # Routes & layout structure
│   ├── index.css           # Design tokens, themes & layout styles
│   └── main.jsx
├── index.html
├── package.json
└── vite.config.js
```

---

## 📄 License

This project is open-source and intended for college mini-project demonstrations.
