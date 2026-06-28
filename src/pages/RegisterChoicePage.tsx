import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { GraduationCap, UserRound, Stethoscope } from 'lucide-react';

const RegisterChoicePage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-accent/10 p-4">
      <Card className="w-full max-w-2xl shadow-2xl border-0">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mb-4 shadow-lg">
            <GraduationCap className="w-8 h-8 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl font-bold">إنشاء حساب جديد</CardTitle>
          <CardDescription className="text-base">اختر النوع الذي يناسبك للمتابعة</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <Link to="/register/student" className="block">
            <div className="rounded-xl border p-6 hover:border-primary hover:shadow-md transition-all">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <UserRound className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold">طالب</h3>
              <p className="mt-2 text-sm text-muted-foreground">إنشاء حساب طالب للالتحاق بالمنصة</p>
               </div>
          </Link>

          <Link to="/register/doctor" className="block">
            <div className="rounded-xl border p-6 hover:border-primary hover:shadow-md transition-all">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Stethoscope className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold">دكتور</h3>
              <p className="mt-2 text-sm text-muted-foreground">إنشاء حساب طبيب أو أستاذ جامعي</p>

            </div>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
};

export default RegisterChoicePage;
