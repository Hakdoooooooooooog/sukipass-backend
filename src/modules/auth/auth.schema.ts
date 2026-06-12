import { z } from 'zod';

/**
 * Validates incoming payloads for user login authentication requests.
 */
export const LoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
});

/**
 * Validates payloads for password update requests with security constraints.
 */
export const PasswordUpdateSchema = z.object({
  oldPassword: z.string().min(1, 'Old password is required'),
  newPassword: z
    .string()
    .min(6, 'Password must be at least 6 characters long')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
});

export type LoginInput = z.infer<typeof LoginSchema>;
export type PasswordUpdateInput = z.infer<typeof PasswordUpdateSchema>;
