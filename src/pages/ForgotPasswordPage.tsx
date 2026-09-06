import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { InputOTP } from '@/components/ui/input-otp';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Link } from 'react-router-dom';
import { ArrowLeft, Globe, Key } from 'lucide-react';
import { usePasswordResetActions } from '@/hooks/usePasswordResetActions';
import { maskEmail } from '@/lib/utils';

type Step = 'request' | 'verify' | 'reset' | 'done';

const RESEND_SECONDS = 10 * 60;

const formatCountdown = (totalSeconds: number) => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, '0')}`;
};

const ForgotPasswordPage: React.FC = () => {
  const { lang, toggleLang } = useLanguage();
  const { requestOtp, resendOtp, verifyResetOtp, verifyOtp, resetPassword, loading } = usePasswordResetActions();

  const [step, setStep] = useState<Step>('request');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [resendIn, setResendIn] = useState(RESEND_SECONDS);
  const [resendMessage, setResendMessage] = useState('');
  const [wasResent, setWasResent] = useState(false);

  useEffect(() => {
    if (step !== 'verify' || resendIn <= 0) return;
    const timer = setInterval(() => setResendIn(s => Math.max(s - 1, 0)), 1000);
    return () => clearInterval(timer);
  }, [step, resendIn]);

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email) {
      setError(lang === 'ar' ? 'الرجاء إدخال البريد الإلكتروني' : 'Please enter your email');
      return;
    }
    const ok = await requestOtp(email);
    if (ok) {
      setResendIn(RESEND_SECONDS);
      setStep('verify');
    } else setError(lang === 'ar' ? 'حدث خطأ، حاول مجدداً' : 'Something went wrong, try again');
  };

  const handleResendOtp = async () => {
    setError('');
    setResendMessage('');
    const ok = await resendOtp(email);
    if (ok) {
      setResendIn(RESEND_SECONDS);
      setWasResent(true);
      setResendMessage(lang === 'ar' ? 'تم إرسال رمز جديد إلى بريدك الإلكتروني' : 'A new code has been sent to your email');
    } else setError(lang === 'ar' ? 'حدث خطأ، حاول مجدداً' : 'Something went wrong, try again');
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!otp) {
      setError(lang === 'ar' ? 'الرجاء إدخال رمز التحقق' : 'Please enter the verification code');
      return;
    }
    const ok = wasResent ? await verifyOtp(email, otp) : await verifyResetOtp(email, otp);
    if (ok) setStep('reset');
    else setError(lang === 'ar' ? 'رمز التحقق غير صحيح' : 'Invalid verification code');
  };

  const passwordsMismatch = confirmPassword.length > 0 && newPassword !== confirmPassword;

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!newPassword || !confirmPassword) {
      setError(lang === 'ar' ? 'الرجاء تعبئة جميع الحقول' : 'Please fill all fields');
      return;
    }
    if (passwordsMismatch) return;
    const ok = await resetPassword(email, otp, newPassword, confirmPassword);
    if (ok) setStep('done');
    else setError(lang === 'ar' ? 'حدث خطأ، حاول مجدداً' : 'Something went wrong, try again');
  };

  return (
    <div
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-primary/10 via-background to-accent/10 px-4 py-24 sm:px-6"
      dir={lang === 'ar' ? 'rtl' : 'ltr'}
    >
      <div className="absolute left-4 right-4 top-4 flex items-center justify-between sm:left-6 sm:right-6 sm:top-6">
        <Link
          to="/login"
          className="inline-flex h-10 items-center gap-2 rounded-lg border border-[#d9a928]/70 bg-[#0b1e48] px-3 text-sm font-medium text-white shadow-md transition-all duration-200 hover:border-[#d9a928] hover:bg-[#d9a928] hover:text-[#0b1e48] hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d9a928] focus-visible:ring-offset-2"
        >
          <ArrowLeft className="h-4 w-4" />
          {lang === 'ar' ? 'العودة لتسجيل الدخول' : 'Back to Login'}
        </Link>
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleLang}
          className="h-10 gap-2 rounded-lg border border-[#d9a928]/70 bg-[#0b1e48] px-3 text-white shadow-md transition-all duration-200 hover:border-[#d9a928] hover:bg-[#d9a928] hover:text-[#0b1e48] hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d9a928] focus-visible:ring-offset-2"
        >
          <Globe className="w-4 h-4" />
          {lang === 'ar' ? 'English' : 'العربية'}
        </Button>
      </div>

      <Card className="w-full max-w-xl rounded-2xl border-0 shadow-2xl">
        <CardHeader className="px-6 pb-5 pt-8 text-center sm:px-12 sm:pt-12">
          <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-2xl bg-primary shadow-lg">
            <Key className="h-10 w-10 text-primary-foreground" />
          </div>
          <CardTitle className="text-3xl font-bold text-[#031c4e] sm:text-4xl">
            {lang === 'ar' ? 'استعادة كلمة المرور' : 'Reset Password'}
          </CardTitle>
          <CardDescription className="mt-3 text-base leading-7 sm:text-lg">
            {step === 'request' && (lang === 'ar' ? 'أدخل بريدك الإلكتروني لإرسال رمز التحقق' : 'Enter your email to receive a verification code')}
            {step === 'verify' && (lang === 'ar' ? `أدخل رمز التحقق المرسل إلى ${maskEmail(email)}` : `Enter the verification code sent to ${maskEmail(email)}`)}
            {step === 'reset' && (lang === 'ar' ? 'قم بتعيين كلمة مرور جديدة' : 'Set a new password')}
            {step === 'done' && (lang === 'ar' ? 'تم تغيير كلمة المرور بنجاح' : 'Password changed successfully')}
          </CardDescription>
        </CardHeader>
        <CardContent className="px-6 pb-8 sm:px-12 sm:pb-12">
          {step === 'request' && (
            <form onSubmit={handleRequestOtp} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-base">{lang === 'ar' ? 'البريد الإلكتروني' : 'Email'}</Label>
                <Input id="email" type="email" className="h-12 text-base" placeholder="user@aleppo.edu" value={email} onChange={e => setEmail(e.target.value)} required />
              </div>
              {error && <p className="text-sm text-destructive font-medium">{error}</p>}
              <Button type="submit" className="h-12 w-full text-base font-semibold" disabled={loading}>
                {loading ? (lang === 'ar' ? 'جاري الإرسال...' : 'Sending...') : (lang === 'ar' ? 'إرسال رمز التحقق' : 'Send verification code')}
              </Button>
            </form>
          )}

          {step === 'verify' && (
            <form onSubmit={handleVerifyOtp} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="otp" className="text-base">{lang === 'ar' ? 'رمز التحقق' : 'Verification code'}</Label>
                <InputOTP
                  id="otp"
                  value={otp}
                  onChange={setOtp}
                  maxLength={6}
                  pattern="[0-9]*"
                  inputMode="numeric"
                  aria-label={lang === 'ar' ? 'رمز التحقق' : 'Verification code'}
                  containerClassName="justify-center gap-2 sm:gap-3"
                  render={({ slots }) => (
                    <div className="flex justify-center gap-2 sm:gap-3">
                      {slots.map((slot, index) => (
                        <div
                          key={index}
                          className={`flex h-12 w-10 items-center justify-center rounded-lg border bg-background text-xl font-semibold transition-all sm:h-14 sm:w-14 sm:rounded-xl sm:text-2xl ${
                            slot.isActive
                              ? 'border-primary ring-2 ring-primary/30'
                              : 'border-input'
                          }`}
                        >
                          {slot.char || <span className="text-muted-foreground">-</span>}
                        </div>
                      ))}
                    </div>
                  )}
                />
              </div>
              {error && <p className="text-sm text-destructive font-medium">{error}</p>}
              {resendMessage && <p className="text-sm text-emerald-600 font-medium">{resendMessage}</p>}
              <Button type="submit" className="h-12 w-full text-base font-semibold" disabled={loading}>
                {loading ? (lang === 'ar' ? 'جاري التحقق...' : 'Verifying...') : (lang === 'ar' ? 'تحقق' : 'Verify')}
              </Button>
              <div className="text-center text-sm">
                {resendIn > 0 ? (
                  <span className="text-muted-foreground">
                    {lang === 'ar' ? `يمكنك إعادة إرسال الرمز خلال ${formatCountdown(resendIn)}` : `You can resend the code in ${formatCountdown(resendIn)}`}
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={loading}
                    className="text-primary font-medium hover:underline disabled:opacity-50"
                  >
                    {lang === 'ar' ? 'إعادة إرسال الرمز' : 'Resend code'}
                  </button>
                )}
              </div>
            </form>
          )}

          {step === 'reset' && (
            <form onSubmit={handleResetPassword} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="newPassword" className="text-base">{lang === 'ar' ? 'كلمة المرور الجديدة' : 'New Password'}</Label>
                <Input id="newPassword" type="password" className="h-12 text-base" value={newPassword} onChange={e => setNewPassword(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-base">{lang === 'ar' ? 'تأكيد كلمة المرور' : 'Confirm New Password'}</Label>
                <Input id="confirmPassword" type="password" className="h-12 text-base" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />
                {passwordsMismatch && (
                  <p className="text-xs text-destructive font-medium">
                    {lang === 'ar' ? 'كلمتا المرور غير متطابقتين' : 'Passwords do not match'}
                  </p>
                )}
              </div>
              {error && <p className="text-sm text-destructive font-medium">{error}</p>}
              <Button type="submit" className="h-12 w-full text-base font-semibold" disabled={loading || passwordsMismatch}>
                {loading ? (lang === 'ar' ? 'جاري الإرسال...' : 'Submitting...') : (lang === 'ar' ? 'تغيير كلمة المرور' : 'Change Password')}
              </Button>
            </form>
          )}

          {step === 'done' && (
            <Link
              to="/login"
              className="inline-flex items-center justify-center gap-2 text-sm text-primary hover:underline w-full"
            >
              <ArrowLeft className="w-4 h-4" />
              {lang === 'ar' ? 'الذهاب لتسجيل الدخول' : 'Go to Login'}
            </Link>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ForgotPasswordPage;
