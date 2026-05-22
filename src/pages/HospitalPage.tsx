import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { hospitals as initialHospitals, hospitalDepartments as initialDepts } from '@/data/mockData';
import { Plus, Pencil, Trash2, Hospital } from 'lucide-react';
import type { Hospital as HospitalType, HospitalDepartment } from '@/types';

const HospitalPage: React.FC = () => {
  const [hospitals, setHospitals] = useState<HospitalType[]>(initialHospitals);
  const [depts, setDepts] = useState<HospitalDepartment[]>(initialDepts);
  const [hDialogOpen, setHDialogOpen] = useState(false);
  const [dDialogOpen, setDDialogOpen] = useState(false);
  const [editingH, setEditingH] = useState<HospitalType | null>(null);
  const [editingD, setEditingD] = useState<HospitalDepartment | null>(null);
  const [hName, setHName] = useState('');
  const [dForm, setDForm] = useState({ name: '', hospital_id: '' });

  const openCreateH = () => { setEditingH(null); setHName(''); setHDialogOpen(true); };
  const openEditH = (h: HospitalType) => { setEditingH(h); setHName(h.name); setHDialogOpen(true); };
  const saveH = () => {
    if (editingH) setHospitals(prev => prev.map(h => h.id === editingH.id ? { ...h, name: hName } : h));
    else setHospitals(prev => [...prev, { id: Date.now(), name: hName }]);
    setHDialogOpen(false);
  };

  const openCreateD = () => { setEditingD(null); setDForm({ name: '', hospital_id: '' }); setDDialogOpen(true); };
  const openEditD = (d: HospitalDepartment) => { setEditingD(d); setDForm({ name: d.name, hospital_id: String(d.hospital_id) }); setDDialogOpen(true); };
  const saveD = () => {
    if (editingD) setDepts(prev => prev.map(d => d.id === editingD.id ? { ...d, name: dForm.name, hospital_id: Number(dForm.hospital_id) } : d));
    else setDepts(prev => [...prev, { id: Date.now(), name: dForm.name, hospital_id: Number(dForm.hospital_id) }]);
    setDDialogOpen(false);
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold flex items-center gap-2"><Hospital className="w-6 h-6 text-primary" /> نظام المستشفى</h1>
      <Tabs defaultValue="hospitals">
        <TabsList><TabsTrigger value="hospitals">المستشفيات</TabsTrigger><TabsTrigger value="departments">أقسام المستشفى</TabsTrigger></TabsList>
        <TabsContent value="hospitals" className="space-y-4">
          <div className="flex justify-end"><Button onClick={openCreateH}><Plus className="w-4 h-4 ml-1" /> إضافة مستشفى</Button></div>
          <Card className="border-0 shadow-sm"><CardContent className="p-0">
            <Table>
              <TableHeader><TableRow><TableHead>#</TableHead><TableHead>الاسم</TableHead><TableHead>إجراءات</TableHead></TableRow></TableHeader>
              <TableBody>
                {hospitals.map(h => (
                  <TableRow key={h.id}>
                    <TableCell>{h.id}</TableCell>
                    <TableCell className="font-medium">{h.name}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button size="icon" variant="ghost" onClick={() => openEditH(h)}><Pencil className="w-4 h-4" /></Button>
                        <Button size="icon" variant="ghost" className="text-destructive" onClick={() => setHospitals(prev => prev.filter(x => x.id !== h.id))}><Trash2 className="w-4 h-4" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent></Card>
        </TabsContent>
        <TabsContent value="departments" className="space-y-4">
          <div className="flex justify-end"><Button onClick={openCreateD}><Plus className="w-4 h-4 ml-1" /> إضافة قسم</Button></div>
          <Card className="border-0 shadow-sm"><CardContent className="p-0">
            <Table>
              <TableHeader><TableRow><TableHead>#</TableHead><TableHead>القسم</TableHead><TableHead>المستشفى</TableHead><TableHead>إجراءات</TableHead></TableRow></TableHeader>
              <TableBody>
                {depts.map(d => (
                  <TableRow key={d.id}>
                    <TableCell>{d.id}</TableCell>
                    <TableCell className="font-medium">{d.name}</TableCell>
                    <TableCell>{hospitals.find(h => h.id === d.hospital_id)?.name || '-'}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button size="icon" variant="ghost" onClick={() => openEditD(d)}><Pencil className="w-4 h-4" /></Button>
                        <Button size="icon" variant="ghost" className="text-destructive" onClick={() => setDepts(prev => prev.filter(x => x.id !== d.id))}><Trash2 className="w-4 h-4" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent></Card>
        </TabsContent>
      </Tabs>

      <Dialog open={hDialogOpen} onOpenChange={setHDialogOpen}>
        <DialogContent dir="rtl">
          <DialogHeader><DialogTitle>{editingH ? 'تعديل' : 'إضافة'} مستشفى</DialogTitle></DialogHeader>
          <div><Label>الاسم</Label><Input value={hName} onChange={e => setHName(e.target.value)} /></div>
          <DialogFooter><Button onClick={saveH}>{editingH ? 'تحديث' : 'إضافة'}</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={dDialogOpen} onOpenChange={setDDialogOpen}>
        <DialogContent dir="rtl">
          <DialogHeader><DialogTitle>{editingD ? 'تعديل' : 'إضافة'} قسم</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div><Label>اسم القسم</Label><Input value={dForm.name} onChange={e => setDForm(f => ({ ...f, name: e.target.value }))} /></div>
            <div><Label>المستشفى</Label>
              <Select value={dForm.hospital_id} onValueChange={v => setDForm(f => ({ ...f, hospital_id: v }))}>
                <SelectTrigger><SelectValue placeholder="اختر" /></SelectTrigger>
                <SelectContent>{hospitals.map(h => <SelectItem key={h.id} value={String(h.id)}>{h.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter><Button onClick={saveD}>{editingD ? 'تحديث' : 'إضافة'}</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default HospitalPage;
