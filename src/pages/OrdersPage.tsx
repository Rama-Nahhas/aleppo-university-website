import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { orders as initialOrders, orderItems as initialOrderItems, supplies, users, laboratories, departments } from '@/data/mockData';
import { Plus, ClipboardList, Check, X, Eye, PackageCheck, FlaskConical } from 'lucide-react';
import type { Order, OrderStatus } from '@/types';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';


const statusConfig: Record<OrderStatus, { label: string; color: string }> = {
  pending:   { label: 'في انتظار موافق العميد',          color: 'bg-amber-100 text-amber-700' },
  approved:  { label: 'موافق – بانتظار المستودع',          color: 'bg-blue-100 text-blue-700' },
  rejected:  { label: 'مرفوض',                            color: 'bg-red-100 text-red-700' },
  delivered: { label: 'تم الصرف',                         color: 'bg-emerald-100 text-emerald-700' },
  purchase:  { label: 'طلب شراء',                         color: 'bg-purple-100 text-purple-700' },
  completed: { label: 'مكتمل',                            color: 'bg-green-100 text-green-700' },
};

interface OrderExtended extends Order {
  rejection_note?: string;
  warehouse_note?: string;
  dean_id?: number | null;
}

interface ItemForm { supply_id: string; quantity: string; }

// ── مساعد: college_id للمخبر عبر القسم ────────────────────────────────────────
const getLabCollegeId = (labId: number): number | null => {
  const lab  = laboratories.find(l => l.id === labId);
  const dept = lab ? departments.find(d => d.id === lab.department_id) : null;
  return dept?.college_id ?? null;
};

