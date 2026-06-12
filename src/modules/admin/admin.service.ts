import { AdminRepository } from './admin.repository.js';
import type { Role } from '@prisma/client';

export class AdminService {
  private adminRepository = new AdminRepository();

  async getUsers(role?: Role) {
    return await this.adminRepository.findAll(role);
  }
}
