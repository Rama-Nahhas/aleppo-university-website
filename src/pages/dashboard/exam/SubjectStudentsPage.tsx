import React, { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useExam } from '@/contexts/ExamContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

const SubjectStudentsPage: React.FC = ()=>{
  const { id } = useParams();
  const { getSubjectById, getSubjectStudentsResponse, MOCK_PASSING_MARK } = useExam();
  const subjectId = Number(id);
  const subj = getSubjectById(subjectId);
  const resp = getSubjectStudentsResponse(subjectId);
  const rawNew = resp.new_students || [];
  const rawFailed = resp.failed_students || [];
  const [q,setQ] = useState('');
  const [selected, setSelected] = useState<any | null>(null);

  const filteredNew = useMemo(()=> rawNew.filter(r=> r.name.includes(q) || String(r.student_id).includes(q)),[q, rawNew]);
  const filteredFailed = useMemo(()=> rawFailed.filter(r=> r.name.includes(q) || String(r.student_id).includes(q)),[q, rawFailed]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">طلاب المادة</h1>
      <div className="p-4 bg-card rounded-lg">
        <p>المادة: <strong>{subj?.name}</strong></p>
        <p>القسم: {subj?.department ?? '-' } - السنة: {subj?.year ?? '-'}</p>
        <p>عدد الطلاب: {rawNew.length + rawFailed.length}</p>
      </div>

      <div className="flex gap-2">
        <input placeholder="بحث" className="input" value={q} onChange={e=>setQ(e.target.value)} />
      </div>

      <div className="overflow-auto bg-card p-3 rounded-lg">
        <h3 className="text-md font-semibold mb-2">طلاب جدد</h3>
        <table className="w-full text-sm table-auto mb-4">
          <thead>
            <tr className="text-muted-foreground text-left">
              <th className="p-2">#</th>
              <th className="p-2">الرقم</th>
              <th className="p-2">الاسم</th>
              <th className="p-2">العلامة</th>
              <th className="p-2">الحالة</th>
              <th className="p-2">إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {filteredNew.map((s,idx)=> (
              <tr key={s.student_id} className="border-t">
                <td className="p-2">{idx+1}</td>
                <td className="p-2">{s.student_id}</td>
                <td className="p-2">{s.name}</td>
                <td className="p-2">{s.mark==null? 'غير مدخلة' : s.mark}</td>
                <td className="p-2">{s.is_success===null? 'غير محددة' : (s.is_success===1? 'ناجح':'راسب')}</td>
                <td className="p-2"><button onClick={()=>setSelected(s)} className="btn btn-sm">عرض التفاصيل</button></td>
              </tr>
            ))}
          </tbody>
        </table>

        <h3 className="text-md font-semibold mb-2">طلاب راسبون سابقاً</h3>
        <table className="w-full text-sm table-auto">
          <thead>
            <tr className="text-muted-foreground text-left">
              <th className="p-2">#</th>
              <th className="p-2">الرقم</th>
              <th className="p-2">الاسم</th>
              <th className="p-2">العلامة</th>
              <th className="p-2">الحالة</th>
              <th className="p-2">إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {filteredFailed.map((s,idx)=> (
              <tr key={s.student_id} className="border-t">
                <td className="p-2">{idx+1}</td>
                <td className="p-2">{s.student_id}</td>
                <td className="p-2">{s.name}</td>
                <td className="p-2">{s.mark==null? 'غير مدخلة' : s.mark}</td>
                <td className="p-2">{s.is_success===null? 'غير محددة' : (s.is_success===1? 'ناجح':'راسب')}</td>
                <td className="p-2"><button onClick={()=>setSelected(s)} className="btn btn-sm">عرض التفاصيل</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Dialog open={!!selected} onOpenChange={()=>setSelected(null)}>
        <DialogContent dir="rtl">
          <DialogHeader>
            <DialogTitle>تفاصيل الطالب</DialogTitle>
            <DialogDescription>
              {selected && (
                <div className="space-y-2">
                  <p>الاسم: <strong>{selected.name}</strong></p>
                  <p>العلامة: {selected.mark==null? '-': selected.mark}</p>
                  <p>النتيجة: {selected.is_success===null? 'غير محددة' : (selected.is_success===1? 'ناجح' : 'راسب')}</p>
                  <p>تاريخ إدخال العلامة: <span dir="ltr">{selected.markEnteredAt? new Date(selected.markEnteredAt).toLocaleString('en-GB') : '-'}</span></p>
                </div>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={()=>setSelected(null)}>إغلاق</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SubjectStudentsPage;
