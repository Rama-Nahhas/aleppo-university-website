import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Globe, GraduationCap, School, User ,BookOpen } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const RegisterChoicePage: React.FC = () => {
  const { lang, toggleLang } = useLanguage();
  const navigate = useNavigate();
  const isArabic = lang === 'ar';

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-[#06266d] text-gray-800 p-4"
      dir={isArabic ? 'rtl' : 'ltr'}
    >
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/login')}
          className="gap-1 bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          {isArabic ? 'العودة' : 'Back'}
        </Button>

        <Button variant="ghost" size="sm" onClick={toggleLang} className="gap-1 bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm">
          <Globe className="w-4 h-4" />
          {isArabic ? 'English' : 'العربية'}
        </Button>
      </div>

      <main className="w-full max-w-2xl bg-[#e5e7eb]/90 backdrop-blur-md rounded-2xl p-8 md:p-12 shadow-2xl border border-white/20 text-center">
        <div className="flex flex-col items-center mb-8">
          <div className="mx-auto mb-4 flex h-[100px] w-[100px] items-center justify-center">
            <img
              src="..\public\favicon.ico"
              alt="جامعة حلب"
              className="h-full w-full object-contain"
            />
          </div>
          <h1 className="text-3xl font-bold text-[#00113a] mb-2">
            {isArabic ? 'إنشاء حساب جديد' : 'Create New Account'}
          </h1>
          <p className="text-gray-600 text-sm md:text-base">
            {isArabic ? 'اختر النوع الذي يناسبك للمتابعة' : 'Choose the type that suits you to continue'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Link
            to="/register/doctor"
            className="group bg-white/70 hover:bg-white border border-gray-300 hover:border-[#00113a]/50 rounded-xl p-6 flex flex-col items-center transition-all duration-300 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#00113a]"
          >
            <div className="w-16 h-16 rounded-xl bg-blue-100/80 group-hover:bg-blue-100 flex items-center justify-center mb-4 transition-colors">
              <BookOpen className="w-9 h-9 text-[#00113a]" />
            </div>
            <h2 className="text-xl font-bold text-[#00113a] mb-2">
              {isArabic ? 'أستاذ' : 'Professor'}
            </h2>
            <p className="text-xs text-gray-500 leading-relaxed">
              {isArabic ? 'إنشاء حساب دكتور أو أستاذ جامعي' : 'Create a doctor or university professor account'}
            </p>
          </Link>

          <Link
            to="/register/student"
            className="group bg-white/70 hover:bg-white border border-gray-300 hover:border-[#00113a]/50 rounded-xl p-6 flex flex-col items-center transition-all duration-300 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#00113a]"
          >
            <div className="w-16 h-16 rounded-xl bg-blue-100/80 group-hover:bg-blue-100 flex items-center justify-center mb-4 transition-colors">
              <User className="w-9 h-9 text-[#00113a]" />
            </div>
            <h2 className="text-xl font-bold text-[#00113a] mb-2">
              {isArabic ? 'طالب' : 'Student'}
            </h2>
            <p className="text-xs text-gray-500 leading-relaxed">
              {isArabic ? 'إنشاء حساب طالب للالتحاق بالمنصة' : 'Create a student account to join the platform'}
            </p>
          </Link>
        </div>

        <div className="text-sm text-gray-600">
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
