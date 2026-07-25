// Mock Authentication for Development
// This bypasses the actual database for quick testing

interface MockUser {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: string;
  departmentId?: string;
}

const mockUsers: MockUser[] = [
  {
    id: 'admin001',
    email: 'admin@campus.edu',
    password: 'admin123',
    firstName: 'System',
    lastName: 'Administrator',
    role: 'admin',
    departmentId: 'dept001'
  },
  {
    id: 'teacher001',
    email: 'teacher@campus.edu',
    password: 'teacher123',
    firstName: 'John',
    lastName: 'Smith',
    role: 'teacher',
    departmentId: 'dept002'
  },
  {
    id: 'student001',
    email: 'student@campus.edu',
    password: 'student123',
    firstName: 'Alice',
    lastName: 'Johnson',
    role: 'student',
    departmentId: 'dept003'
  }
];

export const mockAuth = {
  authenticate: (email: string, password: string): MockUser | null => {
    const user = mockUsers.find(u => u.email === email && u.password === password);
    return user || null;
  },
  
  getUsers: (): MockUser[] => mockUsers,
  
  getUserById: (id: string): MockUser | null => {
    return mockUsers.find(u => u.id === id) || null;
  }
};

export default mockAuth;