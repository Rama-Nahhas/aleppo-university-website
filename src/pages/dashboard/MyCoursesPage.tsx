import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';
import { enrollments, courses, sections, users } from '@/data/mockData';
import { BookOpen } from 'lucide-react';

const MyCoursesPage: React.FC = () => {
  const { user } = useAuth();
  const { lang } = useLanguage();
  const myEnrollments = enrollments.filter(e => e.student_id === user?.id);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground">{lang === 'ar' ? 'مقرراتي' : 'My Courses'}</h1>
      <div className="grid md:grid-cols-2 gap-4">
        {myEnrollments.map(e => {
          const course = courses.find(c => c.id === e.course_id);
          const section = sections.find(s => s.id === e.section_id);
          const doctor = users.find(u => u.id === course?.doctor_id);
          return (
            <Card key={e.course_id} className="border-0 shadow-sm">
              <CardContent className="p-5">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <BookOpen className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground">{lang === 'ar' ? course?.name : course?.nameEn}</h3>
                    <p className="text-xs text-muted-foreground mt-1">{lang === 'ar' ? 'المدرس: ' : 'Instructor: '}{lang === 'ar' ? doctor?.name : doctor?.nameEn}</p>
                    {section && <p className="text-xs text-muted-foreground">{lang === 'ar' ? section.schedule : section.scheduleEn}</p>}
                    {e.grade != null && <p className="text-sm font-bold text-primary mt-2">{lang === 'ar' ? 'الدرجة: ' : 'Grade: '}{e.grade}/100</p>}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
        {myEnrollments.length === 0 && <p className="text-muted-foreground col-span-2 text-center py-8">{lang === 'ar' ? 'لا توجد مقررات مسجلة' : 'No enrolled courses'}</p>}
      </div>
    </div>
  );
};

export default MyCoursesPage;
