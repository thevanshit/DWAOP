# Quick Start Guide

## Step-by-Step Setup Instructions

### 1. Navigate to Project Directory
```bash
cd ~/Desktop/College/Hackathon/Website\ Codes/dwaop-platform
```

### 2. Install Dependencies
```bash
npm install
```

This will install all required packages including:
- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- Lucide React (icons)
- And other dependencies

### 3. Start Development Server
```bash
npm run dev
```

### 4. Open in Browser
Open your browser and navigate to:
```
http://localhost:3000
```

## Testing the Application

### Landing Page
- You'll see the DWAOP landing page with feature descriptions
- Click "Get Started" or "Login to Platform"

### Login Flow
1. **Role Selection**: Choose Student, Faculty, or Administration
2. **Login Form**: Enter any email and password (authentication is simulated)
3. **Dashboard**: You'll be redirected to your role-specific dashboard

### Dashboard Features to Test

#### Student Dashboard
- View pending workflows
- Check attendance status
- See upcoming deadlines
- View assignments
- Track internal marks
- Request leaves
- Access Student Track Report

#### Teacher Dashboard
- Manage attendance sessions
- Create assignments
- Evaluate submissions
- Enter internal marks
- Handle departmental tasks
- View pending evaluations

#### Admin Dashboard
- View department Kanban board
- Monitor at-risk students
- Check analytics
- Configure policies
- Manage all workflows

## Project Structure Overview

```
dwaop-platform/
├── src/
│   ├── app/              # Pages (Next.js App Router)
│   ├── components/       # React components
│   ├── types/           # TypeScript types
│   └── styles/          # Global CSS
├── public/              # Static files
└── Configuration files
```

## Common Commands

```bash
# Development
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Lint code
npm run lint
```

## Troubleshooting

### Port Already in Use
If port 3000 is busy, Next.js will automatically use the next available port (3001, 3002, etc.)

### Module Not Found Errors
Run `npm install` again to ensure all dependencies are installed.

### TypeScript Errors
Make sure TypeScript is properly installed: `npm install -D typescript @types/react @types/node`

## Next Steps

1. **Customize**: Modify colors, branding, and content in the components
2. **Add Backend**: Connect to your API endpoints
3. **Add Authentication**: Implement real authentication system
4. **Add Database**: Connect to PostgreSQL or your preferred database
5. **Deploy**: Deploy to Vercel, Netlify, or your preferred hosting

## Notes

- All data is currently mock data for demonstration
- Authentication uses localStorage (replace with real auth)
- The UI is fully responsive and mobile-friendly
- Design follows Jira/Atlassian style guidelines

## Support

Refer to the main README.md for detailed documentation.
