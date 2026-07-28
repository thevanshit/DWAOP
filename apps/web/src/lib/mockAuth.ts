/**
 * @deprecated Mock Authentication Module
 * 
 * This module is DEPRECATED and should NOT be used in production.
 * Authentication now flows through the backend API via useAuth() hook.
 * 
 * This file is kept only as a reference for development testing.
 * All mock credentials have been removed for security.
 * 
 * Remove this file before production deployment.
 */

export const mockAuth = {
  authenticate: (_email: string, _password: string): null => {
    console.warn('[DEPRECATED] mockAuth.authenticate() called. Use useAuth().login() instead.');
    return null;
  },
  
  getUsers: (): [] => {
    console.warn('[DEPRECATED] mockAuth.getUsers() called. Use API /auth/me instead.');
    return [];
  },
  
  getUserById: (_id: string): null => {
    console.warn('[DEPRECATED] mockAuth.getUserById() called. Use API /users/:id instead.');
    return null;
  }
};

export default mockAuth;
