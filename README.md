# Department Workflow Platform

[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Next.js](https://img.shields.io/badge/Next.js-14-000000?style=flat-square&logo=nextdotjs&logoColor=white)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=white)](https://react.dev)
[![Express](https://img.shields.io/badge/Express-4-000000?style=flat-square&logo=express&logoColor=white)](https://expressjs.com)
[![SQLite](https://img.shields.io/badge/SQLite-3-003B57?style=flat-square&logo=sqlite&logoColor=white)](https://sqlite.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-06D6A0?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-12-0055FF?style=flat-square&logo=framer&logoColor=white)](https://framermotion.framer.website)

A modern, workflow-driven platform that transforms everyday academic operations into structured, transparent, and sustainable processes. Built with Next.js 14, Express, and TypeScript.

## Features

### Core Modules

- **Dashboard** — Role-based dashboards for Admin, Teachers, and Students with at-a-glance metrics
- **Student Management** — Student profiles, records, and academic history
- **Attendance Tracking** — Mark and view attendance records
- **Marks & Grades** — Record, calculate, and view student marks
- **Fees Management** — Track fee payments, dues, and receipts
- **Hostel Management** — Hostel allocation, room assignments, and occupancy tracking
- **Leave Management** — Leave applications, approvals, and history
- **Faculty Management** — Faculty profiles, assignments, and workload tracking
- **Student Reports** — Generate comprehensive student performance reports
- **Workflow Automation** — Configurable approval workflows for academic processes

### Access Control

- **Admin** — Full system access, user management, configuration
- **Teacher** — Class management, attendance, marks entry, leave requests
- **Student** — View attendance, marks, fees, reports, apply for leave

## Tech Stack

| Layer      | Technology                                                              |
| ---------- | ----------------------------------------------------------------------- |
| Frontend   | Next.js 14, React 18, TypeScript, Tailwind CSS, Framer Motion, Recharts |
| Backend    | Express.js, TypeScript, JWT authentication, RBAC middleware              |
| Database   | SQLite with better-sqlite3, migration and seed scripts                   |
| UI Kit     | Lucide React icons, clsx, tailwind-merge                                |

## Project Structure

```
department-workflow-platform/
├── src/                        # Next.js frontend (App Router)
│   ├── app/
│   │   ├── api/                # API routes
│   │   ├── dashboard/          # Role-based dashboards (admin/student/teacher)
│   │   ├── fees/               # Fee management
│   │   ├── hostel/             # Hostel management
│   │   ├── login/              # Authentication
│   │   ├── profile/            # User profiles
│   │   ├── settings/           # System settings
│   │   ├── student-report/     # Student report generation
│   │   └── page.tsx            # Landing page
│   ├── components/             # Shared UI components
│   │   ├── admin/              # Admin-specific components
│   │   ├── auth/               # Authentication components
│   │   ├── common/             # Shared layout components
│   │   ├── dashboard/          # Dashboard-specific components
│   │   ├── faculty/            # Faculty-specific components
│   │   ├── ui/                 # Reusable UI primitives
│   │   └── workflows/          # Workflow-specific components
│   ├── hooks/                  # Custom React hooks
│   ├── lib/                    # Utility functions and shared logic
│   │   └── db/                 # Database client and helpers
│   └── types/                  # TypeScript type definitions
├── backend/                    # Express API server
│   └── src/
│       ├── core/               # Auth, RBAC, Workflow engine
│       ├── routes/             # API route handlers
│       ├── database/           # Migrations and seeds
│       ├── middleware/         # Auth and validation middleware
│       ├── services/           # Business logic layer
│       ├── types/              # TypeScript interfaces
│       ├── config/             # Configuration
│       └── utils/              # Helper functions
├── data/                       # SQLite database files
└── docs/                       # Documentation
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
git clone https://github.com/thevanshit/department-workflow-platform.git
cd department-workflow-platform

# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..
```

### Database Setup

```bash
cd backend
npm run migrate
npm run seed
cd ..
```

### Development

```bash
# Start the backend server (from backend/)
cd backend
npm run dev

# In a separate terminal, start the frontend (from root)
npm run dev
```

The app will be available at [http://localhost:3000](http://localhost:3000) with the API at [http://localhost:5000](http://localhost:5000).

## License

MIT License — see [LICENSE](./LICENSE)
