import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';


const CentersPage: React.FC = () => {
    const { lang, t } = useLanguage();

return(
    <div>
    <section className="bg-primary text-primary-foreground py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-extrabold mb-3">{t('center.title')}</h1>
          <p className="opacity-80 max-w-xl mx-auto">
            {lang === 'ar' ? ' ' : ''}
          </p>
        </div>
      </section>
      </div>
);
};
export default CentersPage;