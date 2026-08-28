import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog';
import { Textarea } from '@/components/ui/textarea';
import { Users, Ban, ShieldCheck, Trash2, Eye, Loader2, Inbox, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { StudentUser, useStudentAdminActions } from '@/hooks/useStudentAdminActions';
import { usePagination } from '@/hooks/usePagination';
import { PaginationControls } from '@/components/ui/pagination-controls';

const PAGE_SIZE = 10;

const ManageStudentsPage: React.FC = () => {
  const { lang } = useLanguage();
  const isArabic = lang === 'ar';
  const { toast } = useToast();
  const { fetchStudents, blockStudent, unblockStudent, deleteStudent, canDelete, loading } = useStudentAdminActions();

  const [data, setData] = useState<StudentUser[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [search, setSearch] = useState('');

  const [viewTarget, setViewTarget] = useState<StudentUser | null>(null);

  const [blockTarget, setBlockTarget] = useState<StudentUser | null>(null);
  const [blockReason, setBlockReason] = useState('');
  const [blocking, setBlocking] = useState(false);

  const [unblockTarget, setUnblockTarget] = useState<StudentUser | null>(null);
  const [unblocking, setUnblocking] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<StudentUser | null>(null);
  const [deleting, setDeleting] = useState(false);

  const filtered = data.filter(s => s.name.includes(search) || s.email.includes(search) || (s.student_number ?? '').includes(search));
  const { page, setPage, totalPages, paginated } = usePagination(filtered, PAGE_SIZE);

  const loadStudents = async () => {
    const result = await fetchStudents();
    setData(result);
    setLoaded(true);
  };

  useEffect(() => {
    loadStudents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const notifySuccess = (description: string) => {
    toast({
      title: isArabic ? 'تم بنجاح' : 'Success',
      description,
      className: 'bg-green-600 text-white font-semibold',
    });
  };

  const notifyError = (description: string) => {
    toast({
      title: isArabic ? 'حدث خطأ' : 'Error',
      description,
      variant: 'destructive',
    });
  };

  const handleBlock = async () => {
    if (!blockTarget || blockReason.trim().length < 5) return;
    setBlocking(true);
    const ok = await blockStudent(blockTarget.id, blockReason.trim());
    setBlocking(false);
    if (ok) {
      setBlockTarget(null);
      setBlockReason('');
      notifySuccess(isArabic ? 'تم حظر الطالب بنجاح' : 'Student blocked successfully');
      await loadStudents();
    } else {
      notifyError(isArabic ? 'حدث خطأ أثناء حظر الطالب' : 'Failed to block student');
    }
  };

  const handleUnblock = async () => {
    if (!unblockTarget) return;
    setUnblocking(true);
    const ok = await unblockStudent(unblockTarget.id);
    setUnblocking(false);
    if (ok) {
      setUnblockTarget(null);
      notifySuccess(isArabic ? 'تم رفع الحظر بنجاح' : 'Student unblocked successfully');
      await loadStudents();
    } else {
      notifyError(isArabic ? 'حدث خطأ أثناء رفع الحظر' : 'Failed to unblock student');
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    const ok = await deleteStudent(deleteTarget.id);
    setDeleting(false);
    if (ok) {
      setDeleteTarget(null);
      notifySuccess(isArabic ? 'تم حذف الطالب بنجاح' : 'Student deleted successfully');
      await loadStudents();
    } else {
      notifyError(isArabic ? 'حدث خطأ أثناء حذف الطالب' : 'Failed to delete student');
    }
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
        <Users className="w-6 h-6" />
        {isArabic ? 'إدارة الطلاب' : 'Manage Students'}
      </h1>

      <div className="relative max-w-sm">
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input className="pr-9" placeholder={isArabic ? 'بحث...' : 'Search...'} value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {!loaded ? (
        <Loader2 className="animate-spin" />
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 py-16 text-muted-foreground">
          <Inbox className="w-10 h-10" />
          <p className="text-sm">{isArabic ? 'لا يوجد طلاب حالياً' : 'No students available'}</p>
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
                    <TableHead>{isArabic ? 'الرقم الجامعي' : 'Student Number'}</TableHead>
                    <TableHead>{isArabic ? 'الحالة' : 'Status'}</TableHead>
                    <TableHead className="text-end">{isArabic ? 'إجراءات' : 'Actions'}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginated.map(s => {
                    const isActive = Number(s.is_active) === 1;
                    return (
                      <TableRow key={s.id}>
                        <TableCell className="font-medium">{s.name}</TableCell>
                        <TableCell>{s.email}</TableCell>
                        <TableCell>{s.student_number ?? '-'}</TableCell>
                        <TableCell>
                          {isActive ? (
                            <Badge className="border-transparent bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
                              {isArabic ? 'نشط' : 'Active'}
                            </Badge>
                          ) : (
                            <Badge className="border-transparent bg-red-100 text-red-700 hover:bg-red-100">
                              {isArabic ? 'محظور' : 'Blocked'}
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-end gap-1">
                            <Button size="icon" variant="ghost" onClick={() => setViewTarget(s)} title={isArabic ? 'عرض التفاصيل' : 'View details'}>
                              <Eye className="w-4 h-4" />
                            </Button>
                            {isActive ? (
                              <Button
                                size="icon"
                                variant="ghost"
                                className="text-amber-500"
                                onClick={() => { setBlockTarget(s); setBlockReason(''); }}
                                title={isArabic ? 'حظر' : 'Block'}
                              >
                                <Ban className="w-4 h-4" />
                              </Button>
                            ) : (
                              <Button
                                size="icon"
                                variant="ghost"
                                className="text-emerald-600"
                                onClick={() => setUnblockTarget(s)}
                                title={isArabic ? 'رفع الحظر' : 'Unblock'}
                              >
                                <ShieldCheck className="w-4 h-4" />
                              </Button>
                            )}
                            {canDelete && (
                              <Button size="icon" variant="ghost" className="text-destructive" onClick={() => setDeleteTarget(s)} title={isArabic ? 'حذف' : 'Delete'}>
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
      <PaginationControls page={page} totalPages={totalPages} onPageChange={setPage} lang={lang} />

      {/* نافذة عرض التفاصيل */}
      <Dialog open={!!viewTarget} onOpenChange={(open) => !open && setViewTarget(null)}>
        <DialogContent dir={isArabic ? 'rtl' : 'ltr'}>
          <DialogHeader>
            <DialogTitle>{isArabic ? 'تفاصيل الطالب' : 'Student Details'}</DialogTitle>
          </DialogHeader>
          {viewTarget && (
            <div className="space-y-2 text-sm">
              <p>{isArabic ? 'الاسم: ' : 'Name: '}<strong>{viewTarget.name}</strong></p>
              <p>{isArabic ? 'البريد: ' : 'Email: '}{viewTarget.email}</p>
              <p>{isArabic ? 'الرقم الجامعي: ' : 'Student Number: '}{viewTarget.student_number ?? '-'}</p>
              <p>{isArabic ? 'نوع القبول: ' : 'Admission Type: '}{viewTarget.admission_type ?? '-'}</p>
              <p>{isArabic ? 'الهاتف: ' : 'Phone: '}{viewTarget.phone ?? '-'}</p>
              <p>{isArabic ? 'العنوان: ' : 'Address: '}{viewTarget.address ?? '-'}</p>
              <p>
                {isArabic ? 'الحالة: ' : 'Status: '}
                {Number(viewTarget.is_active) === 1 ? (isArabic ? 'نشط' : 'Active') : (isArabic ? 'محظور' : 'Blocked')}
              </p>
              {Number(viewTarget.is_active) !== 1 && viewTarget.message && (
                <p className="text-destructive">{isArabic ? 'سبب الحظر: ' : 'Block reason: '}{viewTarget.message}</p>
              )}
              <p className="text-muted-foreground text-xs">
                {isArabic ? 'تاريخ الإنشاء: ' : 'Created: '}
                {new Date(viewTarget.created_at).toLocaleDateString(isArabic ? 'ar-SY' : 'en-US')}
              </p>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setViewTarget(null)}>{isArabic ? 'إغلاق' : 'Close'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* نافذة الحظر */}
      <Dialog open={!!blockTarget} onOpenChange={(open) => !open && setBlockTarget(null)}>
        <DialogContent dir={isArabic ? 'rtl' : 'ltr'}>
          <DialogHeader>
            <DialogTitle>{isArabic ? 'حظر الطالب' : 'Block Student'}</DialogTitle>
            <DialogDescription>
              {isArabic
                ? `أدخل سبب حظر "${blockTarget?.name}"`
                : `Enter the reason for blocking "${blockTarget?.name}"`}
            </DialogDescription>
          </DialogHeader>
          <Textarea
            value={blockReason}
            onChange={e => setBlockReason(e.target.value)}
            placeholder={isArabic ? '5 أحرف على الأقل' : 'Min 5 characters'}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setBlockTarget(null)}>{isArabic ? 'إلغاء' : 'Cancel'}</Button>
            <Button variant="destructive" onClick={handleBlock} disabled={blocking || blockReason.trim().length < 5} className="gap-1.5">
              {blocking && <Loader2 className="w-4 h-4 animate-spin" />}
              {isArabic ? 'تأكيد الحظر' : 'Confirm Block'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* تأكيد رفع الحظر */}
      <AlertDialog open={!!unblockTarget} onOpenChange={(open) => !open && setUnblockTarget(null)}>
        <AlertDialogContent dir={isArabic ? 'rtl' : 'ltr'}>
          <AlertDialogHeader>
            <AlertDialogTitle>{isArabic ? 'رفع الحظر عن الطالب؟' : 'Unblock this student?'}</AlertDialogTitle>
            <AlertDialogDescription>
              {isArabic
                ? `سيتمكن "${unblockTarget?.name}" من تسجيل الدخول مجدداً.`
                : `"${unblockTarget?.name}" will be able to log in again.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={unblocking}>{isArabic ? 'إلغاء' : 'Cancel'}</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                void handleUnblock();
              }}
              disabled={unblocking}
              className="gap-1.5"
            >
              {unblocking && <Loader2 className="w-4 h-4 animate-spin" />}
              {isArabic ? 'نعم، ارفع الحظر' : 'Yes, unblock'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* تأكيد الحذف */}
      <Dialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <DialogContent dir={isArabic ? 'rtl' : 'ltr'}>
          <DialogHeader>
            <DialogTitle>{isArabic ? 'تأكيد الحذف' : 'Confirm Deletion'}</DialogTitle>
            <DialogDescription>
              {isArabic
                ? `هل أنت متأكد بدك تحذف الطالب "${deleteTarget?.name}"؟ لا يمكن التراجع عن هذا الإجراء.`
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

export default ManageStudentsPage;
