import type { Role, College, Department, Course, Laboratory, Warehouse, Supply, Order, Hospital, HospitalDepartment, Announcement, User } from '@/types';

export const roles: Role[] = [
  { id: 1, name: 'admin', label: 'مدير النظام' },
  { id: 2, name: 'dean', label: 'عميد' },
  { id: 3, name: 'academic_doctor', label: 'دكتور' },
  { id: 4, name: 'lab_technician', label: 'فني مخبر' },
  { id: 5, name: 'warehouse_manager', label: 'أمين مستودع' },
  { id: 6, name: 'student', label: 'طالب' },
  { id: 7, name: 'nurse', label: 'ممرض' },
  { id: 8, name: 'employee', label: 'موظف' },
  { id: 9, name: 'medical_doctor', label: 'دكتور' },
  
];

export const colleges: College[] = [
  
  { id: 1,years:6, name: 'كلية الطب البشري', nameEn: 'Faculty of Medicine', slug: 'medicine', description: 'من أعرق كليات الطب في سوريا، تخرّج أطباء متميزين منذ عام 1946', descriptionEn: 'One of the oldest medical schools in Syria, graduating distinguished physicians since 1946' },
  { id: 2,years:5, name: 'كلية طب الأسنان', nameEn: 'Faculty of Dentistry', slug: 'dentistry', description: 'تخرّج أطباء أسنان مؤهلين مع مختبرات وعيادات حديثة', descriptionEn: 'Graduates qualified dentists with modern laboratories and clinics' },
  { id: 3,years:5, name: 'كلية الصيدلة', nameEn: 'Faculty of Pharmacy', slug: 'pharmacy', description: 'تقدم برامج متقدمة في العلوم الصيدلانية والكيمياء الدوائية', descriptionEn: 'Offers advanced programs in pharmaceutical sciences and medicinal chemistry' },
  
  { id: 4,years:5, name: 'كلية الهندسة المعلوماتية', nameEn: 'Faculty of Informatics Engineering', slug: 'informatics', description: 'تأسست عام 2001، تضم أقساماً متعددة في علوم الحاسوب والبرمجيات والشبكات', descriptionEn: 'Founded in 2001, encompasses multiple departments in computer science, software engineering, and networks' },
  { id: 5,years:5, name: 'كلية الهندسة المدنية', nameEn: 'Faculty of Civil Engineering', slug: 'civil', description: 'تؤهل مهندسين في مجالات البناء والإنشاءات والطرق والجسور', descriptionEn: 'Prepares engineers in construction, infrastructure, roads, and bridges' },
  { id: 6,years:5, name: 'كلية الهندسة المعمارية', nameEn: 'Faculty of Architecture', slug: 'architecture', description: 'تجمع بين الفن والهندسة في تصميم المباني والمدن', descriptionEn: 'Combines art and engineering in building and urban design' },
  { id: 7,years:5, name: 'كلية الهندسة الكهربائية', nameEn: 'Faculty of Electrical Engineering', slug: 'electrical', description: 'تقدم برامج في الإلكترونيات والاتصالات وأنظمة التحكم', descriptionEn: 'Offers programs in electronics, communications, and control systems' },
  { id: 8,years:5, name: 'كلية الهندسة الميكانيكية', nameEn: 'Faculty of Mechanical Engineering', slug: 'mechanical', description: 'تغطي مجالات التصميم الميكانيكي والطاقة والتصنيع', descriptionEn: 'Covers mechanical design, energy, and manufacturing fields' },
  { id: 9,years:5, name: 'كلية الهندسة التقنية', nameEn: 'Faculty of Technical Engineering', slug: 'it', description: 'تقدم برامج تقنية متقدمة في تكنولوجيا المعلومات', descriptionEn: 'Offers advanced technical programs in information technology' },
  { id: 10,years:4, name: 'كلية الهندسة الزراعية', nameEn: 'Faculty of Agricultural Engineering', slug: 'textile', description: ' إعداد المختصين في مختلف ميادين الزراعة ', descriptionEn: '' },

  
  { id: 11,years:4, name: 'كلية العلوم', nameEn: 'Faculty of Sciences', slug: 'science', description: 'تضم أقسام الرياضيات والفيزياء والكيمياء وعلوم الحياة', descriptionEn: 'Includes departments of Mathematics, Physics, Chemistry, and Life Sciences' },
  { id: 12,years:4, name: 'كلية الاقتصاد', nameEn: 'Faculty of Economics', slug: 'economics', description: 'تقدم برامج في الاقتصاد والمحاسبة وإدارة الأعمال', descriptionEn: 'Offers programs in economics, accounting, and business administration' },
  { id: 13,years:4, name: 'كلية الفنون الجميلة', nameEn: 'Faculty of Fine Arts', slug: 'finearts', description: 'تشمل أقسام الرسم والنحت والتصميم الداخلي', descriptionEn: 'Includes departments of Painting, Sculpture, and Interior Design' },
  { id: 14,years:4, name: 'الكلية التطبيقية', nameEn: 'Faculty of Applied Sciences', slug: 'technical', description: 'تسعى تعليم تقاني عالي الجودة', descriptionEn: ' provision of high-quality technical education ' },

  { id: 15,years:4, name: 'كلية الحقوق', nameEn: 'Faculty of Law', slug: 'law', description: 'تعد من أبرز كليات القانون في المنطقة مع تاريخ أكاديمي حافل', descriptionEn: 'One of the most prominent law schools in the region with a rich academic history' },
  { id: 16,years:4, name: 'كلية الآداب والعلوم الإنسانية', nameEn: 'Faculty of Arts & Humanities', slug: 'arts', description: 'تشمل أقسام اللغة العربية والإنجليزية والتاريخ والجغرافيا والفلسفة', descriptionEn: 'Includes departments of Arabic, English, History, Geography, and Philosophy' },
  { id: 17,years:4, name: 'كلية التربية', nameEn: 'Faculty of Education', slug: 'education', description: 'تؤهل معلمين ومربين في مختلف التخصصات', descriptionEn: 'Prepares teachers and educators in various specializations' },
  { id: 18,years:4, name: 'كلية الشريعة', nameEn: 'Faculty of Sharia', slug: 'sharia', description: 'تقدم دراسات متعمقة في العلوم الإسلامية والفقه', descriptionEn: 'Offers in-depth studies in Islamic sciences and jurisprudence' },

  { id: 19,years:2, name: 'معهد التقاني الطبي', nameEn: 'Technical Institute of Medicine', slug: 'medicine', description: 'تؤهل فنيين في المساعدات الصحيات', descriptionEn: '' },
  { id: 20,years:2, name: 'معهد التقاني لطب الأسنان', nameEn: 'Technical Institute of Dentistry', slug: 'medicine', description: 'تؤهل فنيين في فروع التعويضات السنية و المساعدات الصحيات', descriptionEn: '' },
  { id: 21,years:2, name: 'المعهد التقاني الزراعي', nameEn: 'Technical Institute of Agricultural', slug: 'technical', description: 'تقدم تطبيقات ميدانية في مزرعة المعهد ومصانع الأغذية', descriptionEn: '' },
  { id: 22,years:2, name: 'المعهد التقاني لإدارة الأعمال و التسويق', nameEn: 'Technical Institute of Marketing and Business Administration', slug: 'technical', description: 'يقدم برامج تقنية في إدارة الأعمال و التسويق و المبيعات و العلاقات العامة', descriptionEn: 'Offers technical and vocational programs in various fields' },
  { id: 23,years:2, name: 'المعهد التقاني للعلوم المالية والمصرفية', nameEn: 'Technical Institute of Banking and Financial Sciences', slug: 'technical', description: 'يؤهل متخصصين في مجال المحاسبة و الإدارة و الأسواق المالية و المصارف ', descriptionEn: '' },
  { id: 24,years:2, name: 'المعهد التقاني للحاسوب', nameEn: 'Technical Institute of Computer', slug: 'technical', description: 'يقدم برامج في هندسة الحاسوب و الشبكات الحاسوبية و هندسة البرمجيات', descriptionEn: 'Prepares professionals in tourism and hotel management' },
  { id: 25,years:2, name: 'المعهد التقاني الهندسي', nameEn: 'Technical Institute of Engineering', slug: 'technical', description: 'تؤهل مساعدي مهندسين لتلبية حاجة قطاع الإنشاءات', descriptionEn: '' },

  { id: 26,years:2, name: 'كلية التمريض', nameEn: 'Faculty of Nursing', slug: 'nursing', description: 'تعد كوادر تمريضية مؤهلة للعمل في المؤسسات الصحية', descriptionEn: 'Prepares qualified nursing staff for healthcare institutions' },
];

