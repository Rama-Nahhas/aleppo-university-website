import React, { useState } from 'react';
import { useExam } from '@/contexts/ExamContext';

const PromotedStudentsPage: React.FC = ()=>{
  const { promotedStudents, years, departments } = useExam();
  const [year,setYear] = useState(years[0]);
  const [dept,setDept] = useState('all');
  const filtered = promotedStudents.filter(p=> (dept==='all'?true:String(p.department)===String(dept)) && (p.year===year));

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">الطلاب المترفعون</h1>
      <p className="text-muted-foreground">قائمة الطلاب المترفعين التجريبية</p>
      <div className="flex gap-2">
        <select value={year} onChange={e=>setYear(e.target.value)} className="input">{years.map(y=> <option key={y} value={y}>{y}</option>)}</select>
        <select value={dept} onChange={e=>setDept(e.target.value)} className="input"><option value="all">كل الأقسام</option>{departments.map(d=> <option key={d} value={d}>{d}</option>)}</select>
      </div>

      <div className="overflow-auto bg-card p-3 rounded-lg">
        {filtered.length === 0 ? (
          <div className="p-6 text-center text-muted-foreground">لا توجد طلاب مترفعون لعرضهم.</div>
        ) : (
          <table className="w-full text-sm table-auto">
            <thead>
              <tr className="text-muted-foreground text-left">
                <th className="p-2">#</th>
                <th className="p-2">الرقم</th>
                <th className="p-2">الاسم</th>
                <th className="p-2">المادة</th>
                <th className="p-2">تاريخ إدخال العلامة</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s, idx)=> (
                <tr key={`${s.student_id}-${idx}`} className="border-t">
                  <td className="p-2">{idx+1}</td>
                  <td className="p-2">{s.student_id}</td>
                  <td className="p-2">{s.name}</td>
                  <td className="p-2">{s.subject?.name ?? '-'}</td>
                  <td className="p-2" dir="ltr">{s.markEnteredAt? new Date(s.markEnteredAt).toLocaleString() : '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default PromotedStudentsPage;
