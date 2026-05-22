import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

const ContactPage: React.FC = () => {
  const { lang, t } = useLanguage();
  const [sent, setSent] = useState(false);

  return (
    <div>
      <section className="bg-primary text-primary-foreground py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-extrabold">{t('contact.title')}</h1>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            {[
              { icon: MapPin, title: lang === 'ar' ? 'العنوان' : 'Address', text: t('footer.address') },
              { icon: Phone, title: t('contact.phone'), text: '+963-21-2633010' },
              { icon: Mail, title: lang === 'ar' ? 'البريد الإلكتروني' : 'Email', text: 'info@alepuniv.edu.sy' },
              { icon: Clock, title: lang === 'ar' ? 'ساعات العمل' : 'Working Hours', text: lang === 'ar' ? 'الأحد - الخميس: 8:00 - 16:00' : 'Sun - Thu: 8:00 AM - 4:00 PM' },
            ].map((item, i) => (
              <Card key={i} className="border-0 shadow-sm">
                <CardContent className="p-5 flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.text}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold text-primary mb-4">{lang === 'ar' ? 'أرسل رسالة' : 'Send a Message'}</h2>
              {sent ? (
                <div className="text-center py-8">
                  <p className="text-lg font-bold text-primary">✓ {lang === 'ar' ? 'تم إرسال رسالتك بنجاح' : 'Message sent successfully'}</p>
                </div>
              ) : (
                <form onSubmit={e => { e.preventDefault(); setSent(true); }} className="space-y-4">
                  <Input placeholder={t('contact.name')} required />
                  <Input type="email" placeholder={t('login.email')} required />
                  <Textarea placeholder={t('contact.message')} rows={5} required />
                  <Button type="submit" className="w-full bg-primary">{t('contact.send')}</Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
