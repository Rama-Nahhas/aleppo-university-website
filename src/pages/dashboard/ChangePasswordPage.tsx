import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Key } from 'lucide-react';
import { usePasswordResetActions } from '@/hooks/usePasswordResetActions';
import { useToast } from '@/hooks/use-toast';

const ChangePasswordPage: React.FC = () => {
  const { lang, t } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { updateProfilePassword, loading } = usePasswordResetActions();

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const passwordsMismatch = confirmPassword.length > 0 && newPassword !== confirmPassword;

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!newPassword || !confirmPassword) {
      setError(lang === 'ar' ? 'الرجاء تعبئة جميع الحقول' : 'Please fill all fields');
      return;
    }
    if (passwordsMismatch) return;
    const ok = await updateProfilePassword(newPassword, confirmPassword);
    if (ok) {
      toast({
        title: lang === 'ar' ? 'تم تغيير كلمة المرور بنجاح' : 'Password changed successfully',
        className: 'bg-green-600 text-white font-semibold',
      });
      navigate('/dashboard');
    } else setError(lang === 'ar' ? 'حدث خطأ، حاول مجدداً' : 'Something went wrong, try again');
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground">
        {lang === 'ar' ? 'تغيير كلمة المرور' : 'Change Password'}
      </h1>

      <div className="flex items-center justify-center min-h-[70vh]">
        <Card className="w-full max-w-md shadow-2xl border-0">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mb-4 shadow-lg">
              <Key className="w-8 h-8 text-primary-foreground" />
            </div>
            <CardTitle className="text-2xl font-bold">
              {lang === 'ar' ? 'تغيير كلمة المرور' : 'Change Password'}
            </CardTitle>
            <CardDescription className="text-base">
              {lang === 'ar' ? 'قم بتعيين كلمة مرور جديدة' : 'Set a new password'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="newPassword">{t('new_password') ?? (lang === 'ar' ? 'كلمة المرور الجديدة' : 'New Password')}</Label>
                <Input id="newPassword" type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">{t('confirm_password') ?? (lang === 'ar' ? 'تأكيد كلمة المرور' : 'Confirm New Password')}</Label>
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ChangePasswordPage;
