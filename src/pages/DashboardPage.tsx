import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { users, colleges, departments, courses, laboratories, supplies, orders } from '@/data/mockData';
import { Users, Building2, BookOpen, FlaskConical, Package, ClipboardList, Megaphone, TrendingUp, Mail, GraduationCap, IdCard } from 'lucide-react';
import { Announcement, useAnnouncementActions } from '@/hooks/useAnnouncementActions';
import { resolveRoleName } from '@/lib/roleUtils';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { lang, t } = useLanguage();
  const role = resolveRoleName(user as any);
  const { fetchAnnouncements } = useAnnouncementActions();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

  useEffect(() => {
    const loadAnnouncements = async () => {
      setAnnouncements(await fetchAnnouncements());
    };
    loadAnnouncements();
  }, []);

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
    { label: lang === 'ar' ? 'البريد الإلكتروني' : 'Email', value: user?.email ?? '-', icon: Mail, color: 'bg-primary' },
    { label: lang === 'ar' ? 'نوع القبول' : 'Admission Type', value: user?.admission_type ?? '-', icon: GraduationCap, color: 'bg-emerald-500' },
    // { label: lang === 'ar' ? 'الدور' : 'Role', value: user?.role?.name ?? '-', icon: UserCheck, color: 'bg-violet-500' },
    { label: lang === 'ar' ? 'الرقم الجامعي' : 'Student Number', value: user?.student_number ?? '-', icon: IdCard, color: 'bg-amber-500' },
  ];

  const doctorStats = [
    { label: t('dash.courses'), value: courses.filter(c => c.doctor_id === user?.id).length, icon: BookOpen, color: 'bg-primary' },
    // { label: t('dash.appointments'), value: appointments.filter(a => a.doctor_id === user?.id).length, icon: Stethoscope, color: 'bg-emerald-500' },
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
    <div className="mx-auto w-full max-w-6xl space-y-6 pb-8">
      <section className="relative overflow-hidden rounded-2xl bg-primary px-5 py-6 text-primary-foreground shadow-sm sm:px-7">
        <div className="relative z-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div className="min-w-0">
            <p className="mb-1 text-sm font-medium text-primary-foreground/70">
              {lang === 'ar' ? 'نظرة عامة على حسابك' : 'Overview of your account'}
            </p>
            <h1 className="truncate text-xl font-bold sm:text-2xl">
              {t('dash.welcome')}، {lang === 'ar' ? user?.name : user?.nameEn || user?.name}
            </h1>
            <p className="mt-1 text-sm text-primary-foreground/75">{user?.role?.label ?? user?.role?.name}</p>
          </div>
          <div className="flex w-fit items-center gap-2 rounded-xl bg-primary-foreground/10 px-3 py-2 text-sm text-primary-foreground/85">
            <TrendingUp className="h-4 w-4" />
            <span>{new Date().toLocaleDateString(lang === 'ar' ? 'ar-SY' : 'en-US')}</span>
          </div>
        </div>
        <div className="absolute -bottom-16 -end-8 h-40 w-40 rounded-full border-[18px] border-primary-foreground/10" />
      </section>

      <section aria-labelledby="dashboard-stats-title">
        <div className="mb-3 flex items-center justify-between">
          <h2 id="dashboard-stats-title" className="text-base font-bold text-foreground sm:text-lg">
            {lang === 'ar' ? 'ملخص سريع' : 'Quick summary'}
          </h2>
          <span className="text-xs text-muted-foreground">{stats.length} {lang === 'ar' ? 'عناصر' : 'items'}</span>
        </div>
        <div className="grid grid-cols-1 gap-3 min-[420px]:grid-cols-2 lg:grid-cols-4">
        {stats.map(stat => (
          <Card key={stat.label} className="border-border/70 shadow-sm transition-shadow hover:shadow-md">
            <CardContent className="flex min-h-[92px] items-center gap-3 p-4 sm:gap-4">
              <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${stat.color} shadow-sm`}>
                <stat.icon className="h-5 w-5 text-white" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-foreground">{stat.label}</p>
                <p className="mt-1 truncate text-sm text-muted-foreground">{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
        </div>
      </section>

      <div className="grid items-start gap-5 lg:grid-cols-[1.15fr_0.85fr]">
        <Card className="border-border/70 shadow-sm">
          <CardContent className="p-5">
            <h2 className="mb-4 flex items-center gap-2 text-base font-bold sm:text-lg">
              <Megaphone className="h-5 w-5 text-primary" />
              {lang === 'ar' ? 'آخر الإعلانات' : 'Latest Announcements'}
            </h2>
            <div className="space-y-3">
              {announcements.slice(0, 2).map(a => (
                <div key={a.id} className="rounded-xl border border-border/60 bg-muted/40 p-4">
                  <p className="font-semibold text-sm">{a.title}</p>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{a.content}</p>
                  <p className="text-xs text-muted-foreground mt-1">{new Date(a.created_at).toLocaleDateString(lang === 'ar' ? 'ar-SY' : 'en-US')}</p>
                </div>
              ))}
              {announcements.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  {lang === 'ar' ? 'لا توجد إعلانات متاحة حالياً' : 'No announcements available yet'}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* <Card className="border-border/70 shadow-sm">
          <CardContent className="p-5">
            <h2 className="mb-4 flex items-center gap-2 text-base font-bold sm:text-lg">
              <ClipboardList className="h-5 w-5 text-primary" />
              {lang === 'ar' ? 'النشاط الأخير' : 'Recent Activity'}
            </h2>
            <div className="space-y-3">
              {orders.filter(o => o.status === 'pending').slice(0, 3).map(o => (
                <div key={o.id} className="flex items-center justify-between gap-3 rounded-xl border border-border/60 bg-muted/40 p-4">
                  <div>
                    <p className="font-semibold text-sm">{lang === 'ar' ? 'طلب' : 'Order'} #{o.id}</p>
                    <p className="text-xs text-muted-foreground">{new Date(o.created_at).toLocaleDateString(lang === 'ar' ? 'ar-SY' : 'en-US')}</p>
                  </div>
                  <span className="px-2.5 py-1 bg-accent/20 text-accent rounded-full text-xs font-semibold">
                    {t('status.pending')}
                  </span>
                </div>
              ))}
              {orders.filter(o => o.status === 'pending').length === 0 && (
                <p className="py-4 text-center text-sm text-muted-foreground">
                  {lang === 'ar' ? 'لا يوجد نشاط حديث' : 'No recent activity'}
                </p>
              )}
            </div>
          </CardContent>
        </Card> */}
      </div>
    </div>
  );
};

export default DashboardPage;
