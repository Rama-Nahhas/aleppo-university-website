import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  LayoutDashboard, Users, Building2, BookOpen, FlaskConical, Warehouse,
  ClipboardList, Hospital, Megaphone, LogOut, GraduationCap, ChevronLeft,
  Globe, Calendar, Wrench, Package, FileText, Stethoscope, UserCheck
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { RoleName } from '@/types';

interface NavItem {
  to: string;
  icon: React.ElementType;
  labelAr: string;
  labelEn: string;
  roles?: RoleName[];
}

const allNavItems: NavItem[] = [
  { to: '/dashboard', icon: LayoutDashboard, labelAr: 'لوحة التحكم', labelEn: 'Dashboard' },
  // Admin
  { to: '/dashboard/users', icon: Users, labelAr: 'المستخدمون', labelEn: 'Users', roles: ['admin'] },
  { to: '/dashboard/colleges', icon: Building2, labelAr: 'الكليات', labelEn: 'Colleges', roles: ['admin'] },
  { to: '/dashboard/departments', icon: Building2, labelAr: 'الأقسام', labelEn: 'Departments', roles: ['admin'] },
  { to: '/dashboard/courses', icon: BookOpen, labelAr: 'المقررات', labelEn: 'Courses', roles: ['admin', 'academic_doctor'] },
  { to: '/dashboard/laboratories', icon: FlaskConical, labelAr: 'المخابر', labelEn: 'Laboratories', roles: ['admin', 'lab_technician', 'dean'] },
  { to: '/dashboard/warehouses', icon: Warehouse, labelAr: 'المستودعات', labelEn: 'Warehouses', roles: ['admin', 'warehouse_manager'] },
  { to: '/dashboard/orders', icon: ClipboardList, labelAr: 'الطلبات', labelEn: 'Orders', roles: ['admin', 'warehouse_manager', 'lab_technician', 'dean'] },
  { to: '/dashboard/hospital', icon: Hospital, labelAr: 'المستشفى', labelEn: 'Hospital', roles: ['admin', 'medical_doctor', 'nurse'] },
  { to: '/dashboard/announcements', icon: Megaphone, labelAr: 'الإعلانات', labelEn: 'Announcements', roles: ['admin'] },
  // Student
  { to: '/dashboard/my-courses', icon: BookOpen, labelAr: 'مقرراتي', labelEn: 'My Courses', roles: ['student'] },
  { to: '/dashboard/my-grades', icon: FileText, labelAr: 'درجاتي', labelEn: 'My Grades', roles: ['student'] },
  { to: '/dashboard/my-schedule', icon: Calendar, labelAr: 'جدولي', labelEn: 'My Schedule', roles: ['student'] },
  
  // Doctor
  { to: '/dashboard/grades', icon: FileText, labelAr: 'الدرجات', labelEn: 'Grades', roles: ['academic_doctor' ] },
  // Lab Tech
  { to: '/dashboard/equipment', icon: Package, labelAr: 'المعدات', labelEn: 'Equipment', roles: ['lab_technician'] },
  { to: '/dashboard/maintenance', icon: Wrench, labelAr: 'الصيانة', labelEn: 'Maintenance', roles: ['lab_technician'] },
  // Staff
  { to: '/dashboard/students', icon: Users, labelAr: 'إدارة الطلاب', labelEn: 'Manage Students', roles: ['employee'] },
  // Hospital for doctor
  { to: '/dashboard/appointments', icon: Stethoscope, labelAr: 'المواعيد', labelEn: 'Appointments', roles: ['medical_doctor', 'nurse'] },
  { to: '/dashboard/patients', icon: Users, labelAr: 'المرضى', labelEn: 'Patients', roles: ['medical_doctor', 'nurse'] },
  //Dean

];

const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout, hasRole } = useAuth();
  const { lang, t, toggleLang } = useLanguage();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = React.useState(false);

  const roleName = user?.role?.name as RoleName | undefined;

  const navItems = allNavItems.filter(item => {
    if (!item.roles) return true;
    if (roleName === 'admin') return true;
    return roleName ? item.roles.includes(roleName) : false;
  });

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <aside className={cn("bg-sidebar text-sidebar-foreground flex flex-col transition-all duration-300 border-e border-sidebar-border relative", collapsed ? "w-16" : "w-64")}>
        <div className="flex items-center gap-3 p-4 border-b border-sidebar-border">
          <div className="w-9 h-9 bg-sidebar-primary rounded-lg flex items-center justify-center flex-shrink-0">
            <GraduationCap className="w-5 h-5 text-sidebar-primary-foreground" />
          </div>
          {!collapsed && (
            <div className="overflow-hidden">
              <h1 className="text-sm font-bold truncate">{lang === 'ar' ? 'جامعة حلب' : 'Univ. of Aleppo'}</h1>
              <p className="text-xs text-sidebar-foreground/60 truncate">{lang === 'ar' ? 'نظام الإدارة' : 'Management System'}</p>
            </div>
          )}
        </div>

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute top-5 -end-3 w-6 h-6 bg-sidebar-primary rounded-full flex items-center justify-center text-sidebar-primary-foreground shadow-md hover:scale-110 transition-transform z-10"
        >
          <ChevronLeft className={cn("w-3.5 h-3.5 transition-transform", collapsed && "rotate-180", lang === 'en' && !collapsed && "rotate-180", lang === 'en' && collapsed && "rotate-0")} />
        </button>

        <nav className="flex-1 p-2 space-y-0.5 overflow-y-auto">
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/dashboard'}
              className={({ isActive }) => cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                isActive ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-md" : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              )}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {!collapsed && <span className="truncate">{lang === 'ar' ? item.labelAr : item.labelEn}</span>}
            </NavLink>
          ))}
        </nav>

        <div className="p-3 border-t border-sidebar-border space-y-1">
          <button onClick={toggleLang} className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm w-full text-sidebar-foreground/70 hover:bg-sidebar-accent transition-colors">
            <Globe className="w-5 h-5 flex-shrink-0" />
            {!collapsed && <span>{lang === 'ar' ? 'English' : 'العربية'}</span>}
          </button>
          {!collapsed && user && (
            <div className="px-2 py-1">
              <p className="text-sm font-semibold truncate">{lang === 'ar' ? user.name : user.nameEn || user.name}</p>
              <p className="text-xs text-sidebar-foreground/60 truncate">{user.role?.label}</p>
            </div>
          )}
          <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm w-full text-sidebar-foreground/70 hover:bg-destructive/20 hover:text-destructive transition-colors">
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {!collapsed && <span>{t('nav.logout')}</span>}
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-auto bg-background">
        <div className="p-6 max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  );
};

export default DashboardLayout;