export const departments: Department[] = [
  { id: 1, name: 'قسم هندسة البرمجيات و نظم المعلومات', nameEn: 'Software Engineering', college_id: 4 },
  { id: 2, name: 'قسم النظم و الشبكات الحاسوبية', nameEn: 'Networks', college_id: 4 },
  { id: 3, name: 'قسم الذكاء الصنعي و اللغات الطبيعية', nameEn: 'Artificial Intelligence', college_id: 4 },
  { id: 4, name: 'قسم العلوم الأساسية (هندسة المعلوماتية)', nameEn: 'Information Systems', college_id: 4 },
  { id: 5, name: 'قسم الجراحة', nameEn: 'Surgery', college_id: 1 },
  { id: 6, name: 'قسم الباطنة', nameEn: 'Internal Medicine', college_id: 1 },
  { id: 7, name: 'قسم الأطفال', nameEn: 'Pediatrics', college_id: 1 },
  { id: 8, name: 'قسم التشريح', nameEn: 'Anatomy', college_id: 1 },
  { id: 9, name: 'قسم الأدوية', nameEn: 'Pharmaceutics', college_id: 1 },
  { id: 10, name: 'قسم الكيمياء الصيدلانية', nameEn: 'Pharmaceutical Chemistry', college_id: 3 },
  { id: 11, name: 'قسم القانون العام', nameEn: 'Public Law', college_id: 15 },
  { id: 12, name: 'قسم القانون الخاص', nameEn: 'Private Law', college_id: 15 },
  { id: 13, name: 'قسم اللغة العربية', nameEn: 'Arabic Language', college_id: 16 },
  { id: 14, name: 'قسم اللغة الإنجليزية', nameEn: 'English Language', college_id: 16 },
  { id: 15, name: 'قسم التاريخ', nameEn: 'History', college_id: 16 },
];

