import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { resolveRoleName } from '@/lib/roleUtils';
import type { RoleName } from '@/types';
import { Plus, Trash2, Megaphone, Calendar, Inbox, Loader2, Globe2 } from 'lucide-react';
import { Announcement, useAnnouncementActions } from '@/hooks/useAnnouncementActions';
import { STUDY_YEARS } from '@/lib/constants';
import { usePagination } from '@/hooks/usePagination';
import { PaginationControls } from '@/components/ui/pagination-controls';

const PAGE_SIZE = 9;

const AnnouncementsPage: React.FC = () => {
  const { user } = useAuth();
  const { lang } = useLanguage();
  const isArabic = lang === 'ar';
  const { toast } = useToast();
  const roleName = resolveRoleName(user as any) as RoleName | undefined;

  // الدكتور بينشر إعلان قسمو، الأدمن/السب أدمن بينشروا إعلان عام يشوفه الكل
  const isDoctor = roleName === 'academic_doctor';
  const isPublicManager = roleName === 'admin' || roleName === 'university_admin';
  const canCreate = isDoctor || isPublicManager;

  const {
    fetchAnnouncements,
    fetchPublicAnnouncements,
    createDepartmentAnnouncement,
    createPublicAnnouncement,
    deleteAnnouncement,
    loading,
  } = useAnnouncementActions();

  const [data, setData] = useState<Announcement[]>([]);
  const [loaded, setLoaded] = useState(false);
  const { page, setPage, totalPages, paginated } = usePagination(data, PAGE_SIZE);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({ title: '', content: '', year_id: '' });
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<Announcement | null>(null);
  const [deleting, setDeleting] = useState(false);

  const loadData = async () => {
    setLoaded(false);
    const result = isPublicManager ? await fetchPublicAnnouncements() : await fetchAnnouncements();
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

  const openCreate = () => {
    setForm({ title: '', content: '', year_id: '' });
    setFormError(null);
    setDialogOpen(true);
  };

  const handleSave = async () => {
    setFormError(null);
    if (!form.title.trim() || !form.content.trim()) {
      setFormError(isArabic ? 'الرجاء تعبئة العنوان والمحتوى' : 'Please fill in the title and content');
      return;
    }
    if (isDoctor && !form.year_id) {
      setFormError(isArabic ? 'الرجاء اختيار السنة' : 'Please select a year');
      return;
    }

    setSaving(true);
    const created = isPublicManager
      ? await createPublicAnnouncement({ title: form.title.trim(), content: form.content.trim() })
      : await createDepartmentAnnouncement({
          title: form.title.trim(),
          content: form.content.trim(),
          year_id: Number(form.year_id),
        });
    setSaving(false);

    if (created) {
      setDialogOpen(false);
      notifySuccess(isArabic ? 'تم نشر الإعلان بنجاح' : 'Announcement published successfully');
      await loadData();
    } else {
      setFormError(isArabic ? 'حدث خطأ أثناء نشر الإعلان' : 'Failed to publish announcement');
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    const ok = await deleteAnnouncement(deleteTarget.id);
    setDeleting(false);
    if (ok) {
      setDeleteTarget(null);
      notifySuccess(isArabic ? 'تم حذف الإعلان بنجاح' : 'Announcement deleted successfully');
      setData((prev) => prev.filter((a) => a.id !== deleteTarget.id));
    } else {
      notifyError(isArabic ? 'حدث خطأ أثناء حذف الإعلان' : 'Failed to delete announcement');
    }
  };

  if (!loaded) return <Loader2 className="animate-spin" />;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Megaphone className="w-6 h-6 text-primary" />
          {isArabic ? 'الإعلانات' : 'Announcements'}
          {isPublicManager && (
            <Badge variant="secondary" className="gap-1 font-normal">
              <Globe2 className="w-3 h-3" />
              {isArabic ? 'عامة' : 'Public'}
            </Badge>
          )}
        </h1>
        {canCreate && (
          <Button onClick={openCreate} className="gap-1.5">
            <Plus className="w-4 h-4" />
            {isArabic ? 'إعلان جديد' : 'New Announcement'}
          </Button>
        )}
      </div>

      {data.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 py-16 text-muted-foreground">
          <Inbox className="w-10 h-10" />
          <p className="text-sm">{isArabic ? 'لا توجد إعلانات متاحة حالياً' : 'No announcements available yet'}</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {paginated.map((a) => {
            const isMine = user?.id != null && a.created_by === user.id;
            return (
              <Card key={a.id} className="border-0 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-bold text-lg text-foreground">{a.title}</h3>
                    {isMine && (
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7 text-destructive flex-shrink-0"
                        onClick={() => setDeleteTarget(a)}
                        title={isArabic ? 'حذف' : 'Delete'}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-3">{a.content}</p>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(a.created_at).toLocaleDateString(isArabic ? 'ar-SY' : 'en-US')}
                    {' - '}
                    {new Date(a.created_at).toLocaleTimeString(isArabic ? 'ar-SY' : 'en-US', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
      <PaginationControls page={page} totalPages={totalPages} onPageChange={setPage} lang={lang} />

      {/* نموذج إعلان جديد */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent dir={isArabic ? 'rtl' : 'ltr'}>
          <DialogHeader>
            <DialogTitle>
              {isPublicManager
                ? (isArabic ? 'إعلان عام جديد' : 'New Public Announcement')
                : (isArabic ? 'إعلان جديد لقسمك' : 'New Department Announcement')}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label>{isArabic ? 'العنوان' : 'Title'}</Label>
              <Input value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label>{isArabic ? 'المحتوى' : 'Content'}</Label>
              <Textarea rows={4} value={form.content} onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))} />
            </div>
            {isDoctor && (
              <div className="space-y-1.5">
                <Label>{isArabic ? 'السنة' : 'Year'}</Label>
                <Select value={form.year_id} onValueChange={(v) => setForm((f) => ({ ...f, year_id: v }))}>
                  <SelectTrigger><SelectValue placeholder={isArabic ? 'اختر السنة' : 'Select Year'} /></SelectTrigger>
                  <SelectContent>
                    {STUDY_YEARS.map((y) => <SelectItem key={y.id} value={String(y.id)}>{y.name}</SelectItem>)}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  {isArabic ? 'رح ينشر لقسمك تلقائياً' : "Will be published to your department automatically"}
                </p>
              </div>
            )}
            {isPublicManager && (
              <p className="text-xs text-muted-foreground">
                {isArabic ? 'هاد الإعلان رح يظهر للجميع بالموقع العام' : 'This announcement will be visible to everyone on the public site'}
              </p>
            )}
          </div>
          {formError && <p className="text-sm text-destructive font-medium">{formError}</p>}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>{isArabic ? 'إلغاء' : 'Cancel'}</Button>
            <Button onClick={handleSave} disabled={saving || loading} className="gap-1.5">
              {saving && <Loader2 className="w-4 h-4 animate-spin" />}
              {isArabic ? 'نشر' : 'Publish'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* تأكيد الحذف */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent dir={isArabic ? 'rtl' : 'ltr'}>
          <AlertDialogHeader>
            <AlertDialogTitle>{isArabic ? 'هل أنت متأكد من الحذف؟' : 'Are you sure you want to delete?'}</AlertDialogTitle>
            <AlertDialogDescription>
              {isArabic
                ? `سيتم حذف إعلان "${deleteTarget?.title}" نهائياً ولا يمكن التراجع عن هذا الإجراء.`
                : `"${deleteTarget?.title}" will be permanently deleted. This action cannot be undone.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>{isArabic ? 'إلغاء' : 'Cancel'}</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                void handleConfirmDelete();
              }}
              disabled={deleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 gap-1.5"
            >
              {deleting && <Loader2 className="w-4 h-4 animate-spin" />}
              {isArabic ? 'نعم، احذف' : 'Yes, delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AnnouncementsPage;
