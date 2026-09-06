import React, { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
// import { GraduationCap, Eye, Mail , EyeOff, Globe, ArrowLeft } from "lucide-react";
import {
  GraduationCap,
  Eye,
  EyeOff,
  Mail,
  LockKeyhole,
  LogIn,
  Globe,
  ArrowLeft,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthActions, UserData } from "@/hooks/useAuthActions";
import { useForm } from "react-hook-form";
import { useToast } from "@/components/ui/use-toast";

const LoginPage: React.FC = () => {
  const { lang, t, toggleLang } = useLanguage();
  const [showPassword, setShowPassword] = useState(false);
  const { handleLogin, isSubmitting, error } = useAuthActions();
  const navigate = useNavigate();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: Record<string, string>): Promise<void> => {
    await handleLogin(values, (userData: UserData) => {
      toast({
        title: lang === "ar" ? "تم تسجيل الدخول بنجاح" : "Login Successful",
        description:
          lang === "ar"
            ? `مرحباً بك مجدداً، ${userData.name || "مستخدم"}`
            : `Welcome back, ${userData.name || "User"}`,
        variant: "default",
        className: "bg-green-600 text-white font-semibold",
      });

      navigate("/dashboard");
    });
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
          onClick={() => navigate("/")}
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
      {/* Main */}
      <div className="flex-1 flex items-center justify-center px-4 py-20">

        <Card className="w-full max-w-[640px] rounded-2xl border-0 shadow-2xl">

          <CardHeader className="px-6 pt-8 pb-5 text-center sm:px-12 sm:pt-12">

            {/* Logo */}
            <Link to="/" className="block">
              <div className="mx-auto mb-5 flex h-[120px] w-[120px] items-center justify-center">
                <img
                  src="..\public\favicon.ico"
                  alt="جامعة حلب"
                  className="h-full w-full object-contain"
                />
              </div>
            </Link>

            <CardTitle className="text-[34px] font-extrabold text-[#031c4e]">
              {lang === "ar" ? "جامعة حلب" : "University of Aleppo"}
            </CardTitle>

            <CardDescription className="mt-3 text-lg text-[#555d6c]">
              {t("login.title")}
            </CardDescription>

          </CardHeader>

          <CardContent className="px-6 pb-10 sm:px-12 sm:pb-12">

            {error && (
              <div className="mb-4 rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-sm font-medium text-destructive">
                {error}
              </div>
            )}

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-7"
            >

              {/* Email */}
              <div className="space-y-2">

                <Label
                  htmlFor="email"
                  className="text-lg font-normal text-[#1e1f24]"
                >
                  {t("login.email")}
                </Label>

                <div className="relative">

                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@university.local"
                    className="h-12 border-slate-200 bg-slate-100/70 pl-10 pr-3 text-base text-left focus-visible:ring-[#0b1e48]"
                    {...register("email", {
                      required:
                        lang === "ar"
                          ? "هذا الحقل مطلوب"
                          : "This field is required",
                      pattern: {
                        value: /^\S+@\S+$/,
                        message:
                          lang === "ar"
                            ? "البريد الإلكتروني غير صالح"
                            : "Invalid email address",
                      },
                    })}
                  />

                  <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#747b8a]">
                    <Mail className="h-6 w-6" />
                  </span>

                </div>

                {errors.email && (
                  <p className="text-xs font-medium text-destructive">
                    {errors.email.message}
                  </p>
                )}

              </div>

              {/* Password */}
              <div className="space-y-2">

                <Label
                  htmlFor="password"
                  className="text-lg font-normal text-[#1e1f24]"
                >
                  {t("login.password")}
                </Label>

                <div className="relative">


                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="h-12 border-slate-200 bg-slate-100/70 pl-10 pr-3 text-base text-left focus-visible:ring-[#0b1e48]"
                    {...register("password", {
                      required:
                        lang === "ar"
                          ? "هذا الحقل مطلوب"
                          : "This field is required",
                      minLength: {
                        value: 6,
                        message:
                          lang === "ar"
                            ? "كلمة المرور قصيرة جداً"
                            : "Password is too short",
                      },
                    })}

                  />

                  <button
                    type="button"
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#747b8a] hover:text-[#031c4e]"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-6 w-6" />
                    ) : (
                      <Eye className="h-6 w-6" />
                    )}
                  </button>

                  <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#747b8a]">
                    <LockKeyhole className="h-6 w-6" />
                  </span>

                </div>

                {errors.password && (
                  <p className="text-xs font-medium text-destructive">
                    {errors.password.message}
                  </p>
                )}

                <Link
                  to="/forgot-password"
                  className="block text-right text-base font-medium text-[#061d50] hover:underline"
                >
                  {lang === "ar"
                    ? "هل نسيت كلمة المرور؟"
                    : "Forgot password?"}
                </Link>

              </div>

              {/* Login */}
              <Button
                type="submit"
                className="mt-2 h-14 w-full rounded-lg bg-[#00194d] text-xl font-semibold text-white shadow-lg hover:bg-[#021f5c] sm:h-16"
                disabled={isSubmitting}
              >
                {isSubmitting
                  ? lang === "ar"
                    ? "جاري التحقق..."
                    : "Verifying..."
                  : t("login.submit")}

                <LogIn className="mr-2 h-6 w-6" />
              </Button>

            </form>

            {/* Register */}
            <div className="mt-8 border-t border-[#d1d5de] pt-6 text-center text-sm text-[#555c6a]">

              {lang === "ar"
                ? "ليس لديك حساب؟"
                : "Don't have an account?"}

              {" "}

              <Link
                to="/register"
                className="font-bold text-[#061d50] hover:underline"
              >
                {lang === "ar" ? "سجل الآن" : "Register"}
              </Link>

            </div>

          </CardContent>
        </Card>
      </div>


    </div>
  );
};

export default LoginPage;
