# DWAOP - Department Workflow & Academic Operations Platform

A workflow-driven, role-based digital platform for managing academic operations in university departments. Built with Next.js, TypeScript, and Tailwind CSS, featuring a Jira-inspired UI/UX.

## Features

### For Students
- Real-time attendance tracking
- Assignment submission and tracking
- Internal marks visibility
- Leave request management
- Student Track Report
- Eligibility status monitoring

### For Faculty & Teachers
- Attendance session management
- Assignment creation and evaluation
- Internal marks entry and review
- Departmental task management
- Workflow tracking

### For Administrators
- Department-wide Kanban board
- At-risk student monitoring
- Analytics and reporting
- Policy configuration
- Workflow oversight
- Risk heat maps

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **UI Design**: Jira-inspired (Atlassian style)

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Navigate to the project directory:
```bash
cd dwaop-platform
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
dwaop-platform/
├── src/
│   ├── app/                    # Next.js app router pages
│   │   ├── page.tsx           # Landing page
│   │   ├── login/              # Login pages
│   │   │   ├── page.tsx       # Role selection
│   │   │   ├── student/       # Student login
│   │   │   ├── teacher/       # Teacher login
│   │   │   └── admin/         # Admin login
│   │   └── dashboard/         # Dashboard pages
│   │       ├── student/        # Student dashboard
│   │       ├── teacher/        # Teacher dashboard
│   │       └── admin/         # Admin dashboard
│   ├── components/             # React components
│   │   ├── auth/              # Authentication components
│   │   ├── common/            # Shared components
│   │   ├── dashboard/         # Dashboard-specific components
│   │   └── workflows/         # Workflow components
│   ├── types/                 # TypeScript type definitions
│   └── styles/                # Global styles
├── public/                    # Static assets
└── package.json              # Dependencies and scripts
```

## Usage

### Landing Page
- Visit the root URL to see the landing page
- Click "Get Started" or "Login to Platform" to proceed to login

### Login Flow
1. Select your role (Student, Faculty, or Administration)
2. Enter credentials (currently simulated - no backend required)
3. You'll be redirected to your role-specific dashboard

### Dashboards

#### Student Dashboard
- View pending workflows and deadlines
- Track attendance and eligibility
- Submit assignments
- Request leaves
- View internal marks
- Access Student Track Report

#### Teacher Dashboard
- Manage attendance sessions
- Create and evaluate assignments
- Enter and review internal marks
- Handle departmental tasks
- View pending evaluations

#### Admin Dashboard
- Monitor department-wide workflows via Kanban board
- Track at-risk students
- View analytics and trends
- Configure policies
- Manage all workflows

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Adding New Features

1. Create components in `src/components/`
2. Add pages in `src/app/`
3. Define types in `src/types/index.ts`
4. Update navigation in dashboard layouts

## Design System

The platform uses a Jira-inspired design system:

- **Primary Color**: Jira Blue (#0052CC)
- **Background**: Light Gray (#F4F5F7)
- **Text**: Dark Gray (#172B4D)
- **Borders**: Light Gray (#DFE1E6)

## Notes

- This is a front-end prototype. Backend integration is required for full functionality.
- Authentication is currently simulated using localStorage.
- All data is mock data for demonstration purposes.
- The platform is designed to be responsive and mobile-friendly.

## Future Enhancements

- Backend API integration
- Real authentication system
- Database connectivity
- Real-time notifications
- File upload functionality
- Advanced analytics
- Mobile app version

## License

This project is created for academic/hackathon purposes.

## Contact

For questions or support, please refer to the project documentation.