const OrdersPage: React.FC = () => {

  {/*const [data, setData] = useState<Order[]>(initialOrders);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({ requester_id: '', supply_id: '', quantity: '' });

  const updateStatus = (id: number, status: OrderStatus) => setData(prev => prev.map(o => o.id === id ? { ...o, status } : o));

  const handleCreate = () => {
    const newOrder: Order = {
      id: Date.now(),
      requester_id: Number(form.requester_id),
      warehouse_manager_id: null,
      status: 'pending',
      created_at: new Date().toISOString(),
    };
    setData(prev => [...prev, newOrder]);
    setDialogOpen(false);
  };
*/}
  
  const { user } = useAuth();
  const role     = user?.role?.name;
  const { lang, t } = useLanguage();
  // المخابر التي يشرف عليها الفني الحالي
  const myLabs = laboratories.filter(l => l.technician_id === user?.id);

  // ── State ──────────────────────────────────────────────────────────────────
// ── نقرأ من localStorage أولاً، وإن لم يوجد نبدأ من mockData ──
  const [orders, setOrders] = useState<OrderExtended[]>(() => {
    try {
      const saved = localStorage.getItem('campus_orders');
      return saved ? JSON.parse(saved) : (initialOrders as OrderExtended[]);
    } catch { return initialOrders as OrderExtended[]; }
  });

  const [orderItems, setOrderItems] = useState(() => {
    try {
      const saved = localStorage.getItem('campus_order_items');
      return saved ? JSON.parse(saved) : initialOrderItems;
    } catch { return initialOrderItems; }
  });

  const [newOrderOpen, setNewOrderOpen] = useState(false);
  const [selectedLabId, setSelectedLabId] = useState('');
  const [items,  setItems]  = useState<ItemForm[]>([{ supply_id: '', quantity: '' }]);
  const [reason, setReason] = useState('');

  const [detailOrder,    setDetailOrder]    = useState<OrderExtended | null>(null);
  const [rejectNote,     setRejectNote]     = useState('');
  const [warehouseNote,  setWarehouseNote]  = useState('');

 // ── حفظ تلقائي في localStorage عند كل تغيير ──
  useEffect(() => {
    localStorage.setItem('campus_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('campus_order_items', JSON.stringify(orderItems));
  }, [orderItems]);

  // ── فلترة الطلبات حسب الدور ────────────────────────────────────────────────
  const visibleOrders = orders.filter(o => {
    if (role === 'admin' || role === 'university_admin') return true;

    if (role === 'warehouse_manager')
      return ['approved', 'delivered', 'purchase'].includes(o.status);

    if (role === 'dean') {
      // العميد يرى طلبات كليته فقط
      const labCollegeId = o.college_id ?? getLabCollegeId(o.lab_id ?? 0);
      return labCollegeId === user?.college_id;
    }

    if (role === 'lab_technician') {
      // الفني يرى طلباته في مخابره فقط
      const myLabIds = myLabs.map(l => l.id);
      return o.requester_id === user?.id && myLabIds.includes(o.lab_id ?? -1);
    }

    return false;
  });

  // ── إنشاء طلب جديد ─────────────────────────────────────────────────────────
  const submitNewOrder = () => {
    if (!user || !selectedLabId) return;
    const labId     = Number(selectedLabId);
    const collegeId = getLabCollegeId(labId);
    const newId = Date.now();

    const newOrder: OrderExtended = {
      id: newId,
      requester_id: user.id,
      warehouse_manager_id: null,
      lab_id: labId,
      college_id: collegeId,
      dean_id: null,
      status: 'pending',
      created_at: new Date().toISOString(),
    };

    const newItems = items
      .filter(i => i.supply_id && i.quantity)
      .map((i, idx) => ({
        id: Date.now() + idx + 1,
        order_id: newId,
        supply_id: Number(i.supply_id),
        quantity:  Number(i.quantity),
      }));

    setOrders(prev => [newOrder, ...prev]);
    setOrderItems(prev => [...prev, ...newItems]);
    setNewOrderOpen(false);
    setSelectedLabId('');
    setItems([{ supply_id: '', quantity: '' }]);
    setReason('');
  };

  // ── قرار العميد ────────────────────────────────────────────────────────────
  const deanApprove = (o: OrderExtended) => {
    setOrders(prev => prev.map(x =>
      x.id === o.id ? { ...x, status: 'approved', dean_id: user?.id } : x
    ));
    setDetailOrder(null);
  };
  const deanReject = (o: OrderExtended) => {
    setOrders(prev => prev.map(x =>
      x.id === o.id ? { ...x, status: 'rejected', rejection_note: rejectNote } : x
    ));
    setRejectNote('');
    setDetailOrder(null);
  };

  // ── قرار أمين المستودع ─────────────────────────────────────────────────────
  const warehouseApprove = (o: OrderExtended) => {
    setOrders(prev => prev.map(x =>
      x.id === o.id ? { ...x, status: 'delivered', warehouse_manager_id: user?.id, warehouse_note: 'تم صرف الكمية كاملة' } : x
    ));
    setDetailOrder(null);
  };
  const warehousePartial = (o: OrderExtended) => {
    setOrders(prev => prev.map(x =>
      x.id === o.id ? { ...x, status: 'delivered', warehouse_manager_id: user?.id, warehouse_note: warehouseNote } : x
    ));
    setWarehouseNote('');
    setDetailOrder(null);
  };

  // ── مساعدات ────────────────────────────────────────────────────────────────
  const getRequesterName = (id: number) => users.find(u => u.id === id)?.name || `#${id}`;
  const getLabName       = (id: number | null) => id ? (laboratories.find(l => l.id === id)?.name || `#${id}`) : '—';
  const getSupplyName    = (id: number) => supplies.find(s => s.id === id)?.name || `#${id}`;
  const getOrderItems    = (id: number) => orderItems.filter(i => i.order_id === id);

  const addItemRow    = () => setItems(p => [...p, { supply_id: '', quantity: '' }]);
  const removeItemRow = (idx: number) => setItems(p => p.filter((_, i) => i !== idx));
  const updateItem    = (idx: number, field: keyof ItemForm, val: string) =>
    setItems(p => p.map((it, i) => i === idx ? { ...it, [field]: val } : it));
   


  return (
   <div className="space-y-4" >
      {/* رأس الصفحة */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <ClipboardList className="w-6 h-6 text-primary" /> {lang === 'ar' ? 'طلبات التوريد ': 'Procurement Requests'}
        </h1>
        {role === 'lab_technician' && myLabs.length > 0 && (
          <Button onClick={() => setNewOrderOpen(true)}>
            <Plus className="w-4 h-4 ml-1" /> {lang === 'ar' ? 'طلب جديد': 'New request'}
          </Button>
        )}
      </div>

      {/* تنبيه إذا لم يكن للفني مخبر */}
      {role === 'lab_technician' && myLabs.length === 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-amber-700 flex items-center gap-2">
          <FlaskConical className="w-5 h-5" />
          <span>{lang === 'ar' ? 'لا يوجد مخبر مرتبط بحسابك. تواصل مع مدير النظام': 'No laboratory is linked to your account. Please contact the system administrator'}</span>
        </div>
      )}

      {/* جدول الطلبات */}
      <Card className="border-0 shadow-sm" >
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>#</TableHead>
                <TableHead> {lang === 'ar' ? 'مقدم لطلب': 'Request Applicant'}</TableHead>
                <TableHead>{lang === 'ar' ? 'مخبر': 'Laboratory'}</TableHead>
                <TableHead>{lang === 'ar' ? 'الحالة': 'Status'}</TableHead>
                <TableHead>{lang === 'ar' ? ' التاريخ': 'Date'}</TableHead>
                <TableHead>{lang === 'ar' ? 'عرض': 'Display'}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {visibleOrders.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-10">
                  {lang === 'ar' ? 'لا توجد طلبات': 'No request'}
                  </TableCell>
                </TableRow>
              )}
              {visibleOrders.map(o => (
                <TableRow key={o.id}>
                  <TableCell>{o.id}</TableCell>
                  <TableCell className="font-medium">{getRequesterName(o.requester_id)}</TableCell>
                  <TableCell className="text-muted-foreground text-sm">{getLabName(o.lab_id ?? null)}</TableCell>
                  <TableCell>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusConfig[o.status].color}`}>
                      {statusConfig[o.status].label}
                    </span>
                  </TableCell>
                  <TableCell>{new Date(o.created_at).toLocaleDateString('ar-SY')}</TableCell>
                  <TableCell>
                    <Button size="sm" variant="ghost" onClick={() => { setDetailOrder(o); setRejectNote(''); setWarehouseNote(''); }}>
                      <Eye className="w-4 h-4 ml-1" /> {lang === 'ar' ? 'عرض': 'show'}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* ── نافذة طلب جديد ── */}
      <Dialog open={newOrderOpen} onOpenChange={setNewOrderOpen}>
        <DialogContent dir="rtl" className="max-w-lg">
          <DialogHeader><DialogTitle>{lang === 'ar' ? 'طلب توريد جديد': 'New Supply Request'}</DialogTitle></DialogHeader>
          <div className="space-y-4">

            {/* اختيار المخبر */}
            <div>
              <Label>{lang === 'ar' ? 'المخبر': 'The Laboratory'}</Label>
              <Select value={selectedLabId} onValueChange={setSelectedLabId}>
                <SelectTrigger><SelectValue placeholder={lang === 'ar' ? 'المخبر': 'Select the Laboratory'} /></SelectTrigger>
                <SelectContent>
                  {myLabs.map(l => (
                    <SelectItem key={l.id} value={String(l.id)}>
                      {l.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* سبب الطلب */}
            <div>
              <Label> {lang === 'ar' ? 'سبب الطلب': 'Reason for the request'}</Label>
              <Textarea
                value={reason}
                onChange={e => setReason(e.target.value)}
                placeholder={lang ==='ar'? 'مثال:مخبر عملي يضم 40 طالباً يحتاج مواد اضافية' : 'A practical laboratory with 40 students requires additional materials'}
              />
            </div>

            {/* المواد */}
            <div className="space-y-2">
              <Label>{lang === 'ar' ? 'المواد المطلوبة': 'Required materials'}</Label>
              {items.map((it, idx) => (
                <div key={idx} className="flex gap-2 items-center">
                  <Select value={it.supply_id} onValueChange={v => updateItem(idx, 'supply_id', v)}>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder={lang === 'ar' ? 'اختر المادة': 'Select the material'} />
                    </SelectTrigger>
                    <SelectContent>
                      {supplies.map(s => (
                        <SelectItem key={s.id} value={String(s.id)}>{s.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    type="number"
                    placeholder={lang === 'ar' ? 'الكمية': 'Quantity'}
                    className="w-24"
                    value={it.quantity}
                    onChange={e => updateItem(idx, 'quantity', e.target.value)}
                  />
                  {items.length > 1 && (
                    <Button size="icon" variant="ghost" className="text-destructive" onClick={() => removeItemRow(idx)}>
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={addItemRow}>
                <Plus className="w-4 h-4 ml-1" />  {lang === 'ar' ? 'إضافة مادة': 'Add item'}
              </Button>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setNewOrderOpen(false)}>{lang === 'ar' ? 'إلغاء': 'Cancel'}</Button>
            <Button onClick={submitNewOrder} disabled={!selectedLabId}>{lang === 'ar' ? 'إرسال الطلب': 'Submit request'} </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── نافذة التفاصيل + الإجراءات ── */}
      {detailOrder && (
        <Dialog open={!!detailOrder} onOpenChange={() => setDetailOrder(null)}>
          <DialogContent dir="rtl" className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{lang === 'ar' ? 'تفاصيل لطلب #': 'Request Details #'}{detailOrder.id}</DialogTitle>
            </DialogHeader>

            <div className="space-y-4 text-sm">
              {/* معلومات عامة */}
              <div className="grid grid-cols-2 gap-2 bg-muted/30 rounded-lg p-3">
                <div><span className="text-muted-foreground">{lang === 'ar' ? 'مقدم الطلب :': 'Applicant : '} </span><strong>{getRequesterName(detailOrder.requester_id)}</strong></div>
                <div><span className="text-muted-foreground">{lang === 'ar' ? 'المخبر :': 'Laboratory : '} </span><strong>{getLabName(detailOrder.lab_id ?? null)}</strong></div>
                <div><span className="text-muted-foreground">{lang === 'ar' ? 'التاريخ : ': 'Date : '} </span>{new Date(detailOrder.created_at).toLocaleDateString('ar-SY')}</div>
                <div>
                  <span className="text-muted-foreground">{lang === 'ar' ? 'الحالة : ': 'Status : '} </span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${statusConfig[detailOrder.status].color}`}>
                    {statusConfig[detailOrder.status].label}
                  </span>
                </div>
              </div>

              {/* المواد */}
              <div>
                <p className="font-semibold mb-2">المواد المطلوبة:</p>
                <ul className="space-y-1.5">
                  {getOrderItems(detailOrder.id).map(i => (
                    <li key={i.id} className="flex justify-between bg-muted/40 rounded-md px-3 py-1.5">
                      <span>{getSupplyName(i.supply_id)}</span>
                      <Badge variant="outline">{lang === 'ar' ? 'الكمية : ': 'Quantity : '} {i.quantity}</Badge>
                    </li>
                  ))}
                  {getOrderItems(detailOrder.id).length === 0 && (
                    <li className="text-muted-foreground">  {lang === 'ar' ? 'لا توجد مواد مسجلة': 'There are no requested materials'} </li>
                  )}
                </ul>
              </div>

              {/* ملاحظة الرفض */}
              {detailOrder.rejection_note && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700">
                  <strong> {lang === 'ar' ? 'سبب الرفض : ': 'Reason for rejection'} </strong>{detailOrder.rejection_note}
                </div>
              )}

              {/* رد المستودع */}
              {detailOrder.warehouse_note && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-blue-700">
                  <strong>{lang === 'ar' ? 'رد المستودع : ': 'Warehouse response : '} </strong>{detailOrder.warehouse_note}
                </div>
              )}

              {/* ── إجراءات العميد ── */}
              {role === 'dean' && detailOrder.status === 'pending' && (
                <div className="space-y-3 border-t pt-3">
                  <p className="font-semibold">{lang === 'ar' ? 'قرارك على هذا الطلب : ': 'Your decision regarding this request'}</p>
                  <div>
                    <Label>{lang === 'ar' ? ' مطلوب عند الرفض (سبب الرفض) : ': 'Required when rejecting (reason for rejection)'}</Label>
                    <Textarea
                      value={rejectNote}
                      onChange={e => setRejectNote(e.target.value)}
                      placeholder={lang === 'ar' ? ' اكتب سبب الرفض هنا ... ': 'Write the reason for rejection here...'}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                      onClick={() => deanApprove(detailOrder)}
                    >
                      <Check className="w-4 h-4 ml-1" /> {lang === 'ar' ? ' موافقة و إرسال للمستودع ': 'Approve and send to the warehouse'}
                    </Button>
                    <Button
                      variant="destructive"
                      className="flex-1"
                      onClick={() => deanReject(detailOrder)}
                      disabled={!rejectNote}
                    >
                      <X className="w-4 h-4 ml-1" /> {lang === 'ar' ? 'الرفض  ': 'Reject'}
                    </Button>
                  </div>
                </div>
              )}

              {/* ── إجراءات أمين المستودع ── */}
              {role === 'warehouse_manager' && detailOrder.status === 'approved' && (
                <div className="space-y-3 border-t pt-3">
                  <p className="font-semibold">{lang === 'ar' ? 'رد المستودع : ': 'Warehouse response : '}</p>
                  <div>
                    <Label>{lang === 'ar' ? 'للموافقة الجزئية او اي تفاصيل (ملاحظة)  ': 'Notes (for partial approval or additional details)'}</Label>
                    <Textarea
                      value={warehouseNote}
                      onChange={e => setWarehouseNote(e.target.value)}
                      placeholder={lang === 'ar' ? 'مثال: يتوفر 30 من أصل 50، الباقي سيصل بعد أسبوعين...  ': 'Example: “30 out of 50 are available. The remaining quantity will arrive in two weeks...'}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                      onClick={() => warehouseApprove(detailOrder)}
                    >
                      <PackageCheck className="w-4 h-4 ml-1" /> {lang === 'ar' ? 'الرصرف الكمية كاملة  ': 'Dispense the full quantity'}
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => warehousePartial(detailOrder)}
                      disabled={!warehouseNote}
                    >
                    {lang === 'ar' ? 'صرف جزئي / رد مع ملاحظة  ': 'Partial fulfillment / Add a note'}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default OrdersPage;