export const users: User[] = [
  { id: 1, name: 'مدير النظام', nameEn: 'System Admin', email: 'admin@aleppo.edu', role_id: 1, college_id: null, department_id: null },
  { id: 2, name: 'د. أحمد محمد', nameEn: 'Dr. Ahmad Mohammad', email: 'ahmed@aleppo.edu', role_id: 3, college_id: 1, department_id: 1},
  { id: 3, name: 'د. سارة خليل', nameEn: 'Dr. Sara Khalil', email: 'sara@aleppo.edu', role_id: 9, college_id: 2, department_id: 5 , hospitalRole: true },
  { id: 4, name: 'علي حسن', nameEn: 'Ali Hassan', email: 'ali@aleppo.edu', role_id: 6, college_id: 1, department_id: 1 },
  { id: 5, name: 'فاطمة عمر', nameEn: 'Fatima Omar', email: 'fatima@aleppo.edu', role_id: 6, college_id: 1, department_id: 2 },
  { id: 6, name: 'خالد يوسف', nameEn: 'Khaled Youssef', email: 'khaled@aleppo.edu', role_id: 4, college_id: 4, department_id: 1 },
  { id: 7, name: 'محمد أمين', nameEn: 'Mohammad Amin', email: 'mohamad@aleppo.edu', role_id: 5, college_id: null, department_id: null },
  { id: 8, name: 'نور الهدى', nameEn: 'Nour Alhuda', email: 'noor@aleppo.edu', role_id: 8, college_id: 2, department_id: 5 },
  
  
  { id: 9, name: 'سيلوا إشخانيان', nameEn: 'Dr. Silwa Ishkhanian', email: 'S.ishkhanan@alepuniv.edu.sy', role_id: 2, college_id: 1, department_id: null },
  { id: 10, name: 'د. جاد الكريم القدور', nameEn: 'Dr. Jad Alkarim Alkaddour', email: 'Jad Alkarim Alkaddour@aleppo.edu', role_id: 2, college_id: 2, department_id: null },
  { id: 11, name: 'د. محمد ياسر عبجي', nameEn: 'Dr. Mohammad Yaser Abajy', email: 'Mohammad Yaser Abajy@aleppo.edu', role_id: 2, college_id: 3, department_id: null },
  { id: 12, name: 'د. أحمد حاج درويش', nameEn: 'Dr. Ahmed Haj Darwish', email: 'ahmed.hajdarwish@alepuniv.edu.sy', role_id: 2, college_id: 4, department_id: null },
  { id: 13, name: 'د.سامر سامر', nameEn: 'Dr. Samer Samer', email: 'samer@aleppo.edu', role_id: 3, college_id: 3, department_id: 9 },


    { id: 14, name: 'ايهم ايهم', nameEn: 'Ayham Ayham', email: 'Ayham@aleppo.edu', role_id: 4, college_id: 4, department_id:1 },
    { id: 15, name: 'مجد مجد', nameEn: 'Majed Majed', email: 'Majed@aleppo.edu', role_id: 4, college_id: 4, department_id: 2 },
    { id: 16, name: 'رامي رامي', nameEn: 'Rami Rami', email: 'Rami@aleppo.edu', role_id: 4, college_id: 4, department_id: 1 },
    { id: 17, name: 'ايمن ايمن', nameEn: 'Ayman Ayman', email: 'Ayman@aleppo.edu', role_id: 4, college_id: 4, department_id: 1 },

];

