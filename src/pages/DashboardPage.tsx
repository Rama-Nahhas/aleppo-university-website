import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { users, colleges, departments, courses, laboratories, supplies, orders, announcements, enrollments, appointments } from '@/data/mockData';
import { Users, Building2, BookOpen, FlaskConical, Package, ClipboardList, Megaphone, TrendingUp, Calendar, Stethoscope } from 'lucide-react';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { lang, t } = useLanguage();
  const role = user?.role?.name;

  const adminStats = [
    { label: t('dash.users'), value: users.length, icon: Users, color: 'bg-primary' },
    { label: t('dash.colleges'), value: colleges.length, icon: Building2, color: 'bg-emerald-500' },
    { label: t('dash.departments'), value: departments.length, icon: Building2, color: 'bg-violet-500' },
    { label: t('dash.courses'), value: courses.length, icon: BookOpen, color: 'bg-amber-500' },
    { label: t('dash.labs'), value: laboratories.length, icon: FlaskConical, color: 'bg-cyan-500' },
    { label: t('dash.inventory'), value: supplies.length, icon: Package, color: 'bg-rose-500' },
    { label: t('dash.orders'), value: orders.length, icon: ClipboardList, color: 'bg-indigo-500' },
    { label: t('dash.announcements'), value: announcements.length, icon: Megaphone, color: 'bg-orange-500' },
  ];

  const studentStats = [
    { label: t('dash.courses'), value: enrollments.filter(e => e.student_id === user?.id).length, icon: BookOpen, color: 'bg-primary' },
    { label: t('dash.announcements'), value: announcements.length, icon: Megaphone, color: 'bg-amber-500' },
  ];

  const doctorStats = [
    { label: t('dash.courses'), value: courses.filter(c => c.doctor_id === user?.id).length, icon: BookOpen, color: 'bg-primary' },
    { label: t('dash.appointments'), value: appointments.filter(a => a.doctor_id === user?.id).length, icon: Stethoscope, color: 'bg-emerald-500' },
  ];

  const warehouseStats = [
    { label: t('dash.inventory'), value: supplies.length, icon: Package, color: 'bg-primary' },
    { label: t('dash.requests'), value: orders.filter(o => o.status === 'pending').length, icon: ClipboardList, color: 'bg-amber-500' },
  ];

  const stats = role === 'admin' ? adminStats
    : role === 'student' ? studentStats
    : role === 'academic_doctor' ? doctorStats
    : role === 'warehouse_manager' ? warehouseStats
    : adminStats.slice(0, 4);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{t('dash.welcome')}، {lang === 'ar' ? user?.name : user?.nameEn || user?.name}</h1>
          <p className="text-muted-foreground">{user?.role?.label}</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <TrendingUp className="w-4 h-4" />
          <span>{new Date().toLocaleDateString(lang === 'ar' ? 'ar-SY' : 'en-US')}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map(stat => (
          <Card key={stat.label} className="border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4 flex items-center gap-4">
              <div className={`w-11 h-11 ${stat.color} rounded-xl flex items-center justify-center shadow-sm`}>
                <stat.icon className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-5">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Megaphone className="w-5 h-5 text-primary" />
              {lang === 'ar' ? 'آخر الإعلانات' : 'Latest Announcements'}
            </h2>
            <div className="space-y-3">
              {announcements.slice(0, 3).map(a => (
                <div key={a.id} className="p-3 bg-muted/50 rounded-lg">
                  <p className="font-semibold text-sm">{lang === 'ar' ? a.title : a.titleEn}</p>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{lang === 'ar' ? a.content : a.contentEn}</p>
                  <p className="text-xs text-muted-foreground mt-1">{new Date(a.created_at).toLocaleDateString(lang === 'ar' ? 'ar-SY' : 'en-US')}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-5">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              {lang === 'ar' ? 'النشاط الأخير' : 'Recent Activity'}
            </h2>
            <div className="space-y-3">
              {orders.filter(o => o.status === 'pending').slice(0, 3).map(o => (
                <div key={o.id} className="p-3 bg-muted/50 rounded-lg flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-sm">{lang === 'ar' ? 'طلب' : 'Order'} #{o.id}</p>
                    <p className="text-xs text-muted-foreground">{new Date(o.created_at).toLocaleDateString(lang === 'ar' ? 'ar-SY' : 'en-US')}</p>
                  </div>
                  <span className="px-2.5 py-1 bg-accent/20 text-accent rounded-full text-xs font-semibold">
                    {t('status.pending')}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
