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
    const normalized = rawRoleName
      .trim()
      .toLowerCase()
      .replace(/[-\s]+/g, '_') // convert spaces or dashes to underscore
      .replace(/[^a-z_]/g, ''); // strip unexpected chars

    // common synonyms mapping
    const synonyms: Record<string, RoleName> = {
      'super_admin': 'admin',
      'super-admin': 'admin',
      'superadmin': 'admin',
      'admin': 'admin',
      'administrator': 'admin',
      'dean': 'dean',
      'directorate': 'dean',
      'academic_doctor': 'academic_doctor',
      'academic-doctor': 'academic_doctor',
      'academicdoctor': 'academic_doctor',
      'medical_doctor': 'medical_doctor',
      'medical-doctor': 'medical_doctor',
      'medicaldoctor': 'medical_doctor',
      'doctor': 'academic_doctor',
      'student': 'student',
      'nurse': 'nurse',
      'lab_technician': 'lab_technician',
      'lab-technician': 'lab_technician',
      'warehouse_manager': 'warehouse_manager',
      'employee': 'employee',
      'university_admin': 'university_admin',
    };

    if (normalized in synonyms) return synonyms[normalized];
    // if it already matches RoleName union
    return normalized as RoleName;
  }

  if (typeof user?.role_id === 'number') {
    return roleIdMap[user.role_id];
  }

  return undefined;
};
