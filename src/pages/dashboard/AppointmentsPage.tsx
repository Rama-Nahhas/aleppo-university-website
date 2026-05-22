import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { appointments, clinics, users } from '@/data/mockData';
import { Calendar, Check, Clock } from 'lucide-react';

const AppointmentsPage: React.FC = () => {
  const { user } = useAuth();
  const { lang } = useLanguage();
  const myAppointments = appointments.filter(a => a.doctor_id === user?.id || user?.role?.name === 'admin' || user?.role?.name === 'nurse');

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground flex items-center gap-2"><Calendar className="w-6 h-6" />{lang === 'ar' ? 'المواعيد الطبية' : 'Medical Appointments'}</h1>
      <div className="space-y-3">
        {myAppointments.map(a => {
          const patient = users.find(u => u.id === a.patient_id);
          const doctor = users.find(u => u.id === a.doctor_id);
          const clinic = clinics.find(c => c.id === a.clinic_id);
          return (
            <Card key={a.id} className="border-0 shadow-sm">
              <CardContent className="p-5 flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${a.status === 'completed' ? 'bg-emerald-100' : 'bg-amber-100'}`}>
                    {a.status === 'completed' ? <Check className="w-5 h-5 text-emerald-600" /> : <Clock className="w-5 h-5 text-amber-600" />}
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground text-sm">{lang === 'ar' ? patient?.name : patient?.nameEn}</h3>
                    <p className="text-xs text-muted-foreground">{lang === 'ar' ? clinic?.name : clinic?.nameEn}</p>
                    <p className="text-xs text-muted-foreground">{lang === 'ar' ? 'الطبيب: ' : 'Doctor: '}{lang === 'ar' ? doctor?.name : doctor?.nameEn}</p>
                  </div>
                </div>
                <div className="text-end">
                  <p className="text-sm font-semibold text-primary">{a.date}</p>
                  <p className="text-xs text-muted-foreground">{a.time}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default AppointmentsPage;
