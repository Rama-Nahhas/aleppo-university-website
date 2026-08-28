import React, { useEffect, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Plus, Trash2, Shield, Loader2, Inbox, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { SubAdmin, useSubAdminActions } from '@/hooks/useSubAdminActions';
import { AdminDepartment, useDepartmentAdminActions } from '@/hooks/useDepartmentAdminActions';
import { usePagination } from '@/hooks/usePagination';
import { PaginationControls } from '@/components/ui/pagination-controls';

const PAGE_SIZE = 10;

interface SubAdminFormState {
  name: string;
  email: string;
  password: string;
  department_id: string;
  phone: string;
}

const emptyForm: SubAdminFormState = { name: '', email: '', password: '', department_id: '', phone: '' };

const SubAdminsPage: React.FC = () => {
  const { lang } = useLanguage();
  const isArabic = lang === 'ar';
  const { toast } = useToast();
  const { fetchSubAdmins, createSubAdmin, deleteSubAdmin, loading } = useSubAdminActions();
  const { fetchDepartments } = useDepartmentAdminActions();

  const [data, setData] = useState<SubAdmin[]>([]);
  const [departments, setDepartments] = useState<AdminDepartment[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [search, setSearch] = useState('');

  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState<SubAdminFormState>(emptyForm);
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<SubAdmin | null>(null);
  const [deleting, setDeleting] = useState(false);

  const filtered = data.filter((s) => s.name.includes(search) || s.email.includes(search));
  const { page, setPage, totalPages, paginated } = usePagination(filtered, PAGE_SIZE);

  const loadData = async () => {
    const result = await fetchSubAdmins();
    setData(result);
    setLoaded(true);
  };

  useEffect(() => {
    loadData();
    fetchDepartments().then(setDepartments);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const notifySuccess = (description: string) => {
    toast({ title: isArabic ? 'تم بنجاح' : 'Success', description, className: 'bg-green-600 text-white font-semibold' });
  };
  const notifyError = (description: string) => {
    toast({ title: isArabic ? 'حدث خطأ' : 'Error', description, variant: 'destructive' });
  };

  const openCreate = () => {
    setForm(emptyForm);
    setFormError(null);
    setDialogOpen(true);
  };

  const handleSave = async () => {
    setFormError(null);
    if (!form.name.trim() || !form.email.trim() || !form.password.trim() || !form.department_id) {
      setFormError(isArabic ? 'الرجاء تعبئة كل الحقول المطلوبة' : 'Please fill in all required fields');
      return;
    }
    setSaving(true);
    const ok = await createSubAdmin({
      name: form.name.trim(),
      email: form.email.trim(),
      password: form.password,
      department_id: form.department_id,
      ...(form.phone.trim() ? { phone: form.phone.trim() } : {}),
    });
    setSaving(false);
    if (ok) {
      setDialogOpen(false);
      notifySuccess(isArabic ? 'تم إضافة المشرف بنجاح' : 'Supervisor added successfully');
      await loadData();
    } else {
      setFormError(isArabic ? 'حدث خطأ أثناء إضافة المشرف' : 'Failed to add supervisor');
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    const ok = await deleteSubAdmin(deleteTarget.id);
    setDeleting(false);
    if (ok) {
      setDeleteTarget(null);
      notifySuccess(isArabic ? 'تم حذف المشرف بنجاح' : 'Supervisor deleted successfully');
      setData((prev) => prev.filter((s) => s.id !== deleteTarget.id));
    } else {
      notifyError(isArabic ? 'حدث خطأ أثناء حذف المشرف' : 'Failed to delete supervisor');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Shield className="w-6 h-6 text-primary" />
          {isArabic ? 'المشرفون' : 'Supervisors'}
        </h1>
        <Button onClick={openCreate} className="gap-1.5">
          <Plus className="w-4 h-4" />
          {isArabic ? 'إضافة مشرف' : 'Add Supervisor'}
        </Button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input className="pr-9" placeholder={isArabic ? 'بحث...' : 'Search...'} value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {!loaded ? (
        <Loader2 className="animate-spin" />
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 py-16 text-muted-foreground">
          <Inbox className="w-10 h-10" />
          <p className="text-sm">{isArabic ? 'لا يوجد مشرفون حالياً' : 'No supervisors yet'}</p>
        </div>
      ) : (
        <Card className="border-0 shadow-sm">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{isArabic ? 'الاسم' : 'Name'}</TableHead>
                    <TableHead>{isArabic ? 'البريد' : 'Email'}</TableHead>
                    <TableHead>{isArabic ? 'الهاتف' : 'Phone'}</TableHead>
                    <TableHead>{isArabic ? 'القسم' : 'Department'}</TableHead>
                    <TableHead className="text-end">{isArabic ? 'إجراءات' : 'Actions'}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginated.map((s) => (
                    <TableRow key={s.id}>
                      <TableCell className="font-medium">{s.name}</TableCell>
                      <TableCell>{s.email}</TableCell>
                      <TableCell>{s.phone ?? '-'}</TableCell>
                      <TableCell>{s.department?.name ?? '-'}</TableCell>
                      <TableCell>
                        <div className="flex justify-end">
                          <Button size="icon" variant="ghost" className="text-destructive" onClick={() => setDeleteTarget(s)} title={isArabic ? 'حذف' : 'Delete'}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
      <PaginationControls page={page} totalPages={totalPages} onPageChange={setPage} lang={lang} />

      {/* نموذج إضافة مشرف */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent dir={isArabic ? 'rtl' : 'ltr'}>
          <DialogHeader>
            <DialogTitle>{isArabic ? 'إضافة مشرف (Sub Admin)' : 'Add Supervisor (Sub Admin)'}</DialogTitle>
            <DialogDescription>
              {isArabic
                ? 'هالحساب رح يقدر يدير قسم محدد بس (طلاب، دكاترة، مخابر، جداول...)'
                : 'This account will be able to manage a single specific department only'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label>{isArabic ? 'الاسم' : 'Name'}</Label>
              <Input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label>{isArabic ? 'البريد الإلكتروني' : 'Email'}</Label>
              <Input type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label>{isArabic ? 'كلمة المرور' : 'Password'}</Label>
              <Input type="password" value={form.password} onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label>{isArabic ? 'الهاتف (اختياري)' : 'Phone (optional)'}</Label>
              <Input value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label>{isArabic ? 'القسم' : 'Department'}</Label>
              <Select value={form.department_id} onValueChange={(v) => setForm((f) => ({ ...f, department_id: v }))}>
                <SelectTrigger><SelectValue placeholder={isArabic ? 'اختر القسم' : 'Select Department'} /></SelectTrigger>
                <SelectContent>
                  {departments.map((d) => (
                    <SelectItem key={d.id} value={String(d.id)}>{d.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          {formError && <p className="text-sm text-destructive font-medium">{formError}</p>}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>{isArabic ? 'إلغاء' : 'Cancel'}</Button>
            <Button onClick={handleSave} disabled={saving || loading} className="gap-1.5">
              {saving && <Loader2 className="w-4 h-4 animate-spin" />}
              {isArabic ? 'إضافة' : 'Add'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* تأكيد الحذف */}
      <Dialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <DialogContent dir={isArabic ? 'rtl' : 'ltr'}>
          <DialogHeader>
            <DialogTitle>{isArabic ? 'تأكيد الحذف' : 'Confirm Deletion'}</DialogTitle>
            <DialogDescription>
              {isArabic
                ? `هل أنت متأكد من رغبتك بحذف المشرف "${deleteTarget?.name}"؟ لا يمكن التراجع عن هذا الإجراء.`
                : `Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>{isArabic ? 'إلغاء' : 'Cancel'}</Button>
            <Button variant="destructive" onClick={handleConfirmDelete} disabled={deleting} className="gap-1.5">
              {deleting && <Loader2 className="w-4 h-4 animate-spin" />}
              {isArabic ? 'تأكيد الحذف' : 'Confirm Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SubAdminsPage;
