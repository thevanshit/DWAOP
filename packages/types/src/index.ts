// Shared types for Department Workflow Platform
// These types are used across apps/web and services/api

export type UserRole = 'student' | 'teacher' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export type WorkflowStatus = 'created' | 'in_progress' | 'under_review' | 'finalised' | 'locked' | 'done' | 'delayed';

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
