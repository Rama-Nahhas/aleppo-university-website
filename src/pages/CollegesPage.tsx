import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { colleges as initialColleges } from '@/data/mockData';
import { Plus, Pencil, Trash2, Building2 } from 'lucide-react';
import type { College } from '@/types';

const CollegesPage: React.FC = () => {
  const [data, setData] = useState<College[]>(initialColleges);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<College | null>(null);
  const [name, setName] = useState('');

  const openCreate = () => { setEditing(null); setName(''); setDialogOpen(true); };
  const openEdit = (c: College) => { setEditing(c); setName(c.name); setDialogOpen(true); };
  const handleSave = () => {
    if (editing) setData(prev => prev.map(c => c.id === editing.id ? { ...c, name } : c));
    else setData(prev => [...prev, { id: Date.now(), name }]);
    setDialogOpen(false);
  };
  const handleDelete = (id: number) => setData(prev => prev.filter(c => c.id !== id));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold flex items-center gap-2"><Building2 className="w-6 h-6 text-primary" /> إدارة الكليات</h1>
        <Button onClick={openCreate}><Plus className="w-4 h-4 ml-1" /> إضافة كلية</Button>
      </div>
      <Card className="border-0 shadow-sm"><CardContent className="p-0">
        <Table>
          <TableHeader><TableRow><TableHead>#</TableHead><TableHead>اسم الكلية</TableHead><TableHead>إجراءات</TableHead></TableRow></TableHeader>
          <TableBody>
            {data.map(c => (
              <TableRow key={c.id}>
                <TableCell>{c.id}</TableCell>
                <TableCell className="font-medium">{c.name}</TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button size="icon" variant="ghost" onClick={() => openEdit(c)}><Pencil className="w-4 h-4" /></Button>
                    <Button size="icon" variant="ghost" className="text-destructive" onClick={() => handleDelete(c.id)}><Trash2 className="w-4 h-4" /></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent></Card>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent dir="rtl">
          <DialogHeader><DialogTitle>{editing ? 'تعديل كلية' : 'إضافة كلية'}</DialogTitle></DialogHeader>
          <div><Label>اسم الكلية</Label><Input value={name} onChange={e => setName(e.target.value)} /></div>
          <DialogFooter><Button onClick={handleSave}>{editing ? 'تحديث' : 'إضافة'}</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CollegesPage;
