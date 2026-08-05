import React, { createContext, useContext, useMemo, useState } from 'react';
import * as mock from '@/data/examMock';

// Types based on backend-like mocks
type ExamSubject = typeof mock.examSubjectsResponseMock.data[number];
type SubjectStudent = typeof mock.examSubjectStudentsResponseMock[7]['new_students'][number];

type SubjectStudentsResponse = {
  subject: { id:number; name:string; year_id:number };
  new_students: SubjectStudent[];
  failed_students: SubjectStudent[];
};

type ExamContextType = {
  subjects: ExamSubject[];
  years: string[];
  departments: number[];
  MOCK_PASSING_MARK: number;
  getSubjectById: (id:number) => ExamSubject | undefined;
  getSubjectStudentsResponse: (subjectId:number) => SubjectStudentsResponse;
  updateStudentMark: (subjectId:number, studentId:number, mark:number | null) => { message:string; pivot:any };
  setSelectedSubjectId: (id:number | null) => void;
  selectedSubjectId: number | null;
};

const ExamContext = createContext<ExamContextType | undefined>(undefined);

export const ExamProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // subjects list (response.data)
  const [rawSubjects, setRawSubjects] = useState<ExamSubject[]>(() => JSON.parse(JSON.stringify(mock.examSubjectsResponseMock.data)));

  // subject students responses map keyed by subject id
  const [subjectStudentsMap, setSubjectStudentsMap] = useState<Record<number, SubjectStudentsResponse>>(() => JSON.parse(JSON.stringify(mock.examSubjectStudentsResponseMock)));

  // promoted students map
  const [promotedMap, setPromotedMap] = useState<Record<number, any>>(() => JSON.parse(JSON.stringify(mock.promotedStudentsResponseMock)));

  const [selectedSubjectId, setSelectedSubjectId] = useState<number | null>(null);

  const years = mock.years;
  const departments = mock.departments;
  const MOCK_PASSING_MARK = mock.MOCK_PASSING_MARK;

  const getSubjectById = (id:number) => rawSubjects.find(s=> s.id === id);

  const getSubjectStudentsResponse = (subjectId:number): SubjectStudentsResponse => {
    const resp = subjectStudentsMap[subjectId as any];
    if(resp) return JSON.parse(JSON.stringify(resp));
    // fallback empty shape
    return { subject: { id: subjectId, name: 'غير معروف', year_id: 0 }, new_students: [], failed_students: [] };
  };

  const updateStudentMark = (subjectId:number, studentId:number, mark:number | null) => {
    // immutable update
    setSubjectStudentsMap(prev => {
      const copy = JSON.parse(JSON.stringify(prev)) as Record<number, SubjectStudentsResponse>;
      const resp = copy[subjectId] || { subject: { id: subjectId, name: 'غير معروف', year_id: 0 }, new_students: [], failed_students: [] };
      const findIn = (arr: SubjectStudent[]) => arr.find((s:any)=> s.student_id === studentId);
      const target = findIn(resp.new_students) || findIn(resp.failed_students);
      if(target){
        const oldMark = target.mark;
        target.mark = mark;
        target.markEnteredAt = mark == null ? null : new Date().toISOString();
        // only compute is_success if backend did not provide it (null). Do not override existing non-null is_success.
        if(target.is_success === null){
          target.is_success = (mark === null) ? null : (mark >= MOCK_PASSING_MARK ? 1 : 0);
        }
      }
      copy[subjectId] = resp;
      return copy;
    });

    // emulate insertMarkResponseMock pivot
    const pivot = mock.insertMarkResponseMock(studentId, subjectId, mark);
    return { message: pivot.message, pivot: pivot.pivot };
  };

  // derive subjects enriched with stats used by UI
  const subjects = useMemo(() => {
    return rawSubjects.map(s=>{
      const resp = subjectStudentsMap[s.id] || { subject: { id: s.id, name: s.name, year_id: s.year_id }, new_students: [], failed_students: [] };
      const studentsCount = (resp.new_students.length + resp.failed_students.length) || 0;
      const enteredCount = (resp.new_students.concat(resp.failed_students).filter(st=> st.mark != null).length) || 0;
      return {
        id: s.id,
        name: s.name,
        department: s.department_id,
        year: s.year?.name || null,
        studentsCount,
        enteredCount,
      };
    });
  }, [rawSubjects, subjectStudentsMap]);

  // aggregate promoted students list
  const promotedStudents = useMemo(()=>{
    const arr: any[] = [];
    Object.keys(promotedMap).forEach(k=>{
      const subjId = Number(k);
      const block = promotedMap[subjId];
      if(!block) return;
      (block.promoted_students || []).forEach((p:any)=> arr.push({ ...p, subject: block.subject }));
    });
    return arr;
  }, [promotedMap]);

  // recent marks derived from students with markEnteredAt
  const recentMarks = useMemo(()=>{
    const arr: any[] = [];
    Object.keys(subjectStudentsMap).forEach(k=>{
      const subjId = Number(k);
      const block = subjectStudentsMap[subjId];
      if(!block) return;
      const subjName = block.subject?.name || rawSubjects.find(rs=>rs.id===subjId)?.name || '';
      block.new_students.concat(block.failed_students).forEach((st:any)=>{
        if(st.markEnteredAt){
          arr.push({ studentName: st.name, subject: subjName, mark: st.mark, enteredAt: st.markEnteredAt, status: 'محفوظ' });
        }
      });
    });
    // sort desc
    arr.sort((a,b)=> new Date(b.enteredAt).getTime() - new Date(a.enteredAt).getTime());
    return arr.slice(0,10);
  }, [subjectStudentsMap, rawSubjects]);

  const value = useMemo(() => ({ subjects, years, departments, MOCK_PASSING_MARK, getSubjectById, getSubjectStudentsResponse, updateStudentMark, setSelectedSubjectId, selectedSubjectId, promotedStudents, recentMarks }), [subjects, subjectStudentsMap, promotedMap, selectedSubjectId, rawSubjects]);

  return <ExamContext.Provider value={value}>{children}</ExamContext.Provider>;
};

export const useExam = ()=>{
  const ctx = useContext(ExamContext);
  if(!ctx) throw new Error('useExam must be used within ExamProvider');
  return ctx;
};

export default ExamContext;

