import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, GraduationCap } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { newsEvents, announcements } from '@/data/mockData';


const Directorate: React.FC = () => {
  const { lang, t } = useLanguage();

  return (
     <div>
<section className="bg-primary text-primary-foreground py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-extrabold mb-3">{t('directorate.title')}</h1>
          <p className="opacity-80 max-w-xl mx-auto">
            {lang === 'ar' ? ' ' : ''}
          </p>
        </div>
      </section>

        <div className="max-w-7xl mx-auto px-4 py-12 space-y-12">
        <section>
          <h2 className="text-2xl font-bold text-primary mb-6 flex items-center gap-2">
            <Calendar className="w-6 h-6" />
            {t('directorate.name')}
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {newsEvents.map(e => (
              <Card key={e.id} className="border-0 shadow-sm overflow-hidden">
               
                <CardContent className="p-5">
                {/*  <h3 className="text-lg font-bold text-foreground mb-2">{lang === 'ar' ? e.title : e.titleEn}</h3>
                  <p className="text-sm text-muted-foreground">{lang === 'ar' ? e.excerpt : e.excerptEn}</p> */}
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
           </div>




     </div>
  );
};
 export default Directorate;