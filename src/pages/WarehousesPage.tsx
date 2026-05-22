import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { warehouses as initialWarehouses, supplies as initialSupplies } from '@/data/mockData';
import { Plus, Pencil, Trash2, Warehouse, Package } from 'lucide-react';
import type { Warehouse as WarehouseType, Supply } from '@/types';
import { useLanguage } from '@/contexts/LanguageContext';

const WarehousesPage: React.FC = () => {
  const { lang, t } = useLanguage();
  const [warehouseData, setWarehouseData] = useState<WarehouseType[]>(initialWarehouses);
  const [supplyData, setSupplyData] = useState<Supply[]>(initialSupplies);
  const [wDialogOpen, setWDialogOpen] = useState(false);
  const [sDialogOpen, setSDialogOpen] = useState(false);
  const [editingW, setEditingW] = useState<WarehouseType | null>(null);
  const [editingS, setEditingS] = useState<Supply | null>(null);
  const [wForm, setWForm] = useState({ name: '', location: '' });
  const [sForm, setSForm] = useState({ name: '', quantity: '', warehouse_id: '' });

  // Warehouse CRUD
  const openCreateW = () => { setEditingW(null); setWForm({ name: '', location: '' }); setWDialogOpen(true); };
  const openEditW = (w: WarehouseType) => { setEditingW(w); setWForm({ name: w.name, location: w.location }); setWDialogOpen(true); };
  const saveW = () => {
    if (editingW) setWarehouseData(prev => prev.map(w => w.id === editingW.id ? { ...w, ...wForm } : w));
    else setWarehouseData(prev => [...prev, { id: Date.now(), ...wForm }]);
    setWDialogOpen(false);
  };
  const deleteW = (id: number) => setWarehouseData(prev => prev.filter(w => w.id !== id));

  // Supply CRUD
  const openCreateS = () => { setEditingS(null); setSForm({ name: '', quantity: '', warehouse_id: '' }); setSDialogOpen(true); };
  const openEditS = (s: Supply) => { setEditingS(s); setSForm({ name: s.name, quantity: String(s.quantity), warehouse_id: String(s.warehouse_id) }); setSDialogOpen(true); };
  const saveS = () => {
    if (editingS) setSupplyData(prev => prev.map(s => s.id === editingS.id ? { ...s, name: sForm.name, quantity: Number(sForm.quantity), warehouse_id: Number(sForm.warehouse_id) } : s));
    else setSupplyData(prev => [...prev, { id: Date.now(), name: sForm.name, quantity: Number(sForm.quantity), warehouse_id: Number(sForm.warehouse_id) }]);
    setSDialogOpen(false);
  };
  const deleteS = (id: number) => setSupplyData(prev => prev.filter(s => s.id !== id));

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold flex items-center gap-2"><Warehouse className="w-6 h-6 text-primary" /> {lang === 'ar' ? 'ادارة المواد و المستوعات': 'Materials and Warehouse Management'}</h1>
      <Tabs defaultValue="warehouses">
        <TabsList><TabsTrigger value="warehouses">{lang === 'ar' ? 'المستودعات': 'The Warehouses'}</TabsTrigger><TabsTrigger value="supplies">{lang === 'ar' ? 'المواد': 'Materials'}</TabsTrigger></TabsList>

        <TabsContent value="warehouses" className="space-y-4">
          <div className="flex justify-end"><Button onClick={openCreateW}><Plus className="w-4 h-4 ml-1" /> {lang === 'ar' ? 'إضافة مستودع': 'Add Warehouses'} </Button></div>
          <Card className="border-0 shadow-sm"><CardContent className="p-0">
            <Table>
              <TableHeader><TableRow><TableHead>#</TableHead><TableHead>{lang === 'ar' ? 'الاسم': 'Name'}</TableHead><TableHead>{lang === 'ar' ? 'الموقع': 'Location'}</TableHead><TableHead>{lang === 'ar' ? 'إجراءات': 'Actions'}</TableHead></TableRow></TableHeader>
              <TableBody>
                {warehouseData.map(w => (
                  <TableRow key={w.id}>
                   <TableCell className="font-medium">{lang === 'ar' ? w.name : w.nameEn}</TableCell>
                   <TableCell>{lang === 'ar' ? w.location : w.locationEn}</TableCell>
                    <TableCell>{w.location}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button size="icon" variant="ghost" onClick={() => openEditW(w)}><Pencil className="w-4 h-4" /></Button>
                        <Button size="icon" variant="ghost" className="text-destructive" onClick={() => deleteW(w.id)}><Trash2 className="w-4 h-4" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent></Card>
        </TabsContent>

        <TabsContent value="supplies" className="space-y-4">
          <div className="flex justify-end"><Button onClick={openCreateS}><Plus className="w-4 h-4 ml-1" /> {lang === 'ar' ? 'إضافة مادة': 'Add item'}</Button></div>
          <Card className="border-0 shadow-sm"><CardContent className="p-0">
            <Table>
              <TableHeader><TableRow><TableHead>#</TableHead><TableHead>{lang === 'ar' ? 'المادة': 'Material'}</TableHead><TableHead>{lang === 'ar' ? 'الكمية': 'Quantity'}</TableHead><TableHead>{lang === 'ar' ? 'المستوع': 'Warehouse'}</TableHead><TableHead>{lang === 'ar' ? 'إجراءات': 'Actions'}</TableHead></TableRow></TableHeader>
              <TableBody>
                {supplyData.map(s => (
                  <TableRow key={s.id}>
                    <TableCell>{s.id}</TableCell>
                    <TableCell className="font-medium">{s.name}</TableCell>
                    <TableCell><span className={`px-2 py-1 rounded-md text-xs font-semibold ${s.quantity < 50 ? 'bg-destructive/10 text-destructive' : 'bg-emerald-100 text-emerald-700'}`}>{s.quantity}</span></TableCell>
                    <TableCell>{warehouseData.find(w => w.id === s.warehouse_id)?.name || '-'}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button size="icon" variant="ghost" onClick={() => openEditS(s)}><Pencil className="w-4 h-4" /></Button>
                        <Button size="icon" variant="ghost" className="text-destructive" onClick={() => deleteS(s.id)}><Trash2 className="w-4 h-4" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent></Card>
        </TabsContent>
      </Tabs>

      {/* Warehouse Dialog */}
      <Dialog open={wDialogOpen} onOpenChange={setWDialogOpen}>
        <DialogContent dir="rtl">
          <DialogHeader><DialogTitle>{editingW
  ? (lang === 'ar' ? 'تعديل مستودع ' : 'Edit Warehouses ')
  : (lang === 'ar' ? 'إضافة مستودع ' : 'Add Warehouses ') }</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div><Label>{lang === 'ar' ? 'الاسم': 'Name'}</Label><Input value={wForm.name} onChange={e => setWForm(f => ({ ...f, name: e.target.value }))} /></div>
            <div><Label>{lang === 'ar' ? 'الموقع': 'Location'}</Label><Input value={wForm.location} onChange={e => setWForm(f => ({ ...f, location: e.target.value }))} /></div>
          </div>
          <DialogFooter><Button onClick={saveW}>{editingW
  ? (lang === 'ar' ? 'تحديث ' : 'Edit ')
  : (lang === 'ar' ? 'إضافة ' : 'Add ') }</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Supply Dialog */}
      <Dialog open={sDialogOpen} onOpenChange={setSDialogOpen}>
        <DialogContent dir="rtl">
          <DialogHeader><DialogTitle>{editingS
  ? (lang === 'ar' ? 'تعديل مادة' : 'Edit Material')
  : (lang === 'ar' ? 'إضافة مادة' : 'Add Material') }</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div><Label>{lang === 'ar' ? 'اسم المادة': 'Material'} </Label><Input value={sForm.name} onChange={e => setSForm(f => ({ ...f, name: e.target.value }))} /></div>
            <div><Label>{lang === 'ar' ? 'الكمية': 'Quantity'}</Label><Input type="number" value={sForm.quantity} onChange={e => setSForm(f => ({ ...f, quantity: e.target.value }))} /></div>
            <div><Label>{lang === 'ar' ? 'المستودع': 'The Warehouse'}</Label>
              <Select value={sForm.warehouse_id} onValueChange={v => setSForm(f => ({ ...f, warehouse_id: v }))}>
                <SelectTrigger><SelectValue placeholder={lang === 'ar' ? 'اختر المستودع': 'Select the Warehouse'} /></SelectTrigger>
                <SelectContent>{warehouseData.map(w => <SelectItem key={w.id} value={String(w.id)}>{w.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter><Button onClick={saveS}>{editingS
  ? (lang === 'ar' ? 'تحديث ' : 'Edit ')
  : (lang === 'ar' ? 'إضافة ' : 'Add ') }</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WarehousesPage;
