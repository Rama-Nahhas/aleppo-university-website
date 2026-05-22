import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { courses, enrollments, users } from '@/data/mockData';
import { FileText } from 'lucide-react';
import { toast } from 'sonner';

const GradesManagementPage: React.FC = () => {
  const { user } = useAuth();
  const { lang } = useLanguage();
  const doctorCourses = courses.filter(c => c.doctor_id === user?.id);
  const [grades, setGrades] = useState<Record<string, number>>({});

  const handleSaveGrade = (studentId: number, courseId: number) => {
    const key = `${studentId}-${courseId}`;
    toast.success(lang === 'ar' ? `تم حفظ الدرجة: ${grades[key]}` : `Grade saved: ${grades[key]}`);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground flex items-center gap-2"><FileText className="w-6 h-6" />{lang === 'ar' ? 'إدارة الدرجات' : 'Grades Management'}</h1>
      {doctorCourses.map(course => {
        const courseStudents = enrollments.filter(e => e.course_id === course.id);
        return (
          <Card key={course.id} className="border-0 shadow-sm">
            <CardContent className="p-5">
              <h2 className="font-bold text-lg text-primary mb-4">{lang === 'ar' ? course.name : course.nameEn}</h2>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{lang === 'ar' ? 'الطالب' : 'Student'}</TableHead>
                    <TableHead>{lang === 'ar' ? 'الدرجة الحالية' : 'Current Grade'}</TableHead>
                    <TableHead>{lang === 'ar' ? 'درجة جديدة' : 'New Grade'}</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {courseStudents.map(e => {
                    const student = users.find(u => u.id === e.student_id);
                    const key = `${e.student_id}-${course.id}`;
                    return (
                      <TableRow key={e.student_id}>
                        <TableCell>{lang === 'ar' ? student?.name : student?.nameEn}</TableCell>
                        <TableCell>{e.grade ?? '-'}</TableCell>
                        <TableCell><Input type="number" min={0} max={100} className="w-20" value={grades[key] ?? ''} onChange={ev => setGrades(p => ({ ...p, [key]: Number(ev.target.value) }))} /></TableCell>
                        <TableCell><Button size="sm" onClick={() => handleSaveGrade(e.student_id, course.id)}>{lang === 'ar' ? 'حفظ' : 'Save'}</Button></TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default GradesManagementPage;
