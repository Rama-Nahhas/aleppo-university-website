import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { courses, departments, enrollments } from '@/data/mockData';
import { UserCheck, BookOpen } from 'lucide-react';
import { toast } from 'sonner';

const EnrollmentPage: React.FC = () => {
  const { user } = useAuth();
  const { lang } = useLanguage();
  const [enrolled, setEnrolled] = useState(enrollments.filter(e => e.student_id === user?.id).map(e => e.course_id));

  const deptCourses = courses.filter(c => c.department_id === user?.department_id);

  const handleEnroll = (courseId: number) => {
    setEnrolled(prev => [...prev, courseId]);
    toast.success(lang === 'ar' ? 'تم التسجيل بنجاح' : 'Enrolled successfully');
  };

  return ( 
    
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
        <UserCheck className="w-6 h-6" />
        {lang === 'ar' ? 'تسجيل المقررات' : 'Course Enrollment'}
      </h1>
      <p className="text-muted-foreground">{lang === 'ar' ? 'المقررات المتاحة في قسمك' : 'Available courses in your department'}</p>
      <div className="grid md:grid-cols-2 gap-4">
        {deptCourses.map(c => {
          const isEnrolled = enrolled.includes(c.id);
          return (
            <Card key={c.id} className="border-0 shadow-sm">
              <CardContent className="p-5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground text-sm">{lang === 'ar' ? c.name : c.nameEn}</h3>
                  </div>
                </div>
                <Button size="sm" disabled={isEnrolled} onClick={() => handleEnroll(c.id)} variant={isEnrolled ? 'secondary' : 'default'}>
                  {isEnrolled ? (lang === 'ar' ? 'مسجل' : 'Enrolled') : (lang === 'ar' ? 'تسجيل' : 'Enroll')}
                </Button>
              </CardContent>
            </Card>
          );
        })}
        {deptCourses.length === 0 && <p className="text-muted-foreground col-span-2 text-center py-8">{lang === 'ar' ? 'لا توجد مقررات متاحة' : 'No courses available'}</p>}
      </div>
    </div>
  );
};

export default EnrollmentPage;
