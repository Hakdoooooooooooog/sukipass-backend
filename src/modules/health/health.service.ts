import type { HealthRepository } from './health.repository.js';
import type { HealthResponse } from './health.schema.js';

export class HealthService {
  constructor(private readonly repository: HealthRepository) {}

  async getHealth(): Promise<HealthResponse> {
    const dbUp = await this.repository.ping();
    return {
      status: 'ok',
      db: dbUp ? 'connected' : 'down',
      timestamp: new Date().toISOString(),
    };
  }
}
