import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';
import { maintenanceReports, laboratories } from '@/data/mockData';
import { Wrench } from 'lucide-react';

const MaintenancePage: React.FC = () => {
  const { lang } = useLanguage();

  const statusLabel = (s: string) => {
    const map: Record<string, { ar: string; en: string; cls: string }> = {
      completed: { ar: 'مكتمل', en: 'Completed', cls: 'bg-emerald-100 text-emerald-700' },
      pending: { ar: 'قيد الانتظار', en: 'Pending', cls: 'bg-amber-100 text-amber-700' },
      in_progress: { ar: 'جاري التنفيذ', en: 'In Progress', cls: 'bg-blue-100 text-blue-700' },
    };
    return map[s] || map.pending;
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground flex items-center gap-2"><Wrench className="w-6 h-6" />{lang === 'ar' ? 'تقارير الصيانة' : 'Maintenance Reports'}</h1>
      <div className="space-y-3">
        {maintenanceReports.map(r => {
          const lab = laboratories.find(l => l.id === r.lab_id);
          const st = statusLabel(r.status);
          return (
            <Card key={r.id} className="border-0 shadow-sm">
              <CardContent className="p-5 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-foreground">{lang === 'ar' ? r.description : r.descriptionEn}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{lang === 'ar' ? lab?.name : lab?.nameEn} • {r.date}</p>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${st.cls}`}>{lang === 'ar' ? st.ar : st.en}</span>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default MaintenancePage;
