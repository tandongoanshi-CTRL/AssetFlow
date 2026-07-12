import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function ensureDepartment(name: string) {
  const existing = await prisma.department.findFirst({ where: { name } });
  if (existing) return existing;
  return prisma.department.create({ data: { name, status: 'ACTIVE' } });
}

async function ensureUser(input: {
  name: string;
  email: string;
  password: string;
  role: 'EMPLOYEE' | 'DEPT_HEAD' | 'ASSET_MANAGER' | 'ADMIN';
  departmentId?: string | null;
}) {
  const existing = await prisma.user.findUnique({ where: { email: input.email } });
  const passwordHash = await bcrypt.hash(input.password, 10);

  if (existing) {
    return prisma.user.update({
      where: { id: existing.id },
      data: {
        name: input.name,
        passwordHash,
        role: input.role,
        departmentId: input.departmentId ?? existing.departmentId,
        status: 'ACTIVE'
      }
    });
  }

  return prisma.user.create({
    data: {
      name: input.name,
      email: input.email,
      passwordHash,
      role: input.role,
      departmentId: input.departmentId ?? undefined,
      status: 'ACTIVE'
    }
  });
}

async function ensureCategory(name: string, description?: string) {
  const existing = await prisma.assetCategory.findFirst({ where: { name } });
  if (existing) return existing;
  return prisma.assetCategory.create({ data: { name, description } });
}

async function ensureAsset(input: {
  name: string;
  assetTag: string;
  categoryId: string;
  isBookable: boolean;
  location?: string;
  condition?: string;
}) {
  const existing = await prisma.asset.findUnique({ where: { assetTag: input.assetTag } });
  if (existing) {
    return prisma.asset.update({
      where: { id: existing.id },
      data: {
        name: input.name,
        categoryId: input.categoryId,
        isBookable: input.isBookable,
        location: input.location,
        condition: input.condition,
        state: 'AVAILABLE'
      }
    });
  }

  return prisma.asset.create({
    data: {
      name: input.name,
      assetTag: input.assetTag,
      categoryId: input.categoryId,
      isBookable: input.isBookable,
      location: input.location,
      condition: input.condition,
      state: 'AVAILABLE'
    }
  });
}

async function ensureAuditCycle(name: string, departmentId: string, assetId: string, auditorId: string) {
  const existing = await prisma.auditCycle.findFirst({ where: { name } });
  if (existing) {
    const item = await prisma.auditItem.findFirst({ where: { auditCycleId: existing.id, assetId } });
    if (!item) {
      await prisma.auditItem.create({
        data: {
          auditCycleId: existing.id,
          assetId,
          auditorId,
          verificationStatus: 'MISSING'
        }
      });
    }
    return existing;
  }

  const created = await prisma.auditCycle.create({
    data: {
      name,
      scopeDepartmentId: departmentId,
      status: 'ACTIVE'
    }
  });

  await prisma.auditItem.create({
    data: {
      auditCycleId: created.id,
      assetId,
      auditorId,
      verificationStatus: 'MISSING'
    }
  });
  return created;
}

async function main() {
  const engineering = await ensureDepartment('Engineering');
  const operations = await ensureDepartment('Operations');
  const category = await ensureCategory('Laptops', 'Portable computing devices');

  const admin = await ensureUser({
    name: 'System Admin',
    email: 'admin@assetflow.local',
    password: 'Admin1234!',
    role: 'ADMIN',
    departmentId: engineering.id
  });

  const deptHead = await ensureUser({
    name: 'Jane Manager',
    email: 'depthead@assetflow.local',
    password: 'Manager1234!',
    role: 'DEPT_HEAD',
    departmentId: engineering.id
  });

  const employee = await ensureUser({
    name: 'Alex Employee',
    email: 'employee@assetflow.local',
    password: 'Employee1234!',
    role: 'EMPLOYEE',
    departmentId: engineering.id
  });

  await prisma.department.update({
    where: { id: engineering.id },
    data: { departmentHeadId: deptHead.id }
  });

  const laptop = await ensureAsset({
    name: 'ThinkPad T14',
    assetTag: 'ASSET-1001',
    categoryId: category.id,
    isBookable: true,
    location: 'HQ-101',
    condition: 'Excellent'
  });

  const projector = await ensureAsset({
    name: 'Projector',
    assetTag: 'ASSET-1002',
    categoryId: category.id,
    isBookable: false,
    location: 'HQ-205',
    condition: 'Good'
  });

  await ensureAuditCycle('Q3 Asset Audit', engineering.id, laptop.id, admin.id);

  console.log('Seeded departments:', [engineering.name, operations.name].join(', '));
  console.log('Seeded users:', [admin.email, deptHead.email, employee.email].join(', '));
  console.log('Seeded assets:', [laptop.assetTag, projector.assetTag].join(', '));
}

main()
  .catch((error) => {
    console.error('Seed failed', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