export const courses: Course[] = [
  { id: 1,collegeId:4,year:3, name: 'هندسة البرمجيات 1', nameEn: 'Software Engineering 1', department_id: 1, doctor_id: 2 },
  { id: 2,collegeId:4,year:3, name: 'قواعد البيانات', nameEn: 'Databases', department_id: 1, doctor_id: 2 },
  { id: 3,collegeId:4,year:3, name: 'شبكات الحاسوب', nameEn: 'Computer Networks', department_id: 2, doctor_id: 2 },
  { id: 4,collegeId:2,year:3, name: 'التشريح العام', nameEn: 'General Anatomy', department_id: 8, doctor_id: 3 },
  { id: 5,collegeId:3,year:3, name: 'الكيمياء الصيدلانية', nameEn: 'Pharmaceutical Chemistry', department_id: 10, doctor_id: 12 },
  { id: 6,collegeId:1,year:3, name: 'الذكاء الاصطناعي', nameEn: 'Artificial Intelligence', department_id: 3, doctor_id: 2 },
  { id: 7,collegeId:2,year:3, name: 'الباطنة العامة', nameEn: 'Internal Medicine', department_id: 6, doctor_id: 11 },
  { id: 8,collegeId:1,year:3, name: 'البرمجة الكائنية', nameEn: 'Object-Oriented Programming', department_id: 1, doctor_id: 2 },
  { id: 9,collegeId:4,year:4, name: 'أمن المعلومات', nameEn: 'Information Security', department_id: 2, doctor_id: 2 },
  { id: 10,collegeId:1,year:3, name: 'طب الأطفال', nameEn: 'Pediatrics', department_id: 7, doctor_id: 3 },
  { id: 12,collegeId:4,year:1, name: 'فيزياء 1', nameEn: 'Physics 1', department_id: 1, doctor_id: 2 },
  { id: 13,collegeId:4,year:1, name: 'فيزياء 2', nameEn: 'Physics 2', department_id: 1, doctor_id: 2 },
  { id: 14,collegeId:4,year:1, name: 'تحليل 1', nameEn: 'Analysis 1', department_id: 1, doctor_id: 2 },
  { id: 15,collegeId:4,year:1, name: 'تحليل 2', nameEn: 'Analysis 2', department_id: 1, doctor_id: 2 },
  { id: 16,collegeId:4,year:1, name: 'برمجة 1', nameEn: 'Programming 1', department_id: 1, doctor_id: 2 },
  { id: 17,collegeId:4,year:1, name: 'فيزياء 1', nameEn: 'Programming 2', department_id: 1, doctor_id: 2 },
  { id: 18,collegeId:4,year:1, name: 'رياضيات متقطعة', nameEn: 'Discrete mathematics', department_id: 1, doctor_id: 2 },
  { id: 19,collegeId:4,year:1, name: 'مبادئ عمل الحواسيب', nameEn: 'Computer principles', department_id: 1, doctor_id: 2 },
];

export const sections = [
  { id: 1, course_id: 1, doctor_id: 2, schedule: 'الأحد-الثلاثاء 8:00-9:30', scheduleEn: 'Sun-Tue 8:00-9:30' },
  { id: 2, course_id: 2, doctor_id: 2, schedule: 'الاثنين-الأربعاء 10:00-11:30', scheduleEn: 'Mon-Wed 10:00-11:30' },
  { id: 3, course_id: 4, doctor_id: 3, schedule: 'الأحد-الثلاثاء 12:00-13:30', scheduleEn: 'Sun-Tue 12:00-13:30' },
  { id: 4, course_id: 7, doctor_id: 11, schedule: 'الاثنين-الأربعاء 8:00-9:30', scheduleEn: 'Mon-Wed 8:00-9:30' },
];

