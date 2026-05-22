import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { GraduationCap, Phone, Mail, MapPin, Facebook, Twitter, Linkedin, Youtube } from 'lucide-react';

const PublicFooter: React.FC = () => {
  const { lang, t } = useLanguage();

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Logo & About */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="font-bold">{lang === 'ar' ? 'جامعة حلب' : 'University of Aleppo'}</p>
              </div>
            </div>
            <p className="text-sm opacity-80 leading-relaxed">
              {lang === 'ar'
                ? 'صرح علمي عريق تأسس عام 1946، يضم أكثر من 18 كلية ومعهد أكاديمي.'
                : 'A prestigious institution founded in 1946, with over 18 colleges and academic institutes.'}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold mb-4 text-accent">{t('footer.quickLinks')}</h3>
            <ul className="space-y-2 text-sm opacity-80">
              <li><Link to="/" className="hover:text-accent transition-colors">{t('nav.home')}</Link></li>
              <li><Link to="/hospitals" className="hover:text-accent transition-colors">{t('nav.hospitals')}</Link></li>
              <li><Link to="/events" className="hover:text-accent transition-colors">{t('nav.events')}</Link></li>
              <li><Link to="/contact" className="hover:text-accent transition-colors">{t('nav.contact')}</Link></li>
              <li><Link to="/login" className="hover:text-accent transition-colors">{t('nav.login')}</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold mb-4 text-accent">{t('footer.contactInfo')}</h3>
            <ul className="space-y-3 text-sm opacity-80">
              <li className="flex items-center gap-2"><MapPin className="w-4 h-4 flex-shrink-0" /> {t('footer.address')}</li>
              <li className="flex items-center gap-2"><Phone className="w-4 h-4 flex-shrink-0" /> +963-21-2633010</li>
              <li className="flex items-center gap-2"><Mail className="w-4 h-4 flex-shrink-0" /> info@alepuniv.edu.sy</li>
            </ul>
          </div>

          {/* Social */}
         {/* <div>
            <h3 className="font-bold mb-4 text-accent">{t('footer.followUs')}</h3>
            <div className="flex items-center gap-3">
              {[Facebook, Twitter, Linkedin, Youtube].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center hover:bg-accent hover:text-primary transition-colors">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>  */}
        </div>

        <div className="mt-10 pt-6 border-t border-white/10 text-center text-sm opacity-60">
          <p>© 2026 {lang === 'ar' ? 'جامعة حلب' : 'University of Aleppo'} - {t('footer.rights')}</p>
        </div>
      </div>
    </footer>
  );
};

export default PublicFooter;
