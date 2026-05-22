import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { users, colleges, departments } from '@/data/mockData';
import { Users, UserPlus } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';

const ManageStudentsPage: React.FC = () => {
  const { lang } = useLanguage();
  const students = users.filter(u => u.role_id === 1);
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2"><Users className="w-6 h-6" />{lang === 'ar' ? 'إدارة الطلاب' : 'Manage Students'}</h1>
        <Button onClick={() => setDialogOpen(true)} className="gap-1"><UserPlus className="w-4 h-4" />{lang === 'ar' ? 'إضافة طالب' : 'Add Student'}</Button>
      </div>
      <Card className="border-0 shadow-sm">
        <CardContent className="p-5">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{lang === 'ar' ? 'الاسم' : 'Name'}</TableHead>
                <TableHead>{lang === 'ar' ? 'البريد' : 'Email'}</TableHead>
                <TableHead>{lang === 'ar' ? 'الكلية' : 'College'}</TableHead>
                <TableHead>{lang === 'ar' ? 'القسم' : 'Department'}</TableHead>
                <TableHead>{lang === 'ar' ? 'إجراءات' : 'Actions'}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.map(s => {
                const college = colleges.find(c => c.id === s.college_id);
                const dept = departments.find(d => d.id === s.department_id);
                return (
                  <TableRow key={s.id}>
                    <TableCell className="font-medium">{lang === 'ar' ? s.name : s.nameEn}</TableCell>
                    <TableCell>{s.email}</TableCell>
                    <TableCell>{lang === 'ar' ? college?.name : college?.nameEn}</TableCell>
                    <TableCell>{lang === 'ar' ? dept?.name : dept?.nameEn}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button size="sm" variant="outline">{lang === 'ar' ? 'تعديل' : 'Edit'}</Button>
                        <Button size="sm" variant="outline" className="text-destructive">{lang === 'ar' ? 'تعليق' : 'Suspend'}</Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{lang === 'ar' ? 'إضافة طالب جديد' : 'Add New Student'}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <Input placeholder={lang === 'ar' ? 'الاسم' : 'Name'} />
            <Input placeholder={lang === 'ar' ? 'البريد الإلكتروني' : 'Email'} />
            <Select><SelectTrigger><SelectValue placeholder={lang === 'ar' ? 'الكلية' : 'College'} /></SelectTrigger>
              <SelectContent>{colleges.map(c => <SelectItem key={c.id} value={String(c.id)}>{lang === 'ar' ? c.name : c.nameEn}</SelectItem>)}</SelectContent>
            </Select>
            <Button className="w-full" onClick={() => { setDialogOpen(false); toast.success(lang === 'ar' ? 'تمت الإضافة' : 'Added'); }}>{lang === 'ar' ? 'إضافة' : 'Add'}</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ManageStudentsPage;
