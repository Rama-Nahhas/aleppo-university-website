import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { GraduationCap, Eye, EyeOff, Globe,ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const { lang, t, toggleLang } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const success = await login(email, password);
    if (!success) {
      setError(t('login.error'));
    }
  };

  // const demoAccounts = [
  //   { label: lang === 'ar' ? 'مدير' : 'Admin', email: 'admin@aleppo.edu', pass: 'admin123' },
  //   { label: lang === 'ar' ? 'دكتور الجامعي' : 'Acadimic_Doctor', email: 'doctor@aleppo.edu', pass: 'doctor123' },
  //   { label: lang === 'ar' ? 'طالب' : 'Student', email: 'student@aleppo.edu', pass: 'student123' },
  //   { label: lang === 'ar' ? 'أمين مستودع' : 'Warehouse', email: 'warehouse@aleppo.edu', pass: 'warehouse123' },
  //   { label: lang === 'ar' ? 'فني مخبر' : 'Lab Tech', email: 'lab@aleppo.edu', pass: 'lab123' },
  //   { label: lang === 'ar' ? 'موظف' : 'Staff', email: 'staff@aleppo.edu', pass: 'staff123' },
  //   { label: lang === 'ar' ? 'الطبيب' : 'Medical_Doctor', email: 'medical@aleppo.edu', pass: 'medical123' },
  //   { label: lang === 'ar' ? 'عميد الكلية' : 'Dean', email: 'dean@aleppo.edu', pass: 'dean123' },
  //   { label: lang === 'ar' ? 'مدير الجامعة' : 'University Director', email: 'director@aleppo.edu', pass: 'director123' },
  // ];

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
          <CardTitle className="text-2xl font-bold">{lang === 'ar' ? 'جامعة حلب' : 'University of Aleppo'}</CardTitle>
          <CardDescription className="text-base">{t('login.title')}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">{t('login.email')}</Label>
              <Input id="email" type="email" placeholder="admin@aleppo.edu" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">{t('login.password')}</Label>
              <div className="relative">
                <Input id="password" type={showPassword ? 'text' : 'password'} placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required />
                <button type="button" className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            {error && <p className="text-sm text-destructive font-medium">{error}</p>}
            <Button type="submit" className="w-full h-11 text-base font-semibold">{t('login.submit')}</Button>
          </form>
          {/* <div className="mt-6 p-3 bg-muted rounded-lg">
            <p className="text-xs text-muted-foreground font-medium mb-2">{t('login.demo')}:</p>
            <div className="space-y-1 text-xs text-muted-foreground">
              {demoAccounts.map(a => (
                <p key={a.email} className="cursor-pointer hover:text-primary" onClick={() => { setEmail(a.email); setPassword(a.pass); }}>
                  {a.label}: {a.email} / {a.pass}
                </p>
              ))}
            </div>
          </div> */}
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;