export const enrollments = [
  { student_id: 4, course_id: 1, section_id: 1, grade: 85 },
  { student_id: 4, course_id: 2, section_id: 2, grade: 92 },
  { student_id: 5, course_id: 3, section_id: null, grade: 78 },
  { student_id: 10, course_id: 4, section_id: 3, grade: null },
  { student_id: 10, course_id: 7, section_id: 4, grade: 88 },
];


export const laboratories: Laboratory[] = [
  { id: 1, name: 'مخبر البرمجة', nameEn: 'Programming Lab', department_id: 1, technician_id: 14 },
  { id: 2, name: 'مخبر الشبكات', nameEn: 'Networks Lab', department_id: 2, technician_id: 15  },
  { id: 3, name: 'مخبر هندسة البرمجيات', nameEn: ' Lab', department_id: 1, technician_id: 16 },
  { id: 4, name: 'مخبر قواعد المعطيات', nameEn: ' Lab', department_id: 1, technician_id: 17 },
  { id: 5, name: 'مخبر الرسوميات', nameEn: ' Lab', department_id: 1, technician_id: 6 },
  { id: 6, name: 'مخبر البيانات و الرسم الهندسي', nameEn: ' Lab', department_id: 1, technician_id: 6 },
  { id: 7, name: 'مخبر قواعد المعطيات الموزعة', nameEn: ' Lab', department_id: 1, technician_id: 6 },
  { id: 8, name: 'مخبر الذكاء الصنعي', nameEn: ' Lab', department_id: 3, technician_id: 6 },
  { id: 9, name: 'مخبر الروبوتية', nameEn: ' Lab', department_id: 3, technician_id: 6 },
  { id: 10, name: 'مخبر الرؤية الحاسوبية', nameEn: ' Lab', department_id: 3, technician_id: 6 },
  { id: 11, name: 'مخبر هندسة الروبوت', nameEn: ' Lab', department_id: 3, technician_id: 6 },
  { id: 12, name: 'مخبر الفيزياء', nameEn: ' Lab', department_id: 4, technician_id: 6 },

  
  { id: 13, name: ' أبحاث التشريح الوصفي', nameEn: 'Anatomy Lab', department_id: 5, technician_id: 6 },
  { id: 14, name: 'مخبر التشريح الوصفي', nameEn: 'Chemistry Lab', department_id: 5, technician_id: 6 },
  { id: 15, name: 'مخبر المعلوماتية الطبي', nameEn: ' Lab', department_id: 5, technician_id: 6 },
  { id: 16, name: 'مخبر علم الخلية ', nameEn: ' Lab', department_id: 5, technician_id: 6 },
  { id: 17, name: 'مخبر الجنين  ', nameEn: ' Lab', department_id: 5, technician_id: 6 },
  { id: 18, name: 'مخبر المهارات الطبية – قسم الداخلية والجراحة  ', nameEn: ' Lab', department_id: 5, technician_id: 6 },
  { id: 19, name: 'مخبر المهارات الطبية  ', nameEn: ' Lab', department_id: 5, technician_id: 6 },
  { id: 20, name: 'مخبر الأدوية  ', nameEn: ' Lab', department_id: 5, technician_id: 6 },
  { id: 21, name: 'مخبر الفيزيولوجيا  ', nameEn: ' Lab', department_id: 5, technician_id: 6 },
  { id: 22, name: 'مخبر الكيمياء الحيوية - قسم الكيمياء الحيوية  ', nameEn: ' Lab', department_id: 5, technician_id: 6 },
  { id: 23, name: 'مخبر الكيمياء العامة - قسم الكيمياء العامة  ', nameEn: ' Lab', department_id: 5, technician_id: 6 },
  { id: 24, name: 'مخبر الأحياء الدقيقة – قسم الطب المخبري  ', nameEn: ' Lab', department_id: 5, technician_id: 6 },
  { id: 25, name: 'مخبر التشريح المرضي ', nameEn: ' Lab', department_id: 5, technician_id: 6 },
  { id: 26, name: 'مخبر  الكيمياء السريرية  ', nameEn: ' Lab', department_id: 5, technician_id: 6 },
  { id: 27, name: 'مخبر النسج  ', nameEn: ' Lab', department_id: 5, technician_id: 6 },
  { id: 28, name: 'مخبر التعليم الطبي المستمر ', nameEn: ' Lab', department_id: 5, technician_id: 6 },
  { id: 29, name: 'مخبر الفيزيولوجيا', nameEn: ' Lab', department_id: 5, technician_id: 6 },

  { id: 30, name: 'مخبر التعويضات المتحركة الكاملة والجزئية', nameEn: ' Lab', department_id: 10, technician_id: 6 },


];

