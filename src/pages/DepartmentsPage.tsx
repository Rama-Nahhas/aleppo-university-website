import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { departments as initialDepts, colleges } from '@/data/mockData';
import { Plus, Pencil, Trash2, Building2 } from 'lucide-react';
import type { Department } from '@/types';

const DepartmentsPage: React.FC = () => {
  const [data, setData] = useState<Department[]>(initialDepts);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Department | null>(null);
  const [form, setForm] = useState({ name: '', college_id: '' });

  const openCreate = () => { setEditing(null); setForm({ name: '', college_id: '' }); setDialogOpen(true); };
  const openEdit = (d: Department) => { setEditing(d); setForm({ name: d.name, college_id: String(d.college_id) }); setDialogOpen(true); };
  const handleSave = () => {
    if (editing) setData(prev => prev.map(d => d.id === editing.id ? { ...d, name: form.name, college_id: Number(form.college_id) } : d));
    else setData(prev => [...prev, { id: Date.now(), name: form.name, college_id: Number(form.college_id) }]);
    setDialogOpen(false);
  };
  const handleDelete = (id: number) => setData(prev => prev.filter(d => d.id !== id));
  const getCollegeName = (id: number) => colleges.find(c => c.id === id)?.name || '-';

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold flex items-center gap-2"><Building2 className="w-6 h-6 text-primary" /> إدارة الأقسام</h1>
        <Button onClick={openCreate}><Plus className="w-4 h-4 ml-1" /> إضافة قسم</Button>
      </div>
      <Card className="border-0 shadow-sm"><CardContent className="p-0">
        <Table>
          <TableHeader><TableRow><TableHead>#</TableHead><TableHead>اسم القسم</TableHead><TableHead>الكلية</TableHead><TableHead>إجراءات</TableHead></TableRow></TableHeader>
          <TableBody>
            {data.map(d => (
              <TableRow key={d.id}>
                <TableCell>{d.id}</TableCell>
                <TableCell className="font-medium">{d.name}</TableCell>
                <TableCell>{getCollegeName(d.college_id)}</TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button size="icon" variant="ghost" onClick={() => openEdit(d)}><Pencil className="w-4 h-4" /></Button>
                    <Button size="icon" variant="ghost" className="text-destructive" onClick={() => handleDelete(d.id)}><Trash2 className="w-4 h-4" /></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent></Card>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent dir="rtl">
          <DialogHeader><DialogTitle>{editing ? 'تعديل قسم' : 'إضافة قسم'}</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div><Label>اسم القسم</Label><Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} /></div>
            <div><Label>الكلية</Label>
              <Select value={form.college_id} onValueChange={v => setForm(f => ({ ...f, college_id: v }))}>
                <SelectTrigger><SelectValue placeholder="اختر الكلية" /></SelectTrigger>
                <SelectContent>{colleges.map(c => <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter><Button onClick={handleSave}>{editing ? 'تحديث' : 'إضافة'}</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DepartmentsPage;
