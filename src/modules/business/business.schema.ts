import { z } from 'zod';

// Sub-schema for nested JSON profile property of Business
const BusinessProfileSchema = z.object({
  tagline: z.string().trim().max(150).optional(),
  description: z.string().trim().max(1000).optional(),
  business_hours: z.record(z.string(), z.string()).optional(),
  social_links: z.record(z.string(), z.string().url()).optional(),
});

// Validation for POST request (Onboarding)
export const CreateBusinessSchema = z.object({
  body: z.object({
    username: z.string().trim().min(3).max(30),
    email: z.string().trim().email(),
    password: z
      .string()
      .min(6, 'Password must be at least 6 characters long')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number')
      .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
    business_name: z.string().trim().min(2),
    physical_address: z.string().trim().min(5),
    category: z.string().trim().min(2),
    contact_number: z.string().trim().min(7),
    profile: BusinessProfileSchema.optional(),
  }),
});

// Validation for PATCH request (Update Profile)
export const UpdateBusinessSchema = z.object({
  body: z.object({
    business_name: z.string().trim().min(2).optional(),
    physical_address: z.string().trim().min(5).optional(),
    category: z.string().trim().min(2).optional(),
    contact_number: z.string().trim().min(7).optional(),
    profile: BusinessProfileSchema.optional(),
  }),
});

// Validation for GET request (Get All Businesses)
export const GetBusinessesSchema = z.object({
  query: z.object({
    search: z.string().optional().describe('Search businesses by name or address'),
  }),
});

export type CreateBusinessInput = z.infer<typeof CreateBusinessSchema>;
export type UpdateBusinessInput = z.infer<typeof UpdateBusinessSchema>;
