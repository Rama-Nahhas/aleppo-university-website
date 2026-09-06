import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { InputOTP } from "@/components/ui/input-otp";
import { Mail, ArrowLeft, ArrowRight, RefreshCcw, Globe } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { usePasswordResetActions } from "@/hooks/usePasswordResetActions";

const RESEND_SECONDS = 60;

const maskEmail = (value: string): string => {
  const [localPart, domain] = value.split("@");
  if (!domain || localPart.length <= 2) return value;

  return `${localPart.slice(0, 2)}******${localPart.slice(-1)}@${domain}`;
};

const DoctorOtpVerificationPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { lang, toggleLang } = useLanguage();
  const { verifyOtp, resendOtp, loading } = usePasswordResetActions();
  const [otpCode, setOtpCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [seconds, setSeconds] = useState(RESEND_SECONDS);
  const [isResendDisabled, setIsResendDisabled] = useState(true);

  const stateEmail = (location.state as { email?: string } | null)?.email ?? "";
  const email =
    stateEmail || sessionStorage.getItem("pendingDoctorOtpEmail") || "";
  const emailMessage = email
    ? maskEmail(email)
    : lang === "ar"
      ? "بريدك الإلكتروني أو رقم هاتفك"
      : "your email or phone";
  const BackIcon = lang === "ar" ? ArrowRight : ArrowLeft;

  // ما في إيميل بانتظار التحقق (زيارة مباشرة للصفحة) → رجّعه لصفحة التسجيل
  useEffect(() => {
    if (!email) {
      navigate("/register/doctor", { replace: true });
    }
  }, [email, navigate]);

  useEffect(() => {
    if (!isResendDisabled) return;
    if (seconds <= 0) {
      setIsResendDisabled(false);
      return;
    }

    const timer = window.setInterval(() => {
      setSeconds((prev) => prev - 1);
    }, 1000);

    return () => window.clearInterval(timer);
  }, [isResendDisabled, seconds]);

  const handleVerify = async () => {
    setError(null);

    if (!/^\d{4}$|^\d{6}$/.test(otpCode)) {
      setError(
        lang === "ar"
          ? "الرجاء إدخال كود تحقق صحيح مكون من 4 أو 6 أرقام"
          : "Please enter a valid 4 or 6 digit code",
      );
      return;
    }

    const ok = await verifyOtp(email, otpCode);
    if (ok) {
      sessionStorage.removeItem("pendingDoctorOtpEmail");
      navigate("/register/doctor/under-review", {
        state: { fromOtp: true },
      });
    } else {
      setError(
        lang === "ar" ? "رمز التحقق غير صحيح" : "Invalid verification code",
      );
    }
  };

  const handleResend = async () => {
    setError(null);
    const ok = await resendOtp(email);
    if (ok) {
      setIsResendDisabled(true);
      setSeconds(RESEND_SECONDS);
    } else {
      setError(
        lang === "ar" ? "حدث خطأ، حاول مجدداً" : "Something went wrong, try again",
      );
    }
  };

  return (
    <div
      className="relative flex min-h-screen items-center justify-center overflow-x-hidden bg-gradient-to-br from-primary/10 via-background to-accent/10 px-4 py-20 sm:px-6"
      dir={lang === "ar" ? "rtl" : "ltr"}
    >
      <div className="absolute inset-x-4 top-4 flex items-center justify-between sm:inset-x-6">
        <Link
          to="/register/doctor"
          onClick={() => sessionStorage.removeItem("pendingDoctorOtpEmail")}
          className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-[#d9a928]/70 bg-[#0b1e48] text-white px-3 text-sm font-medium text-foreground shadow-sm transition-colors hover:border-primary/40 hover:bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        >
          <BackIcon className="h-4 w-4" />
          <span className="hidden sm:inline ">
            {lang === "ar" ? "الرجوع إلى تسجيل الدكتور" : "Back to Doctor Registration"}
          </span>
          <span className="sm:hidden">{lang === "ar" ? "رجوع" : "Back"}</span>
        </Link>
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleLang}
          className="gap-2 border border-[#d9a928]/70 bg-[#0b1e48] text-white shadow-md transition-all duration-200 hover:border-[#d9a928] hover:bg-[#d9a928] hover:text-[#0b1e48] hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d9a928] focus-visible:ring-offset-2"
        >
          <Globe className="h-4 w-4" />
          {lang === "ar" ? "English" : "العربية"}
        </Button>
      </div>

      <Card className="my-4 w-full max-w-lg rounded-2xl border-0 shadow-xl">
        <CardHeader className="px-5 pb-3 pt-7 text-center sm:px-10 sm:pt-9">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-sm sm:h-16 sm:w-16">
            <Mail className="h-7 w-7 sm:h-8 sm:w-8" />
          </div>
          <CardTitle className="text-xl font-bold sm:text-2xl">
            {lang === "ar" ? "التحقق من الكود" : "Verify OTP"}
          </CardTitle>
          <CardDescription className="mx-auto max-w-md text-sm leading-6 text-muted-foreground sm:text-base">
            {lang === "ar"
              ? "تم إرسال كود التحقق إلى بريدك الإلكتروني "
              : "A verification code has been sent to your email "}
          </CardDescription>
        </CardHeader>

        <CardContent className="px-5 pb-7 sm:px-10 sm:pb-9">
          <div className="rounded-2xl border border-border bg-background p-4 shadow-sm sm:p-6">
            <div className="flex flex-col gap-5">
              <div className="space-y-2">
                <Label htmlFor="otp">{lang === "ar" ? "كود التحقق" : "Verification Code"}</Label>
                <InputOTP
                  id="otp"
                  value={otpCode}
                  onChange={setOtpCode}
                  maxLength={6}
                  textAlign="center"
                  placeholder="-"
                  className="mx-auto w-full rounded-xl border border-input bg-transparent p-1"
                  containerClassName="justify-center"
                  render={({ slots }) => (
                    <div className="flex justify-center gap-1.5 min-[400px]:gap-2 sm:gap-3">
                      {slots.map((slot, index) => (
                        <div
                          key={index}
                          className={
                            "flex h-11 w-11 items-center justify-center rounded-xl border bg-background text-xl font-semibold transition-all duration-200 min-[400px]:h-12 min-[400px]:w-12 sm:h-14 sm:w-14 sm:rounded-2xl sm:text-2xl " +
                            "border-input shadow-sm " +
                            (slot.isActive
                              ? "ring-2 ring-primary/70 bg-primary/5 text-primary"
                              : "hover:-translate-y-0.5 hover:shadow-md")
                          }
                        >
                          <span className={slot.char ? "text-foreground" : "text-muted-foreground"}>
                            {slot.char ?? "-"}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                />
              </div>

              <p className="text-sm text-muted-foreground text-center">
                {lang === "ar" ? "تم إرسال الكود إلى" : "Sent to"} {emailMessage}
              </p>

              {error && (
                <p className="text-sm text-destructive text-center font-medium">{error}</p>
              )}

              <Button
                className="h-12 w-full rounded-lg text-base font-semibold shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                onClick={handleVerify}
                disabled={loading}
              >
                {loading
                  ? lang === "ar"
                    ? "جاري التحقق..."
                    : "Verifying..."
                  : lang === "ar"
                    ? "تأكيد الكود"
                    : "Verify Code"}
              </Button>

              <div className="flex flex-col items-center gap-2 text-sm text-muted-foreground">
                <button
                  type="button"
                  className={`inline-flex min-h-10 items-center gap-2 rounded-lg px-3 font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${isResendDisabled ? "text-muted-foreground/70" : "text-primary hover:bg-primary/10 hover:text-primary"}`}
                  onClick={handleResend}
                  disabled={isResendDisabled}
                >
                  <RefreshCcw className="h-4 w-4" />
                  {lang === "ar" ? "إعادة إرسال الكود" : "Resend Code"}
                </button>
                {isResendDisabled && (
                  <span>
                    {lang === "ar"
                      ? `يمكن إعادة الإرسال بعد ${seconds} ثانية`
                      : `Resend available in ${seconds}s`}
                  </span>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DoctorOtpVerificationPage;
