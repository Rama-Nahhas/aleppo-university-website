import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Key, Globe } from 'lucide-react';

const ChangePasswordPage: React.FC = () => {
  const { changePassword } = useAuth();
  const { lang, t, toggleLang } = useLanguage();
  const navigate = useNavigate();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError(t('changePassword.fill_all') ?? 'Please fill all fields');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError(t('changePassword.password_mismatch') ?? 'Passwords do not match');
      return;
    }

    setLoading(true);
    const result = await changePassword(currentPassword, newPassword, confirmPassword);
    setLoading(false);

    if (!result.success) {
      setError(result.message || t('changePassword.error'));
      return;
    }

    setSuccess(t('changePassword.success') ?? 'Password changed successfully.');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-accent/10 p-4" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <div className="absolute top-4 right-4">
        <Button variant="ghost" size="sm" onClick={toggleLang} className="gap-1">
          <Globe className="w-4 h-4" />
          {lang === 'ar' ? 'English' : 'العربية'}
        </Button>
      </div>
      <Card className="w-full max-w-lg shadow-2xl border-0">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mb-4 shadow-lg">
            <Key className="w-8 h-8 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl font-bold">{lang === 'ar' ? 'تغيير كلمة المرور' : 'Change Password'}</CardTitle>
          <CardDescription className="text-base">{lang === 'ar' ? 'قم بتحديث كلمة المرور الخاصة بك بأمان' : 'Update your password securely'}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">{t('current_password') ?? 'Current Password'}</Label>
              <Input id="currentPassword" type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newPassword">{t('new_password') ?? 'New Password'}</Label>
              <Input id="newPassword" type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">{t('confirm_password') ?? 'Confirm New Password'}</Label>
              <Input id="confirmPassword" type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />
            </div>
            {error && <p className="text-sm text-destructive font-medium">{error}</p>}
            {success && <p className="text-sm text-success font-medium">{success}</p>}
            <div className="flex flex-col gap-3">
              <Button type="submit" className="w-full h-11 text-base font-semibold" disabled={loading}>{loading ? (t('changePassword.submitting') ?? 'Submitting...') : (t('changePassword.submit') ?? 'Change Password')}</Button>
              <Link to="/dashboard" className="inline-flex items-center justify-center gap-2 text-sm text-primary hover:underline">
                <ArrowLeft className="w-4 h-4" />
                {lang === 'ar' ? 'العودة إلى لوحة التحكم' : 'Back to dashboard'}
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChangePasswordPage;
