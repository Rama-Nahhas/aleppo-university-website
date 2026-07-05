import type { RoleName } from '@/types';

interface RoleLikeUser {
  role_id?: number | null;
  role?: { name?: string | null } | null;
  role_name?: string | null;
  roleName?: string | null;
}

const roleIdMap: Record<number, RoleName> = {
  1: 'admin',
  2: 'dean',
  3: 'academic_doctor',
  4: 'lab_technician',
  5: 'warehouse_manager',
  6: 'medical_doctor',
  7: 'student',
  8: 'employee',
};

export const resolveRoleName = (user: RoleLikeUser | null | undefined): RoleName | undefined => {
  const rawRoleName = user?.role?.name || user?.role_name || user?.roleName;
  if (typeof rawRoleName === 'string' && rawRoleName.trim()) {
    return rawRoleName as RoleName;
  }

  if (typeof user?.role_id === 'number') {
    return roleIdMap[user.role_id];
  }

  return undefined;
};
