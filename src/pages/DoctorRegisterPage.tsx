import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { ArrowLeft, GraduationCap } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const DoctorRegisterPage: React.FC = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    specialization: '',
    university: '',
    graduation_year: '',
    employment_year: '',
    work_history: '',
    role: 'doctor',
  });

  const handleChange = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const { registerDoctor } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { ...form };
      // ensure role is set to 'doctor'
      payload.role = 'doctor';
      const res = await registerDoctor(payload as any);
      if (res.success) {
        // redirect to login or OTP verify page if exists
        navigate('/login');
      } else {
        alert(res.message || 'فشل تسجيل الطبيب');
      }
    } catch (err: any) {
      alert(err?.message || 'خطأ أثناء إرسال البيانات');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-accent/10 p-4">
      <Card className="w-full max-w-xl shadow-2xl border-0">
        <CardHeader className="text-center pb-2">
          <Link to="/register" className="inline-flex items-center gap-1 text-sm opacity-70 hover:opacity-100 mb-4">
            <ArrowLeft className="w-4 h-4" />
            العودة
          </Link>
          <div className="mx-auto w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mb-4 shadow-lg">
            <GraduationCap className="w-8 h-8 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl font-bold">تسجيل دكتور</CardTitle>
          <CardDescription className="text-base">أدخل بياناتك لتصبح عضواً في المنصة</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">الاسم</Label>
                <Input id="name" value={form.name} onChange={e => handleChange('name', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">البريد الإلكتروني</Label>
                <Input id="email" type="email" value={form.email} onChange={e => handleChange('email', e.target.value)} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">كلمة المرور</Label>
              <Input id="password" type="password" value={form.password} onChange={e => handleChange('password', e.target.value)} />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="specialization">التخصص</Label>
                <Input id="specialization" value={form.specialization} onChange={e => handleChange('specialization', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="university">الجامعة</Label>
                <Input id="university" value={form.university} onChange={e => handleChange('university', e.target.value)} />
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="graduation_year">سنة التخرج</Label>
                <Input id="graduation_year" value={form.graduation_year} onChange={e => handleChange('graduation_year', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="employment_year">سنة العمل</Label>
                <Input id="employment_year" value={form.employment_year} onChange={e => handleChange('employment_year', e.target.value)} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="work_history">سيرة العمل</Label>
              <Input id="work_history" value={form.work_history} onChange={e => handleChange('work_history', e.target.value)} />
            </div>
            <Button className="w-full" type="submit" disabled={loading}>{loading ? 'جاري الإنشاء...' : 'إنشاء حساب الدكتور'}</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default DoctorRegisterPage;
