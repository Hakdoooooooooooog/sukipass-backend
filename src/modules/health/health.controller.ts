import type { Request, Response } from 'express';
import type { HealthService } from './health.service.js';

export class HealthController {
  constructor(private readonly service: HealthService) {}

  getHealth = async (_req: Request, res: Response): Promise<void> => {
    const health = await this.service.getHealth();
    res.status(200).json(health);
  };
}
