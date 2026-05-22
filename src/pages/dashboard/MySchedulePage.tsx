import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';
import { enrollments, courses, sections, users } from '@/data/mockData';
import { Clock } from 'lucide-react';

const MySchedulePage: React.FC = () => {
  const { user } = useAuth();
  const { lang } = useLanguage();
  const myEnrollments = enrollments.filter(e => e.student_id === user?.id && e.section_id);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground">{lang === 'ar' ? 'جدولي الدراسي' : 'My Schedule'}</h1>
      <div className="space-y-3">
        {myEnrollments.map(e => {
          const course = courses.find(c => c.id === e.course_id);
          const section = sections.find(s => s.id === e.section_id);
          const doctor = users.find(u => u.id === course?.doctor_id);
          return (
            <Card key={e.course_id} className="border-0 shadow-sm">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="w-10 h-10 bg-accent/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Clock className="w-5 h-5 text-accent" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-foreground text-sm">{lang === 'ar' ? course?.name : course?.nameEn}</h3>
                  <p className="text-xs text-muted-foreground">{lang === 'ar' ? doctor?.name : doctor?.nameEn}</p>
                </div>
                <div className="text-sm font-semibold text-primary">{lang === 'ar' ? section?.schedule : section?.scheduleEn}</div>
              </CardContent>
            </Card>
          );
        })}
        {myEnrollments.length === 0 && <p className="text-muted-foreground text-center py-8">{lang === 'ar' ? 'لا يوجد جدول' : 'No schedule'}</p>}
      </div>
    </div>
  );
};

export default MySchedulePage;