export const warehouses: Warehouse[] = [
  { id: 1, name: 'المستودع المركزي', nameEn: 'Central Warehouse', location: 'المبنى الرئيسي', locationEn: 'Main Building' },
  { id: 2, name: 'مستودع المستشفى', nameEn: 'Hospital Warehouse', location: 'مبنى المستشفى الجامعي', locationEn: 'University Hospital Building' },
];

export const supplies: Supply[] = [
  { id: 1, name: 'أجهزة حاسوب', nameEn: 'Computers', quantity: 50, warehouse_id: 1 },
  { id: 2, name: 'كابلات شبكة', nameEn: 'Network Cables', quantity: 200, warehouse_id: 1 },
  { id: 3, name: 'أدوات مخبرية', nameEn: 'Lab Tools', quantity: 100, warehouse_id: 1 },
  { id: 4, name: 'أدوية طبية', nameEn: 'Medical Drugs', quantity: 500, warehouse_id: 2 },
  { id: 5, name: 'قرطاسية', nameEn: 'Stationery', quantity: 1000, warehouse_id: 1 },
  { id: 6, name: 'معدات جراحية', nameEn: 'Surgical Equipment', quantity: 30, warehouse_id: 2 },
  { id: 7, name: 'طاولات مكتبية', nameEn: 'Office Desks', quantity: 25, warehouse_id: 1 },
  { id: 8, name: 'كراسي', nameEn: 'Chairs', quantity: 80, warehouse_id: 1 },
  { id: 9, name: 'مجاهر', nameEn: 'Microscopes', quantity: 15, warehouse_id: 1 },
];

export const orders: Order[] = [
  { id: 1, requester_id: 6, warehouse_manager_id: 7,lab_id: 1, college_id: 1, status: 'pending', created_at: '2026-04-01T10:00:00Z' },
  { id: 2, requester_id: 8, warehouse_manager_id: 7, lab_id: 2, college_id: 1, status: 'approved', created_at: '2026-03-28T14:30:00Z' },
  { id: 3, requester_id: 6, warehouse_manager_id: null,lab_id: 1, college_id: 1, status: 'rejected', created_at: '2026-03-25T09:00:00Z' },
  { id: 4, requester_id: 9, warehouse_manager_id: 7,lab_id: 3, college_id: 1, status: 'purchase', created_at: '2026-04-05T11:00:00Z' },
  { id: 5, requester_id: 6, warehouse_manager_id: 7,lab_id: 1, college_id: 1, status: 'delivered', created_at: '2026-03-20T09:00:00Z' },
];

export const orderItems = [
  { id: 1, order_id: 1, supply_id: 1, quantity: 5 },
  { id: 2, order_id: 1, supply_id: 5, quantity: 50 },
  { id: 3, order_id: 2, supply_id: 4, quantity: 100 },
  { id: 4, order_id: 3, supply_id: 6, quantity: 10 },
  { id: 5, order_id: 4, supply_id: 9, quantity: 20 },
  { id: 6, order_id: 5, supply_id: 3, quantity: 15 },
];

export const hospitals: Hospital[] = [
  { id: 1, name: 'مشفى حلب الجامعي', nameEn: 'Aleppo University Hospital', location: 'سورية - حلب - ساحة الجامعة', locationEn: 'Syria - Aleppo - University Square' },
  { id: 2, name: 'مشفى التوليد وأمراض النساء الجامعي', nameEn: 'University Obstetrics and Gynecology Hospital', location: 'سورية - حلب - حرم جامعة حلب خلف كلية الطب', locationEn: 'Syria - Aleppo - Aleppo University campus, behind the faculty of Medicine' },
  { id: 3, name: 'مشفى جراحة الفم والفكين', nameEn: 'Oral and Maxillofacial Hospital', location: 'سورية - حلب - كلية طب الاسنان', locationEn: 'Syria - Aleppo - Faculty of Dentistry' },
  { id: 4, name: 'مشفى أمراض وجراحة القلب الجامعي', nameEn: 'University Cardiology Hospital', location: 'سورية – حلب - المحافظة - مقابل فندق بولمان الشهباء', locationEn: 'Syria - Aleppo - AL-Muhafaza ,opposite the Pullman Al Shahbaa Hotel' },
];

