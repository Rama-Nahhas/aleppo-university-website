import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { enrollments, courses } from '@/data/mockData';

const MyGradesPage: React.FC = () => {
  const { user } = useAuth();
  const { lang } = useLanguage();
  const myEnrollments = enrollments.filter(e => e.student_id === user?.id);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground">{lang === 'ar' ? 'درجاتي' : 'My Grades'}</h1>
      <Card className="border-0 shadow-sm">
        <CardContent className="p-5">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{lang === 'ar' ? 'المقرر' : 'Course'}</TableHead>
                <TableHead>{lang === 'ar' ? 'الدرجة' : 'Grade'}</TableHead>
                <TableHead>{lang === 'ar' ? 'الحالة' : 'Status'}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {myEnrollments.map(e => {
                const course = courses.find(c => c.id === e.course_id);
                return (
                  <TableRow key={e.course_id}>
                    <TableCell className="font-medium">{lang === 'ar' ? course?.name : course?.nameEn}</TableCell>
                    <TableCell>{e.grade != null ? `${e.grade}/100` : '-'}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${e.grade != null ? (e.grade >= 60 ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700') : 'bg-muted text-muted-foreground'}`}>
                        {e.grade != null ? (e.grade >= 60 ? (lang === 'ar' ? 'ناجح' : 'Pass') : (lang === 'ar' ? 'راسب' : 'Fail')) : (lang === 'ar' ? 'لم يُرصد' : 'Pending')}
                      </span>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default MyGradesPage;
