import React, { useEffect, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
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
import { ShieldBan, ShieldCheck, Loader2, Inbox, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { BlockedUser, useBlockedUsersActions } from '@/hooks/useBlockedUsersActions';
import { usePagination } from '@/hooks/usePagination';
import { PaginationControls } from '@/components/ui/pagination-controls';

const PAGE_SIZE = 10;

const BlockedUsersPage: React.FC = () => {
  const { lang } = useLanguage();
  const isArabic = lang === 'ar';
  const { toast } = useToast();
  const { fetchBlockedUsers, unblockUser, loading } = useBlockedUsersActions();

  const [data, setData] = useState<BlockedUser[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [search, setSearch] = useState('');

  const [unblockTarget, setUnblockTarget] = useState<BlockedUser | null>(null);
  const [unblocking, setUnblocking] = useState(false);

  const filtered = data.filter(
    (u) => u.name.includes(search) || u.email.includes(search) || (u.department_name ?? '').includes(search),
  );
  const { page, setPage, totalPages, paginated } = usePagination(filtered, PAGE_SIZE);

  const loadData = async () => {
    const result = await fetchBlockedUsers();
    setData(result);
    setLoaded(true);
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const notifySuccess = (description: string) => {
    toast({ title: isArabic ? 'تم بنجاح' : 'Success', description, className: 'bg-green-600 text-white font-semibold' });
  };
  const notifyError = (description: string) => {
    toast({ title: isArabic ? 'حدث خطأ' : 'Error', description, variant: 'destructive' });
  };

  const handleUnblock = async () => {
    if (!unblockTarget) return;
    setUnblocking(true);
    const ok = await unblockUser(unblockTarget.id, unblockTarget.role);
    setUnblocking(false);
    if (ok) {
      notifySuccess(isArabic ? 'تم رفع الحظر بنجاح' : 'User unblocked successfully');
      setData((prev) => prev.filter((u) => u.id !== unblockTarget.id));
      setUnblockTarget(null);
    } else {
      notifyError(isArabic ? 'حدث خطأ أثناء رفع الحظر' : 'Failed to unblock user');
    }
  };

  const roleLabel = (role: string | null) => {
    if (role === 'Doctor') return isArabic ? 'دكتور' : 'Doctor';
    if (role === 'Student') return isArabic ? 'طالب' : 'Student';
    return role ?? '-';
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold flex items-center gap-2">
        <ShieldBan className="w-6 h-6 text-destructive" />
        {isArabic ? 'المستخدمون المحظورون' : 'Blocked Users'}
      </h1>

      <div className="relative max-w-sm">
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          className="pr-9"
          placeholder={isArabic ? 'بحث بالاسم أو البريد أو القسم...' : 'Search by name, email, or department...'}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {!loaded ? (
        <Loader2 className="animate-spin" />
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 py-16 text-muted-foreground">
          <Inbox className="w-10 h-10" />
          <p className="text-sm">{isArabic ? 'لا يوجد مستخدمون محظورون حالياً' : 'No blocked users currently'}</p>
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
                    <TableHead>{isArabic ? 'الدور' : 'Role'}</TableHead>
                    <TableHead>{isArabic ? 'القسم' : 'Department'}</TableHead>
                    <TableHead>{isArabic ? 'سبب الحظر' : 'Block Reason'}</TableHead>
                    <TableHead className="text-end">{isArabic ? 'إجراءات' : 'Actions'}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginated.map((u) => (
                    <TableRow key={u.id}>
                      <TableCell className="font-medium">{u.name}</TableCell>
                      <TableCell>{u.email}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{roleLabel(u.role)}</Badge>
                      </TableCell>
                      <TableCell>{u.department_name ?? '-'}</TableCell>
                      <TableCell className="max-w-xs truncate" title={u.block_reason ?? ''}>
                        {u.block_reason ?? '-'}
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-end">
                          <Button
                            size="sm"
                            variant="outline"
                            className="gap-1.5 text-emerald-600 border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
                            onClick={() => setUnblockTarget(u)}
                          >
                            <ShieldCheck className="w-3.5 h-3.5" />
                            {isArabic ? 'رفع الحظر' : 'Unblock'}
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

      {/* تأكيد رفع الحظر */}
      <AlertDialog open={!!unblockTarget} onOpenChange={(open) => !open && setUnblockTarget(null)}>
        <AlertDialogContent dir={isArabic ? 'rtl' : 'ltr'}>
          <AlertDialogHeader>
            <AlertDialogTitle>{isArabic ? 'رفع الحظر عن هذا المستخدم؟' : 'Unblock this user?'}</AlertDialogTitle>
            <AlertDialogDescription>
              {isArabic
                ? `سيتمكن "${unblockTarget?.name}" (${roleLabel(unblockTarget?.role ?? null)}) من تسجيل الدخول مجدداً.`
                : `"${unblockTarget?.name}" (${roleLabel(unblockTarget?.role ?? null)}) will be able to log in again.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={unblocking}>{isArabic ? 'إلغاء' : 'Cancel'}</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                void handleUnblock();
              }}
              disabled={unblocking || loading}
              className="gap-1.5"
            >
              {unblocking && <Loader2 className="w-4 h-4 animate-spin" />}
              {isArabic ? 'نعم، ارفع الحظر' : 'Yes, unblock'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default BlockedUsersPage;
