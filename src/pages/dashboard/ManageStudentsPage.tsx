import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Users, Ban, Trash2, Loader2, Inbox } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { StudentUser, useStudentAdminActions } from '@/hooks/useStudentAdminActions';
import { usePagination } from '@/hooks/usePagination';
import { PaginationControls } from '@/components/ui/pagination-controls';

const PAGE_SIZE = 10;

const ManageStudentsPage: React.FC = () => {
  const { lang } = useLanguage();
  const { toast } = useToast();
  const { fetchStudents, blockStudent, deleteStudent, loading } = useStudentAdminActions();

  const [data, setData] = useState<StudentUser[]>([]);
  const [loaded, setLoaded] = useState(false);

  const [blockTarget, setBlockTarget] = useState<StudentUser | null>(null);
  const [blockReason, setBlockReason] = useState('');
  const [blocking, setBlocking] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<StudentUser | null>(null);
  const [deleting, setDeleting] = useState(false);

  const { page, setPage, totalPages, paginated } = usePagination(data, PAGE_SIZE);

  const loadStudents = async () => {
    const result = await fetchStudents();
    setData(result);
    setLoaded(true);
  };

  useEffect(() => {
    loadStudents();
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

  const handleBlock = async () => {
    if (!blockTarget || !blockReason.trim()) return;
    setBlocking(true);
    const ok = await blockStudent(blockTarget.id, blockReason);
    setBlocking(false);
    if (ok) {
      setBlockTarget(null);
      setBlockReason('');
      notifySuccess(lang === 'ar' ? 'تم حظر الطالب بنجاح' : 'Student blocked successfully');
      await loadStudents();
    } else {
      notifyError(lang === 'ar' ? 'حدث خطأ أثناء حظر الطالب' : 'Failed to block student');
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    const ok = await deleteStudent(deleteTarget.id);
    setDeleting(false);
    if (ok) {
      setDeleteTarget(null);
      notifySuccess(lang === 'ar' ? 'تم حذف الطالب بنجاح' : 'Student deleted successfully');
      await loadStudents();
    } else {
      notifyError(lang === 'ar' ? 'حدث خطأ أثناء حذف الطالب' : 'Failed to delete student');
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
        <Users className="w-6 h-6" />
        {lang === 'ar' ? 'إدارة الطلاب' : 'Manage Students'}
      </h1>

      {!loaded ? (
        <Loader2 className="animate-spin" />
      ) : data.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 py-16 text-muted-foreground">
          <Inbox className="w-10 h-10" />
          <p className="text-sm">{lang === 'ar' ? 'لا يوجد طلاب حالياً' : 'No students available'}</p>
        </div>
      ) : (
        <Card className="border-0 shadow-sm">
          <CardContent className="p-5">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{lang === 'ar' ? 'الاسم' : 'Name'}</TableHead>
                  <TableHead>{lang === 'ar' ? 'البريد' : 'Email'}</TableHead>
                  <TableHead>{lang === 'ar' ? 'الرقم الجامعي' : 'Student Number'}</TableHead>
                  <TableHead>{lang === 'ar' ? 'الهاتف' : 'Phone'}</TableHead>
                  <TableHead>{lang === 'ar' ? 'إجراءات' : 'Actions'}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginated.map(s => (
                  <TableRow key={s.id}>
                    <TableCell className="font-medium">{s.name}</TableCell>
                    <TableCell>{s.email}</TableCell>
                    <TableCell>{s.student_number ?? '-'}</TableCell>
                    <TableCell>{s.phone ?? '-'}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button size="icon" variant="ghost" className="text-amber-500" onClick={() => { setBlockTarget(s); setBlockReason(''); }}><Ban className="w-4 h-4" /></Button>
                        <Button size="icon" variant="ghost" className="text-destructive" onClick={() => setDeleteTarget(s)}><Trash2 className="w-4 h-4" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
      <PaginationControls page={page} totalPages={totalPages} onPageChange={setPage} lang={lang} />

      {/* Block dialog */}
      <Dialog open={!!blockTarget} onOpenChange={(open) => !open && setBlockTarget(null)}>
        <DialogContent dir={lang === 'ar' ? 'rtl' : 'ltr'}>
          <DialogHeader>
            <DialogTitle>{lang === 'ar' ? 'حظر الطالب' : 'Block Student'}</DialogTitle>
            <DialogDescription>
              {lang === 'ar'
                ? `أدخل سبب حظر "${blockTarget?.name}"`
                : `Enter the reason for blocking "${blockTarget?.name}"`}
            </DialogDescription>
          </DialogHeader>
          <Textarea value={blockReason} onChange={e => setBlockReason(e.target.value)} />
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
                ? `هل أنت متأكد بدك تحذف الطالب "${deleteTarget?.name}"؟ لا يمكن التراجع عن هذا الإجراء.`
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

export default ManageStudentsPage;
