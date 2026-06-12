import { Role } from '@prisma/client';
import bcrypt from 'bcrypt';
import { prisma } from '../src/lib/prisma.js';

async function main() {
  const hashedPassword = await bcrypt.hash('adminpassword123', 10);

  await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      email: 'admin@sukipass.com',
      password: hashedPassword,
      accountNumber: 'ADMIN-001',
      role: Role.ADMIN,
      isTemporary: false, // ✅ explicit for clarity
    },
  });

  console.log('✅ Admin user seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
