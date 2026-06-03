import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { GraduationCap, Globe, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const RegisterPage: React.FC = () => {
  const { register } = useAuth();
  const { lang, t, toggleLang } = useLanguage();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!name || !email || !password) {
      setError(t('register.fill_all') ?? 'Please fill all fields');
      return;
    }
    if (password !== passwordConfirm) {
      setError(t('register.password_mismatch') ?? 'Passwords do not match');
      return;
    }

    setLoading(true);
    const result = await register(name, email, password, passwordConfirm);
    setLoading(false);

    if (!result.success) {
      setError(result.message || t('register.error'));
      return;
    }

    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-accent/10 p-4" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <div className="absolute top-4 right-4">
        <Button variant="ghost" size="sm" onClick={toggleLang} className="gap-1">
          <Globe className="w-4 h-4" />
          {lang === 'ar' ? 'English' : 'العربية'}
        </Button>
        <br />
        <Link to="/" className="inline-flex items-center gap-1 text-sm opacity-70 hover:opacity-100 mb-4">
           <ArrowLeft className="w-4 h-4" />
           {lang === 'ar' ? 'العودة' : 'Back'}
        </Link>
      </div>

      <Card className="w-full max-w-md shadow-2xl border-0">
        <CardHeader className="text-center pb-2">
          <Link to="/">
            <div className="mx-auto w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mb-4 shadow-lg">
              <GraduationCap className="w-8 h-8 text-primary-foreground" />
            </div>
          </Link>
          <CardTitle className="text-2xl font-bold">{lang === 'ar' ? 'إنشاء حساب' : 'Create an account'}</CardTitle>
          <CardDescription className="text-base">{t('register.title') ?? (lang === 'ar' ? 'أنشئ حسابك' : 'Create your account')}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">{t('name') ?? 'Name'}</Label>
              <Input id="name" type="text" placeholder={lang === 'ar' ? 'الاسم الكامل' : 'Full name'} value={name} onChange={e => setName(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">{t('email') ?? 'Email'}</Label>
              <Input id="email" type="email" placeholder="user@aleppo.edu" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">{t('password') ?? 'Password'}</Label>
              <Input id="password" type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="passwordConfirm">{t('password_confirm') ?? 'Confirm Password'}</Label>
              <Input id="passwordConfirm" type="password" placeholder="••••••••" value={passwordConfirm} onChange={e => setPasswordConfirm(e.target.value)} required />
            </div>
            {error && <p className="text-sm text-destructive font-medium">{error}</p>}
            <Button type="submit" className="w-full h-11 text-base font-semibold" disabled={loading}>{loading ? (t('submitting') ?? 'Submitting...') : (t('submit') ?? 'Register')}</Button>
          </form>
          <div className="mt-4 text-sm text-muted-foreground text-center">
            {lang === 'ar' ? 'هل لديك حساب؟' : 'Already have an account?'} <Link to="/login" className="text-primary font-medium">{lang === 'ar' ? 'تسجيل الدخول' : 'Login'}</Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RegisterPage;
