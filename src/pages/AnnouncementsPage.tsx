import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { resolveRoleName } from '@/lib/roleUtils';
import type { RoleName } from '@/types';
import { Plus, Pencil, Trash2, Megaphone, Calendar, Inbox, Loader2 } from 'lucide-react';
import { Announcement, useAnnouncementActions } from '@/hooks/useAnnouncementActions';

const AnnouncementsPage: React.FC = () => {
  const { user } = useAuth();
  const roleName = resolveRoleName(user as any) as RoleName | undefined;
  const canEdit = roleName === 'admin' || roleName === 'academic_doctor';
  const { fetchAnnouncements, loading } = useAnnouncementActions();
  const [data, setData] = useState<Announcement[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Announcement | null>(null);
  const [form, setForm] = useState({ title: '', content: '' });

  useEffect(() => {
    const loadData = async () => {
      const result = await fetchAnnouncements();
      setData(result);
    };
    loadData();
  }, []);

  const openCreate = () => { if (!canEdit) return; setEditing(null); setForm({ title: '', content: '' }); setDialogOpen(true); };
  const openEdit = (a: Announcement) => { if (!canEdit) return; setEditing(a); setForm({ title: a.title, content: a.content }); setDialogOpen(true); };
  const handleSave = () => {
    if (editing) setData(prev => prev.map(a => a.id === editing.id ? { ...a, ...form } : a));
    else setData(prev => [...prev, { id: Date.now(), ...form, created_at: new Date().toISOString() }]);
    setDialogOpen(false);
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
        {data.map(a => (
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

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent dir="rtl">
          <DialogHeader><DialogTitle>{editing ? 'تعديل إعلان' : 'إعلان جديد'}</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div><Label>العنوان</Label><Input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} /></div>
            <div><Label>المحتوى</Label><Textarea rows={4} value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} /></div>
          </div>
          <DialogFooter><Button onClick={handleSave}>{editing ? 'تحديث' : 'نشر'}</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AnnouncementsPage;
