import React, { useEffect, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Globe,
  ArrowLeft,
  IdCard,
  Calendar,
  Contact,
  Mail,
  Phone,
  Lock,
  GraduationCap,
  CreditCard,
  Building,
  Bookmark,
  UserPlus,
  MapPin,
  FileCheck,
  User,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { useAuthActions, UserData } from "@/hooks/useAuthActions";
import {
  NamedOption,
  useCollegeLookups,
} from "@/hooks/students/useApiActions";

const COLLEGE_ID = 1;

export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  department_id: string;
  year_id: string;
  student_number: string;
  admission_type: string;
  birth_date: string;
  phone: string;
  address: string;
}

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { lang, t, toggleLang } = useLanguage();
  const { handleRegisterStu, isSubmitting, error } = useAuthActions();
  const { fetchDepartments } = useCollegeLookups();
  const [departments, setDepartments] = useState<NamedOption[]>([]);

  useEffect(() => {
    const loadDepartments = async () => {
      const data = await fetchDepartments(COLLEGE_ID);
      setDepartments(data);
    };
    loadDepartments();
  }, []);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      password_confirmation: "",
      department_id: "",
      year_id: "",
      student_number: "",
      admission_type: "",
      birth_date: "",
      phone: "",
      address: "",
    },
  });
  const onSubmit = async (values: RegisterFormData): Promise<void> => {
    await handleRegisterStu(
      values as unknown as Record<string, string>,
      (userData: UserData) => {
        toast({
          title: lang === "ar" ? "تم إنشاء الحساب بنجاح" : "Account Created",
          description:
            lang === "ar"
              ? `مرحباً ${userData.name}`
              : `Welcome ${userData.name}`,
          className: "bg-green-600 text-white font-semibold",
        });

        navigate("/dashboard");
      },
    );
  };

  return (

    <div
      className="min-h-screen flex flex-col relative overflow-hidden"
      dir={lang === "ar" ? "rtl" : "ltr"}
    >
      {/* Top buttons */}
      <div dir="ltr" className="absolute top-4 left-4 right-4 flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/login')}
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
      {/* Main Container */}
      <div className="w-full max-w-2xl mx-auto rounded-2xl p-6 md:p-8 shadow-2xl my-auto z-10">
        {/* Logo & Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-block ">
            <div className="mx-auto w-16 h-16 bg-gradient-to-tr from-sky-500 to-indigo-500 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-sky-500/20">
              <User className="w-9 h-9 text-[#00113a]" />
            </div>
          </Link>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#0b1e48] mb-1">
            {lang === "ar" ? "إنشاء حساب طالب جديد" : "Create New Student Account"}
          </h1>
          <p className="text-sm font-medium text-slate-500">
            {lang === "ar"
              ? "يرجى إدخال بياناتك بدقة للانضمام إلى المنصة التعليمية"
              : "Please enter your details accurately to join the learning platform"}
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Section 1: المعلومات الشخصية */}
          <Card className="border-0 shadow-sm bg-white rounded-xl">
            <CardHeader className="pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2 text-[#1e293b] font-bold text-base">
                <User className="w-5 h-5 text-slate-700" />
                <span>{lang === "ar" ? "المعلومات الشخصية" : "Personal Information"}</span>
              </div>
            </CardHeader>
            <CardContent className="pt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Full Name */}
              <div className="space-y-1.5 md:col-span-2">
                <Label htmlFor="name" className="text-xs text-slate-900 font-medium">
                  {(lang === "ar" ? "الاسم الكامل" : "Full Name")}
                </Label>
                <div className="relative flex items-center">
                  <IdCard className="w-4 h-4 absolute right-3 text-slate-400 pointer-events-none rtl:right-3 ltr:left-3" />
                  <Input
                    id="name"
                    placeholder={lang === "ar" ? "أدخل اسمك الثلاثي" : "Enter your full name"}
                    className="bg-slate-100/70 border-slate-200 text-xs pr-9 rtl:pr-9 ltr:pl-9 ltr:pr-3 focus-visible:ring-[#0b1e48]"
                    {...register("name", { required: true })}
                  />
                </div>
              </div>

              {/* Birth Date */}
              <div className="space-y-1.5">
                <Label htmlFor="birth_date" className="text-xs text-slate-900 font-medium">
                  {lang === "ar" ? "تاريخ الميلاد" : "Birth Date"}
                </Label>
                <div className="relative flex items-center">
                  <Calendar className="w-4 h-4 absolute right-3 text-slate-400 pointer-events-none rtl:right-3 ltr:left-3" />
                  <Input
                    id="birth_date"
                    type="date"
                    className="bg-slate-100/70 border-slate-200 text-xs pr-9 rtl:pr-9 ltr:pl-9 ltr:pr-3 focus-visible:ring-[#0b1e48]"
                    {...register("birth_date", { required: true })}
                  />
                </div>
              </div>

              {/* Address */}
              <div className="space-y-1.5">
                <Label htmlFor="address" className="text-xs text-slate-900 font-medium">
                  {lang === "ar" ? "العنوان" : "Address"}
                </Label>
                <div className="relative flex items-center">
                  <MapPin className="w-4 h-4 absolute right-3 text-slate-400 pointer-events-none rtl:right-3 ltr:left-3" />
                  <Input
                    id="address"
                    type="text"
                    placeholder={lang === "ar" ? "حلب - الفرقان" : "Aleppo - Al Furqan"}
                    className="bg-slate-100/70 border-slate-200 text-xs pr-9 rtl:pr-9 ltr:pl-9 ltr:pr-3 focus-visible:ring-[#0b1e48]"
                    {...register("address", { required: true })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Section 2: معلومات الاتصال والأمان */}
          <Card className="border-0 shadow-sm bg-white rounded-xl">
            <CardHeader className="pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2 text-[#1e293b] font-bold text-base">
                <Contact className="w-5 h-5 text-slate-700" />
                <span>{lang === "ar" ? "معلومات الاتصال والأمان" : "Contact & Security Information"}</span>
              </div>
            </CardHeader>
            <CardContent className="pt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Email */}
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-xs text-slate-900 font-medium">
                  {t("email") ?? (lang === "ar" ? "البريد الإلكتروني" : "Email")}
                </Label>
                <div className="relative flex items-center">
                  <Mail className="w-4 h-4 absolute right-3 text-slate-400 pointer-events-none rtl:right-3 ltr:left-3" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="user@aleppo.edu"
                    className="bg-slate-100/70 border-slate-200 text-xs pr-9 rtl:pr-9 ltr:pl-9 ltr:pr-3 focus-visible:ring-[#0b1e48]"
                    {...register("email", { required: true })}
                  />
                </div>
              </div>

              {/* Phone */}
              <div className="space-y-1.5">
                <Label htmlFor="phone" className="text-xs text-slate-900 font-medium">
                  {lang === "ar" ? "رقم الهاتف" : "Phone Number"}
                </Label>
                <div className="relative flex items-center">
                  <Phone className="w-4 h-4 absolute right-3 text-slate-400 pointer-events-none rtl:right-3 ltr:left-3" />
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="09XX XXX XXX"
                    className="bg-slate-100/70 border-slate-200 text-xs pr-9 rtl:pr-9 ltr:pl-9 ltr:pr-3 focus-visible:ring-[#0b1e48]"
                    {...register("phone", { required: true })}
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-xs text-slate-900 font-medium">
                  {(lang === "ar" ? "كلمة المرور" : "Password")}
                </Label>
                <div className="relative flex items-center">
                  <Lock className="w-4 h-4 absolute right-3 text-slate-400 pointer-events-none rtl:right-3 ltr:left-3" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    className="bg-slate-100/70 border-slate-200 text-xs pr-9 rtl:pr-9 ltr:pl-9 ltr:pr-3 focus-visible:ring-[#0b1e48]"
                    {...register("password", { required: true })}
                  />
                </div>
              </div>

              {/* Password Confirmation */}
              <div className="space-y-1.5">
                <Label htmlFor="password_confirmation" className="text-xs text-slate-900 font-medium">
                  {(lang === "ar" ? "تأكيد كلمة المرور" : "Confirm Password")}
                </Label>
                <div className="relative flex items-center">
                  <Lock className="w-4 h-4 absolute right-3 text-slate-400 pointer-events-none rtl:right-3 ltr:left-3" />
                  <Input
                    id="password_confirmation"
                    type="password"
                    placeholder="••••••••"
                    className="bg-slate-100/70 border-slate-200 text-xs pr-9 rtl:pr-9 ltr:pl-9 ltr:pr-3 focus-visible:ring-[#0b1e48]"
                    {...register("password_confirmation", { required: true })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Section 3: التفاصيل الأكاديمية */}
          <Card className="border-0 shadow-sm bg-white rounded-xl">
            <CardHeader className="pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2 text-[#1e293b] font-bold text-base">
                <GraduationCap className="w-5 h-5 text-slate-700" />
                <span>{lang === "ar" ? "التفاصيل الأكاديمية" : "Academic Details"}</span>
              </div>
            </CardHeader>
            <CardContent className="pt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Department Select */}
              <div className="space-y-1.5">
                <Label className="text-xs text-slate-900 font-medium">
                  {lang === "ar" ? "القسم" : "Department"}
                </Label>
                <Controller
                  control={control}
                  name="department_id"
                  rules={{ required: true }}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="bg-slate-100/70 border-slate-200 text-xs focus:ring-[#0b1e48]">
                        <div className="flex items-center gap-2">
                          <Building className="w-4 h-4 text-slate-400" />
                          <SelectValue
                            placeholder={lang === "ar" ? "اختر القسم" : "Select Department"}
                          />
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                        {departments.map((dep) => (
                          <SelectItem key={dep.id} value={String(dep.id)}>
                            {dep.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              {/* Year Select */}
              <div className="space-y-1.5">
                <Label className="text-xs text-slate-900 font-medium">
                  {lang === "ar" ? "السنة" : "Year"}
                </Label>
                <Controller
                  control={control}
                  name="year_id"
                  rules={{ required: true }}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="bg-slate-100/70 border-slate-200 text-xs focus:ring-[#0b1e48]">
                        <div className="flex items-center gap-2">
                          <Bookmark className="w-4 h-4 text-slate-400" />
                          <SelectValue
                            placeholder={lang === "ar" ? "اختر السنة" : "Select Year"}
                          />
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">{lang === "ar" ? "السنة الأولى" : "First Year"}</SelectItem>
                        <SelectItem value="2">{lang === "ar" ? "السنة الثانية" : "Second Year"}</SelectItem>
                        <SelectItem value="3">{lang === "ar" ? "السنة الثالثة" : "Third Year"}</SelectItem>
                        <SelectItem value="4">{lang === "ar" ? "السنة الرابعة" : "Fourth Year"}</SelectItem>
                        <SelectItem value="5">{lang === "ar" ? "السنة الخامسة" : "Fifth Year"}</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              {/* Student Number */}
              <div className="space-y-1.5">
                <Label htmlFor="student_number" className="text-xs text-slate-900 font-medium">
                  {lang === "ar" ? "الرقم الجامعي" : "Student Number"}
                </Label>
                <div className="relative flex items-center">
                  <CreditCard className="w-4 h-4 absolute right-3 text-slate-400 pointer-events-none rtl:right-3 ltr:left-3" />
                  <Input
                    id="student_number"
                    type="text"
                    placeholder="0000"
                    className="bg-slate-100/70 border-slate-200 text-xs pr-9 rtl:pr-9 ltr:pl-9 ltr:pr-3 focus-visible:ring-[#0b1e48]"
                    {...register("student_number", { required: true })}
                  />
                </div>
              </div>

              {/* Admission Type Select */}
              <div className="space-y-1.5">
                <Label className="text-xs text-slate-900 font-medium">
                  {lang === "ar" ? "نوع القبول" : "Admission Type"}
                </Label>
                <Controller
                  control={control}
                  name="admission_type"
                  rules={{ required: true }}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="bg-slate-100/70 border-slate-200 text-xs focus:ring-[#0b1e48]">
                        <div className="flex items-center gap-2">
                          <FileCheck className="w-4 h-4 text-slate-400" />
                          <SelectValue
                            placeholder={
                              lang === "ar" ? "اختر نوع القبول" : "Select admission type"
                            }
                          />
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="عام">
                          {lang === "ar" ? "عام" : "General"}
                        </SelectItem>
                        <SelectItem value="خاص">
                          {lang === "ar" ? "خاص" : "Private"}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Error Message Display */}
          {error && (
            <p className="text-xs text-red-600 font-medium bg-red-50 p-3 rounded-lg border border-red-200 text-center">
              {error}
            </p>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col items-center gap-3 pt-2">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-[#0b1e48] hover:bg-[#162a5a] text-white font-bold px-8 py-2.5 h-auto rounded-lg text-sm flex items-center gap-2 transition-all shadow-md hover:shadow-lg w-full md:w-auto"
            >
              <UserPlus className="w-4 h-4" />
              {isSubmitting
                ? lang === "ar"
                  ? "جاري إنشاء الحساب..."
                  : "Creating Account..."
                : lang === "ar"
                  ? "إنشاء الحساب"
                  : "Create Account"}
            </Button>

            <div className="text-xs text-slate-600 font-medium">
              {lang === "ar" ? "هل لديك حساب؟" : "Already have an account?"}{" "}
              <Link
                to="/login"
                className="text-[#0b1e48] hover:underline font-bold transition-colors"
              >
                {lang === "ar" ? "تسجيل الدخول" : "Login"}
              </Link>
            </div>
          </div>
        </form>
      </div>


    </div>
  );
};

export default RegisterPage;
