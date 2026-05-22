import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';
import { colleges } from '@/data/mockData';
import { Building2 } from 'lucide-react';

const CollegesListPage: React.FC = () => {
  const { lang, t } = useLanguage();

  return (
    <div>
      <section className="bg-primary text-primary-foreground py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-extrabold">{t('nav.colleges')}</h1>
          <p className="opacity-80 mt-2">{colleges.length} {lang === 'ar' ? 'كلية ومعهد' : 'colleges and institutes'}</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {colleges.map(c => (
            <Link key={c.id} to={`/college/${c.slug}`}>
              <Card className="border-0 shadow-sm hover:shadow-md transition-all hover:-translate-y-1 cursor-pointer h-full">
                <CardContent className="p-5 text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Building2 className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-sm font-bold text-foreground">{lang === 'ar' ? c.name : c.nameEn}</h3>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CollegesListPage;
