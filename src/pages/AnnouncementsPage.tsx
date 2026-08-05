import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
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
import { useAuth } from '@/contexts/AuthContext';
import { resolveRoleName } from '@/lib/roleUtils';
import type { RoleName } from '@/types';
import { Plus, Pencil, Trash2, Megaphone, Calendar, Inbox, Loader2 } from 'lucide-react';
import { Announcement, useAnnouncementActions } from '@/hooks/useAnnouncementActions';
import { NamedOption, useCollegeLookups } from '@/hooks/students/useApiActions';
import { STUDY_YEARS } from '@/lib/constants';
import { usePagination } from '@/hooks/usePagination';
import { PaginationControls } from '@/components/ui/pagination-controls';

const COLLEGE_ID = 1;
const PAGE_SIZE = 9;

const AnnouncementsPage: React.FC = () => {
  const { user } = useAuth();
  const roleName = resolveRoleName(user as any) as RoleName | undefined;
  const canEdit = roleName === 'admin' || roleName === 'academic_doctor';
  const { fetchAnnouncements, createAnnouncement, loading } = useAnnouncementActions();
  const { fetchDepartments } = useCollegeLookups();
  const [data, setData] = useState<Announcement[]>([]);
  const { page, setPage, totalPages, paginated } = usePagination(data, PAGE_SIZE);
  const [departments, setDepartments] = useState<NamedOption[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Announcement | null>(null);
  const [form, setForm] = useState({ title: '', content: '', year_id: '', department_id: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      const result = await fetchAnnouncements();
      setData(result);
    };
    loadData();
  }, []);

  useEffect(() => {
    const loadDepartments = async () => {
      setDepartments(await fetchDepartments(COLLEGE_ID));
    };
    loadDepartments();
  }, []);

  const openCreate = () => { if (!canEdit) return; setEditing(null); setForm({ title: '', content: '', year_id: '', department_id: '' }); setDialogOpen(true); };
  const openEdit = (a: Announcement) => { if (!canEdit) return; setEditing(a); setForm({ title: a.title, content: a.content, year_id: '', department_id: '' }); setDialogOpen(true); };
  const handleSave = async () => {
    if (editing) {
      setData(prev => prev.map(a => a.id === editing.id ? { ...a, title: form.title, content: form.content } : a));
      setDialogOpen(false);
      return;
    }
    if (!form.year_id || !form.department_id) return;
    setSaving(true);
    const created = await createAnnouncement({
      title: form.title,
      content: form.content,
      year_id: Number(form.year_id),
      department_id: Number(form.department_id),
    });
    setSaving(false);
    if (created) {
      setData(prev => [created, ...prev]);
      setDialogOpen(false);
    }
  };
  const handleDelete = (id: number) => setData(prev => prev.filter(a => a.id !== id));

  if (loading) return <Loader2 className="animate-spin" />;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold flex items-center gap-2"><Megaphone className="w-6 h-6 text-primary" /> الإعلانات</h1>
        {canEdit && <Button onClick={openCreate}><Plus className="w-4 h-4 ml-1" /> إعلان جديد</Button>}
      </div>

      {data.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 py-16 text-muted-foreground">
          <Inbox className="w-10 h-10" />
          <p className="text-sm">لا توجد إعلانات متاحة حالياً</p>
        </div>
      ) : (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {paginated.map(a => (
          <Card key={a.id} className="border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-bold text-lg text-foreground">{a.title}</h3>
                <div className="flex gap-1 flex-shrink-0">
                  {canEdit && <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => openEdit(a)}><Pencil className="w-3.5 h-3.5" /></Button>}
                  {canEdit && <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive" onClick={() => handleDelete(a.id)}><Trash2 className="w-3.5 h-3.5" /></Button>}
                </div>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed mb-3">{a.content}</p>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Calendar className="w-3.5 h-3.5" />
                {new Date(a.created_at).toLocaleDateString('ar-SY')}
                {' - '}
                {new Date(a.created_at).toLocaleTimeString('ar-SY', { hour: '2-digit', minute: '2-digit' })}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      )}
      <PaginationControls page={page} totalPages={totalPages} onPageChange={setPage} />

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent dir="rtl">
          <DialogHeader><DialogTitle>{editing ? 'تعديل إعلان' : 'إعلان جديد'}</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div><Label>العنوان</Label><Input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} /></div>
            <div><Label>المحتوى</Label><Textarea rows={4} value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} /></div>
            {!editing && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>السنة</Label>
                  <Select value={form.year_id} onValueChange={v => setForm(f => ({ ...f, year_id: v }))}>
                    <SelectTrigger><SelectValue placeholder="اختر السنة" /></SelectTrigger>
                    <SelectContent>
                      {STUDY_YEARS.map(y => <SelectItem key={y.id} value={String(y.id)}>{y.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>القسم</Label>
                  <Select value={form.department_id} onValueChange={v => setForm(f => ({ ...f, department_id: v }))}>
                    <SelectTrigger><SelectValue placeholder="اختر القسم" /></SelectTrigger>
                    <SelectContent>
                      {departments.map(d => <SelectItem key={d.id} value={String(d.id)}>{d.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? 'جاري النشر...' : editing ? 'تحديث' : 'نشر'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AnnouncementsPage;
