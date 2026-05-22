import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { courses as initialCourses, departments, users } from '@/data/mockData';
import { Plus, Pencil, Trash2, BookOpen } from 'lucide-react';
import type { Course } from '@/types';

const CoursesPage: React.FC = () => {
  const [data, setData] = useState<Course[]>(initialCourses);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Course | null>(null);
  const [form, setForm] = useState({ name: '', department_id: '', doctor_id: '' });
  const doctors = users.filter(u => u.role_id === 2);

  const openCreate = () => { setEditing(null); setForm({ name: '', department_id: '', doctor_id: '' }); setDialogOpen(true); };
  const openEdit = (c: Course) => { setEditing(c); setForm({ name: c.name, department_id: String(c.department_id), doctor_id: String(c.doctor_id) }); setDialogOpen(true); };
  const handleSave = () => {
    if (editing) setData(prev => prev.map(c => c.id === editing.id ? { ...c, name: form.name, department_id: Number(form.department_id), doctor_id: Number(form.doctor_id) } : c));
    else setData(prev => [...prev, { id: Date.now(), name: form.name, department_id: Number(form.department_id), doctor_id: Number(form.doctor_id) }]);
    setDialogOpen(false);
  };
  const handleDelete = (id: number) => setData(prev => prev.filter(c => c.id !== id));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold flex items-center gap-2"><BookOpen className="w-6 h-6 text-primary" /> إدارة المقررات</h1>
        <Button onClick={openCreate}><Plus className="w-4 h-4 ml-1" /> إضافة مقرر</Button>
      </div>
      <Card className="border-0 shadow-sm"><CardContent className="p-0">
        <Table>
          <TableHeader><TableRow><TableHead>#</TableHead><TableHead>المقرر</TableHead><TableHead>القسم</TableHead><TableHead>الدكتور</TableHead><TableHead>إجراءات</TableHead></TableRow></TableHeader>
          <TableBody>
            {data.map(c => (
              <TableRow key={c.id}>
                <TableCell>{c.id}</TableCell>
                <TableCell className="font-medium">{c.name}</TableCell>
                <TableCell>{departments.find(d => d.id === c.department_id)?.name || '-'}</TableCell>
                <TableCell>{users.find(u => u.id === c.doctor_id)?.name || '-'}</TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button size="icon" variant="ghost" onClick={() => openEdit(c)}><Pencil className="w-4 h-4" /></Button>
                    <Button size="icon" variant="ghost" className="text-destructive" onClick={() => handleDelete(c.id)}><Trash2 className="w-4 h-4" /></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent></Card>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent dir="rtl">
          <DialogHeader><DialogTitle>{editing ? 'تعديل مقرر' : 'إضافة مقرر'}</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div><Label>اسم المقرر</Label><Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} /></div>
            <div><Label>القسم</Label>
              <Select value={form.department_id} onValueChange={v => setForm(f => ({ ...f, department_id: v }))}>
                <SelectTrigger><SelectValue placeholder="اختر القسم" /></SelectTrigger>
                <SelectContent>{departments.map(d => <SelectItem key={d.id} value={String(d.id)}>{d.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div><Label>الدكتور</Label>
              <Select value={form.doctor_id} onValueChange={v => setForm(f => ({ ...f, doctor_id: v }))}>
                <SelectTrigger><SelectValue placeholder="اختر الدكتور" /></SelectTrigger>
                <SelectContent>{doctors.map(d => <SelectItem key={d.id} value={String(d.id)}>{d.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter><Button onClick={handleSave}>{editing ? 'تحديث' : 'إضافة'}</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CoursesPage;
