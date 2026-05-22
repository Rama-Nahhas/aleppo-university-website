import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';
import { medicalRecords, users } from '@/data/mockData';
import { FileText } from 'lucide-react';

const PatientsPage: React.FC = () => {
  const { lang } = useLanguage();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground flex items-center gap-2"><FileText className="w-6 h-6" />{lang === 'ar' ? 'المرضى والسجلات الطبية' : 'Patients & Medical Records'}</h1>
      <div className="space-y-3">
        {medicalRecords.map(r => {
          const patient = users.find(u => u.id === r.patient_id);
          const doctor = users.find(u => u.id === r.doctor_id);
          return (
            <Card key={r.id} className="border-0 shadow-sm">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-foreground">{lang === 'ar' ? patient?.name : patient?.nameEn}</h3>
                  <span className="text-xs text-muted-foreground">{r.date}</span>
                </div>
                <p className="text-sm"><span className="font-semibold text-primary">{lang === 'ar' ? 'التشخيص: ' : 'Diagnosis: '}</span>{lang === 'ar' ? r.diagnosis : r.diagnosisEn}</p>
                <p className="text-sm mt-1"><span className="font-semibold text-primary">{lang === 'ar' ? 'العلاج: ' : 'Treatment: '}</span>{lang === 'ar' ? r.treatment : r.treatmentEn}</p>
                <p className="text-xs text-muted-foreground mt-2">{lang === 'ar' ? 'الطبيب: ' : 'Doctor: '}{lang === 'ar' ? doctor?.name : doctor?.nameEn}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default PatientsPage;