export const clinics = [
  { id: 1, hospital_id: 1, name: 'عيادة الجراحة العامة', nameEn: 'General Surgery Clinic', specialty: 'جراحة', specialtyEn: 'Surgery' },
  { id: 2, hospital_id: 1, name: 'عيادة القلبية', nameEn: 'Cardiology Clinic', specialty: 'قلبية', specialtyEn: 'Cardiology' },
  { id: 3, hospital_id: 1, name: 'عيادة العظمية', nameEn: 'Orthopedics Clinic', specialty: 'عظمية', specialtyEn: 'Orthopedics' },
  { id: 4, hospital_id: 1, name: 'عيادة الباطنة', nameEn: 'Internal Medicine Clinic', specialty: 'باطنة', specialtyEn: 'Internal Medicine' },
  { id: 5, hospital_id: 2, name: 'عيادة التوليد', nameEn: 'Obstetrics Clinic', specialty: 'توليد', specialtyEn: 'Obstetrics' },
  { id: 6, hospital_id: 2, name: 'عيادة النسائية', nameEn: 'Gynecology Clinic', specialty: 'نسائية', specialtyEn: 'Gynecology' },
  { id: 7, hospital_id: 3, name: 'عيادة الأطفال العامة', nameEn: 'General Pediatrics Clinic', specialty: 'أطفال', specialtyEn: 'Pediatrics' },
  { id: 8, hospital_id: 4, name: 'عيادة العيون', nameEn: 'Eye Clinic', specialty: 'عيون', specialtyEn: 'Ophthalmology' },
];

export const appointments = [
  { id: 1, patient_id: 4, doctor_id: 3, clinic_id: 1, date: '2026-04-15', time: '09:00', status: 'scheduled' as const },
  { id: 2, patient_id: 10, doctor_id: 11, clinic_id: 4, date: '2026-04-16', time: '10:30', status: 'completed' as const },
  { id: 3, patient_id: 5, doctor_id: 3, clinic_id: 1, date: '2026-04-17', time: '11:00', status: 'scheduled' as const },
];

export const medicalRecords = [
  { id: 1, patient_id: 4, doctor_id: 3, date: '2026-03-15', diagnosis: 'فحص روتيني - النتائج طبيعية', diagnosisEn: 'Routine checkup - normal results', treatment: 'لا يوجد', treatmentEn: 'None' },
  { id: 2, patient_id: 10, doctor_id: 11, date: '2026-03-20', diagnosis: 'التهاب حلق', diagnosisEn: 'Throat infection', treatment: 'مضاد حيوي لمدة 5 أيام', treatmentEn: 'Antibiotics for 5 days' },
];

export const hospitalDepartments: HospitalDepartment[] = [
  { id: 1, name: 'قسم الطوارئ', nameEn: 'Emergency Department', hospital_id: 1 },
  { id: 2, name: 'قسم الجراحة', nameEn: 'Surgery Department', hospital_id: 1 },
  { id: 3, name: 'قسم الباطنة', nameEn: 'Internal Medicine', hospital_id: 1 },
  { id: 4, name: 'قسم الأطفال', nameEn: 'Pediatrics', hospital_id: 1 },
  { id: 5, name: 'قسم النسائية', nameEn: 'Gynecology', hospital_id: 1 },
  { id: 6, name: 'قسم العناية المشددة', nameEn: 'ICU', hospital_id: 1 },
  { id: 7, name: 'قسم التوليد', nameEn: 'Obstetrics', hospital_id: 2 },
  { id: 8, name: 'قسم حديثي الولادة', nameEn: 'Neonatal', hospital_id: 2 },
];

export const announcements: Announcement[] = [
  { id: 1, title: 'موعد الامتحانات النهائية', titleEn: 'Final Exams Schedule', content: 'تبدأ الامتحانات النهائية للفصل الثاني يوم 15/06/2026', contentEn: 'Second semester final exams start on 15/06/2026', created_by: 1, created_at: '2026-04-05T08:00:00Z' },
  { id: 2, title: 'عطلة عيد الفطر', titleEn: 'Eid Al-Fitr Holiday', content: 'تعلن الجامعة عن عطلة عيد الفطر من 20/03 إلى 25/03/2026', contentEn: 'The university announces Eid Al-Fitr holiday from 20/03 to 25/03/2026', created_by: 1, created_at: '2026-03-15T10:00:00Z' },
  { id: 3, title: 'ورشة عمل تقنية', titleEn: 'Technical Workshop', content: 'تقام ورشة عمل حول الذكاء الاصطناعي في قاعة المؤتمرات يوم 10/04/2026', contentEn: 'An AI workshop will be held in the conference hall on 10/04/2026', created_by: 1, created_at: '2026-04-02T12:00:00Z' },
  { id: 4, title: 'افتتاح مخبر جديد', titleEn: 'New Laboratory Opening', content: 'يسر كلية الهندسة المعلوماتية الإعلان عن افتتاح مخبر الروبوتيك الجديد', contentEn: 'The Faculty of Informatics Engineering is pleased to announce the opening of the new Robotics Lab', created_by: 1, created_at: '2026-04-08T14:00:00Z' },
  { id: 5, title: 'مؤتمر طبي دولي', titleEn: 'International Medical Conference', content: 'تستضيف كلية الطب مؤتمراً طبياً دولياً بمشاركة أكثر من 200 باحث', contentEn: 'The Faculty of Medicine hosts an international medical conference with over 200 researchers', created_by: 1, created_at: '2026-04-10T09:00:00Z' },
];

