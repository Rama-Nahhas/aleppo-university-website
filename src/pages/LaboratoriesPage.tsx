import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { laboratories as initialLabs, departments, users, colleges } from '@/data/mockData';
import { Plus, Pencil, Trash2, FlaskConical } from 'lucide-react';
import type { Laboratory } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';

const LaboratoriesPage: React.FC = () => {

 
{/*
  const [data, setData] = useState<Laboratory[]>(initialLabs);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Laboratory | null>(null);
  const [form, setForm] = useState({ name: '', department_id: '', technician_id: '' });
  const technicians = users.filter(u => u.role_id === 4);

  const openCreate = () => { setEditing(null); setForm({ name: '', department_id: '', technician_id: '' }); setDialogOpen(true); };
  const openEdit = (l: Laboratory) => { setEditing(l); setForm({ name: l.name, department_id: String(l.department_id), technician_id: String(l.technician_id) }); setDialogOpen(true); };
  const handleSave = () => {
    if (editing) setData(prev => prev.map(l => l.id === editing.id ? { ...l, name: form.name, department_id: Number(form.department_id), technician_id: Number(form.technician_id) } : l));
    else setData(prev => [...prev, { id: Date.now(), name: form.name, department_id: Number(form.department_id), technician_id: Number(form.technician_id) }]);
    setDialogOpen(false);
  };
  const handleDelete = (id: number) => setData(prev => prev.filter(l => l.id !== id));
*/}

  const { lang, t } = useLanguage();
  const { user } = useAuth();
  const role = user?.role?.name;

  const [data, setData]           = useState<Laboratory[]>(initialLabs); //يحفظ جميع المخابر
  const [dialogOpen, setDialogOpen] = useState(false); // لفتح نافذة الإضافة أو التعديل.
  const [editing, setEditing]     = useState<Laboratory | null>(null); //هل نحن نعدل مخبر أم نضيف جديد؟
  const [form, setForm]           = useState({ name: '', department_id: '', technician_id: ''  });   //يحفظ بيانات النموذج.

  // الفنيون فقط
  const technicians = users.filter(u => u.role_id === 4);   // المشكلة جلب جميع الفنيين من كل الكليات.

  // الأقسام المتاحة حسب الدور
  const availableDepts = role === 'dean'  // إذا كان المستخدم عميد يرى فقط اقسام كليته و الا يرى جميع الاقسام
    ? departments.filter(d => d.college_id === user?.college_id)
    : departments;

  // المخابر المرئية حسب الدور
  const visibleLabs = (() => {
    if (role === 'admin' || role === 'university_admin') return data;
    if (role === 'dean') {
      const myDeptIds = departments.filter(d => d.college_id === user?.college_id).map(d => d.id);     // اذاكان عميد يجلب اقسام كلية العميد
      return data.filter(l => myDeptIds.includes(l.department_id));                        // يعرض فقط مخابر هذه الأقسام
    }       
    if (role === 'lab_technician') return data.filter(l => l.technician_id === user?.id);
    return data;
  })();

  // تجميع المخابر حسب الكلية
  const labsByCollege = colleges.map(college => {
    const collegeDepts = departments.filter(d => d.college_id === college.id);
    const collegeLabs  = visibleLabs.filter(l => collegeDepts.some(d => d.id === l.department_id));
    return { college, labs: collegeLabs };
  }).filter(g => g.labs.length > 0);

  // ── CRUD ──────────────────────────────────────────────────────
  const canEdit = role === 'admin' || role === 'university_admin' || role === 'dean';

  const openCreate = () => {
    setEditing(null);
    setForm({ name: '', department_id: '', technician_id: ''  });
    setDialogOpen(true);
  };
  const openEdit = (l: Laboratory) => {
    setEditing(l);
    setForm({ name: l.name, department_id: String(l.department_id), technician_id: String(l.technician_id) });
    setDialogOpen(true);
  };
  const handleSave = () => {
    if (editing) {
      setData(prev => prev.map(l => l.id === editing.id
        ? { ...l, name: form.name, department_id: Number(form.department_id), technician_id: Number(form.technician_id)  }
        : l));
    } else {
      setData(prev => [...prev, {
        id: Date.now(),
        name: form.name,
        department_id: Number(form.department_id),
        technician_id: Number(form.technician_id),
         
      }]);
    }
    setDialogOpen(false);
  };
  const handleDelete = (id: number) => setData(prev => prev.filter(l => l.id !== id));

  // ── مساعدات ───────────────────────────────────────────────────
  const getDeptName  = (id: number) => departments.find(d => d.id === id)?.name  || '—';
  const getTechName  = (id: number) => users.find(u => u.id === id)?.name         || '—';
  const getTechEmail = (id: number) => users.find(u => u.id === id)?.email        || '';

   

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold flex items-center gap-2"><FlaskConical className="w-6 h-6 text-primary" /> {lang === 'ar' ? 'ادارة المخابر': 'Laboratory Management'} </h1>
        <Button onClick={openCreate}><Plus className="w-4 h-4 ml-1" />{lang === 'ar' ? 'إضافة مخبر': 'Add Laboratory'}</Button>
      </div>
      <Card className="border-0 shadow-sm"><CardContent className="p-0">
        <Table>
          <TableHeader><TableRow><TableHead>#</TableHead><TableHead>{lang === 'ar' ? 'المخبر': 'The Laboratory'}</TableHead><TableHead>{lang === 'ar' ? 'القسم': 'The Department'}</TableHead><TableHead>{lang === 'ar' ? 'الفني': 'The Technician'}</TableHead><TableHead>{lang === 'ar' ? 'إجراءات': 'Actions'}</TableHead></TableRow></TableHeader>
          <TableBody>
            {visibleLabs.map(l => (
              <TableRow key={l.id}>
                <TableCell>{l.id}</TableCell>
                <TableCell className="font-medium">{l.name}</TableCell>
                <TableCell>{departments.find(d => d.id === l.department_id)?.name || '-'}</TableCell>
                <TableCell>{users.find(u => u.id === l.technician_id)?.name || '-'}</TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button size="icon" variant="ghost" onClick={() => openEdit(l)}><Pencil className="w-4 h-4" /></Button>
                    <Button size="icon" variant="ghost" className="text-destructive" onClick={() => handleDelete(l.id)}><Trash2 className="w-4 h-4" /></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent></Card>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent dir="rtl">
          <DialogHeader><DialogTitle>{editing
  ? (lang === 'ar' ? 'تعديل مخبر' : 'Edit Laboratory')
  : (lang === 'ar' ? 'إضافة مخبر' : 'Add Laboratory')
}</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div><Label> {lang === 'ar' ? 'اسم المخبر ': 'Laboratory Name'}</Label><Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} /></div>
            <div><Label>{lang === 'ar' ? 'القسم': 'The Department'}</Label>
              <Select value={form.department_id} onValueChange={v => setForm(f => ({ ...f, department_id: v }))}>
                <SelectTrigger><SelectValue placeholder={lang === 'ar' ? 'اختر القسم': 'Select the department'} /></SelectTrigger>
                <SelectContent>{departments.map(d => <SelectItem key={d.id} value={String(d.id)}>{d.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div><Label>{lang === 'ar' ? 'الفني المسؤول': 'Responsible Technician'}</Label>
              <Select value={form.technician_id} onValueChange={v => setForm(f => ({ ...f, technician_id: v }))}>
                <SelectTrigger><SelectValue placeholder={lang === 'ar' ? 'اختر الفني': 'Select the Technician'} /></SelectTrigger>
                <SelectContent>{technicians.map(t => <SelectItem key={t.id} value={String(t.id)}>{t.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter><Button onClick={handleSave}>{editing ?  (lang === 'ar' ? 'تحديث ' : 'Edit') : (lang === 'ar' ? 'إضافة ' : 'Add')}</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LaboratoriesPage;
