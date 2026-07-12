import { Role } from '../middleware/rbac';

export const ROLES = {
  ADMIN: 'ADMIN' as const,
  ASSET_MANAGER: 'ASSET_MANAGER' as const,
  DEPT_HEAD: 'DEPT_HEAD' as const,
  EMPLOYEE: 'EMPLOYEE' as const
};

export type AppRole = Role;

