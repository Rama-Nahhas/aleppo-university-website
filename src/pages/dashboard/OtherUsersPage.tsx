import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Trash2, Search, Users, Loader2, Inbox } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { OtherUser, useOtherUsersAdminActions } from '@/hooks/useOtherUsersAdminActions';
import { useDoctorAdminActions } from '@/hooks/useDoctorAdminActions';
import { usePagination } from '@/hooks/usePagination';
import { PaginationControls } from '@/components/ui/pagination-controls';

const PAGE_SIZE = 10;

const OtherUsersPage: React.FC = () => {
  const { lang } = useLanguage();
  const { toast } = useToast();
  const { fetchOtherUsers, loading } = useOtherUsersAdminActions();
  const { deleteUser } = useDoctorAdminActions();

  const [data, setData] = useState<OtherUser[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [search, setSearch] = useState('');

  const [deleteTarget, setDeleteTarget] = useState<OtherUser | null>(null);
  const [deleting, setDeleting] = useState(false);

  const filtered = data.filter(u => u.name.includes(search) || u.email.includes(search));
  const { page, setPage, totalPages, paginated } = usePagination(filtered, PAGE_SIZE);

  const loadUsers = async () => {
    const result = await fetchOtherUsers();
    setData(result);
    setLoaded(true);
  };

  useEffect(() => {
    loadUsers();
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

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    const ok = await deleteUser(deleteTarget.id);
    setDeleting(false);
    if (ok) {
      setDeleteTarget(null);
      notifySuccess(lang === 'ar' ? 'تم حذف المستخدم بنجاح' : 'User deleted successfully');
      await loadUsers();
    } else {
      notifyError(lang === 'ar' ? 'حدث خطأ أثناء حذف المستخدم' : 'Failed to delete user');
    }
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold flex items-center gap-2">
        <Users className="w-6 h-6 text-primary" />
        {lang === 'ar' ? 'المستخدمون الآخرون' : 'Other Users'}
      </h1>
      <div className="relative max-w-sm">
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input className="pr-9" placeholder={lang === 'ar' ? 'بحث...' : 'Search...'} value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {!loaded ? (
        <Loader2 className="animate-spin" />
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 py-16 text-muted-foreground">
          <Inbox className="w-10 h-10" />
          <p className="text-sm">{lang === 'ar' ? 'لا يوجد مستخدمون حالياً' : 'No users available'}</p>
        </div>
      ) : (
        <Card className="border-0 shadow-sm">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{lang === 'ar' ? 'الاسم' : 'Name'}</TableHead>
                  <TableHead>{lang === 'ar' ? 'البريد' : 'Email'}</TableHead>
                  <TableHead>{lang === 'ar' ? 'الدور' : 'Role'}</TableHead>
                  <TableHead>{lang === 'ar' ? 'تاريخ الإنشاء' : 'Created At'}</TableHead>
                  <TableHead>{lang === 'ar' ? 'إجراءات' : 'Actions'}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginated.map(u => (
                  <TableRow key={u.id}>
                    <TableCell className="font-medium">{u.name}</TableCell>
                    <TableCell>{u.email}</TableCell>
                    <TableCell><span className="px-2 py-1 bg-primary/10 text-primary rounded-md text-xs font-semibold">{u.role?.name ?? '-'}</span></TableCell>
                    <TableCell>{new Date(u.created_at).toLocaleDateString(lang === 'ar' ? 'ar-SY' : 'en-US')}</TableCell>
                    <TableCell>
                      <Button size="icon" variant="ghost" className="text-destructive" onClick={() => setDeleteTarget(u)}><Trash2 className="w-4 h-4" /></Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
      <PaginationControls page={page} totalPages={totalPages} onPageChange={setPage} lang={lang} />

      {/* Delete confirmation dialog */}
      <Dialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <DialogContent dir={lang === 'ar' ? 'rtl' : 'ltr'}>
          <DialogHeader>
            <DialogTitle>{lang === 'ar' ? 'تأكيد الحذف' : 'Confirm Deletion'}</DialogTitle>
            <DialogDescription>
              {lang === 'ar'
                ? `هل أنت متأكد بدك تحذف المستخدم "${deleteTarget?.name}"؟ لا يمكن التراجع عن هذا الإجراء.`
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

export default OtherUsersPage;
