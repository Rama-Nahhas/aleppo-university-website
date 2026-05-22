import React , { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';
import { colleges, departments, courses, laboratories, users } from '@/data/mockData';
import { Building2, BookOpen, FlaskConical, Users, ArrowLeft } from 'lucide-react';

const CollegePage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { lang, t } = useLanguage();

  const college = colleges.find(c => c.slug === slug);
  if (!college) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-primary mb-4">{lang === 'ar' ? 'الكلية غير موجودة' : 'College not found'}</h1>
        <Link to="/" className="text-accent hover:underline">{lang === 'ar' ? 'العودة للرئيسية' : 'Back to Home'}</Link>
      </div>
    );
  }

  const collegeDepts = departments.filter(d => d.college_id === college.id);
  const deptIds = collegeDepts.map(d => d.id);
  const collegeCourses = courses.filter(c => deptIds.includes(c.department_id));
  const collegeLabs = laboratories.filter(l => deptIds.includes(l.department_id));
  const facultyMembers = users.filter(u => u.role_id === 2 && u.college_id === college.id);
  const [selectedYear, setSelectedYear] = useState(1);
  const filteredCourses = collegeCourses.filter(
  c => c.year === selectedYear
);

  return (
    <div>
      {/* Hero */}
      <section className="bg-primary text-primary-foreground py-16">
        <div className="max-w-7xl mx-auto px-4">
          <Link to="/" className="inline-flex items-center gap-1 text-sm opacity-70 hover:opacity-100 mb-4">
            <ArrowLeft className="w-4 h-4" />
            {lang === 'ar' ? 'العودة' : 'Back'}
          </Link>
          <h1 className="text-3xl md:text-4xl font-extrabold">{lang === 'ar' ? college.name : college.nameEn}</h1>
          <p className="mt-3 opacity-80 max-w-2xl">{lang === 'ar' ? college.description : college.descriptionEn}</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-12 space-y-12">
        {/* About */}
        <section>
          <h2 className="text-2xl font-bold text-primary mb-4 flex items-center gap-2">
            <Building2 className="w-6 h-6" />
            {t('collegePage.about')}
          </h2>
          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <p className="text-muted-foreground leading-relaxed">
                {lang === 'ar' ? college.description : college.descriptionEn}
                {' '}
                {lang === 'ar'
                  ? `تضم الكلية ${collegeDepts.length} أقسام أكاديمية و${collegeCourses.length} مقرراً دراسياً و${collegeLabs.length} مخبراً بحثياً.`
                  : `The college includes ${collegeDepts.length} academic departments, ${collegeCourses.length} courses, and ${collegeLabs.length} research laboratories.`}
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Departments */}
        {collegeDepts.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-primary mb-4 flex items-center gap-2">
              <Building2 className="w-6 h-6" />
              {t('collegePage.departments')}
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {collegeDepts.map(d => (
                <Card key={d.id} className="border-0 shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-5">
                    <h3 className="font-bold text-foreground">{lang === 'ar' ? d.name : d.nameEn}</h3>
                   {/* <p className="text-xs text-muted-foreground mt-1">
                      {courses.filter(c => c.department_id === d.id).length} {lang === 'ar' ? 'مقرر' : 'courses'}
                    </p> */}
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Faculty */}
        {facultyMembers.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-primary mb-4 flex items-center gap-2">
              <Users className="w-6 h-6" />
              {t('collegePage.faculty')}
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {facultyMembers.map(f => (
                <Card key={f.id} className="border-0 shadow-sm">
                  <CardContent className="p-5 flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <Users className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground">{lang === 'ar' ? f.name : f.nameEn}</h3>
                      <p className="text-xs text-muted-foreground">{f.email}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Courses */}
        {collegeCourses.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-primary mb-4 flex items-center gap-2">
              <BookOpen className="w-6 h-6" />
              {t('collegePage.courses')}
            </h2>
            {/* سنوات الكلية */}
<div className="flex flex-wrap gap-3 mb-6">

  {Array.from({ length: college.years }, (_, index) => (
    <button
      key={index}
      onClick={() => setSelectedYear(index + 1)}
      className={`px-4 py-2 rounded-lg font-semibold transition-colors
      ${
        selectedYear === index + 1
          ? 'bg-yellow-500 text-black'
          : 'bg-muted hover:bg-yellow-100'
      }`}
    >
      السنة {index + 1}
    </button>
  ))}

</div>

{/* مقررات السنة المختارة */}
<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">

  {filteredCourses.map(c => {
    const doctor = users.find(u => u.id === c.doctor_id);

    return (
      <Card key={c.id} className="border-0 shadow-sm">
        <CardContent className="p-5">

          <h3 className="font-bold text-foreground">
            {lang === 'ar' ? c.name : c.nameEn}
          </h3>

          <p className="text-xs text-muted-foreground mt-1">
            {lang === 'ar' ? 'المدرس: ' : 'Instructor: '}
            {lang === 'ar' ? doctor?.name : doctor?.nameEn}
          </p>

        </CardContent>
      </Card>
    );
  })}

</div>
          </section>
        )}

        {/* Labs */}
        {collegeLabs.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-primary mb-4 flex items-center gap-2">
              <FlaskConical className="w-6 h-6" />
              {t('collegePage.labs')}
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {collegeLabs.map(l => (
                <Card key={l.id} className="border-0 shadow-sm">
                  <CardContent className="p-5">
                    <h3 className="font-bold text-foreground">{lang === 'ar' ? l.name : l.nameEn}</h3>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default CollegePage;
