import React, { useState } from "react";
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
import { ArrowLeft, GraduationCap, Eye, EyeOff, Globe } from "lucide-react";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { useAuthActions, UserData } from "@/hooks/useAuthActions";

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
      (userData: UserData) => {
        toast({
          title:
            lang === "ar"
              ? "تم إنشاء حساب الطبيب بنجاح"
              : "Doctor Account Created",
          description:
            lang === "ar"
              ? `مرحباً د. ${userData.name}`
              : `Welcome Dr. ${userData.name}`,
          className: "bg-green-600 text-white font-semibold",
        });

        navigate("/dashboard");
      },
    );
  };

  const requiredMessage =
    lang === "ar" ? "هذا الحقل مطلوب" : "This field is required";

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-accent/10 p-4"
      dir={lang === "ar" ? "rtl" : "ltr"}
    >
      <div className="absolute top-4 right-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleLang}
          className="gap-1 mb-4"
        >
          <Globe className="w-4 h-4" />
          {lang === "ar" ? "English" : "العربية"}
        </Button>
        <br />
        <Link
          to="/register"
          className="inline-flex items-center gap-1 text-sm opacity-70 hover:opacity-100 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          {lang === "ar" ? "العودة" : "Back"}
        </Link>
      </div>

      <Card className="w-full max-w-2xl shadow-2xl border-0 my-8">
        <CardHeader className="text-center pb-2">
          <Link to="/">
            <div className="mx-auto w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mb-4 shadow-lg">
              <GraduationCap className="w-8 h-8 text-primary-foreground" />
            </div>
          </Link>
          <CardTitle className="text-2xl font-bold">
            {lang === "ar" ? "تسجيل طبيب" : "Doctor Registration"}
          </CardTitle>
          <CardDescription className="text-base">
            {lang === "ar"
              ? "أدخل بياناتك لتصبح عضواً في المنصة"
              : "Enter your details to join the platform"}
          </CardDescription>
        </CardHeader>

        <CardContent>
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-sm text-destructive font-medium">
              {error}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">{lang === "ar" ? "الاسم" : "Name"}</Label>
                <Input
                  id="name"
                  placeholder={lang === "ar" ? "د. أحمد" : "Dr. Ahmed"}
                  {...register("name", { required: requiredMessage })}
                />
                {errors.name && (
                  <p className="text-xs text-destructive font-medium">
                    {errors.name.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">
                  {lang === "ar" ? "البريد الإلكتروني" : "Email"}
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="doctor@example.com"
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
                {errors.email && (
                  <p className="text-xs text-destructive font-medium">
                    {errors.email.message}
                  </p>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">
                {lang === "ar" ? "كلمة المرور" : "Password"}
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
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
                  className={`absolute ${lang === "ar" ? "left-3" : "right-3"} top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground`}
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
                <p className="text-xs text-destructive font-medium">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="specialization">
                  {lang === "ar" ? "التخصص" : "Specialization"}
                </Label>
                <Input
                  id="specialization"
                  placeholder={lang === "ar" ? "أمراض القلب" : "Cardiology"}
                  {...register("specialization", { required: requiredMessage })}
                />
                {errors.specialization && (
                  <p className="text-xs text-destructive font-medium">
                    {errors.specialization.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="university">
                  {lang === "ar" ? "الجامعة" : "University"}
                </Label>
                <Input
                  id="university"
                  placeholder={
                    lang === "ar" ? "جامعة دمشق" : "Damascus University"
                  }
                  {...register("university", { required: requiredMessage })}
                />
                {errors.university && (
                  <p className="text-xs text-destructive font-medium">
                    {errors.university.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="graduation_year">
                  {lang === "ar" ? "سنة التخرج" : "Graduation Year"}
                </Label>
                <Input
                  id="graduation_year"
                  type="number"
                  placeholder="2010"
                  {...register("graduation_year", {
                    required: requiredMessage,
                  })}
                />
                {errors.graduation_year && (
                  <p className="text-xs text-destructive font-medium">
                    {errors.graduation_year.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="employment_year">
                  {lang === "ar" ? "سنة العمل" : "Employment Year"}
                </Label>
                <Input
                  id="employment_year"
                  type="number"
                  placeholder="2012"
                  {...register("employment_year", {
                    required: requiredMessage,
                  })}
                />
                {errors.employment_year && (
                  <p className="text-xs text-destructive font-medium">
                    {errors.employment_year.message}
                  </p>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="work_history">
                {lang === "ar" ? "سيرة العمل" : "Work History"}
              </Label>
              <Input
                id="work_history"
                placeholder={
                  lang === "ar"
                    ? "عملت في المشفى المركزي لمدة 5 سنوات"
                    : "Worked at Central Hospital for 5 years"
                }
                {...register("work_history", { required: requiredMessage })}
              />
              {errors.work_history && (
                <p className="text-xs text-destructive font-medium">
                  {errors.work_history.message}
                </p>
              )}
            </div>

            <Button
              className="w-full h-11 text-base font-semibold mt-4"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? lang === "ar"
                  ? "جاري إنشاء الحساب..."
                  : "Creating Account..."
                : lang === "ar"
                  ? "إنشاء حساب دكتور"
                  : "Register as Doctor"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default DoctorRegisterPage;
