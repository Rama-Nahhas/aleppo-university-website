import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { users as initialUsers, roles } from '@/data/mockData';
import { Plus, Pencil, Trash2, Search, Users } from 'lucide-react';
import type { User } from '@/types';
import { usePagination } from '@/hooks/usePagination';
import { PaginationControls } from '@/components/ui/pagination-controls';

const PAGE_SIZE = 10;

const OtherUsersPage: React.FC = () => {
  const others = initialUsers.filter(u => ![3,9,6].includes(u.role_id));
  const [data, setData] = useState<User[]>(others);
  const [search, setSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<User | null>(null);
  const [form, setForm] = useState({ name: '', email: '', role_id: '' });

  const filtered = data.filter(u => u.name.includes(search) || u.email.includes(search));
  const { page, setPage, totalPages, paginated } = usePagination(filtered, PAGE_SIZE);

  const openCreate = () => { setEditing(null); setForm({ name: '', email: '', role_id: '' }); setDialogOpen(true); };
  const openEdit = (u: User) => { setEditing(u); setForm({ name: u.name, email: u.email, role_id: String(u.role_id) }); setDialogOpen(true); };

  const handleSave = () => {
    if (editing) setData(prev => prev.map(u => u.id === editing.id ? { ...u, name: form.name, email: form.email, role_id: Number(form.role_id) } : u));
    else setData(prev => [...prev, { id: Date.now(), name: form.name, email: form.email, role_id: Number(form.role_id), college_id: null, department_id: null } as User]);
    setDialogOpen(false);
  };

  const handleDelete = (id: number) => setData(prev => prev.filter(u => u.id !== id));

  return (
    <div dir="rtl" className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold flex items-center gap-2"><Users className="w-6 h-6 text-primary" /> المستخدمون الآخرون</h1>
        <Button onClick={openCreate}><Plus className="w-4 h-4 ml-1" /> إضافة مستخدم</Button>
      </div>
      <div className="relative max-w-sm">
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input className="pr-9" placeholder="بحث..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>
      <Card className="border-0 shadow-sm">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>#</TableHead>
                <TableHead>الاسم</TableHead>
                <TableHead>البريد</TableHead>
                <TableHead>الدور</TableHead>
                <TableHead>الحالة</TableHead>
                <TableHead>تاريخ الإنشاء</TableHead>
                <TableHead>إجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginated.map(u => (
                <TableRow key={u.id}>
                  <TableCell>{u.id}</TableCell>
                  <TableCell className="font-medium">{u.name}</TableCell>
                  <TableCell>{u.email}</TableCell>
                  <TableCell><span className="px-2 py-1 bg-primary/10 text-primary rounded-md text-xs font-semibold">{roles.find(r => r.id === u.role_id)?.label || '-'}</span></TableCell>
                  <TableCell><span className="px-2 py-1 rounded-md text-xs font-semibold bg-muted/30">{u.status || 'active'}</span></TableCell>
                  <TableCell>{u.created_at ? new Date(u.created_at).toLocaleDateString('ar-SY') : '-'}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button size="icon" variant="ghost" onClick={() => openEdit(u)}><Pencil className="w-4 h-4" /></Button>
                      <Button size="icon" variant="ghost" className="text-destructive" onClick={() => handleDelete(u.id)}><Trash2 className="w-4 h-4" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <PaginationControls page={page} totalPages={totalPages} onPageChange={setPage} />

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent dir="rtl">
          <DialogHeader><DialogTitle>{editing ? 'تعديل مستخدم' : 'إضافة مستخدم'}</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div><Label>الاسم</Label><Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} /></div>
            <div><Label>البريد الإلكتروني</Label><Input value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} /></div>
            <div><Label>الدور</Label>
              <Select value={form.role_id} onValueChange={v => setForm(f => ({ ...f, role_id: v }))}>
                <SelectTrigger><SelectValue placeholder="اختر الدور" /></SelectTrigger>
                <SelectContent>{roles.map(r => <SelectItem key={r.id} value={String(r.id)}>{r.label}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter><Button onClick={handleSave}>{editing ? 'تحديث' : 'إضافة'}</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OtherUsersPage;
