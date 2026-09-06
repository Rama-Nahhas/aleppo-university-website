import React, { useEffect, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  GraduationCap,
  Globe,
  ArrowLeft,
  Eye,
  EyeOff,
  User,
  Mail,
  Lock,
  Award,
  Building,
  BookOpen,
  Briefcase,
  Calendar,
  History
} from "lucide-react";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { useAuthActions } from "@/hooks/useAuthActions";

export interface DoctorRegisterFormData {
  name: string;
  email: string;
  password: string;
  specialization: string;
  university: string;
  graduation_year: string;
  employment_year: string;
  work_history: string;
}

const DoctorRegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { lang, toggleLang } = useLanguage();
  const { handleRegisterDoctor, isSubmitting, error } = useAuthActions();
  const [showPassword, setShowPassword] = useState(false);

  // إذا كان في تسجيل سابق لسه ما تحقق فيه بالكود (OTP)، رجّعه فوراً
  // لصفحة التحقق بدل ما يبلّش تسجيل من جديد
  useEffect(() => {
    const pendingEmail = sessionStorage.getItem("pendingDoctorOtpEmail");
    if (pendingEmail) {
      navigate("/register/doctor/verify", {
        state: { email: pendingEmail },
        replace: true,
      });
    }
  }, [navigate]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DoctorRegisterFormData>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      specialization: "",
      university: "",
      graduation_year: "",
      employment_year: "",
      work_history: "",
    },
  });

  const onSubmit = async (values: DoctorRegisterFormData): Promise<void> => {
    const payload = {
      ...values,
      role: "doctor",
    };

    await handleRegisterDoctor(
      payload as unknown as Record<string, string>,
      (result) => {
        toast({
          title:
            lang === "ar"
              ? "تم إنشاء حساب الدكتور بنجاح"
              : "Doctor Account Created",
          description: result.message,
          className: "bg-green-600 text-white font-semibold",
        });

        sessionStorage.setItem("pendingDoctorOtpEmail", result.email);
        navigate("/register/doctor/verify", {
          state: { email: result.email },
        });
      },
    );
  };

  const requiredMessage =
    lang === "ar" ? "هذا الحقل مطلوب" : "This field is required";

  return (
    // <div
    //   className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-accent/10 p-4"
    //   dir={lang === "ar" ? "rtl" : "ltr"}
    // >
    //   <div className="absolute top-4 right-4">
    //     <Button
    //       variant="ghost"
    //       size="sm"
    //       onClick={toggleLang}
    //       className="gap-1 mb-4"
    //     >
    //       <Globe className="w-4 h-4" />
    //       {lang === "ar" ? "English" : "العربية"}
    //     </Button>
    //     <br />
    //     <Link
    //       to="/register"
    //       className="inline-flex items-center gap-1 text-sm opacity-70 hover:opacity-100 mb-4"
    //     >
    //       <ArrowLeft className="w-4 h-4" />
    //       {lang === "ar" ? "العودة" : "Back"}
    //     </Link>
    //   </div>

    //   <Card className="w-full max-w-2xl shadow-2xl border-0 my-8">
    //     <CardHeader className="text-center pb-2">
    //       <Link to="/">
    //         <div className="mx-auto w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mb-4 shadow-lg">
    //           <GraduationCap className="w-8 h-8 text-primary-foreground" />
    //         </div>
    //       </Link>
    //       <CardTitle className="text-2xl font-bold">
    //         {lang === "ar" ? "تسجيل دكتور" : "Doctor Registration"}
    //       </CardTitle>
    //       <CardDescription className="text-base">
    //         {lang === "ar"
    //           ? "أدخل بياناتك لتصبح عضواً في المنصة"
    //           : "Enter your details to join the platform"}
    //       </CardDescription>
    //     </CardHeader>

    //     <CardContent>
    //       {error && (
    //         <div className="mb-4 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-sm text-destructive font-medium">
    //           {error}
    //         </div>
    //       )}

    //       <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
    //         <div className="grid gap-4 md:grid-cols-2">
    //           <div className="space-y-2">
    //             <Label htmlFor="name">{lang === "ar" ? "الاسم" : "Name"}</Label>
    //             <Input
    //               id="name"
    //               placeholder={lang === "ar" ? "د. أحمد" : "Dr. Ahmed"}
    //               {...register("name", { required: requiredMessage })}
    //             />
    //             {errors.name && (
    //               <p className="text-xs text-destructive font-medium">
    //                 {errors.name.message}
    //               </p>
    //             )}
    //           </div>
    //           <div className="space-y-2">
    //             <Label htmlFor="email">
    //               {lang === "ar" ? "البريد الإلكتروني" : "Email"}
    //             </Label>
    //             <Input
    //               id="email"
    //               type="email"
    //               placeholder="doctor@example.com"
    //               {...register("email", {
    //                 required: requiredMessage,
    //                 pattern: {
    //                   value: /^\S+@\S+$/,
    //                   message:
    //                     lang === "ar"
    //                       ? "بريد إلكتروني غير صالح"
    //                       : "Invalid email",
    //                 },
    //               })}
    //             />
    //             {errors.email && (
    //               <p className="text-xs text-destructive font-medium">
    //                 {errors.email.message}
    //               </p>
    //             )}
    //           </div>
    //         </div>
    //         <div className="space-y-2">
    //           <Label htmlFor="password">
    //             {lang === "ar" ? "كلمة المرور" : "Password"}
    //           </Label>
    //           <div className="relative">
    //             <Input
    //               id="password"
    //               type={showPassword ? "text" : "password"}
    //               placeholder="••••••••"
    //               {...register("password", {
    //                 required: requiredMessage,
    //                 minLength: {
    //                   value: 6,
    //                   message:
    //                     lang === "ar"
    //                       ? "كلمة المرور قصيرة"
    //                       : "Password is too short",
    //                 },
    //               })}
    //             />
    //             <button
    //               type="button"
    //               className={`absolute ${lang === "ar" ? "left-3" : "right-3"} top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground`}
    //               onClick={() => setShowPassword(!showPassword)}
    //             >
    //               {showPassword ? (
    //                 <EyeOff className="w-4 h-4" />
    //               ) : (
    //                 <Eye className="w-4 h-4" />
    //               )}
    //             </button>
    //           </div>
    //           {errors.password && (
    //             <p className="text-xs text-destructive font-medium">
    //               {errors.password.message}
    //             </p>
    //           )}
    //         </div>

    //         <div className="grid gap-4 md:grid-cols-2">
    //           <div className="space-y-2">
    //             <Label htmlFor="specialization">
    //               {lang === "ar" ? "التخصص" : "Specialization"}
    //             </Label>
    //             <Input
    //               id="specialization"
    //               placeholder={lang === "ar" ? "أمراض القلب" : "Cardiology"}
    //               {...register("specialization", { required: requiredMessage })}
    //             />
    //             {errors.specialization && (
    //               <p className="text-xs text-destructive font-medium">
    //                 {errors.specialization.message}
    //               </p>
    //             )}
    //           </div>
    //           <div className="space-y-2">
    //             <Label htmlFor="university">
    //               {lang === "ar" ? "الجامعة" : "University"}
    //             </Label>
    //             <Input
    //               id="university"
    //               placeholder={
    //                 lang === "ar" ? "جامعة دمشق" : "Damascus University"
    //               }
    //               {...register("university", { required: requiredMessage })}
    //             />
    //             {errors.university && (
    //               <p className="text-xs text-destructive font-medium">
    //                 {errors.university.message}
    //               </p>
    //             )}
    //           </div>
    //         </div>

    //         <div className="grid gap-4 md:grid-cols-2">
    //           <div className="space-y-2">
    //             <Label htmlFor="graduation_year">
    //               {lang === "ar" ? "سنة التخرج" : "Graduation Year"}
    //             </Label>
    //             <Input
    //               id="graduation_year"
    //               type="number"
    //               placeholder="2010"
    //               {...register("graduation_year", {
    //                 required: requiredMessage,
    //               })}
    //             />
    //             {errors.graduation_year && (
    //               <p className="text-xs text-destructive font-medium">
    //                 {errors.graduation_year.message}
    //               </p>
    //             )}
    //           </div>
    //           <div className="space-y-2">
    //             <Label htmlFor="employment_year">
    //               {lang === "ar" ? "سنة العمل" : "Employment Year"}
    //             </Label>
    //             <Input
    //               id="employment_year"
    //               type="number"
    //               placeholder="2012"
    //               {...register("employment_year", {
    //                 required: requiredMessage,
    //               })}
    //             />
    //             {errors.employment_year && (
    //               <p className="text-xs text-destructive font-medium">
    //                 {errors.employment_year.message}
    //               </p>
    //             )}
    //           </div>
    //         </div>
    //         <div className="space-y-2">
    //           <Label htmlFor="work_history">
    //             {lang === "ar" ? "سيرة العمل" : "Work History"}
    //           </Label>
    //           <Input
    //             id="work_history"
    //             placeholder={
    //               lang === "ar"
    //                 ? "عملت في المشفى المركزي لمدة 5 سنوات"
    //                 : "Worked at Central Hospital for 5 years"
    //             }
    //             {...register("work_history", { required: requiredMessage })}
    //           />
    //           {errors.work_history && (
    //             <p className="text-xs text-destructive font-medium">
    //               {errors.work_history.message}
    //             </p>
    //           )}
    //         </div>

    //         <Button
    //           className="w-full h-11 text-base font-semibold mt-4"
    //           type="submit"
    //           disabled={isSubmitting}
    //         >
    //           {isSubmitting
    //             ? lang === "ar"
    //               ? "جاري إنشاء الحساب..."
    //               : "Creating Account..."
    //             : lang === "ar"
    //               ? "إنشاء حساب دكتور"
    //               : "Register as Doctor"}
    //         </Button>
    //       </form>
    //     </CardContent>
    //   </Card>
    // </div>
    // <div
    //   className="min-h-screen flex items-center justify-center bg-slate-950 p-4 relative overflow-hidden text-slate-100"
    //   dir={lang === "ar" ? "rtl" : "ltr"}
    // >
    //   {/* Background Decorative Elements */}
    //   <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
    //   <div className="absolute bottom-10 right-10 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

    //   {/* Top Header Controls */}
    //   <div className="absolute top-6 right-6 left-6 flex justify-between items-center max-w-3xl mx-auto z-10">
    //     <Link
    //       to="/register"
    //       className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-slate-200 transition-colors"
    //     >
    //       <ArrowLeft className={`w-4 h-4 ${lang === "ar" ? "rotate-180" : ""}`} />
    //       {lang === "ar" ? "العودة" : "Back"}
    //     </Link>

    //     <Button
    //       variant="ghost"
    //       size="sm"
    //       onClick={toggleLang}
    //       className="gap-2 text-slate-300 hover:text-white hover:bg-slate-900 border border-slate-800 rounded-lg"
    //     >
    //       <Globe className="w-4 h-4 text-sky-400" />
    //       {lang === "ar" ? "English" : "العربية"}
    //     </Button>
    //   </div>

    //   <Card className="w-full max-w-3xl bg-slate-900/80 backdrop-blur-xl border border-slate-800 shadow-2xl rounded-2xl my-16 z-10">
    //     <CardHeader className="text-center pb-6 pt-8">
    //       <Link to="/" className="inline-block">
    //         <div className="mx-auto w-16 h-16 bg-gradient-to-tr from-sky-500 to-indigo-500 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-sky-500/20">
    //           <GraduationCap className="w-9 h-9 text-white" />
    //         </div>
    //       </Link>
    //       <CardTitle className="text-3xl font-bold text-white tracking-tight">
    //         {lang === "ar" ? "تسجيل دكتور محاضر" : "Doctor Registration"}
    //       </CardTitle>
    //       <CardDescription className="text-slate-400 text-base mt-2">
    //         {lang === "ar"
    //           ? "أدخل بياناتك الأكاديمية للانضمام إلى أعضاء الهيئة التدريسية"
    //           : "Enter your academic details to join the faculty staff"}
    //       </CardDescription>
    //     </CardHeader>

    //     <CardContent className="px-6 pb-8">
    //       {error && (
    //         <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-sm text-rose-400 font-medium text-center">
    //           {error}
    //         </div>
    //       )}

    //       <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
    //         {/* Name & Email */}
    //         <div className="grid gap-5 md:grid-cols-2">
    //           <div className="space-y-2">
    //             <Label htmlFor="name" className="text-slate-300">
    //               {lang === "ar" ? "الاسم الكامل" : "Full Name"}
    //             </Label>
    //             <div className="relative">
    //               <User className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 ${lang === "ar" ? "right-3" : "left-3"}`} />
    //               <Input
    //                 id="name"
    //                 className={`bg-slate-950/60 border-slate-800 text-slate-100 placeholder:text-slate-600 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 ${lang === "ar" ? "pr-10" : "pl-10"}`}
    //                 placeholder={lang === "ar" ? "د. أحمد السوري" : "Dr. Ahmad Al-Souri"}
    //                 {...register("name", { required: requiredMessage })}
    //               />
    //             </div>
    //             {errors.name && (
    //               <p className="text-xs text-rose-400 font-medium">
    //                 {errors.name.message as string}
    //               </p>
    //             )}
    //           </div>

    //           <div className="space-y-2">
    //             <Label htmlFor="email" className="text-slate-300">
    //               {lang === "ar" ? "البريد الإلكتروني" : "Email"}
    //             </Label>
    //             <div className="relative">
    //               <Mail className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 ${lang === "ar" ? "right-3" : "left-3"}`} />
    //               <Input
    //                 id="email"
    //                 type="email"
    //                 className={`bg-slate-950/60 border-slate-800 text-slate-100 placeholder:text-slate-600 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 ${lang === "ar" ? "pr-10" : "pl-10"}`}
    //                 placeholder="doctor@example.com"
    //                 {...register("email", {
    //                   required: requiredMessage,
    //                   pattern: {
    //                     value: /^\S+@\S+$/,
    //                     message:
    //                       lang === "ar"
    //                         ? "بريد إلكتروني غير صالح"
    //                         : "Invalid email",
    //                   },
    //                 })}
    //               />
    //             </div>
    //             {errors.email && (
    //               <p className="text-xs text-rose-400 font-medium">
    //                 {errors.email.message as string}
    //               </p>
    //             )}
    //           </div>
    //         </div>

    //         {/* Password Field */}
    //         <div className="space-y-2">
    //           <Label htmlFor="password" className="text-slate-300">
    //             {lang === "ar" ? "كلمة المرور" : "Password"}
    //           </Label>
    //           <div className="relative">
    //             <Lock className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 ${lang === "ar" ? "right-3" : "left-3"}`} />
    //             <Input
    //               id="password"
    //               type={showPassword ? "text" : "password"}
    //               className={`bg-slate-950/60 border-slate-800 text-slate-100 placeholder:text-slate-600 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 ${lang === "ar" ? "px-10" : "px-10"}`}
    //               placeholder="••••••••"
    //               {...register("password", {
    //                 required: requiredMessage,
    //                 minLength: {
    //                   value: 6,
    //                   message:
    //                     lang === "ar"
    //                       ? "كلمة المرور قصيرة"
    //                       : "Password is too short",
    //                 },
    //               })}
    //             />
    //             <button
    //               type="button"
    //               className={`absolute ${
    //                 lang === "ar" ? "left-3" : "right-3"
    //               } top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors`}
    //               onClick={() => setShowPassword(!showPassword)}
    //             >
    //               {showPassword ? (
    //                 <EyeOff className="w-4 h-4" />
    //               ) : (
    //                 <Eye className="w-4 h-4" />
    //               )}
    //             </button>
    //           </div>
    //           {errors.password && (
    //             <p className="text-xs text-rose-400 font-medium">
    //               {errors.password.message as string}
    //             </p>
    //           )}
    //         </div>

    //         {/* Academic Title & University */}
    //         <div className="grid gap-5 md:grid-cols-2">
    //           <div className="space-y-2">
    //             <Label htmlFor="academic_title" className="text-slate-300">
    //               {lang === "ar" ? "اللقب الأكاديمي" : "Academic Title"}
    //             </Label>
    //             <div className="relative">
    //               <Award className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 ${lang === "ar" ? "right-3" : "left-3"}`} />
    //               <Input
    //                 id="academic_title"
    //                 className={`bg-slate-950/60 border-slate-800 text-slate-100 placeholder:text-slate-600 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 ${lang === "ar" ? "pr-10" : "pl-10"}`}
    //                 placeholder={lang === "ar" ? "أستاذ دكتور / مدرس" : "Professor / Lecturer"}
    //                 {...register("academic_title", { required: requiredMessage })}
    //               />
    //             </div>
    //             {errors.academic_title && (
    //               <p className="text-xs text-rose-400 font-medium">
    //                 {errors.academic_title.message as string}
    //               </p>
    //             )}
    //           </div>

    //           <div className="space-y-2">
    //             <Label htmlFor="university" className="text-slate-300">
    //               {lang === "ar" ? "الجامعة" : "University"}
    //             </Label>
    //             <div className="relative">
    //               <Building className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 ${lang === "ar" ? "right-3" : "left-3"}`} />
    //               <Input
    //                 id="university"
    //                 className={`bg-slate-950/60 border-slate-800 text-slate-100 placeholder:text-slate-600 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 ${lang === "ar" ? "pr-10" : "pl-10"}`}
    //                 placeholder={lang === "ar" ? "جامعة حلب" : "University of Aleppo"}
    //                 {...register("university", { required: requiredMessage })}
    //               />
    //             </div>
    //             {errors.university && (
    //               <p className="text-xs text-rose-400 font-medium">
    //                 {errors.university.message as string}
    //               </p>
    //             )}
    //           </div>
    //         </div>

    //         {/* Department & Specialization */}
    //         <div className="grid gap-5 md:grid-cols-2">
    //           <div className="space-y-2">
    //             <Label htmlFor="faculty" className="text-slate-300">
    //               {lang === "ar" ? "الكلية / القسم" : "Faculty / Department"}
    //             </Label>
    //             <div className="relative">
    //               <BookOpen className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 ${lang === "ar" ? "right-3" : "left-3"}`} />
    //               <Input
    //                 id="faculty"
    //                 className={`bg-slate-950/60 border-slate-800 text-slate-100 placeholder:text-slate-600 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 ${lang === "ar" ? "pr-10" : "pl-10"}`}
    //                 placeholder={lang === "ar" ? "الهندسة المعلوماتية" : "Informatics Engineering"}
    //                 {...register("faculty", { required: requiredMessage })}
    //               />
    //             </div>
    //             {errors.faculty && (
    //               <p className="text-xs text-rose-400 font-medium">
    //                 {errors.faculty.message as string}
    //               </p>
    //             )}
    //           </div>

    //           <div className="space-y-2">
    //             <Label htmlFor="specialization" className="text-slate-300">
    //               {lang === "ar" ? "التخصص الدقيق" : "Specialization"}
    //             </Label>
    //             <div className="relative">
    //               <Briefcase className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 ${lang === "ar" ? "right-3" : "left-3"}`} />
    //               <Input
    //                 id="specialization"
    //                 className={`bg-slate-950/60 border-slate-800 text-slate-100 placeholder:text-slate-600 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 ${lang === "ar" ? "pr-10" : "pl-10"}`}
    //                 placeholder={lang === "ar" ? "برمجيات وذكاء اصطناعي" : "Software Engineering"}
    //                 {...register("specialization", { required: requiredMessage })}
    //               />
    //             </div>
    //             {errors.specialization && (
    //               <p className="text-xs text-rose-400 font-medium">
    //                 {errors.specialization.message as string}
    //               </p>
    //             )}
    //           </div>
    //         </div>

    //         {/* Graduation & Employment Years */}
    //         <div className="grid gap-5 md:grid-cols-2">
    //           <div className="space-y-2">
    //             <Label htmlFor="graduation_year" className="text-slate-300">
    //               {lang === "ar" ? "سنة الحصول على الدكتوراه" : "Ph.D. Year"}
    //             </Label>
    //             <div className="relative">
    //               <Calendar className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 ${lang === "ar" ? "right-3" : "left-3"}`} />
    //               <Input
    //                 id="graduation_year"
    //                 type="number"
    //                 className={`bg-slate-950/60 border-slate-800 text-slate-100 placeholder:text-slate-600 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 ${lang === "ar" ? "pr-10" : "pl-10"}`}
    //                 placeholder="2015"
    //                 {...register("graduation_year", {
    //                   required: requiredMessage,
    //                 })}
    //               />
    //             </div>
    //             {errors.graduation_year && (
    //               <p className="text-xs text-rose-400 font-medium">
    //                 {errors.graduation_year.message as string}
    //               </p>
    //             )}
    //           </div>

    //           <div className="space-y-2">
    //             <Label htmlFor="employment_year" className="text-slate-300">
    //               {lang === "ar" ? "سنة بداية التدريس" : "Employment Year"}
    //             </Label>
    //             <div className="relative">
    //               <Calendar className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 ${lang === "ar" ? "right-3" : "left-3"}`} />
    //               <Input
    //                 id="employment_year"
    //                 type="number"
    //                 className={`bg-slate-950/60 border-slate-800 text-slate-100 placeholder:text-slate-600 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 ${lang === "ar" ? "pr-10" : "pl-10"}`}
    //                 placeholder="2018"
    //                 {...register("employment_year", {
    //                   required: requiredMessage,
    //                 })}
    //               />
    //             </div>
    //             {errors.employment_year && (
    //               <p className="text-xs text-rose-400 font-medium">
    //                 {errors.employment_year.message as string}
    //               </p>
    //             )}
    //           </div>
    //         </div>

    //         {/* Work History */}
    //         <div className="space-y-2">
    //           <Label htmlFor="work_history" className="text-slate-300">
    //             {lang === "ar" ? "المواد المدرسية / سيرة العمل" : "Teaching / Work History"}
    //           </Label>
    //           <div className="relative">
    //             <History className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 ${lang === "ar" ? "right-3" : "left-3"}`} />
    //             <Input
    //               id="work_history"
    //               className={`bg-slate-950/60 border-slate-800 text-slate-100 placeholder:text-slate-600 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 ${lang === "ar" ? "pr-10" : "pl-10"}`}
    //               placeholder={
    //                 lang === "ar"
    //                   ? "تدريس هندسة البرمجيات وقواعد البيانات لمدة 6 سنوات"
    //                   : "Teaching Software Engineering and Databases for 6 years"
    //               }
    //               {...register("work_history", { required: requiredMessage })}
    //             />
    //           </div>
    //           {errors.work_history && (
    //             <p className="text-xs text-rose-400 font-medium">
    //               {errors.work_history.message as string}
    //             </p>
    //           )}
    //         </div>

    //         {/* Submit Button */}
    //         <Button
    //           className="w-full h-12 text-base font-semibold mt-6 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white rounded-xl shadow-lg shadow-sky-500/25 transition-all duration-200"
    //           type="submit"
    //           disabled={isSubmitting}
    //         >
    //           {isSubmitting
    //             ? lang === "ar"
    //               ? "جاري إنشاء الحساب..."
    //               : "Creating Account..."
    //             : lang === "ar"
    //             ? "إنشاء حساب دكتور"
    //             : "Register as Doctor"}
    //         </Button>
    //       </form>
    //     </CardContent>
    //   </Card>
    // </div>
    <div
      className="min-h-screen flex flex-col relative overflow-hidden py-10"
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

        <Button variant="ghost" size="sm" onClick={toggleLang}
          className="gap-2 border border-[#d9a928]/70 bg-[#0b1e48] text-white shadow-md transition-all duration-200 hover:border-[#d9a928] hover:bg-[#d9a928] hover:text-[#0b1e48] hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d9a928] focus-visible:ring-offset-2"
       >  <Globe className="w-4 h-4" />
        {lang === "ar" ? "English" : "العربية"}
      </Button>
    </div>

      {/* Main Container */ }
  <div className="w-full max-w-2xl mx-auto rounded-2xl p-6 md:p-8 shadow-2xl my-auto z-10">
    {/* Logo & Header */}
    <div className="text-center mb-8 pt-4 md:pt-0">
      <Link to="/" className="inline-block">
        <div className="mx-auto w-16 h-16 bg-gradient-to-tr from-sky-500 to-indigo-500 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-sky-500/20">
          <GraduationCap className="w-9 h-9 text-[#00113a]" />
        </div>
      </Link>
      <h1 className="text-2xl md:text-3xl font-extrabold text-[#0b1e48] mb-1">
        {lang === "ar" ? "تسجيل دكتور محاضر" : "Doctor Registration"}
      </h1>
      <p className="text-sm font-medium text-slate-500">
        {lang === "ar"
          ? "أدخل بياناتك الأكاديمية للانضمام إلى أعضاء الهيئة التدريسية"
          : "Enter your academic details to join the faculty staff"}
      </p>
    </div>

    {error && (
      <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-600 font-medium text-center">
        {error}
      </div>
    )}

    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Section 1: الحساب والمعلومات الأساسية */}
      <Card className="border-0 shadow-sm bg-white rounded-xl">
        <CardHeader className="pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2 text-[#1e293b] font-bold text-base">
            <User className="w-5 h-5 text-slate-700" />
            <span>
              {lang === "ar"
                ? "المعلومات الشخصية والحساب"
                : "Personal & Account Details"}
            </span>
          </div>
        </CardHeader>
        <CardContent className="pt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Full Name */}
          <div className="space-y-1.5 md:col-span-2">
            <Label
              htmlFor="name"
              className="text-xs text-slate-900 font-medium"
            >
              {lang === "ar" ? "الاسم الكامل" : "Full Name"}
            </Label>
            <div className="relative flex items-center">
              <User className="w-4 h-4 absolute text-slate-400 pointer-events-none rtl:right-3 ltr:left-3" />
              <Input
                id="name"
                placeholder={
                  lang === "ar" ? "د. أحمد السوري" : "Dr. Ahmad Al-Souri"
                }
                className="bg-slate-100/70 border-slate-200 text-slate-900 text-xs rtl:pr-9 ltr:pl-9 focus-visible:ring-[#0b1e48]"
                {...register("name", { required: requiredMessage })}
              />
            </div>
            {errors.name && (
              <p className="text-xs text-red-500 font-medium mt-1">
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <Label
              htmlFor="email"
              className="text-xs text-slate-900 font-medium"
            >
              {lang === "ar" ? "البريد الإلكتروني" : "Email"}
            </Label>
            <div className="relative flex items-center">
              <Mail className="w-4 h-4 absolute text-slate-400 pointer-events-none rtl:right-3 ltr:left-3" />
              <Input
                id="email"
                type="email"
                placeholder="doctor@example.com"
                className="bg-slate-100/70 border-slate-200 text-slate-900 text-xs rtl:pr-9 ltr:pl-9 focus-visible:ring-[#0b1e48]"
                {...register("email", {
                  required: requiredMessage,
                  pattern: {
                    value: /^\S+@\S+$/,
                    message:
                      lang === "ar"
                        ? "بريد إلكتروني غير صالح"
                        : "Invalid email",
                  },
                })}
              />
            </div>
            {errors.email && (
              <p className="text-xs text-red-500 font-medium mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <Label
              htmlFor="password"
              className="text-xs text-slate-900 font-medium"
            >
              {lang === "ar" ? "كلمة المرور" : "Password"}
            </Label>
            <div className="relative flex items-center">
              <Lock className="w-4 h-4 absolute text-slate-400 pointer-events-none rtl:right-3 ltr:left-3" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="bg-slate-100/70 border-slate-200 text-slate-900 text-xs rtl:pr-9 ltr:pl-9 rtl:pl-9 ltr:pr-9 focus-visible:ring-[#0b1e48]"
                {...register("password", {
                  required: requiredMessage,
                  minLength: {
                    value: 6,
                    message:
                      lang === "ar"
                        ? "كلمة المرور قصيرة"
                        : "Password is too short",
                  },
                })}
              />
              <button
                type="button"
                className="absolute text-slate-400 hover:text-slate-600 rtl:left-3 ltr:right-3"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-xs text-red-500 font-medium mt-1">
                {errors.password.message}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Section 2: المؤهلات الأكاديمية */}
      <Card className="border-0 shadow-sm bg-white rounded-xl">
        <CardHeader className="pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2 text-[#1e293b] font-bold text-base">
            <BookOpen className="w-5 h-5 text-slate-700" />
            <span>
              {lang === "ar" ? "المؤهلات الأكاديمية" : "Academic Background"}
            </span>
          </div>
        </CardHeader>
        <CardContent className="pt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* University */}
          <div className="space-y-1.5">
            <Label
              htmlFor="university"
              className="text-xs text-slate-900 font-medium"
            >
              {lang === "ar" ? "الجامعة" : "University"}
            </Label>
            <div className="relative flex items-center">
              <Building className="w-4 h-4 absolute text-slate-400 pointer-events-none rtl:right-3 ltr:left-3" />
              <Input
                id="university"
                placeholder={
                  lang === "ar" ? "جامعة حلب" : "University of Aleppo"
                }
                className="bg-slate-100/70 border-slate-200 text-slate-900 text-xs rtl:pr-9 ltr:pl-9 focus-visible:ring-[#0b1e48]"
                {...register("university", { required: requiredMessage })}
              />
            </div>
            {errors.university && (
              <p className="text-xs text-red-500 font-medium mt-1">
                {errors.university.message}
              </p>
            )}
          </div>

          {/* Specialization */}
          <div className="space-y-1.5">
            <Label
              htmlFor="specialization"
              className="text-xs text-slate-900 font-medium"
            >
              {lang === "ar" ? "التخصص الدقيق" : "Specialization"}
            </Label>
            <div className="relative flex items-center">
              <Briefcase className="w-4 h-4 absolute text-slate-400 pointer-events-none rtl:right-3 ltr:left-3" />
              <Input
                id="specialization"
                placeholder={
                  lang === "ar"
                    ? "برمجيات وذكاء اصطناعي"
                    : "Software Engineering"
                }
                className="bg-slate-100/70 border-slate-200 text-slate-900 text-xs rtl:pr-9 ltr:pl-9 focus-visible:ring-[#0b1e48]"
                {...register("specialization", {
                  required: requiredMessage,
                })}
              />
            </div>
            {errors.specialization && (
              <p className="text-xs text-red-500 font-medium mt-1">
                {errors.specialization.message}
              </p>
            )}
          </div>

          {/* Graduation Year */}
          <div className="space-y-1.5">
            <Label
              htmlFor="graduation_year"
              className="text-xs text-slate-900 font-medium"
            >
              {lang === "ar"
                ? "سنة الحصول على الدكتوراه"
                : "Ph.D. Year"}
            </Label>
            <div className="relative flex items-center">
              <Calendar className="w-4 h-4 absolute text-slate-400 pointer-events-none rtl:right-3 ltr:left-3" />
              <Input
                id="graduation_year"
                type="number"
                placeholder="2015"
                className="bg-slate-100/70 border-slate-200 text-slate-900 text-xs rtl:pr-9 ltr:pl-9 focus-visible:ring-[#0b1e48]"
                {...register("graduation_year", {
                  required: requiredMessage,
                })}
              />
            </div>
            {errors.graduation_year && (
              <p className="text-xs text-red-500 font-medium mt-1">
                {errors.graduation_year.message}
              </p>
            )}
          </div>

          {/* Employment Year */}
          <div className="space-y-1.5">
            <Label
              htmlFor="employment_year"
              className="text-xs text-slate-900 font-medium"
            >
              {lang === "ar" ? "سنة بداية التدريس" : "Employment Year"}
            </Label>
            <div className="relative flex items-center">
              <Calendar className="w-4 h-4 absolute text-slate-400 pointer-events-none rtl:right-3 ltr:left-3" />
              <Input
                id="employment_year"
                type="number"
                placeholder="2018"
                className="bg-slate-100/70 border-slate-200 text-slate-900 text-xs rtl:pr-9 ltr:pl-9 focus-visible:ring-[#0b1e48]"
                {...register("employment_year", {
                  required: requiredMessage,
                })}
              />
            </div>
            {errors.employment_year && (
              <p className="text-xs text-red-500 font-medium mt-1">
                {errors.employment_year.message}
              </p>
            )}
          </div>

          {/* Work History */}
          <div className="space-y-1.5 md:col-span-2">
            <Label
              htmlFor="work_history"
              className="text-xs text-slate-900 font-medium"
            >
              {lang === "ar"
                ? "المواد المدرسية / سيرة العمل"
                : "Teaching / Work History"}
            </Label>
            <div className="relative flex items-center">
              <History className="w-4 h-4 absolute text-slate-400 pointer-events-none rtl:right-3 ltr:left-3" />
              <Input
                id="work_history"
                placeholder={
                  lang === "ar"
                    ? "تدريس هندسة البرمجيات وقواعد البيانات"
                    : "Teaching Software Engineering and Databases"
                }
                className="bg-slate-100/70 border-slate-200 text-slate-900 text-xs rtl:pr-9 ltr:pl-9 focus-visible:ring-[#0b1e48]"
                {...register("work_history", {
                  required: requiredMessage,
                })}
              />
            </div>
            {errors.work_history && (
              <p className="text-xs text-red-500 font-medium mt-1">
                {errors.work_history.message}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full h-12 text-base font-bold bg-[#0b1e48] hover:bg-[#06266d] text-white rounded-xl shadow-lg transition-all"
      >
        {isSubmitting
          ? lang === "ar"
            ? "جاري إنشاء الحساب..."
            : "Creating Account..."
          : lang === "ar"
            ? "إنشاء حساب دكتور"
            : "Register as Doctor"}
      </Button>

      <div className="text-center text-xs font-medium text-slate-600">
        {lang === "ar" ? "هل لديك حساب؟" : "Already have an account?"}{" "}
        <Link
          to="/login"
          className="text-[#0b1e48] hover:underline font-bold transition-colors"
        >
          {lang === "ar" ? "تسجيل الدخول" : "Login"}
        </Link>
      </div>
    </form>
  </div>
    </div >
  );
};

export default DoctorRegisterPage;
