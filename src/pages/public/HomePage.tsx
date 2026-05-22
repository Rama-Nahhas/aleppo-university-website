import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { newsEvents, colleges, announcements } from '@/data/mockData';
import { GraduationCap, Calendar , BookOpen, Users, FlaskConical, Building2, ArrowLeft, ArrowRight, Star, Award, Globe } from 'lucide-react';


const HomePage: React.FC = () => {
  const { lang, t } = useLanguage();
  const Arrow = lang === 'ar' ? ArrowLeft : ArrowRight;

  const quickStats = [
    { icon: Building2, value: '18+', label: lang === 'ar' ? 'كلية ومعهد' : 'Colleges & Institutes' },
    { icon: Users, value: '60,000+', label: lang === 'ar' ? 'طالب وطالبة' : 'Students' },
    { icon: BookOpen, value: '500+', label: lang === 'ar' ? 'برنامج أكاديمي' : 'Academic Programs' },
    { icon: FlaskConical, value: '120+', label: lang === 'ar' ? 'مخبر بحثي' : 'Research Labs' },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="relative bg-primary min-h-[500px] flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/95 to-primary/80" />
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-96 h-96 rounded-full bg-accent blur-[120px]" />
          <div className="absolute bottom-10 right-20 w-72 h-72 rounded-full bg-sky-400 blur-[100px]" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 py-20 text-primary-foreground text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-1.5 text-sm mb-6">
            <Star className="w-4 h-4 text-accent" />
            <span>{lang === 'ar' ? 'تأسست عام 1946' : 'Established 1946'}</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4 leading-tight">{t('hero.title')}</h1>
          <p className="text-lg md:text-xl opacity-85 max-w-2xl mx-auto mb-8">{t('hero.subtitle')}</p>
         {/*<div className="flex items-center justify-center gap-4 flex-wrap">
            <Button size="lg" className="bg-accent text-primary hover:bg-accent/90 font-bold px-8">
              {t('hero.cta')}
            </Button>
            <Button size="lg" variant="outline" className="border-white/30 text-primary-foreground hover:bg-white/10">
              {t('hero.learn')}
              <Arrow className="w-4 h-4 ms-2" />
            </Button>
          </div> */}
        </div>
      </section>


{(() => {
  // نضمن أن عدد العناصر كافٍ لملء الشاشة دائماً
  // الحل: نكرر حتى نصل لـ 16 عنصر على الأقل، ثم نضاعف للـ seamless loop
  const minVisible = 4;
  const repeatCount = Math.ceil(minVisible / newsEvents.length);
  const singleSet = Array.from({ length: repeatCount }, () => newsEvents).flat();
  // نضاعف مرة واحدة للـ seamless loop (النسخة الأولى + نسخة مطابقة)
  const allItems = [...singleSet, ...singleSet];

  return (
    <div className="ticker-wrap">
      <div className="ticker">
        {allItems.map((event, index) => (
          <span key={index} className="ticker-item">
            ✦ {lang === 'ar' ? event.title : event.titleEn}
          </span>
        ))}
      </div>
    </div>
  );
})()}
    



      {/* Stats bar */}
      <section className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {quickStats.map((s, i) => (
              <div key={i} className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-2">
                  <s.icon className="w-6 h-6 text-primary" />
                </div>
                <p className="text-2xl font-extrabold text-primary">{s.value}</p>
                <p className="text-sm text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-extrabold text-primary">{t('about.title')}</h2>
            <div className="w-16 h-1 bg-accent mx-auto mt-3 rounded-full" />
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Award, title: t('about.mission.title'), text: t('about.mission.text') },
              { icon: Globe, title: t('about.vision.title'), text: t('about.vision.text') },
              { icon: GraduationCap, title: t('about.excellence.title'), text: t('about.excellence.text') },
            ].map((item, i) => (
              <Card key={i} className="border-0 shadow-sm hover:shadow-md transition-shadow group">
                <CardContent className="p-6 text-center">
                  <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <item.icon className="w-7 h-7 text-primary group-hover:text-primary-foreground" />
                  </div>
                  <h3 className="text-lg font-bold text-primary mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.text}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Colleges */}
      <section className="py-16 bg-card">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-extrabold text-primary">{t('nav.colleges')}</h2>
            <div className="w-16 h-1 bg-accent mx-auto mt-3 rounded-full" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {colleges.slice(0, 8).map(c => (
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
          <div className="text-center mt-8">
            <Link to="/colleges-list">
              <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                {lang === 'ar' ? 'عرض جميع الكليات' : 'View All Colleges'}
                <Arrow className="w-4 h-4 ms-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* News & Events */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-extrabold text-primary">{t('news.title')}</h2>
            <div className="w-16 h-1 bg-accent mx-auto mt-3 rounded-full" />
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {newsEvents.map(n => (
              <Card key={n.id} className="border-0 shadow-sm hover:shadow-md transition-shadow overflow-hidden group">
                <div className="h-40 bg-primary/10 flex items-center justify-center">
                  <GraduationCap className="w-16 h-16 text-primary/30" />
                </div>
                <CardContent className="p-4">
                  <p className="text-xs text-accent font-semibold mb-1">{new Date(n.date).toLocaleDateString(lang === 'ar' ? 'ar-SY' : 'en-US')}</p>
                  <h3 className="font-bold text-sm text-foreground mb-2 line-clamp-2">{lang === 'ar' ? n.title : n.titleEn}</h3>
                  <p className="text-xs text-muted-foreground line-clamp-2">{lang === 'ar' ? n.excerpt : n.excerptEn}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Announcements */}
      <section className="py-16 bg-card">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-extrabold text-primary">{t('dash.announcements')}</h2>
            <div className="w-16 h-1 bg-accent mx-auto mt-3 rounded-full" />
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {announcements.slice(0, 3).map(a => (
              <Card key={a.id} className="border-0 shadow-sm">
                <CardContent className="p-5">
                  <p className="text-xs text-accent font-semibold mb-2">{new Date(a.created_at).toLocaleDateString(lang === 'ar' ? 'ar-SY' : 'en-US')}</p>
                  <h3 className="font-bold text-foreground mb-2">{lang === 'ar' ? a.title : a.titleEn}</h3>
                  <p className="text-sm text-muted-foreground">{lang === 'ar' ? a.content : a.contentEn}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
