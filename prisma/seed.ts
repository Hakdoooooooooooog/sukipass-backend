import bcrypt from 'bcrypt';
import { prisma } from '../src/lib/prisma.js';

async function main() {
  // Admin
  const hashedPassword = await bcrypt.hash('adminpassword123', 10);
  await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      name: 'Super Admin',
      email: 'admin@sukipass.com',
      password: hashedPassword,
      accountNumber: 'ADMIN-001',
      role: 'ADMIN',
      isTemporary: false,
    },
  });

  // Customer
  const customerPassword = await bcrypt.hash('Customer@123', 10);
  const customer = await prisma.user.upsert({
    where: { username: 'customer_test' },
    update: {},
    create: {
      username: 'customer_test',
      name: 'Juan dela Cruz',
      email: 'customer@sukipass.com',
      password: customerPassword,
      accountNumber: 'CUS-001',
      role: 'CUSTOMER',
      isTemporary: false,
    },
  });

  // Business Owner
  const ownerPassword = await bcrypt.hash('Owner@123', 10);
  const owner = await prisma.user.upsert({
    where: { username: 'owner_test' },
    update: {},
    create: {
      username: 'owner_test',
      name: 'Maria Santos',
      email: 'owner@sukipass.com',
      password: ownerPassword,
      accountNumber: 'OWN-001',
      role: 'BUSINESS_OWNER',
      isTemporary: false,
    },
  });

  // Business
  const business = await prisma.business.upsert({
    where: { id: '00000000-0000-0000-0000-000000000001' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000001',
      name: 'Suki Cafe',
      address: '123 Loyalty St, Manila',
      category: 'Food & Beverage',
      contactNumber: '09171234567',
      ownerId: owner.id,
    },
  });

  // -----------------------------------------------
  // Campaign 1: Coffee Loyalty Card (in progress)
  // stampGoal: 10 | customer has 3 stamps
  // -----------------------------------------------
  const campaign1 = await prisma.campaign.upsert({
    where: { id: '00000000-0000-0000-0000-000000000002' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000002',
      businessId: business.id,
      name: 'Coffee Loyalty Card',
      description: 'Buy 10 coffees, get 1 free!',
      stampGoal: 10,
      reward: '1 free coffee of your choice',
      isActive: true,
    },
  });

  const cc1 = await prisma.customerCampaign.upsert({
    where: { customerId_campaignId: { customerId: customer.id, campaignId: campaign1.id } },
    update: {},
    create: {
      customerId: customer.id,
      campaignId: campaign1.id,
      stampCount: 3,
      isCompleted: false,
    },
  });

  // 3 STAMP transactions matching stampCount: 3
  for (const { createdAt, amount } of [
    { createdAt: new Date('2026-06-10T09:00:00Z'), amount: 150 },
    { createdAt: new Date('2026-06-12T14:30:00Z'), amount: 185 },
    { createdAt: new Date('2026-06-14T11:00:00Z'), amount: 200 },
  ]) {
    await prisma.transaction.create({
      data: {
        customerCampaignId: cc1.id,
        businessId: business.id,
        performedById: owner.id,
        type: 'STAMP',
        stampCount: 1,
        amount,
        createdAt,
      },
    });
  }

  // -----------------------------------------------
  // Campaign 2: Pastry Club (completed)
  // stampGoal: 5 | customer completed it and redeemed
  // -----------------------------------------------
  const campaign2 = await prisma.campaign.upsert({
    where: { id: '00000000-0000-0000-0000-000000000003' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000003',
      businessId: business.id,
      name: 'Pastry Club',
      description: 'Buy 5 pastries, get 1 free!',
      stampGoal: 5,
      reward: '1 free pastry of your choice',
      isActive: true,
    },
  });

  const cc2 = await prisma.customerCampaign.upsert({
    where: { customerId_campaignId: { customerId: customer.id, campaignId: campaign2.id } },
    update: {},
    create: {
      customerId: customer.id,
      campaignId: campaign2.id,
      stampCount: 5,
      isCompleted: true,
    },
  });

  // 5 STAMP transactions matching stampCount: 5
  for (const { createdAt, amount } of [
    { createdAt: new Date('2026-05-20T09:00:00Z'), amount: 120 },
    { createdAt: new Date('2026-05-22T10:00:00Z'), amount: 95 },
    { createdAt: new Date('2026-05-24T13:00:00Z'), amount: 160 },
    { createdAt: new Date('2026-05-26T15:00:00Z'), amount: 110 },
    { createdAt: new Date('2026-05-28T11:00:00Z'), amount: 175 },
  ]) {
    await prisma.transaction.create({
      data: {
        customerCampaignId: cc2.id,
        businessId: business.id,
        performedById: owner.id,
        type: 'STAMP',
        stampCount: 1,
        amount,
        createdAt,
      },
    });
  }

  // 1 REDEEM transaction — reward was claimed after completing the card
  await prisma.transaction.create({
    data: {
      customerCampaignId: cc2.id,
      businessId: business.id,
      performedById: owner.id,
      type: 'REDEEM',
      createdAt: new Date('2026-05-30T12:00:00Z'),
    },
  });

  // Staff / Cashier
  const staffPassword = await bcrypt.hash('Staff@123', 10);
  const staff = await prisma.user.upsert({
    where: { username: 'staff_test' },
    update: {},
    create: {
      username: 'staff_test',
      name: 'Carlo Reyes',
      email: 'staff@sukipass.com',
      password: staffPassword,
      accountNumber: 'STF-001',
      role: 'STAFF',
      isTemporary: false,
    },
  });

  await prisma.staffProfile.upsert({
    where: { userId: staff.id },
    update: {},
    create: {
      userId: staff.id,
      businessId: business.id,
    },
  });

  console.log('✅ Admin seeded');
  console.log('✅ Customer seeded');
  console.log('✅ Business owner seeded');
  console.log('✅ Business seeded');
  console.log('✅ Campaign 1 (Coffee Loyalty Card) — 3/10 stamps in progress');
  console.log('✅ Staff (cashier) seeded');
  console.log('✅ Campaign 2 (Pastry Club) — 5/5 stamps completed + redeemed');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
