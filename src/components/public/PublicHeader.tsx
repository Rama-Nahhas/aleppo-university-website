import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { colleges, collegeMegaMenu } from '@/data/mockData';
import { Search, User, Globe, Menu, X, ChevronDown, GraduationCap } from 'lucide-react';

const PublicHeader: React.FC = () => {
  const { lang, t, toggleLang } = useLanguage();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [megaOpen, setMegaOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const navLinks = [
    { to: '/', label: t('nav.home') },
    { to: '#colleges', label: t('nav.colleges'), mega: true },
    { to: '/hospitals', label: t('nav.hospitals') },
    { to: '/Directorate', label: t('nav.Directorate') },
    { to: '/CentersPage', label: t('nav.CentersPage') },
    { to: '/events', label: t('nav.events') },
    { to: '/contact', label: t('nav.contact') },
  ];

  return (
    <header className="sticky top-0 z-50 bg-primary text-primary-foreground shadow-lg">
      {/* Top bar */}
      <div className="bg-primary/90 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-1.5 flex items-center justify-between text-xs">
          <div className="flex items-center gap-4">
            <span>📞 +963-21-2633010</span>
            <span className="hidden sm:inline">✉ info@alepuniv.edu.sy</span>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={toggleLang} className="flex items-center gap-1 hover:text-accent transition-colors">
              <Globe className="w-3.5 h-3.5" />
              {lang === 'ar' ? 'English' : 'العربية'}
            </button>
          </div>
        </div>
      </div>

      {/* Main nav */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-primary" />
            </div>
            <div className="hidden sm:block">
              <p className="font-bold text-sm leading-tight">{lang === 'ar' ? 'جامعة حلب' : 'University of Aleppo'}</p>
              <p className="text-[10px] opacity-70">{lang === 'ar' ? 'Aleppo University' : 'جامعة حلب'}</p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map(link => (
              link.mega ? (
                <div key={link.to} className="relative">
                  <button
                    onMouseEnter={() => setMegaOpen(true)}
                    onClick={() => setMegaOpen(!megaOpen)}
                    className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium hover:bg-white/10 transition-colors"
                  >
                    {link.label}
                    <ChevronDown className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <Link key={link.to} to={link.to} className="px-3 py-2 rounded-lg text-sm font-medium hover:bg-white/10 transition-colors">
                  {link.label}
                </Link>
              )
            ))}
          </nav>

          {/* Right icons */}
          <div className="flex items-center gap-2">
            <button onClick={() => setSearchOpen(!searchOpen)} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
              <Search className="w-5 h-5" />
            </button>
            <button
              onClick={() => navigate(isAuthenticated ? '/dashboard' : '/login')}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <User className="w-5 h-5" />
            </button>
            <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden p-2 hover:bg-white/10 rounded-lg">
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mega Menu */}
      {megaOpen && (
        <div
          className="absolute left-0 right-0 bg-card text-card-foreground shadow-2xl border-t-2 border-accent z-50"
          onMouseLeave={() => setMegaOpen(false)}
        >
          <div className="max-w-7xl mx-auto p-6">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {collegeMegaMenu.map((group, i) => (
                <div key={i}>
                  <h3 className="font-bold text-sm text-primary mb-3 border-b border-accent/30 pb-2">
                    {lang === 'ar' ? group.title : group.titleEn}
                  </h3>
                  <ul className="space-y-1.5">
                    {group.colleges.map(cid => {
                      const college = colleges.find(c => c.id === cid);
                      if (!college) return null;
                      return (
                        <li key={cid}>
                          <Link
                            to={`/college/${college.slug}`}
                            onClick={() => setMegaOpen(false)}
                            className="text-xs text-muted-foreground hover:text-primary hover:underline transition-colors block py-0.5"
                          >
                            {lang === 'ar' ? college.name : college.nameEn}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Search overlay */}
      {searchOpen && (
        <div className="absolute left-0 right-0 bg-card shadow-lg p-4 z-50">
          <div className="max-w-2xl mx-auto">
            <input
              autoFocus
              type="text"
              placeholder={t('nav.search')}
              className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>
      )}

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-primary border-t border-white/10">
          <nav className="p-4 space-y-1">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.mega ? '/colleges-list' : link.to}
                onClick={() => setMobileOpen(false)}
                className="block px-3 py-2.5 rounded-lg text-sm hover:bg-white/10"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};

export default PublicHeader;
