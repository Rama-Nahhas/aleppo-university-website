import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { hospitals, clinics, users, hospitalDepartments } from '@/data/mockData';
import { Building2, Stethoscope, Calendar, MapPin, Clock, User } from 'lucide-react';

const HospitalsPage: React.FC = () => {
  const { lang, t } = useLanguage();
  const [bookingOpen, setBookingOpen] = useState(false);
  const [selectedClinic, setSelectedClinic] = useState('');
  const hospitalDoctors = users.filter(u => u.hospitalRole);

  return (
    <div>
      {/* Hero */}
      <section className="bg-primary text-primary-foreground py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-extrabold mb-3">{t('hospital.title')}</h1>
          <p className="opacity-80 max-w-xl mx-auto">
            {lang === 'ar' ? 'خدمات طبية متكاملة في مستشفياتنا الجامعية' : 'Comprehensive medical services in our university hospitals'}
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-12 space-y-12">
        {/* Hospitals list */}
        <section>
          <div className="grid md:grid-cols-2 gap-6">
            {hospitals.map(h => {
              const hClinics = clinics.filter(c => c.hospital_id === h.id);
              const hDepts = hospitalDepartments.filter(d => d.hospital_id === h.id);
              return (
                <Card key={h.id} className="border-0 shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center flex-shrink-0">
                        <Building2 className="w-7 h-7 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-foreground">{lang === 'ar' ? h.name : h.nameEn}</h3>
                        <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                          <MapPin className="w-3.5 h-3.5" /> {lang === 'ar' ? h.location : h.locationEn}
                        </p>
                        <div className="flex gap-4 mt-3 text-xs text-muted-foreground">
                          <span>{hClinics.length} {lang === 'ar' ? 'عيادة' : 'clinics'}</span>
                          <span>{hDepts.length} {lang === 'ar' ? 'قسم' : 'departments'}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Clinics */}
        <section>
          <h2 className="text-2xl font-bold text-primary mb-6 flex items-center gap-2">
            <Stethoscope className="w-6 h-6" />
            {t('hospital.clinics')}
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {clinics.map(c => (
              <Card key={c.id} className="border-0 shadow-sm hover:shadow-md transition-shadow cursor-pointer" onClick={() => { setSelectedClinic(String(c.id)); setBookingOpen(true); }}>
                <CardContent className="p-5 text-center">
                  <div className="w-10 h-10 bg-accent/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Stethoscope className="w-5 h-5 text-accent" />
                  </div>
                  <h3 className="font-bold text-sm text-foreground">{lang === 'ar' ? c.name : c.nameEn}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{lang === 'ar' ? c.specialty : c.specialtyEn}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Doctors */}
        <section>
          <h2 className="text-2xl font-bold text-primary mb-6 flex items-center gap-2">
            <User className="w-6 h-6" />
            {t('hospital.doctors')}
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {hospitalDoctors.map(d => (
              <Card key={d.id} className="border-0 shadow-sm">
                <CardContent className="p-5 flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground">{lang === 'ar' ? d.name : d.nameEn}</h3>
                    <p className="text-xs text-muted-foreground">{d.email}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Booking Form */}
        {bookingOpen && (
          <section>
            <Card className="border-0 shadow-md max-w-lg mx-auto">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  {t('hospital.bookAppointment')}
                </h2>
                <div className="space-y-4">
                  <Input placeholder={lang === 'ar' ? 'الاسم الكامل' : 'Full name'} />
                  <Select value={selectedClinic} onValueChange={setSelectedClinic}>
                    <SelectTrigger><SelectValue placeholder={lang === 'ar' ? 'اختر العيادة' : 'Select clinic'} /></SelectTrigger>
                    <SelectContent>
                      {clinics.map(c => (
                        <SelectItem key={c.id} value={String(c.id)}>{lang === 'ar' ? c.name : c.nameEn}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input type="date" />
                  <div className="flex gap-3">
                    <Button className="flex-1 bg-primary">{lang === 'ar' ? 'حجز الموعد' : 'Book'}</Button>
                    <Button variant="outline" onClick={() => setBookingOpen(false)}>{t('action.cancel')}</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>
        )}

        {/* Services */}
        <section>
          <h2 className="text-2xl font-bold text-primary mb-6">{t('hospital.services')}</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { icon: '🏥', title: lang === 'ar' ? 'الطوارئ 24/7' : 'Emergency 24/7', desc: lang === 'ar' ? 'خدمات طوارئ على مدار الساعة' : 'Round-the-clock emergency services' },
              { icon: '🔬', title: lang === 'ar' ? 'المختبرات الطبية' : 'Medical Labs', desc: lang === 'ar' ? 'تحاليل طبية شاملة' : 'Comprehensive medical tests' },
              { icon: '📱', title: lang === 'ar' ? 'الحجز الإلكتروني' : 'Online Booking', desc: lang === 'ar' ? 'احجز موعدك إلكترونياً' : 'Book your appointment online' },
            ].map((s, i) => (
              <Card key={i} className="border-0 shadow-sm">
                <CardContent className="p-5 text-center">
                  <span className="text-3xl mb-3 block">{s.icon}</span>
                  <h3 className="font-bold text-foreground mb-1">{s.title}</h3>
                  <p className="text-sm text-muted-foreground">{s.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default HospitalsPage;
