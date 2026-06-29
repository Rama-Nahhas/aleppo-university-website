import React from "react";
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
import { GraduationCap, Globe, ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { useAuthActions, UserData } from "@/hooks/useAuthActions";

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
          to="/login"
          className="inline-flex items-center gap-1 text-sm opacity-70 hover:opacity-100 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          {lang === "ar" ? "العودة لتسجيل الدخول" : "Back to Login"}
        </Link>
      </div>

      <Card className="w-full max-w-md shadow-2xl border-0 my-8">
        <CardHeader className="text-center pb-2">
          <Link to="/">
            <div className="mx-auto w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mb-4 shadow-lg">
              <GraduationCap className="w-8 h-8 text-primary-foreground" />
            </div>
          </Link>
          <CardTitle className="text-2xl font-bold">
            {lang === "ar" ? "إنشاء حساب طالب" : "Create Student Account"}
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-2">
              <Label htmlFor="name">{t("name") ?? "Name"}</Label>
              <Input
                id="name"
                placeholder={lang === "ar" ? "الاسم الكامل" : "Full Name"}
                {...register("name", { required: true })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">{t("email") ?? "Email"}</Label>
              <Input
                id="email"
                type="email"
                placeholder="user@aleppo.edu"
                {...register("email", { required: true })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">{t("password") ?? "Password"}</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                {...register("password", { required: true })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password_confirmation">
                {t("password_confirm") ?? "Confirm Password"}
              </Label>
              <Input
                id="password_confirmation"
                type="password"
                placeholder="••••••••"
                {...register("password_confirmation", { required: true })}
              />
            </div>

            <div className="space-y-2">
              <Label>{lang === "ar" ? "القسم" : "Department"}</Label>
              <Controller
                control={control}
                name="department_id"
                rules={{ required: true }}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue
                        placeholder={
                          lang === "ar" ? "اختر القسم" : "Select Department"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">برمجيات</SelectItem>
                      <SelectItem value="2">شبكات حاسوبية</SelectItem>
                      <SelectItem value="3">ذكاء صنعي</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <div className="space-y-2">
              <Label>{lang === "ar" ? "السنة" : "Year"}</Label>
              <Controller
                control={control}
                name="year_id"
                rules={{ required: true }}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue
                        placeholder={
                          lang === "ar" ? "اختر السنة" : "Select Year"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">السنة الأولى</SelectItem>
                      <SelectItem value="1">السنة الثانية</SelectItem>
                      <SelectItem value="1">السنة الثالثة</SelectItem>
                      <SelectItem value="1">السنة الرابعة</SelectItem>
                      <SelectItem value="1">السنة الخامسة</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="student_number">
                {lang === "ar" ? "الرقم الجامعي" : "Student Number"}
              </Label>
              <Input
                id="student_number"
                type="text"
                placeholder="0000"
                {...register("student_number", { required: true })}
              />
            </div>
            <div className="space-y-2">
              <Label>{lang === "ar" ? "نوع القبول" : "Admission Type"}</Label>
              <Controller
                control={control}
                name="admission_type"
                rules={{ required: true }}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue
                        placeholder={
                          lang === "ar"
                            ? "اختر نوع القبول"
                            : "Select admission type"
                        }
                      />
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
            <div className="space-y-2">
              <Label htmlFor="birth_date">
                {lang === "ar" ? "تاريخ الميلاد" : "Birth Date"}
              </Label>
              <Input
                id="birth_date"
                type="date"
                {...register("birth_date", { required: true })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">
                {lang === "ar" ? "الهاتف" : "Phone"}
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder="09********"
                {...register("phone", { required: true })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">
                {lang === "ar" ? "العنوان" : "Address"}
              </Label>
              <Input
                id="address"
                type="text"
                placeholder={
                  lang === "ar" ? "حلب - الفرقان" : "Aleppo - Al Furqan"
                }
                {...register("address", { required: true })}
              />
            </div>
            {error && (
              <p className="text-sm text-destructive font-medium bg-destructive/10 p-3 rounded-lg border border-destructive/20">
                {error}
              </p>
            )}
            <Button
              type="submit"
              className="w-full h-11 text-base font-semibold"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? lang === "ar"
                  ? "جاري إنشاء الحساب..."
                  : "Creating Account..."
                : lang === "ar"
                  ? "إنشاء حساب"
                  : "Create Account"}
            </Button>
          </form>

          <div className="mt-4 text-sm text-muted-foreground text-center">
            {lang === "ar" ? "هل لديك حساب؟" : "Already have an account?"}{" "}
            <Link to="/login" className="text-primary font-medium">
              {lang === "ar" ? "تسجيل الدخول" : "Login"}
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RegisterPage;
