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
import { GraduationCap, Eye, EyeOff, Globe, ArrowLeft } from "lucide-react";
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
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-accent/10 p-4"
      dir={lang === "ar" ? "rtl" : "ltr"}
    >
      <div className="absolute top-4 right-4 flex flex-col items-end gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleLang}
          className="gap-1"
        >
          <Globe className="w-4 h-4" />
          {lang === "ar" ? "English" : "العربية"}
        </Button>
        <Link
          to="/"
          className="inline-flex items-center gap-1 text-sm opacity-70 hover:opacity-100"
        >
          <ArrowLeft className="w-4 h-4" />
          {lang === "ar" ? "العودة" : "Back"}
        </Link>
      </div>

      <Card className="w-full max-w-md shadow-2xl border-0">
        <CardHeader className="text-center pb-2">
          <Link to="/">
            <div className="mx-auto w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mb-4 shadow-lg">
              <GraduationCap className="w-8 h-8 text-primary-foreground" />
            </div>
          </Link>
          <CardTitle className="text-2xl font-bold">
            {lang === "ar" ? "جامعة حلب" : "University of Aleppo"}
          </CardTitle>
          <CardDescription className="text-base">
            {t("login.title")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-sm text-destructive font-medium">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">{t("login.email")}</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@aleppo.edu"
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
              {errors.email && (
                <p className="text-xs text-destructive font-medium">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">{t("login.password")}</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
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

            <Button
              type="submit"
              className="w-full h-11 text-base font-semibold"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? lang === "ar"
                  ? "جاري التحقق..."
                  : "Verifying..."
                : t("login.submit")}
            </Button>
          </form>

          <div className="mt-4 text-sm text-muted-foreground text-center">
            {lang === "ar" ? "ما عندك حساب؟" : "Don't have an account?"}{" "}
            <Link to="/register" className="text-primary font-medium">
              {lang === "ar" ? "سجل الآن" : "Register"}
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;
