// Breadcrumb خفيف للصفحات المتفرعة فعلياً من صفحة أب (nested)، مش لكل الصفحات
// المتشابهة بنفس المستوى — هاي أصلاً موجودة ومتاحة عبر الـ sidebar.

interface CrumbDef {
  labelAr: string;
  labelEn: string;
  /** مسار الصفحة الأب المباشرة (لبناء السلسلة تصاعدياً) */
  parent?: string;
}

const DASHBOARD_ROOT = "/dashboard";

const crumbs: Record<string, CrumbDef> = {
  [DASHBOARD_ROOT]: { labelAr: "لوحة التحكم", labelEn: "Dashboard" },

  "/dashboard/profile": { labelAr: "الملف الشخصي", labelEn: "My Profile", parent: DASHBOARD_ROOT },
  "/dashboard/change-password": { labelAr: "تغيير كلمة المرور", labelEn: "Change Password", parent: "/dashboard/profile" },

  "/dashboard/users": { labelAr: "إدارة المستخدمين", labelEn: "Manage Users", parent: DASHBOARD_ROOT },
  "/dashboard/users/doctor-requests": { labelAr: "طلبات الدكاترة", labelEn: "Doctor Requests", parent: "/dashboard/users" },
  "/dashboard/users/active-doctors": { labelAr: "الدكاترة النشطون", labelEn: "Active Doctors", parent: "/dashboard/users" },
  "/dashboard/users/students": { labelAr: "الطلاب", labelEn: "Students", parent: "/dashboard/users" },
  "/dashboard/users/others": { labelAr: "مستخدمون آخرون", labelEn: "Other Users", parent: "/dashboard/users" },

  "/dashboard/lab-schedules": { labelAr: "جداول المخبر", labelEn: "Lab Schedules", parent: DASHBOARD_ROOT },
  "/dashboard/lab-students": { labelAr: "طلاب المخبر", labelEn: "Lab Students", parent: "/dashboard/lab-schedules" },

  "/dashboard/exam-employee": { labelAr: "لوحة الامتحانات", labelEn: "Exam Dashboard", parent: DASHBOARD_ROOT },
  "/dashboard/exam-employee/subjects": { labelAr: "المواد حسب السنة", labelEn: "Subjects by Year", parent: "/dashboard/exam-employee" },
  "/dashboard/exam-employee/enter-grades": { labelAr: "إدخال العلامات", labelEn: "Enter Grades", parent: "/dashboard/exam-employee/subjects" },
  "/dashboard/exam-employee/promoted": { labelAr: "الطلاب المترفعون", labelEn: "Promoted Students", parent: "/dashboard/exam-employee/subjects" },
};

/** مسارات فيها باراميترات (id إلخ) */
const patternCrumbs: { pattern: RegExp; def: CrumbDef }[] = [
  {
    pattern: /^\/dashboard\/exam-employee\/subjects\/\d+\/students$/,
    def: { labelAr: "طلاب المادة", labelEn: "Subject Students", parent: "/dashboard/exam-employee/subjects" },
  },
];

const findCrumbDef = (pathname: string): CrumbDef | undefined =>
  crumbs[pathname] ?? patternCrumbs.find((p) => p.pattern.test(pathname))?.def;

export interface BreadcrumbItem {
  to: string;
  labelAr: string;
  labelEn: string;
  isCurrent: boolean;
}

/**
 * بيرجع سلسلة الـ breadcrumb تصاعدياً من الجذر لحتى الصفحة الحالية.
 * بيرجع مصفوفة فاضية إذا الصفحة مالها أب معرّف (يعني صفحة مستوى أول، بلا تفرّع).
 */
export const getBreadcrumb = (pathname: string): BreadcrumbItem[] => {
  const current = findCrumbDef(pathname);
  if (!current || !current.parent) return [];

  const chain: BreadcrumbItem[] = [{ to: pathname, labelAr: current.labelAr, labelEn: current.labelEn, isCurrent: true }];

  let parentPath: string | undefined = current.parent;
  const visited = new Set<string>([pathname]);

  while (parentPath && !visited.has(parentPath)) {
    visited.add(parentPath);
    const def: CrumbDef | undefined = crumbs[parentPath];
    if (!def) break;
    chain.unshift({ to: parentPath, labelAr: def.labelAr, labelEn: def.labelEn, isCurrent: false });
    parentPath = def.parent;
  }

  return chain;
};
