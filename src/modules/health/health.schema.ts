import { z } from 'zod';

export const HealthResponseSchema = z
  .object({
    status: z.literal('ok'),
    db: z.enum(['connected', 'down']),
    timestamp: z.string().meta({ example: '2026-06-09T00:00:00.000Z' }),
  })
  .meta({ id: 'HealthResponse', description: 'Service health status' });

export type HealthResponse = z.infer<typeof HealthResponseSchema>;
