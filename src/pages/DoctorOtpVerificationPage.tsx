import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { InputOTP } from "@/components/ui/input-otp";
import { Mail, ArrowLeft, RefreshCcw } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { usePasswordResetActions } from "@/hooks/usePasswordResetActions";

const RESEND_SECONDS = 60;

const DoctorOtpVerificationPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { lang, toggleLang } = useLanguage();
  const { verifyOtp, resendOtp, loading } = usePasswordResetActions();
  const [otpCode, setOtpCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [seconds, setSeconds] = useState(RESEND_SECONDS);
  const [isResendDisabled, setIsResendDisabled] = useState(true);

  const email = (location.state as { email?: string } | null)?.email ?? "";
  const emailMessage =
    email || (lang === "ar" ? "بريدك الإلكتروني أو رقم هاتفك" : "your email or phone");

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
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-accent/10 p-4"
      dir={lang === "ar" ? "rtl" : "ltr"}
    >
      <div className="absolute top-4 right-4">
        <Button variant="ghost" size="sm" onClick={toggleLang} className="gap-1 mb-4">
          {lang === "ar" ? "English" : "العربية"}
        </Button>
        <br />
        <Link
          to="/register/doctor"
          className="inline-flex items-center gap-1 text-sm opacity-70 hover:opacity-100"
        >
          <ArrowLeft className="w-4 h-4" />
          {lang === "ar" ? "الرجوع إلى تسجيل الدكتور" : "Back to Doctor Registration"}
        </Link>
      </div>

      <Card className="w-full max-w-xl shadow-2xl border-0 my-8">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-primary/10 text-primary shadow-md">
            <Mail className="h-8 w-8" />
          </div>
          <CardTitle className="text-2xl font-bold">
            {lang === "ar" ? "التحقق من الكود" : "Verify OTP"}
          </CardTitle>
          <CardDescription className="text-base text-muted-foreground">
            {lang === "ar"
              ? "تم إرسال كود التحقق إلى بريدك الإلكتروني / رقم هاتفك"
              : "A verification code has been sent to your email / phone number"}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="rounded-3xl border border-border bg-background p-6 shadow-sm">
            <div className="flex flex-col gap-4">
              <div className="space-y-2">
                <Label htmlFor="otp">{lang === "ar" ? "كود التحقق" : "Verification Code"}</Label>
                <InputOTP
                  id="otp"
                  value={otpCode}
                  onChange={setOtpCode}
                  maxLength={6}
                  textAlign="center"
                  placeholder="-"
                  className="w-full max-w-md mx-auto rounded-xl border border-input bg-transparent p-1"
                  containerClassName="justify-center"
                  render={({ slots }) => (
                    <div className="flex justify-center gap-3">
                      {slots.map((slot, index) => (
                        <div
                          key={index}
                          className={
                            "flex h-14 w-14 items-center justify-center rounded-2xl border bg-background text-2xl font-semibold transition-all duration-200 " +
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
                className="w-full h-12 text-base font-semibold"
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
                  className={`inline-flex items-center gap-2 font-medium ${isResendDisabled ? "text-muted-foreground/70" : "text-primary hover:text-primary/90"}`}
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
