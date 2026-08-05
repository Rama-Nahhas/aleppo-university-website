import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useExam } from '@/contexts/ExamContext';
import { Users, FileText, ClipboardList, Calendar } from 'lucide-react';

const ExamDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { lang } = useLanguage();

  const { subjects, promotedStudents, recentMarks } = useExam();
  const dateFormatter = new Intl.DateTimeFormat(lang === 'ar' ? 'ar-SY' : 'en-US', { dateStyle: 'medium', timeStyle: 'short' });

  const stats = [
    { label: 'عدد المواد', value: subjects.length, icon: FileText, color: 'bg-primary' },
    { label: 'عدد الطلاب', value: subjects.reduce((s,sub)=>s+sub.studentsCount,0), icon: Users, color: 'bg-emerald-500' },
    { label: 'عدد العلامات المدخلة', value: subjects.reduce((s,sub)=>s+sub.enteredCount,0), icon: ClipboardList, color: 'bg-amber-500' },
    { label: 'الطلاب المترفعون', value: promotedStudents.length, icon: Calendar, color: 'bg-cyan-500' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">لوحة موظف الامتحانات</h1>
          <p className="text-muted-foreground">مرحباً بك في لوحة إدارة العلامات</p>
        </div>
        <div className="text-sm text-muted-foreground">{new Date().toLocaleDateString(lang === 'ar' ? 'ar-SY' : 'en-US')}</div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map(s => (
          <Card key={s.label} className="border-0 shadow-sm">
            <CardContent className="p-4 flex items-center gap-4">
              <div className={`w-11 h-11 ${s.color} rounded-xl flex items-center justify-center shadow-sm`}>
                <s.icon className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-bold">{s.label}</p>
                <p className="text-sm text-muted-foreground">{s.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="space-y-3">
        <h2 className="text-lg font-bold">العمليات السريعة</h2>
        <div className="flex gap-2 flex-wrap">
          <button onClick={() => navigate('/dashboard/exam-employee/subjects')} className="btn btn-primary">عرض المواد</button>
          <button onClick={() => navigate('/dashboard/exam-employee/enter-grades')} className="btn btn-secondary">إدخال العلامات</button>
          <button onClick={() => navigate('/dashboard/exam-employee/promoted')} className="btn btn-accent">عرض الطلاب المترفعين</button>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-bold mb-3">آخر العلامات المدخلة</h2>
        <div className="overflow-auto bg-card p-3 rounded-lg">
          <table className="w-full text-sm table-auto">
            <thead>
              <tr className="text-muted-foreground text-left">
                <th className="p-2">اسم الطالب</th>
                <th className="p-2">المادة</th>
                <th className="p-2">العلامة</th>
                <th className="p-2">تاريخ الإدخال</th>
                <th className="p-2">الحالة</th>
              </tr>
            </thead>
            <tbody>
              {recentMarks.map((r,idx) => (
                <tr key={idx} className="border-t">
                  <td className="p-2">{r.studentName}</td>
                  <td className="p-2">{r.subject}</td>
                  <td className="p-2">{r.mark}</td>
                  <td className="p-2" dir="ltr" style={{whiteSpace: 'nowrap'}}>{dateFormatter.format(new Date(r.enteredAt))}</td>
                  <td className="p-2">{r.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ExamDashboardPage;
