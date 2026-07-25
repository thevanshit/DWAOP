import rateLimit from 'express-rate-limit';
import { Request, Response } from 'express';
import { config } from '@/config';

/**
 * Strict rate limiter for login endpoints.
 * Prevents brute-force attacks.
 *
 * Default: 10 attempts per 15 minutes per IP
 */
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: {
    error: 'Too many login attempts. Please try again after 15 minutes.',
    code: 'RATE_LIMIT_LOGIN',
    retryAfter: '15 minutes',
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req: Request): string => {
    // Use IP + email (if provided) as the key for more granular limiting
    const email = req.body?.email || 'unknown';
    return `${req.ip}-${email}`;
  },
  skipSuccessfulRequests: false, // Count all attempts
});

/**
 * Moderate rate limiter for registration endpoints.
 * Prevents account creation abuse.
 *
 * Default: 5 attempts per hour per IP
 */
export const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5,
  message: {
    error: 'Too many registration attempts. Please try again later.',
    code: 'RATE_LIMIT_REGISTER',
    retryAfter: '1 hour',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Moderate rate limiter for password change/reset endpoints.
 *
 * Default: 3 attempts per 30 minutes per IP
 */
export const passwordChangeLimiter = rateLimit({
  windowMs: 30 * 60 * 1000, // 30 minutes
  max: 3,
  message: {
    error: 'Too many password change attempts. Please try again later.',
    code: 'RATE_LIMIT_PASSWORD',
    retryAfter: '30 minutes',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Moderate rate limiter for email verification resend.
 *
 * Default: 3 attempts per hour per IP
 */
export const emailVerificationLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3,
  message: {
    error: 'Too many verification requests. Please try again later.',
    code: 'RATE_LIMIT_VERIFICATION',
    retryAfter: '1 hour',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Strict rate limiter for token refresh.
 *
 * Default: 20 attempts per 15 minutes per IP
 */
export const refreshLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  message: {
    error: 'Too many refresh attempts. Please try again later.',
    code: 'RATE_LIMIT_REFRESH',
    retryAfter: '15 minutes',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export default {
  loginLimiter,
  registerLimiter,
  passwordChangeLimiter,
  emailVerificationLimiter,
  refreshLimiter,
};
