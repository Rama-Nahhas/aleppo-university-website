import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { doctorRequests as initialRequests } from '@/data/mockData';
import { Search, Eye, Check, X } from 'lucide-react';

const DoctorRequestsPage: React.FC = () => {
  const [data, setData] = useState(initialRequests);
  const [search, setSearch] = useState('');
  const [filterSpec, setFilterSpec] = useState('');
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selected, setSelected] = useState<any | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  const filtered = data.filter(r => (
    r.name.includes(search) || r.email.includes(search) || (filterSpec ? r.specialty === filterSpec : true)
  ));

  const openDetails = (r: any) => { setSelected(r); setDetailsOpen(true); };
  const accept = (r: any) => { setSelected(r); setConfirmOpen(true); };
  const confirmAccept = () => {
    if (!selected) return; setData(prev => prev.map(p => p.id === selected.id ? { ...p, status: 'accepted' } : p)); setConfirmOpen(false);
  };
  const openReject = (r: any) => { setSelected(r); setRejectReason(''); setRejectOpen(true); };
  const confirmReject = () => {
    if (!rejectReason.trim()) return alert('يرجى إدخال سبب الرفض');
    if (!selected) return;
    setData(prev => prev.map(p => p.id === selected.id ? { ...p, status: 'rejected', rejection_note: rejectReason } : p));
    setRejectOpen(false);
  };

  return (
    <div dir="rtl" className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">طلبات الأطباء</h1>
      </div>

      <div className="flex gap-3 items-center">
        <div className="relative max-w-sm">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input className="pr-9" placeholder="بحث..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <Select value={filterSpec} onValueChange={v => setFilterSpec(v)}>
          <SelectTrigger><SelectValue placeholder="الاختصاص" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="">الكل</SelectItem>
            <SelectItem value="أطفال">أطفال</SelectItem>
            <SelectItem value="باطنة">باطنة</SelectItem>
            <SelectItem value="جراحة">جراحة</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card className="border-0 shadow-sm"><CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>#</TableHead>
              <TableHead>الاسم</TableHead>
              <TableHead>البريد</TableHead>
              <TableHead>الاختصاص</TableHead>
              <TableHead>الجامعة</TableHead>
              <TableHead>سنة التخرج</TableHead>
              <TableHead>سنة التوظيف</TableHead>
              <TableHead>تاريخ الطلب</TableHead>
              <TableHead>الحالة</TableHead>
              <TableHead>الإجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map(r => (
              <TableRow key={r.id}>
                <TableCell>{r.id}</TableCell>
                <TableCell className="font-medium">{r.name}</TableCell>
                <TableCell>{r.email}</TableCell>
                <TableCell>{r.specialty}</TableCell>
                <TableCell>{r.university}</TableCell>
                <TableCell>{r.grad_year}</TableCell>
                <TableCell>{r.employment_year}</TableCell>
                <TableCell>{new Date(r.requested_at).toLocaleDateString('ar-SY')}</TableCell>
                <TableCell><span className="px-2 py-1 rounded-md text-xs font-semibold bg-muted/30">{r.status}</span></TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button size="icon" variant="ghost" onClick={() => openDetails(r)}><Eye className="w-4 h-4" /></Button>
                    <Button size="icon" className="text-success" onClick={() => accept(r)}><Check className="w-4 h-4" /></Button>
                    <Button size="icon" className="text-destructive" onClick={() => openReject(r)}><X className="w-4 h-4" /></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent></Card>

      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent dir="rtl">
          <DialogHeader><DialogTitle>تفاصيل طلب الطبيب</DialogTitle></DialogHeader>
          <div className="space-y-2">
            <p className="font-semibold">الاسم: {selected?.name}</p>
            <p>البريد: {selected?.email}</p>
            <p>الاختصاص: {selected?.specialty}</p>
            <p>الجامعة: {selected?.university}</p>
            <p>تفاصيل: {selected?.details}</p>
          </div>
          <DialogFooter><Button onClick={() => setDetailsOpen(false)}>إغلاق</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent dir="rtl">
          <DialogHeader><DialogTitle>تأكيد القبول</DialogTitle></DialogHeader>
          <div className="space-y-3">هل تريد قبول {selected?.name}؟</div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmOpen(false)}>إلغاء</Button>
            <Button onClick={confirmAccept} className="bg-emerald-500">قبول</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={rejectOpen} onOpenChange={setRejectOpen}>
        <DialogContent dir="rtl">
          <DialogHeader><DialogTitle>رفض الطلب</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <Input placeholder="سبب الرفض" value={rejectReason} onChange={e => setRejectReason(e.target.value)} />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setRejectOpen(false)}>إلغاء</Button>
              <Button className="bg-destructive" onClick={confirmReject}>رفض</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DoctorRequestsPage;
