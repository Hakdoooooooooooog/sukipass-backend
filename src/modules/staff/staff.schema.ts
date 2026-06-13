import { z } from 'zod';

export const CreateStaffSchema = z.object({
  username: z.string().min(3),
  email: z.string().email(),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters long')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
});

export const UpdateStaffSchema = z.object({
  username: z.string().min(3).optional(),
  email: z.string().email().optional(),
});
