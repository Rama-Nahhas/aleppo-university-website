import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Plus, Pencil, Trash2, Eye, Building2, Loader2, Inbox } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { usePagination } from '@/hooks/usePagination';
import { PaginationControls } from '@/components/ui/pagination-controls';
import {
  AdminCollege,
  CollegeDetails,
  useCollegeAdminActions,
} from '@/hooks/useCollegeAdminActions';

const PAGE_SIZE = 10;

const CollegesPage: React.FC = () => {
  const { lang } = useLanguage();
  const { toast } = useToast();
  const {
    fetchColleges,
    fetchCollegeDetails,
    createCollege,
    updateCollege,
    deleteCollege,
    loading,
  } = useCollegeAdminActions();

  const formatDate = (value: string) =>
    new Date(value).toLocaleString(lang === 'ar' ? 'ar-SY' : 'en-US');

  const [data, setData] = useState<AdminCollege[]>([]);
  const [loaded, setLoaded] = useState(false);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<AdminCollege | null>(null);
  const [name, setName] = useState('');
  const [saving, setSaving] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<AdminCollege | null>(null);
  const [deleting, setDeleting] = useState(false);

  const [detailsOpen, setDetailsOpen] = useState(false);
  const [details, setDetails] = useState<CollegeDetails | null>(null);

  const { page, setPage, totalPages, paginated } = usePagination(data, PAGE_SIZE);

  const loadColleges = async () => {
    const result = await fetchColleges();
    setData(result);
    setLoaded(true);
  };

  useEffect(() => {
    loadColleges();
  }, []);

  const openCreate = () => { setEditing(null); setName(''); setDialogOpen(true); };
  const openEdit = (c: AdminCollege) => { setEditing(c); setName(c.name); setDialogOpen(true); };

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

  const handleSave = async () => {
    if (!name.trim()) return;
    setSaving(true);
    const ok = editing
      ? await updateCollege(editing.id, name)
      : await createCollege(name);
    setSaving(false);
    if (ok) {
      setDialogOpen(false);
      notifySuccess(
        editing
          ? (lang === 'ar' ? 'تم تعديل الكلية بنجاح' : 'College updated successfully')
          : (lang === 'ar' ? 'تم إضافة الكلية بنجاح' : 'College added successfully'),
      );
      await loadColleges();
    } else {
      notifyError(
        editing
          ? (lang === 'ar' ? 'حدث خطأ أثناء تعديل الكلية' : 'Failed to update college')
          : (lang === 'ar' ? 'حدث خطأ أثناء إضافة الكلية' : 'Failed to add college'),
      );
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    const ok = await deleteCollege(deleteTarget.id);
    setDeleting(false);
    if (ok) {
      setDeleteTarget(null);
      notifySuccess(lang === 'ar' ? 'تم حذف الكلية بنجاح' : 'College deleted successfully');
      await loadColleges();
    } else {
      notifyError(lang === 'ar' ? 'حدث خطأ أثناء حذف الكلية' : 'Failed to delete college');
    }
  };

  const openDetails = async (c: AdminCollege) => {
    setDetailsOpen(true);
    setDetails(null);
    const result = await fetchCollegeDetails(c.id);
    setDetails(result);
    if (!result) {
      notifyError(lang === 'ar' ? 'حدث خطأ أثناء جلب تفاصيل الكلية' : 'Failed to load college details');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Building2 className="w-6 h-6 text-primary" />
          {lang === 'ar' ? 'إدارة الكليات' : 'Manage Colleges'}
        </h1>
        <Button onClick={openCreate}>
          <Plus className="w-4 h-4 ml-1" />
          {lang === 'ar' ? 'إضافة كلية' : 'Add College'}
        </Button>
      </div>

      {!loaded ? (
        <Loader2 className="animate-spin" />
      ) : data.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 py-16 text-muted-foreground">
          <Inbox className="w-10 h-10" />
          <p className="text-sm">{lang === 'ar' ? 'لا توجد كليات متاحة حالياً' : 'No colleges available yet'}</p>
        </div>
      ) : (
        <Card className="border-0 shadow-sm"><CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>#</TableHead>
                <TableHead>{lang === 'ar' ? 'اسم الكلية' : 'College Name'}</TableHead>
                <TableHead>{lang === 'ar' ? 'إجراءات' : 'Actions'}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginated.map(c => (
                <TableRow key={c.id}>
                  <TableCell>{c.id}</TableCell>
                  <TableCell className="font-medium">{c.name}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button size="icon" variant="ghost" onClick={() => openDetails(c)}><Eye className="w-4 h-4" /></Button>
                      <Button size="icon" variant="ghost" onClick={() => openEdit(c)}><Pencil className="w-4 h-4" /></Button>
                      <Button size="icon" variant="ghost" className="text-destructive" onClick={() => setDeleteTarget(c)}><Trash2 className="w-4 h-4" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent></Card>
      )}
      <PaginationControls page={page} totalPages={totalPages} onPageChange={setPage} lang={lang} />

      {/* Create / Edit dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent dir={lang === 'ar' ? 'rtl' : 'ltr'}>
          <DialogHeader>
            <DialogTitle>
              {editing
                ? (lang === 'ar' ? 'تعديل كلية' : 'Edit College')
                : (lang === 'ar' ? 'إضافة كلية' : 'Add College')}
            </DialogTitle>
          </DialogHeader>
          <div>
            <Label>{lang === 'ar' ? 'اسم الكلية' : 'College Name'}</Label>
            <Input value={name} onChange={e => setName(e.target.value)} />
          </div>
          <DialogFooter>
            <Button onClick={handleSave} disabled={saving || loading}>
              {saving
                ? (lang === 'ar' ? 'جاري الحفظ...' : 'Saving...')
                : editing
                  ? (lang === 'ar' ? 'تحديث' : 'Update')
                  : (lang === 'ar' ? 'إضافة' : 'Add')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation dialog */}
      <Dialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <DialogContent dir={lang === 'ar' ? 'rtl' : 'ltr'}>
          <DialogHeader>
            <DialogTitle>{lang === 'ar' ? 'تأكيد حذف الكلية' : 'Confirm College Deletion'}</DialogTitle>
            <DialogDescription>
              {lang === 'ar'
                ? `هل أنت متأكد من رغبتك في حذف كلية "${deleteTarget?.name}"؟ لا يمكن التراجع عن هذا الإجراء.`
                : `Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>
              {lang === 'ar' ? 'إلغاء' : 'Cancel'}
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete} disabled={deleting}>
              {deleting
                ? (lang === 'ar' ? 'جاري الحذف...' : 'Deleting...')
                : (lang === 'ar' ? 'تأكيد الحذف' : 'Confirm Delete')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Details dialog */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent dir={lang === 'ar' ? 'rtl' : 'ltr'} className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{details?.name ?? (lang === 'ar' ? 'تفاصيل الكلية' : 'College Details')}</DialogTitle>
          </DialogHeader>
          {!details ? (
            <Loader2 className="animate-spin" />
          ) : (
            <div className="space-y-4">
              <div>
                <h4 className="font-bold text-sm mb-2">
                  {lang === 'ar' ? 'الأقسام' : 'Departments'} ({details.departments.length})
                </h4>
                {details.departments.length === 0 ? (
                  <p className="text-xs text-muted-foreground">
                    {lang === 'ar' ? 'لا توجد أقسام' : 'No departments'}
                  </p>
                ) : (
                  <ul className="space-y-1">
                    {details.departments.map(d => (
                      <li key={d.id} className="text-sm bg-muted/50 rounded-lg px-3 py-1.5">{d.name}</li>
                    ))}
                  </ul>
                )}
              </div>
              <div>
                <h4 className="font-bold text-sm mb-2">
                  {lang === 'ar' ? 'السنوات' : 'Years'} ({details.years.length})
                </h4>
                {details.years.length === 0 ? (
                  <p className="text-xs text-muted-foreground">
                    {lang === 'ar' ? 'لا توجد سنوات' : 'No years'}
                  </p>
                ) : (
                  <ul className="space-y-1">
                    {details.years.map(y => (
                      <li key={y.id} className="text-sm bg-muted/50 rounded-lg px-3 py-1.5">{y.name}</li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="text-xs text-muted-foreground space-y-1 pt-2 border-t border-border">
                <p>{lang === 'ar' ? 'تاريخ الإنشاء: ' : 'Created: '}{formatDate(details.created_at)}</p>
                <p>{lang === 'ar' ? 'آخر تحديث: ' : 'Updated: '}{formatDate(details.updated_at)}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CollegesPage;
