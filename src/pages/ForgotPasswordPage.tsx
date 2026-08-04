import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-accent/10 p-4"
      dir={lang === 'ar' ? 'rtl' : 'ltr'}
    >
      <div className="absolute top-4 right-4 flex flex-col items-end gap-2">
        <Button variant="ghost" size="sm" onClick={toggleLang} className="gap-1">
          <Globe className="w-4 h-4" />
          {lang === 'ar' ? 'English' : 'العربية'}
        </Button>
        <Link to="/login" className="inline-flex items-center gap-1 text-sm opacity-70 hover:opacity-100">
          <ArrowLeft className="w-4 h-4" />
          {lang === 'ar' ? 'العودة لتسجيل الدخول' : 'Back to Login'}
        </Link>
      </div>

      <Card className="w-full max-w-md shadow-2xl border-0">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mb-4 shadow-lg">
            <Key className="w-8 h-8 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl font-bold">
            {lang === 'ar' ? 'استعادة كلمة المرور' : 'Reset Password'}
          </CardTitle>
          <CardDescription className="text-base">
            {step === 'request' && (lang === 'ar' ? 'أدخل بريدك الإلكتروني لإرسال رمز التحقق' : 'Enter your email to receive a verification code')}
            {step === 'verify' && (lang === 'ar' ? `أدخل رمز التحقق المرسل إلى ${maskEmail(email)}` : `Enter the verification code sent to ${maskEmail(email)}`)}
            {step === 'reset' && (lang === 'ar' ? 'قم بتعيين كلمة مرور جديدة' : 'Set a new password')}
            {step === 'done' && (lang === 'ar' ? 'تم تغيير كلمة المرور بنجاح' : 'Password changed successfully')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {step === 'request' && (
            <form onSubmit={handleRequestOtp} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">{lang === 'ar' ? 'البريد الإلكتروني' : 'Email'}</Label>
                <Input id="email" type="email" placeholder="user@aleppo.edu" value={email} onChange={e => setEmail(e.target.value)} required />
              </div>
              {error && <p className="text-sm text-destructive font-medium">{error}</p>}
              <Button type="submit" className="w-full h-11 text-base font-semibold" disabled={loading}>
                {loading ? (lang === 'ar' ? 'جاري الإرسال...' : 'Sending...') : (lang === 'ar' ? 'إرسال رمز التحقق' : 'Send verification code')}
              </Button>
            </form>
          )}

          {step === 'verify' && (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="otp">{lang === 'ar' ? 'رمز التحقق' : 'Verification code'}</Label>
                <Input id="otp" type="text" value={otp} onChange={e => setOtp(e.target.value)} required />
              </div>
              {error && <p className="text-sm text-destructive font-medium">{error}</p>}
              {resendMessage && <p className="text-sm text-emerald-600 font-medium">{resendMessage}</p>}
              <Button type="submit" className="w-full h-11 text-base font-semibold" disabled={loading}>
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
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="newPassword">{lang === 'ar' ? 'كلمة المرور الجديدة' : 'New Password'}</Label>
                <Input id="newPassword" type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">{lang === 'ar' ? 'تأكيد كلمة المرور' : 'Confirm New Password'}</Label>
                <Input id="confirmPassword" type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />
                {passwordsMismatch && (
                  <p className="text-xs text-destructive font-medium">
                    {lang === 'ar' ? 'كلمتا المرور غير متطابقتين' : 'Passwords do not match'}
                  </p>
                )}
              </div>
              {error && <p className="text-sm text-destructive font-medium">{error}</p>}
              <Button type="submit" className="w-full h-11 text-base font-semibold" disabled={loading || passwordsMismatch}>
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
