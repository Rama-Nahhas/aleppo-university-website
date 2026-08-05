import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { users as allUsers } from '@/data/mockData';
import { Plus, Eye, Pencil, Slash, Trash2 } from 'lucide-react';
import { Input as UiInput } from '@/components/ui/input';

const ActiveDoctorsPage: React.FC = () => {
  const initial = allUsers.filter(u => [3,9].includes(u.role_id));
  const [data, setData] = useState(initial);
  const [search, setSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const [form, setForm] = useState({ name: '', email: '', password: '', specialty: '', university: '' });
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selected, setSelected] = useState<any | null>(null);

  const filtered = data.filter(d => d.name.includes(search) || d.email.includes(search));

  const openAdd = () => { setEditing(null); setForm({ name: '', email: '', password: '', specialty: '', university: '' }); setDialogOpen(true); };
  const openEdit = (d: any) => { setEditing(d); setForm({ name: d.name, email: d.email, password: '', specialty: d.specialty || '', university: d.university || '' }); setDialogOpen(true); };
  const save = () => {
    if (!form.name || !form.email) return alert('الحقول المطلوبة فارغة');
    if (editing) setData(prev => prev.map(p => p.id === editing.id ? { ...p, ...form } : p));
    else setData(prev => [...prev, { id: Date.now(), ...form, role_id: 3 }]);
    setDialogOpen(false);
  };
  const block = (d: any) => { setSelected(d); setConfirmOpen(true); };
  const confirmBlock = () => { if (!selected) return; setData(prev => prev.map(p => p.id === selected.id ? { ...p, status: 'blocked' } : p)); setConfirmOpen(false); };
  const remove = (id: number) => setData(prev => prev.filter(p => p.id !== id));

  return (
    <div dir="rtl" className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">الأطباء النشطون</h1>
        <Button onClick={openAdd}><Plus className="w-4 h-4 ml-1" /> إضافة طبيب</Button>
      </div>

      <div className="relative max-w-sm">
        <UiInput className="pr-9" placeholder="بحث..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      <Card className="border-0 shadow-sm"><CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>#</TableHead>
              <TableHead>الاسم</TableHead>
              <TableHead>البريد</TableHead>
              <TableHead>الاختصاص</TableHead>
              <TableHead>الجامعة</TableHead>
              <TableHead>الحالة</TableHead>
              <TableHead>تاريخ الإنشاء</TableHead>
              <TableHead>الإجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map(d => (
              <TableRow key={d.id}>
                <TableCell>{d.id}</TableCell>
                <TableCell className="font-medium">{d.name}</TableCell>
                <TableCell>{d.email}</TableCell>
                <TableCell>{d.specialty || '-'}</TableCell>
                <TableCell>{d.university || '-'}</TableCell>
                <TableCell><span className="px-2 py-1 rounded-md text-xs font-semibold bg-muted/30">{d.status || 'active'}</span></TableCell>
                <TableCell>{d.created_at ? new Date(d.created_at).toLocaleDateString('ar-SY') : '-'}</TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button size="icon" variant="ghost"><Eye className="w-4 h-4" /></Button>
                    <Button size="icon" variant="ghost" onClick={() => openEdit(d)}><Pencil className="w-4 h-4" /></Button>
                    <Button size="icon" className="text-amber-500" onClick={() => block(d)}><Slash className="w-4 h-4" /></Button>
                    <Button size="icon" className="text-destructive" onClick={() => remove(d.id)}><Trash2 className="w-4 h-4" /></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent></Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent dir="rtl">
          <DialogHeader><DialogTitle>{editing ? 'تعديل طبيب' : 'إضافة طبيب'}</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <UiInput placeholder="الاسم" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
            <UiInput placeholder="البريد الإلكتروني" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
            <UiInput placeholder="كلمة المرور" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} />
            <UiInput placeholder="الاختصاص" value={form.specialty} onChange={e => setForm(f => ({ ...f, specialty: e.target.value }))} />
            <UiInput placeholder="الجامعة" value={form.university} onChange={e => setForm(f => ({ ...f, university: e.target.value }))} />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>إلغاء</Button>
            <Button onClick={save}>حفظ</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent dir="rtl">
          <DialogHeader><DialogTitle>حظر الطبيب</DialogTitle></DialogHeader>
          <div>هل تريد حظر {selected?.name}؟</div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmOpen(false)}>إلغاء</Button>
            <Button className="bg-amber-500" onClick={confirmBlock}>تأكيد</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ActiveDoctorsPage;
