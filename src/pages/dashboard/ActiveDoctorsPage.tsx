import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Search, UserCog, Loader2, Inbox, Pencil, Ban, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { PendingDoctor, useDoctorAdminActions } from '@/hooks/useDoctorAdminActions';
import { usePagination } from '@/hooks/usePagination';
import { PaginationControls } from '@/components/ui/pagination-controls';

const PAGE_SIZE = 10;

const ActiveDoctorsPage: React.FC = () => {
  const { lang } = useLanguage();
  const { toast } = useToast();
  const { fetchActiveDoctors, createDoctor, updateDoctor, blockDoctor, deleteUser, loading } = useDoctorAdminActions();

  const [data, setData] = useState<PendingDoctor[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [search, setSearch] = useState('');

  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '', specialization: '' });
  const [saving, setSaving] = useState(false);

  const [editTarget, setEditTarget] = useState<PendingDoctor | null>(null);
  const [editForm, setEditForm] = useState({ name: '', specialization: '' });
  const [editSaving, setEditSaving] = useState(false);

  const [blockTarget, setBlockTarget] = useState<PendingDoctor | null>(null);
  const [blockReason, setBlockReason] = useState('');
  const [blocking, setBlocking] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<PendingDoctor | null>(null);
  const [deleting, setDeleting] = useState(false);

  const filtered = data.filter(d => d.name.includes(search) || d.email.includes(search));
  const { page, setPage, totalPages, paginated } = usePagination(filtered, PAGE_SIZE);

  const loadDoctors = async () => {
    const result = await fetchActiveDoctors();
    setData(result);
    setLoaded(true);
  };

  useEffect(() => {
    loadDoctors();
  }, []);

  const notifySuccess = (description: string) => {
    toast({
      title: lang === 'ar' ? 'تم بنجاح' : 'Success',
      description,
      className: 'bg-green-600 text-white font-semibold',
    });
  };

  const notifyError = (description: string) => {
    toast({
      title: lang === 'ar' ? 'حدث خطأ' : 'Error',
      description,
      variant: 'destructive',
    });
  };

  const openAdd = () => {
    setForm({ name: '', email: '', password: '', specialization: '' });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.name.trim() || !form.email.trim() || !form.password.trim()) return;
    setSaving(true);
    const ok = await createDoctor(form.name, form.email, form.password, form.specialization);
    setSaving(false);
    if (ok) {
      setDialogOpen(false);
      notifySuccess(lang === 'ar' ? 'تم إضافة الطبيب بنجاح' : 'Doctor added successfully');
      await loadDoctors();
    } else {
      notifyError(lang === 'ar' ? 'حدث خطأ أثناء إضافة الطبيب' : 'Failed to add doctor');
    }
  };

  const openEdit = (d: PendingDoctor) => {
    setEditTarget(d);
    setEditForm({ name: d.name, specialization: d.specialization ?? '' });
  };

  const handleEditSave = async () => {
    if (!editTarget || !editForm.name.trim()) return;
    setEditSaving(true);
    const ok = await updateDoctor(editTarget.id, editForm.name, editForm.specialization);
    setEditSaving(false);
    if (ok) {
      setEditTarget(null);
      notifySuccess(lang === 'ar' ? 'تم تعديل بيانات الطبيب بنجاح' : 'Doctor updated successfully');
      await loadDoctors();
    } else {
      notifyError(lang === 'ar' ? 'حدث خطأ أثناء تعديل الطبيب' : 'Failed to update doctor');
    }
  };

  const handleBlock = async () => {
    if (!blockTarget || !blockReason.trim()) return;
    setBlocking(true);
    const ok = await blockDoctor(blockTarget.id, blockReason);
    setBlocking(false);
    if (ok) {
      setBlockTarget(null);
      setBlockReason('');
      notifySuccess(lang === 'ar' ? 'تم حظر الطبيب بنجاح' : 'Doctor blocked successfully');
      await loadDoctors();
    } else {
      notifyError(lang === 'ar' ? 'حدث خطأ أثناء حظر الطبيب' : 'Failed to block doctor');
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    const ok = await deleteUser(deleteTarget.id);
    setDeleting(false);
    if (ok) {
      setDeleteTarget(null);
      notifySuccess(lang === 'ar' ? 'تم حذف المستخدم بنجاح' : 'User deleted successfully');
      await loadDoctors();
    } else {
      notifyError(lang === 'ar' ? 'حدث خطأ أثناء حذف المستخدم' : 'Failed to delete user');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <UserCog className="w-6 h-6 text-primary" />
          {lang === 'ar' ? 'الأطباء النشطون' : 'Active Doctors'}
        </h1>
        <Button onClick={openAdd}>
          <Plus className="w-4 h-4 ml-1" />
          {lang === 'ar' ? 'إضافة طبيب' : 'Add Doctor'}
        </Button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input className="pr-9" placeholder={lang === 'ar' ? 'بحث...' : 'Search...'} value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {!loaded ? (
        <Loader2 className="animate-spin" />
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 py-16 text-muted-foreground">
          <Inbox className="w-10 h-10" />
          <p className="text-sm">{lang === 'ar' ? 'لا يوجد أطباء نشطون حالياً' : 'No active doctors'}</p>
        </div>
      ) : (
        <Card className="border-0 shadow-sm"><CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{lang === 'ar' ? 'الاسم' : 'Name'}</TableHead>
                <TableHead>{lang === 'ar' ? 'البريد' : 'Email'}</TableHead>
                <TableHead>{lang === 'ar' ? 'التخصص' : 'Specialization'}</TableHead>
                <TableHead>{lang === 'ar' ? 'الجامعة' : 'University'}</TableHead>
                <TableHead>{lang === 'ar' ? 'تاريخ الإنشاء' : 'Created At'}</TableHead>
                <TableHead>{lang === 'ar' ? 'إجراءات' : 'Actions'}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginated.map(d => (
                <TableRow key={d.id}>
                  <TableCell className="font-medium">{d.name}</TableCell>
                  <TableCell>{d.email}</TableCell>
                  <TableCell>{d.specialization ?? '-'}</TableCell>
                  <TableCell>{d.university ?? '-'}</TableCell>
                  <TableCell>{new Date(d.created_at).toLocaleDateString(lang === 'ar' ? 'ar-SY' : 'en-US')}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button size="icon" variant="ghost" onClick={() => openEdit(d)}><Pencil className="w-4 h-4" /></Button>
                      <Button size="icon" variant="ghost" className="text-amber-500" onClick={() => { setBlockTarget(d); setBlockReason(''); }}><Ban className="w-4 h-4" /></Button>
                      <Button size="icon" variant="ghost" className="text-destructive" onClick={() => setDeleteTarget(d)}><Trash2 className="w-4 h-4" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent></Card>
      )}
      <PaginationControls page={page} totalPages={totalPages} onPageChange={setPage} lang={lang} />

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent dir={lang === 'ar' ? 'rtl' : 'ltr'}>
          <DialogHeader><DialogTitle>{lang === 'ar' ? 'إضافة طبيب' : 'Add Doctor'}</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div>
              <Label>{lang === 'ar' ? 'الاسم' : 'Name'}</Label>
              <Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
            </div>
            <div>
              <Label>{lang === 'ar' ? 'البريد الإلكتروني' : 'Email'}</Label>
              <Input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
            </div>
            <div>
              <Label>{lang === 'ar' ? 'كلمة المرور' : 'Password'}</Label>
              <Input type="password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} />
            </div>
            <div>
              <Label>{lang === 'ar' ? 'التخصص' : 'Specialization'}</Label>
              <Input value={form.specialization} onChange={e => setForm(f => ({ ...f, specialization: e.target.value }))} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>{lang === 'ar' ? 'إلغاء' : 'Cancel'}</Button>
            <Button onClick={handleSave} disabled={saving || loading}>
              {saving ? (lang === 'ar' ? 'جاري الحفظ...' : 'Saving...') : (lang === 'ar' ? 'حفظ' : 'Save')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit dialog */}
      <Dialog open={!!editTarget} onOpenChange={(open) => !open && setEditTarget(null)}>
        <DialogContent dir={lang === 'ar' ? 'rtl' : 'ltr'}>
          <DialogHeader><DialogTitle>{lang === 'ar' ? 'تعديل الطبيب' : 'Edit Doctor'}</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div>
              <Label>{lang === 'ar' ? 'الاسم' : 'Name'}</Label>
              <Input value={editForm.name} onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))} />
            </div>
            <div>
              <Label>{lang === 'ar' ? 'التخصص' : 'Specialization'}</Label>
              <Input value={editForm.specialization} onChange={e => setEditForm(f => ({ ...f, specialization: e.target.value }))} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditTarget(null)}>{lang === 'ar' ? 'إلغاء' : 'Cancel'}</Button>
            <Button onClick={handleEditSave} disabled={editSaving || loading}>
              {editSaving ? (lang === 'ar' ? 'جاري الحفظ...' : 'Saving...') : (lang === 'ar' ? 'حفظ' : 'Save')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Block dialog */}
      <Dialog open={!!blockTarget} onOpenChange={(open) => !open && setBlockTarget(null)}>
        <DialogContent dir={lang === 'ar' ? 'rtl' : 'ltr'}>
          <DialogHeader>
            <DialogTitle>{lang === 'ar' ? 'حظر الطبيب' : 'Block Doctor'}</DialogTitle>
            <DialogDescription>
              {lang === 'ar'
                ? `أدخل سبب حظر "${blockTarget?.name}"`
                : `Enter the reason for blocking "${blockTarget?.name}"`}
            </DialogDescription>
          </DialogHeader>
          <div>
            <Label>{lang === 'ar' ? 'سبب الحظر' : 'Block Reason'}</Label>
            <Textarea value={blockReason} onChange={e => setBlockReason(e.target.value)} />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setBlockTarget(null)}>{lang === 'ar' ? 'إلغاء' : 'Cancel'}</Button>
            <Button variant="destructive" onClick={handleBlock} disabled={blocking || !blockReason.trim()}>
              {blocking ? (lang === 'ar' ? 'جاري الحظر...' : 'Blocking...') : (lang === 'ar' ? 'تأكيد الحظر' : 'Confirm Block')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation dialog */}
      <Dialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <DialogContent dir={lang === 'ar' ? 'rtl' : 'ltr'}>
          <DialogHeader>
            <DialogTitle>{lang === 'ar' ? 'تأكيد الحذف' : 'Confirm Deletion'}</DialogTitle>
            <DialogDescription>
              {lang === 'ar'
                ? `هل أنت متأكد بدك تحذف اليوزر "${deleteTarget?.name}"؟ لا يمكن التراجع عن هذا الإجراء.`
                : `Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>{lang === 'ar' ? 'إلغاء' : 'Cancel'}</Button>
            <Button variant="destructive" onClick={handleConfirmDelete} disabled={deleting}>
              {deleting ? (lang === 'ar' ? 'جاري الحذف...' : 'Deleting...') : (lang === 'ar' ? 'تأكيد الحذف' : 'Confirm Delete')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ActiveDoctorsPage;
