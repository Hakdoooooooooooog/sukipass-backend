import type { BusinessRepository } from './business.repository.js';
import type { CreateBusinessInput, UpdateBusinessInput } from './business.schema.js';

export class BusinessService {
  constructor(private readonly businessRepository: BusinessRepository) {}

  public async createWithOwner(
    data: CreateBusinessInput['body'] & { passwordHash: string },
    ownerAccountNumber: string,
  ): Promise<unknown> {
    return this.businessRepository.createWithOwner(data, ownerAccountNumber);
  }

  async getAllPublic(query?: string) {
    return await this.businessRepository.findAllPublic(query);
  }

  public async findAll(): Promise<unknown[]> {
    return this.businessRepository.findAllPublic();
  }

  public async findById(id: string): Promise<unknown | null> {
    return this.businessRepository.findById(id);
  }

  public async update(id: string, data: UpdateBusinessInput['body']): Promise<unknown> {
    return this.businessRepository.update(id, data);
  }
}
