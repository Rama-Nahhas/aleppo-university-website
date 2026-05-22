import React, { createContext, useContext, useState, useCallback } from 'react';

type Lang = 'ar' | 'en';

interface LanguageContextType {
  lang: Lang;
  dir: 'rtl' | 'ltr';
  t: (key: string) => string;
  toggleLang: () => void;
  setLang: (l: Lang) => void;
}

const translations: Record<string, Record<Lang, string>> = {
  // Nav
  'nav.home': { ar: 'الرئيسية', en: 'Home' },
  'nav.colleges': { ar: 'الكليات', en: 'Colleges' },
  'nav.hospitals': { ar: 'المشافي', en: 'Hospitals' },
   'nav.Directorate': { ar: 'المديريات', en: 'Directorate' },
   'nav.CentersPage': { ar: 'المراكز', en: 'Centers' },
  'nav.events': { ar: 'الفعاليات', en: 'Events' },
  'nav.contact': { ar: 'التواصل', en: 'Contact' },
  'nav.login': { ar: 'تسجيل الدخول', en: 'Login' },
  'nav.logout': { ar: 'تسجيل الخروج', en: 'Logout' },
  'nav.dashboard': { ar: 'لوحة التحكم', en: 'Dashboard' },
  'nav.search': { ar: 'بحث...', en: 'Search...' },

  // Hero
  'hero.title': { ar: 'جامعة حلب', en: 'University of Aleppo' },
  'hero.subtitle': { ar: 'صرح علمي عريق يمتد لأكثر من 75 عاماً في خدمة العلم والمعرفة', en: 'A prestigious academic institution with over 75 years of excellence in education and research' },
  'hero.cta': { ar: 'تقدم الآن', en: 'Apply Now' },
  'hero.learn': { ar: 'اكتشف المزيد', en: 'Learn More' },

  // About
  'about.title': { ar: 'عن الجامعة', en: 'About the University' },
  'about.mission.title': { ar: 'رسالتنا', en: 'Our Mission' },
  'about.mission.text': { ar: 'تقديم تعليم عالي الجودة يلبي احتياجات المجتمع ويساهم في التنمية المستدامة من خلال البحث العلمي والابتكار.', en: 'Delivering high-quality education that meets community needs and contributes to sustainable development through scientific research and innovation.' },
  'about.vision.title': { ar: 'رؤيتنا', en: 'Our Vision' },
  'about.vision.text': { ar: 'أن تكون جامعة حلب مؤسسة رائدة إقليمياً ودولياً في التعليم والبحث العلمي وخدمة المجتمع.', en: 'To be a leading institution regionally and internationally in education, research, and community service.' },
  'about.excellence.title': { ar: 'التميز الأكاديمي', en: 'Academic Excellence' },
  'about.excellence.text': { ar: 'أكثر من 18 كلية و100 قسم أكاديمي مع برامج متنوعة في العلوم والهندسة والطب والآداب.', en: 'Over 18 colleges and 100 academic departments with diverse programs in science, engineering, medicine, and arts.' },

  // News
  'news.title': { ar: 'أخبار وفعاليات', en: 'News & Events' },
  'news.readMore': { ar: 'اقرأ المزيد', en: 'Read More' },

  // Footer
  'footer.quickLinks': { ar: 'روابط سريعة', en: 'Quick Links' },
  'footer.contactInfo': { ar: 'معلومات التواصل', en: 'Contact Info' },
  'footer.followUs': { ar: 'تابعنا', en: 'Follow Us' },
  'footer.address': { ar: 'حلب، سوريا - شارع الجامعة', en: 'Aleppo, Syria - University Street' },
  'footer.rights': { ar: 'جميع الحقوق محفوظة', en: 'All Rights Reserved' },

  // Login
  'login.title': { ar: 'تسجيل الدخول', en: 'Sign In' },
  'login.email': { ar: 'البريد الإلكتروني', en: 'Email' },
  'login.password': { ar: 'كلمة المرور', en: 'Password' },
  'login.submit': { ar: 'دخول', en: 'Sign In' },
  'login.error': { ar: 'البريد الإلكتروني أو كلمة المرور غير صحيحة', en: 'Invalid email or password' },
  'login.demo': { ar: 'حسابات تجريبية', en: 'Demo Accounts' },

  // Dashboard common
  'dash.welcome': { ar: 'مرحباً', en: 'Welcome' },
  'dash.overview': { ar: 'نظرة عامة', en: 'Overview' },
  'dash.users': { ar: 'المستخدمون', en: 'Users' },
  'dash.colleges': { ar: 'الكليات', en: 'Colleges' },
  'dash.departments': { ar: 'الأقسام', en: 'Departments' },
  'dash.courses': { ar: 'المقررات', en: 'Courses' },
  'dash.labs': { ar: 'المخابر', en: 'Laboratories' },
  'dash.warehouses': { ar: 'المستودعات', en: 'Warehouses' },
  'dash.orders': { ar: 'الطلبات', en: 'Orders' },
  'dash.hospital': { ar: 'المستشفى', en: 'Hospital' },
  'dash.announcements': { ar: 'الإعلانات', en: 'Announcements' },
  'dash.students': { ar: 'الطلاب', en: 'Students' },
  'dash.grades': { ar: 'الدرجات', en: 'Grades' },
  'dash.schedule': { ar: 'الجدول', en: 'Schedule' },
  //'dash.attendance': { ar: 'الحضور', en: 'Attendance' },
  'dash.materials': { ar: 'المواد', en: 'Materials' },
  'dash.patients': { ar: 'المرضى', en: 'Patients' },
  'dash.appointments': { ar: 'المواعيد', en: 'Appointments' },
  'dash.equipment': { ar: 'المعدات', en: 'Equipment' },
  'dash.maintenance': { ar: 'الصيانة', en: 'Maintenance' },
  'dash.inventory': { ar: 'المخزون', en: 'Inventory' },
  'dash.requests': { ar: 'الطلبات', en: 'Requests' },
  'dash.settings': { ar: 'الإعدادات', en: 'Settings' },
  
  'dash.records': { ar: 'السجلات الطبية', en: 'Medical Records' },
  'dash.shifts': { ar: 'المناوبات', en: 'Shifts' },

  // Actions
  'action.add': { ar: 'إضافة', en: 'Add' },
  'action.edit': { ar: 'تعديل', en: 'Edit' },
  'action.delete': { ar: 'حذف', en: 'Delete' },
  'action.save': { ar: 'حفظ', en: 'Save' },
  'action.cancel': { ar: 'إلغاء', en: 'Cancel' },
  'action.approve': { ar: 'موافقة', en: 'Approve' },
  'action.reject': { ar: 'رفض', en: 'Reject' },
  'action.view': { ar: 'عرض', en: 'View' },
  'action.close': { ar: 'إغلاق', en: 'Close' },

  // Status
  'status.pending': { ar: 'قيد الانتظار', en: 'Pending' },
  'status.approved': { ar: 'موافق عليه', en: 'Approved' },
  'status.rejected': { ar: 'مرفوض', en: 'Rejected' },
  'status.delivered': { ar: 'تم التسليم', en: 'Delivered' },
  'status.completed': { ar: 'مكتمل', en: 'Completed' },
  'status.purchase': { ar: 'طلب شراء', en: 'Purchase Request' },

  // Colleges mega menu
  'college.informatics': { ar: 'كلية الهندسة المعلوماتية', en: 'Faculty of Informatics Engineering' },
  'college.civil': { ar: 'كلية الهندسة المدنية', en: 'Faculty of Civil Engineering' },
  'college.mechanical': { ar: 'كلية الهندسة الميكانيكية', en: 'Faculty of Mechanical Engineering' },
  'college.electrical': { ar: 'كلية الهندسة الكهربائية', en: 'Faculty of Electrical Engineering' },
  'college.architecture': { ar: 'كلية الهندسة المعمارية', en: 'Faculty of Architecture' },
  'college.biomedical': { ar: 'كلية الهندسة الطبية', en: 'Faculty of Biomedical Engineering' },
  'college.textile': { ar: 'كلية الهندسة النسيجية', en: 'Faculty of Textile Engineering' },
  'college.medicine': { ar: 'كلية الطب البشري', en: 'Faculty of Medicine' },
  'college.dentistry': { ar: 'كلية طب الأسنان', en: 'Faculty of Dentistry' },
  'college.pharmacy': { ar: 'كلية الصيدلة', en: 'Faculty of Pharmacy' },
  'college.nursing': { ar: 'كلية التمريض', en: 'Faculty of Nursing' },
  'college.science': { ar: 'كلية العلوم', en: 'Faculty of Sciences' },
  'college.arts': { ar: 'كلية الآداب والعلوم الإنسانية', en: 'Faculty of Arts & Humanities' },
  'college.law': { ar: 'كلية الحقوق', en: 'Faculty of Law' },
  'college.economics': { ar: 'كلية الاقتصاد', en: 'Faculty of Economics' },
  'college.agriculture': { ar: 'كلية الزراعة', en: 'Faculty of Agriculture' },
  'college.education': { ar: 'كلية التربية', en: 'Faculty of Education' },
  'college.sharia': { ar: 'كلية الشريعة', en: 'Faculty of Sharia' },
  'college.finearts': { ar: 'كلية الفنون الجميلة', en: 'Faculty of Fine Arts' },
  'college.physical': { ar: 'كلية التربية الرياضية', en: 'Faculty of Physical Education' },
  'college.music': { ar: 'المعهد العالي للموسيقا', en: 'Higher Institute of Music' },
  'college.technical': { ar: 'المعهد التقاني', en: 'Technical Institute' },
  'college.languages': { ar: 'معهد اللغات', en: 'Languages Institute' },
  'college.vet': { ar: 'كلية الطب البيطري', en: 'Faculty of Veterinary Medicine' },
  'college.political': { ar: 'كلية العلوم السياسية', en: 'Faculty of Political Science' },
  'college.tourism': { ar: 'كلية السياحة', en: 'Faculty of Tourism' },
  'college.it': { ar: 'كلية الهندسة التقنية', en: 'Faculty of Technical Engineering' },
  'college.petroleum': { ar: 'كلية هندسة البترول', en: 'Faculty of Petroleum Engineering' },
  'college.chemical': { ar: 'كلية الهندسة الكيميائية', en: 'Faculty of Chemical Engineering' },
  'college.math': { ar: 'كلية الرياضيات', en: 'Faculty of Mathematics' },
  'college.media': { ar: 'كلية الإعلام', en: 'Faculty of Media' },

  // Hospitals
  'hospital.title': { ar: 'المستشفيات الجامعية', en: 'University Hospitals' },
  'hospital.university': { ar: 'مشفى حلب الجامعي', en: 'Aleppo University Hospital' },
  'hospital.maternity': { ar: 'مستشفى التوليد و أمراض النساء الجامعي', en: 'University Obstetrics and Gynecology Hospital' },
  'hospital.children': { ar: 'مشفى أمراض و جراحة القلب الجامعي', en: 'University Children Hospital' },
  'hospital.eye': { ar: 'مشفى جراحة الفم و الفكين', en: 'Oral and Maxillofacial Hospital' },
  'hospital.services': { ar: 'خدماتنا الطبية', en: 'Our Medical Services' },
  'hospital.bookAppointment': { ar: 'حجز موعد', en: 'Book Appointment' },
  'hospital.doctors': { ar: 'الأطباء', en: 'Doctors' },
  'hospital.clinics': { ar: 'العيادات', en: 'Clinics' },

  //Directorate
  'directorate.title':{ar:'المديريات',en:'Directorate'},
  'directorate.name':{ar:'المديريات',en:'Directorate:'},

  //Centers
  'center.title':{ar:'المراكز', en:'Centers'},
  'center.name':{ar:'المراكز',en:'Centers'},

  // Events
  'events.title': { ar: 'الفعاليات والأنشطة', en: 'Events & Activities' },
  'events.upcoming': { ar: 'الفعاليات القادمة', en: 'Upcoming Events' },

  // Contact
  'contact.title': { ar: 'تواصل معنا', en: 'Contact Us' },
  'contact.name': { ar: 'الاسم', en: 'Name' },
  'contact.message': { ar: 'الرسالة', en: 'Message' },
  'contact.send': { ar: 'إرسال', en: 'Send' },
  'contact.phone': { ar: 'الهاتف', en: 'Phone' },

  // College page
  'collegePage.about': { ar: 'عن الكلية', en: 'About the College' },
  'collegePage.departments': { ar: 'الأقسام', en: 'Departments' },
  'collegePage.faculty': { ar: 'أعضاء الهيئة التدريسية', en: 'Faculty Members' },
  'collegePage.courses': { ar: 'المقررات الدراسية', en: 'Courses' },
  'collegePage.labs': { ar: 'المخابر', en: 'Laboratories' },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Lang>(() => {
    return (localStorage.getItem('lang') as Lang) || 'ar';
  });

  const dir = lang === 'ar' ? 'rtl' : 'ltr';

  const t = useCallback((key: string): string => {
    return translations[key]?.[lang] || key;
  }, [lang]);

  const toggleLang = useCallback(() => {
    setLangState(prev => {
      const next = prev === 'ar' ? 'en' : 'ar';
      localStorage.setItem('lang', next);
      document.documentElement.dir = next === 'ar' ? 'rtl' : 'ltr';
      document.documentElement.lang = next;
      return next;
    });
  }, []);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    localStorage.setItem('lang', l);
    document.documentElement.dir = l === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = l;
  }, []);

  React.useEffect(() => {
    document.documentElement.dir = dir;
    document.documentElement.lang = lang;
  }, [dir, lang]);

  return (
    <LanguageContext.Provider value={{ lang, dir, t, toggleLang, setLang }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
};
