import React, { useMemo, useState } from 'react';
import { useExam } from '@/contexts/ExamContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';

const SubjectsByYearPage: React.FC = () => {
  const { lang } = useLanguage();
  const navigate = useNavigate();
  const { subjects, years, departments } = useExam();
  const [year, setYear] = useState<string>(years[0]);
  const [dept, setDept] = useState<string>('all');
  const [q, setQ] = useState<string>('');

  const filtered = useMemo(() => subjects.filter(s => (
    (year ? (s.year === year) : true) &&
    (dept==='all' ? true : String(s.department) === String(dept)) &&
    (s.name.includes(q))
  )), [subjects, year, dept, q]);

  const completed = filtered.filter(s=> s.enteredCount>=s.studentsCount).length;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">المواد حسب السنة</h1>
      <p className="text-muted-foreground">اختر السنة الدراسية لعرض المواد المتاحة</p>

      <div className="flex gap-2 flex-wrap">
        <select value={year} onChange={e=>setYear(e.target.value)} className="input">
          {years.map(y=> <option key={y} value={y}>{y}</option>)}
        </select>
        <select value={dept} onChange={e=>setDept(e.target.value)} className="input">
          <option value="all">كل الأقسام</option>
          {departments.map(d=> <option key={d} value={d}>{d}</option>)}
        </select>
        <input placeholder="بحث باسم المادة" value={q} onChange={e=>setQ(e.target.value)} className="input" />
        <button onClick={()=>{setYear(years[0]); setDept('all'); setQ('');}} className="btn">إعادة ضبط الفلاتر</button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-card rounded-lg">
          <p className="text-sm font-semibold">عدد المواد الظاهرة</p>
          <p className="text-lg font-bold">{filtered.length}</p>
        </div>
        <div className="p-4 bg-card rounded-lg">
          <p className="text-sm font-semibold">مجموع الطلاب</p>
          <p className="text-lg font-bold">{filtered.reduce((s,sub)=>s+sub.studentsCount,0)}</p>
        </div>
        <div className="p-4 bg-card rounded-lg">
          <p className="text-sm font-semibold">المواد المكتملة</p>
          <p className="text-lg font-bold">{completed}</p>
        </div>
        <div className="p-4 bg-card rounded-lg">
          <p className="text-sm font-semibold">المواد غير المكتملة</p>
          <p className="text-lg font-bold">{filtered.length-completed}</p>
        </div>
      </div>

      <div className="overflow-auto bg-card p-3 rounded-lg">
        <table className="w-full text-sm table-auto">
          <thead>
            <tr className="text-muted-foreground text-left">
              <th className="p-2">#</th>
              <th className="p-2">اسم المادة</th>
              <th className="p-2">القسم</th>
              <th className="p-2">السنة</th>
              <th className="p-2">عدد الطلاب</th>
              <th className="p-2">المدخلات</th>
              <th className="p-2">نسبة الاكتمال</th>
              <th className="p-2">الحالة</th>
              <th className="p-2">الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((s,idx)=>{
              const pct = Math.round((s.enteredCount/s.studentsCount)*100);
              const status = s.enteredCount===0? 'لم يبدأ إدخال العلامات' : (s.enteredCount<s.studentsCount? 'قيد الإدخال' : 'مكتمل');
              return (
                <tr key={s.id} className="border-t">
                  <td className="p-2">{idx+1}</td>
                  <td className="p-2">{s.name}</td>
                  <td className="p-2">{s.department ?? '-'}</td>
                  <td className="p-2">{s.year ?? '-'}</td>
                  <td className="p-2">{s.studentsCount}</td>
                  <td className="p-2">{s.enteredCount}</td>
                  <td className="p-2"><div className="w-40 bg-muted h-2 rounded overflow-hidden"><div style={{width:`${pct}%`}} className="h-2 bg-primary" /></div></td>
                  <td className="p-2">{status}</td>
                  <td className="p-2 space-x-1">
                    <button onClick={()=>navigate(`/dashboard/exam-employee/subjects/${s.id}/students`)} className="btn btn-sm">عرض طلاب المادة</button>
                    <button onClick={()=>navigate('/dashboard/exam-employee/enter-grades',{state:{subjectId:s.id}})} className="btn btn-sm">إدخال العلامات</button>
                    <button onClick={()=>navigate('/dashboard/exam-employee/promoted')} className="btn btn-sm">طلاب مترفعون</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SubjectsByYearPage;