export const newsEvents = [
  { id: 1, title: 'حفل تخرج الدفعة الجديدة', titleEn: 'New Batch Graduation Ceremony', date: '2026-04-20', image: '/favicon.ico', excerpt: 'تحتفل الجامعة بتخريج أكثر من 2000 طالب من مختلف الكليات', excerptEn: 'The university celebrates the graduation of over 2000 students from various colleges' },
  { id: 2, title: 'مؤتمر البحث العلمي السنوي', titleEn: 'Annual Scientific Research Conference', date: '2026-04-25', image: '/favicon.ico', excerpt: 'ينعقد المؤتمر السنوي للبحث العلمي بمشاركة باحثين من 15 دولة', excerptEn: 'The annual scientific research conference is held with researchers from 15 countries' },
  { id: 3, title: 'اتفاقية تعاون مع جامعة برلين', titleEn: 'Cooperation Agreement with Berlin University', date: '2026-05-01', image: '/favicon.ico', excerpt: 'توقيع اتفاقية تبادل أكاديمي مع جامعة برلين التقنية', excerptEn: 'Signing an academic exchange agreement with Berlin Technical University' },
  { id: 4, title: 'ندوة الذكاء الاصطناعي في الطب', titleEn: 'AI in Medicine Symposium', date: '2026-05-10', image: '/favicon.ico', excerpt: 'ندوة حول تطبيقات الذكاء الاصطناعي في التشخيص الطبي', excerptEn: 'A symposium on AI applications in medical diagnosis' },
];

export const newsDir = [
  { id: 1, title: '', titleEn: '' },
];

// Mega menu structure for colleges
export const collegeMegaMenu = [
  {
    title: 'الكليات الهندسية',
    titleEn: 'Engineering',
    colleges: [4, 5, 6, 7, 8, 9, 10],
  },
  {
    title: 'الكليات االطبية',
    titleEn: 'Medicine & Health',
    colleges: [1, 2, 3, 26],
  },
  {
    title: 'الكليات العلمية',
    titleEn: 'Sciences',
    colleges: [11, 12,13,14],
  },
  {
    title: 'الكليات الأدبية',
    titleEn: 'Arts & Law',
    colleges: [15, 16, 17, 18],
  },
  {
    title: 'معاهد',
    titleEn: 'Technical',
    colleges: [19, 20, 21, 22, 23, 24, 25],
  },
  {
    title: 'تعليم مفتوح',
    titleEn: 'Humanities',
    colleges: [12, 17, 15, 16],
  },
];

export const maintenanceReports = [
  { id: 1, lab_id: 1, description: 'صيانة أجهزة الحاسوب', descriptionEn: 'Computer maintenance', status: 'completed' as const, date: '2026-03-15' },
  { id: 2, lab_id: 2, description: 'إصلاح سويتش الشبكة', descriptionEn: 'Network switch repair', status: 'pending' as const, date: '2026-04-01' },
  { id: 3, lab_id: 3, description: 'تعقيم المخبر', descriptionEn: 'Lab sterilization', status: 'in_progress' as const, date: '2026-04-05' },
];
{/*
export const attendanceRecords = [
  { id: 1, student_id: 4, course_id: 1, date: '2026-04-06', present: true },
  { id: 2, student_id: 4, course_id: 1, date: '2026-04-08', present: true },
  { id: 3, student_id: 4, course_id: 2, date: '2026-04-07', present: false },
  { id: 4, student_id: 5, course_id: 3, date: '2026-04-06', present: true },
  { id: 5, student_id: 10, course_id: 7, date: '2026-04-07', present: true },
];  */}
