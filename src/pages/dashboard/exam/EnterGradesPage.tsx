import React, { useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useExam } from '@/contexts/ExamContext';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

type StudentState = {
  student_id: number;
  name: string;
  mark: number | null;
  status: 'غير مدخلة' | 'محفوظ' | 'معدّلة ولم تحفظ' | 'خطأ في القيمة';
  prev?: number | null;
};

const EnterGradesPage: React.FC = ()=>{
  const { state } = useLocation();
  const { subjects, getSubjectById, getSubjectStudentsResponse, MOCK_PASSING_MARK, updateStudentMark, setSelectedSubjectId } = useExam();
  const selectedSubjectId = state?.subjectId ?? subjects[0]?.id ?? null;
  const subjectId = selectedSubjectId ? Number(selectedSubjectId) : null;
  const subject = subjectId ? getSubjectById(subjectId) : undefined;
  const resp = subjectId
    ? getSubjectStudentsResponse(subjectId)
    : { subject: { id: 0, name: '', year_id: 0 }, new_students: [], failed_students: [] };
  const rawStudents = resp.new_students.concat(resp.failed_students);
  const subjectStats = subjectId ? subjects.find(s => s.id === subjectId) : undefined;
  const studentsCount = rawStudents.length;
  const enteredCount = rawStudents.filter(s => s.mark != null).length;
  const completionPercent = studentsCount ? Math.round((enteredCount / studentsCount) * 100) : 0;
  const subjectLabel = subjectStats?.name ?? subject?.name ?? 'غير معروف';
  const subjectDept = subjectStats?.department ?? subject?.department_id ?? '-';
  const subjectYear = subjectStats?.year ?? subject?.year?.name ?? 'غير معروف';
  const { lang } = useLanguage();

  const [students, setStudents] = useState<StudentState[]>(rawStudents.map(s=>({ student_id: s.student_id, name: s.name, mark: s.mark, status: s.mark==null? 'غير مدخلة':'محفوظ', prev: s.mark })));
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingEdit, setPendingEdit] = useState<{studentId:number; name:string; oldMark:number | null; newMark:number | null} | null>(null);
  const [filterQ, setFilterQ] = useState('');
  const [filterState, setFilterState] = useState<'all'|'not_entered'|'saved'|'modified' | 'error'>('all');

  const filtered = useMemo(()=> students.filter(st=> String(st.student_id).includes(filterQ) || st.name.includes(filterQ) || (st.mark!==null && String(st.mark).includes(filterQ) )),[students,filterQ]);

  const updateMark = (student_id:number, val:string)=>{
    setStudents(prev=> prev.map(p=> p.student_id===student_id? ({...p, mark: val===''? null: Number(val), status: val===''? 'غير مدخلة' : (p.status==='محفوظ' && Number(val)!==p.prev? 'معدّلة ولم تحفظ': (p.status==='محفوظ'?'محفوظ':p.status))}) : p));
  };

  const saveAll = ()=>{
    // validate
    const invalid = students.find(s=> s.mark!==null && (isNaN(s.mark as any) || (s.mark as number) < 0 || (s.mark as number) > 100));
    if(invalid){
      alert('توجد قيم غير صالحة، تحقق من الإدخالات.');
      return;
    }
    // apply to context
    students.forEach(s=> updateStudentMark(Number(subjectId), s.student_id, s.mark ?? null));
    setStudents(prev=> prev.map(p=> ({...p, status: p.mark==null? 'غير مدخلة':'محفوظ', prev: p.mark })));
    alert('تم حفظ التعديلات محلياً');
  };

  const cancelAll = ()=>{
    // reset reads fresh from context original mock
    const freshResp = getSubjectStudentsResponse(Number(subjectId));
    const fresh = freshResp.new_students.concat(freshResp.failed_students);
    setStudents(fresh.map(s=>({ student_id: s.student_id, name: s.name, mark: s.mark, status: s.mark==null? 'غير مدخلة':'محفوظ', prev: s.mark })));
  };

  const fillSample = ()=>{
    // fill sample: set all to passing mark
    const passing = MOCK_PASSING_MARK ?? 60;
    setStudents(prev=> prev.map(p=> ({...p, mark: passing, status: 'محفوظ', prev: passing })));
    // apply to context
    students.forEach(s=> updateStudentMark(Number(subjectId), s.student_id, passing));
  };

  // sync when subject or rawStudents change
  React.useEffect(()=>{
    setStudents(rawStudents.map(s=>({ student_id: s.student_id, name: s.name, mark: s.mark, status: s.mark==null? 'غير مدخلة':'محفوظ', prev: s.mark })));
  }, [subjectId]);

  const handleSaveSingle = (st: StudentState)=>{
    // validation
    if(st.mark!==null && (isNaN(st.mark as any) || st.mark < 0 || st.mark > 100)){
      alert('قيمة غير صالحة');
      return;
    }
    // if previously saved and changed, ask confirm
    if(st.prev!=null && st.prev!==st.mark){
      const name = rawStudents.find(r=>r.student_id===st.student_id)?.name||'';
      setPendingEdit({studentId:st.student_id, name, oldMark: st.prev ?? null, newMark: st.mark});
      setConfirmOpen(true);
      return;
    }
    updateStudentMark(Number(subjectId), st.student_id, st.mark ?? null);
    setStudents(prev=> prev.map(p=> p.student_id===st.student_id? ({...p, status: st.mark==null? 'غير مدخلة':'محفوظ', prev: st.mark}):p));
  };

  const confirmApplyEdit = ()=>{
    if(!pendingEdit) return;
    updateStudentMark(Number(subjectId), pendingEdit.studentId, pendingEdit.newMark ?? null);
    setStudents(prev=> prev.map(p=> p.student_id===pendingEdit.studentId? ({...p, status: pendingEdit.newMark==null? 'غير مدخلة':'محفوظ', prev: pendingEdit.newMark}):p));
    setConfirmOpen(false);
    setPendingEdit(null);
  };

  if (!subjectId) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">إدخال العلامات</h1>
        <div className="p-4 bg-card rounded-lg">
          <p>لا توجد مادة متاحة للعرض.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">إدخال العلامات</h1>
      <div className="p-4 bg-card rounded-lg">
        <p>المادة: <strong>{subjectLabel}</strong></p>
        <p>القسم: {subjectDept} - السنة: {subjectYear}</p>
        <p>عدد الطلاب: {studentsCount} - المدخلة: {enteredCount} - غير المدخلة: {studentsCount - enteredCount}</p>
        <p>نسبة الإنجاز: {completionPercent}%</p>
      </div>

      <div className="flex gap-2">
        <input placeholder="بحث باسم الطالب أو رقمه" className="input" value={filterQ} onChange={e=>setFilterQ(e.target.value)} />
        <select value={filterState} onChange={e=>setFilterState(e.target.value as any)} className="input">
          <option value="all">الكل</option>
          <option value="not_entered">غير مدخلة</option>
          <option value="saved">محفوظة</option>
          <option value="modified">معدّلة ولم تحفظ</option>
        </select>
        <button onClick={saveAll} className="btn btn-primary">حفظ جميع التعديلات</button>
        <button onClick={cancelAll} className="btn">إلغاء التعديلات</button>
        <button onClick={fillSample} className="btn">تعبئة علامات تجريبية</button>
      </div>

      <div className="overflow-auto bg-card p-3 rounded-lg">
        <table className="w-full text-sm table-auto">
          <thead>
            <tr className="text-muted-foreground text-left">
              <th className="p-2">#</th>
              <th className="p-2">الرقم</th>
              <th className="p-2">اسم الطالب</th>
              <th className="p-2">العلامة الحالية</th>
              <th className="p-2">إدخال/تعديل</th>
              <th className="p-2">النتيجة</th>
              <th className="p-2">حالة الحفظ</th>
              <th className="p-2">إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {students.map((st,idx)=>{
              const raw = rawStudents.find(rs=>rs.student_id===st.student_id)!;
              const result = raw?.is_success === null ? 'غير محددة' : (raw?.is_success === 1 ? 'ناجح' : (raw?.is_success === 0 ? 'راسب' : (st.mark==null? 'غير مدخلة' : (st.mark >= (MOCK_PASSING_MARK||60)? 'ناجح':'راسب'))));
              const error = st.mark!==null && (isNaN(st.mark as any) || (st.mark as number)<0 || (st.mark as number)>100);
              return (
                <tr key={st.student_id} className="border-t">
                  <td className="p-2">{idx+1}</td>
                  <td className="p-2">{st.student_id}</td>
                  <td className="p-2">{st.name}</td>
                  <td className="p-2">{st.mark==null? 'غير مدخلة' : st.mark}</td>
                  <td className="p-2">
                    <input type="number" value={st.mark===null? '': String(st.mark)} onChange={e=>updateMark(st.student_id,e.target.value)} className="input w-24" />
                    {error && <p className="text-xs text-destructive mt-1">قيمة خارج النطاق (0-100)</p>}
                  </td>
                  <td className="p-2">{result}</td>
                  <td className="p-2">{error? 'خطأ في القيمة' : st.status}</td>
                  <td className="p-2 space-x-1">
                    <button onClick={()=>handleSaveSingle(st)} className="btn btn-sm">حفظ</button>
                    <button onClick={()=> setStudents(prev=> prev.map(p=> p.student_id===st.student_id? ({...p, mark: p.prev, status: p.prev==null? 'غير مدخلة':'محفوظ'}):p))} className="btn btn-sm">استعادة</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent dir="rtl">
          <DialogHeader>
            <DialogTitle>تأكيد تعديل العلامة</DialogTitle>
            <DialogDescription>
              {pendingEdit ? (
                <div className="space-y-2">
                  <p>الطالب: <strong>{pendingEdit.name}</strong></p>
                  <p>العلامة القديمة: <strong>{pendingEdit.oldMark ?? '-'}</strong></p>
                  <p>العلامة الجديدة: <strong>{pendingEdit.newMark ?? '-'}</strong></p>
                </div>
              ) : null}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={()=>{setConfirmOpen(false); setPendingEdit(null);}}>إلغاء</Button>
            <Button variant="destructive" onClick={confirmApplyEdit}>تأكيد التعديل</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EnterGradesPage;
