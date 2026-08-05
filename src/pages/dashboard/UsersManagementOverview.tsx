import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { users, doctorRequests, laboratories } from '@/data/mockData';
import { Users, Stethoscope, FlaskConical, GraduationCap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const UsersManagementOverview: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div dir="rtl" className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">إدارة المستخدمين</h1>
          <p className="text-muted-foreground">نظرة عامة سريعة على حالات المستخدمين المختلفة</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-0 shadow-sm cursor-pointer" onClick={() => navigate('/dashboard/users/doctor-requests')}>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center text-white"><Stethoscope className="w-5 h-5" /></div>
            <div>
              <p className="font-bold">طلبات الأطباء</p>
              <p className="text-sm text-muted-foreground">{doctorRequests.length} طلب</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm cursor-pointer" onClick={() => navigate('/dashboard/users/active-doctors')}>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-white"><Users className="w-5 h-5" /></div>
            <div>
              <p className="font-bold">الأطباء النشطون</p>
              <p className="text-sm text-muted-foreground">{users.filter(u => [3,9].includes(u.role_id)).length} طبيب</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm cursor-pointer" onClick={() => navigate('/dashboard/users/students')}>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center text-white"><GraduationCap className="w-5 h-5" /></div>
            <div>
              <p className="font-bold">الطلاب</p>
              <p className="text-sm text-muted-foreground">{users.filter(u => u.role_id === 6).length} طالب</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm cursor-pointer" onClick={() => navigate('/dashboard/users/others')}>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 bg-violet-500 rounded-xl flex items-center justify-center text-white"><FlaskConical className="w-5 h-5" /></div>
            <div>
              <p className="font-bold">المستخدمون الآخرون</p>
              <p className="text-sm text-muted-foreground">{users.filter(u => ![3,9,6].includes(u.role_id)).length} مستخدم</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UsersManagementOverview;
