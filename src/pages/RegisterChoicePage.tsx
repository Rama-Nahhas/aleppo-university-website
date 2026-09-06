import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Globe, GraduationCap, School, User, BookOpen } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const RegisterChoicePage: React.FC = () => {
  const { lang, toggleLang } = useLanguage();
  const navigate = useNavigate();
  const isArabic = lang === 'ar';

  // إذا في تسجيل دكتور معلّق ولسا ما تم التحقق من إيميلو، ماله معنى
  // يرجع يختار نوع الحساب من جديد - نكمّل معه من نفس النقطة يلي وقف فيها
  useEffect(() => {
    const pendingEmail = sessionStorage.getItem('pendingDoctorOtpEmail');
    if (pendingEmail) {
      navigate('/register/doctor/verify', {
        state: { email: pendingEmail },
        replace: true,
      });
    }
  }, [navigate]);

  return (
    <div
      className="min-h-screen flex items-center justify-center text-gray-800 p-4"
      dir={isArabic ? 'rtl' : 'ltr'}
    >
      <div dir="ltr" className="absolute top-4 left-4 right-4 flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/login")}
          className="gap-2 border border-[#d9a928]/70 bg-[#0b1e48] text-white shadow-md transition-all duration-200 hover:border-[#d9a928] hover:bg-[#d9a928] hover:text-[#0b1e48] hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d9a928] focus-visible:ring-offset-2"
        >
          <ArrowLeft className="w-4 h-4" />
          {lang === "ar" ? 'العودة' : 'Back'}
        </Button>

        <Button variant="ghost" size="sm" onClick={toggleLang} className="gap-2 border border-[#d9a928]/70 bg-[#0b1e48] text-white shadow-md transition-all duration-200 hover:border-[#d9a928] hover:bg-[#d9a928] hover:text-[#0b1e48] hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d9a928] focus-visible:ring-offset-2">
          <Globe className="w-4 h-4" />
          {lang === "ar" ? "English" : "العربية"}
        </Button>
      </div>

      <main className="w-full max-w-4xl rounded-2xl border border-white/20 p-6 text-center shadow-2xl backdrop-blur-md sm:p-10 md:p-14">
        <div className="mb-10 flex flex-col items-center">
          <div className="mx-auto mb-5 flex h-[120px] w-[120px] items-center justify-center sm:h-[140px] sm:w-[140px]">
            <img
              src="..\public\favicon.ico"
              alt="جامعة حلب"
              className="h-full w-full object-contain"
            />
          </div>
          <h1 className="mb-3 text-3xl font-bold text-[#00113a] sm:text-4xl">
            {isArabic ? 'إنشاء حساب جديد' : 'Create New Account'}
          </h1>
          <p className="text-base text-gray-600 sm:text-lg">
            {isArabic ? 'اختر النوع الذي يناسبك للمتابعة' : 'Choose the type that suits you to continue'}
          </p>
        </div>

        <div className="mb-10 grid grid-cols-1 gap-8 md:grid-cols-2">
          <Link
            to="/register/doctor"
            className="group flex min-h-[240px] flex-col items-center rounded-xl border border-gray-300 bg-white/70 p-8 transition-all duration-300 hover:border-[#00113a]/50 hover:bg-white hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#00113a] sm:p-10"
          >
            <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-xl bg-blue-100/80 transition-colors group-hover:bg-blue-100">
              <BookOpen className="h-11 w-11 text-[#00113a]" />
            </div>
            <h2 className="mb-3 text-2xl font-bold text-[#00113a]">
              {isArabic ? 'أستاذ' : 'Professor'}
            </h2>
            <p className="max-w-xs text-sm leading-relaxed text-gray-500 sm:text-base">
              {isArabic ? 'إنشاء حساب دكتور أو أستاذ جامعي' : 'Create a doctor or university professor account'}
            </p>
          </Link>

          <Link
            to="/register/student"
            className="group flex min-h-[240px] flex-col items-center rounded-xl border border-gray-300 bg-white/70 p-8 transition-all duration-300 hover:border-[#00113a]/50 hover:bg-white hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#00113a] sm:p-10"
          >
            <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-xl bg-blue-100/80 transition-colors group-hover:bg-blue-100">
              <User className="h-11 w-11 text-[#00113a]" />
            </div>
            <h2 className="mb-3 text-2xl font-bold text-[#00113a]">
              {isArabic ? 'طالب' : 'Student'}
            </h2>
            <p className="max-w-xs text-sm leading-relaxed text-gray-500 sm:text-base">
              {isArabic ? 'إنشاء حساب طالب للالتحاق بالمنصة' : 'Create a student account to join the platform'}
            </p>
          </Link>
        </div>

        <div className="text-base text-gray-600 sm:text-lg">
          {isArabic ? 'لديك حساب بالفعل؟' : 'Already have an account?'}{' '}
          <Link to="/login" className="text-[#00113a] font-bold hover:underline transition-all">
            {isArabic ? 'تسجيل الدخول' : 'Sign in'}
          </Link>
        </div>
      </main>
    </div>
  );
};

export default RegisterChoicePage;
