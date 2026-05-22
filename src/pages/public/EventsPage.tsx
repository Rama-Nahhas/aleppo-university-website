import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';
import { newsEvents, announcements } from '@/data/mockData';
import { Calendar, GraduationCap } from 'lucide-react';

const EventsPage: React.FC = () => {
  const { lang, t } = useLanguage();

  return (
    <div>
      <section className="bg-primary text-primary-foreground py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-extrabold">{t('events.title')}</h1>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-12 space-y-12">
        <section>
          <h2 className="text-2xl font-bold text-primary mb-6 flex items-center gap-2">
            <Calendar className="w-6 h-6" />
            {t('events.upcoming')}
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {newsEvents.map(e => (
              <Card key={e.id} className="border-0 shadow-sm overflow-hidden">
                <div className="h-48 bg-primary/10 flex items-center justify-center">
                  <GraduationCap className="w-20 h-20 text-primary/20" />
                </div>
                <CardContent className="p-5">
                  <p className="text-sm text-accent font-semibold mb-2 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(e.date).toLocaleDateString(lang === 'ar' ? 'ar-SY' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                  <h3 className="text-lg font-bold text-foreground mb-2">{lang === 'ar' ? e.title : e.titleEn}</h3>
                  <p className="text-sm text-muted-foreground">{lang === 'ar' ? e.excerpt : e.excerptEn}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-primary mb-6">{t('dash.announcements')}</h2>
          <div className="space-y-3">
            {announcements.map(a => (
              <Card key={a.id} className="border-0 shadow-sm">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-bold text-foreground">{lang === 'ar' ? a.title : a.titleEn}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{lang === 'ar' ? a.content : a.contentEn}</p>
                    </div>
                    <p className="text-xs text-muted-foreground whitespace-nowrap">
                      {new Date(a.created_at).toLocaleDateString(lang === 'ar' ? 'ar-SY' : 'en-US')}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default EventsPage;
