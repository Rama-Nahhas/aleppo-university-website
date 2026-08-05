// Mock data shaped to match backend responses exactly for the Exam Employee UI.
export const MOCK_PASSING_MARK = 60; // Experimental value for frontend only — must be aligned with backend later.

export const years = ['السنة الأولى','السنة الثانية','السنة الثالثة','السنة الرابعة','السنة الخامسة'];
export const departments = [1,2,3,4]; // department ids only; names not provided by backend in this mock

export type ExamSubject = {
  id: number;
  department_id: number;
  year_id: number;
  user_id: number | null;
  name: string;
  created_at: string | null;
  updated_at: string | null;
  doctor: { id: number; name: string } | null;
  year?: { id:number; name:string } | null;
};

// Response shape for subjects list
export const examSubjectsResponseMock = {
  data: [
    {
      id: 7,
      department_id: 1,
      year_id: 1,
      user_id: null,
      name: 'Anatomy',
      created_at: '2026-08-04T23:20:52.000000Z',
      updated_at: '2026-08-04T23:20:52.000000Z',
      doctor: null,
      year: {
        id: 1,
        name: 'السنة الأولى'
      }
    },
    {
      id: 8,
      department_id: 2,
      year_id: 2,
      user_id: 5,
      name: 'Physiology',
      created_at: '2026-08-04T23:21:00.000000Z',
      updated_at: '2026-08-04T23:21:00.000000Z',
      doctor: { id:5, name: 'د. علي' },
      year: { id:2, name: 'السنة الثانية' }
    }
  ] as ExamSubject[]
};

export type SubjectStudent = {
  subject_id: number;
  department_id: number;
  year_id: number;
  student_id: number;
  name: string;
  mark: number | null;
  is_success: number | null; // 1,0 or null
};

// Response shape for students of a subject
export const examSubjectStudentsResponseMock: Record<number, { subject: { id:number; name:string; year_id:number }, new_students: SubjectStudent[], failed_students: SubjectStudent[] }> = {
  7: {
    subject: { id:7, name: 'Anatomy', year_id: 1 },
    new_students: [
      { subject_id:7, department_id:1, year_id:1, student_id: 12, name: 'Test Student', mark: null, is_success: null },
      { subject_id:7, department_id:1, year_id:1, student_id: 13, name: 'John Doe', mark: null, is_success: null }
    ],
    failed_students: []
  },
  8: {
    subject: { id:8, name: 'Physiology', year_id: 2 },
    new_students: [
      { subject_id:8, department_id:2, year_id:2, student_id: 21, name: 'Alice', mark: 75, is_success: 1 },
    ],
    failed_students: [
      { subject_id:8, department_id:2, year_id:2, student_id: 22, name: 'Bob', mark: 45, is_success: 0 }
    ]
  }
};

// Mock response for inserting/updating a mark (emulated locally)
export const insertMarkResponseMock = (student_id:number, subject_id:number, mark:number | null) => ({
  message: 'Mark updated successfully',
  pivot: {
    id: Math.floor(Math.random()*1000),
    subject_id,
    mark: mark===null? null: String(mark),
    is_success: mark===null? null: (mark >= MOCK_PASSING_MARK ? 1 : 0),
    old_mark: null,
    new_mark: null,
    old_is_success: null,
    new_is_success: null,
    changed_by: null,
    user_id: null,
    created_at: null,
    updated_at: null,
  }
});

// promoted students response mock per subject
export const promotedStudentsResponseMock: Record<number, { subject: { id:number; name:string; year_id:number }, promoted_students: SubjectStudent[] }> = {
  7: { subject: { id:7, name:'Anatomy', year_id:1 }, promoted_students: [] },
  8: { subject: { id:8, name:'Physiology', year_id:2 }, promoted_students: [] }
};
