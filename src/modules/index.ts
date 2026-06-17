import type { AppModule } from './module.types.js';
import { healthModule } from './health/health.module.js';
import { authModule } from './auth/auth.module.js';
import { staffModule } from './staff/staff.module.js';
import { businessModule } from './business/business.module.js';
import { adminModule } from './admin/admin.module.js';
import { customerModule } from './customer/customer.module.js';

export const modules: AppModule[] = [
  healthModule,
  authModule,
  staffModule,
  businessModule,
  adminModule,
  customerModule,
];
