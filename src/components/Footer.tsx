import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Facebook, Instagram, Mail, Phone, MapPin, Clock, MessageCircle } from 'lucide-react';

export default function Footer() {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  const quickLinks = [
    { name: t('nav.home'), path: '/' },
    { name: t('nav.vehicles'), path: '/vehicles' },
    { name: t('nav.calculator'), path: '/calculator' },
    { name: t('nav.auctionCheck'), path: '/auction-check' },
    { name: t('nav.blog'), path: '/blog' },
    { name: t('nav.contact'), path: '/contact' },
  ];

  const services = [
    { name: t('footer.priceDatabase'), path: '/vehicles' },
    { name: t('footer.importCalculator'), path: '/calculator' },
    { name: t('footer.auctionVerification'), path: '/auction-check' },
    { name: t('common.consultation'), path: '/consultation' },
    { name: t('footer.exporterReferrals'), path: '/vehicles' },
  ];

  return (
    <footer className="bg-surface-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          <div className="space-y-4">
            <h2 className="font-display text-2xl font-bold bg-gradient-to-r from-brand-400 to-brand-300 bg-clip-text text-transparent">
              Motoraconnect
            </h2>
            <p className="text-surface-400 text-sm leading-relaxed">
              {t('footer.tagline')}
            </p>
            <div className="flex gap-4 pt-2">
              <a href="https://wa.me/15559072666" target="_blank" rel="noopener noreferrer" className="text-surface-500 hover:text-emerald-400 transition-colors" aria-label="WhatsApp"><MessageCircle size={20} /></a>
              <a href="https://facebook.com/motoraconnect" target="_blank" rel="noopener noreferrer" className="text-surface-500 hover:text-brand-400 transition-colors" aria-label="Facebook"><Facebook size={20} /></a>
              <a href="https://instagram.com/motoraconnect" target="_blank" rel="noopener noreferrer" className="text-surface-500 hover:text-brand-400 transition-colors" aria-label="Instagram"><Instagram size={20} /></a>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{t('footer.quickLinks')}</h3>
            <nav className="space-y-2.5">
              {quickLinks.map((link) => (
                <Link key={link.path} to={link.path} className="block text-surface-400 hover:text-brand-300 transition-colors text-sm">
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{t('footer.services')}</h3>
            <nav className="space-y-2.5">
              {services.map((link) => (
                <Link key={link.path} to={link.path} className="block text-surface-400 hover:text-brand-300 transition-colors text-sm">
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{t('footer.contactInfo')}</h3>
            <div className="space-y-3">
              <div className="flex gap-3 items-start">
                <MessageCircle size={16} className="text-emerald-400 mt-0.5 flex-shrink-0" />
                <a href="https://wa.me/15559072666" target="_blank" rel="noopener noreferrer" className="text-surface-400 hover:text-emerald-400 transition-colors text-sm">+1 (555) 907-2666</a>
              </div>
              <div className="flex gap-3 items-start">
                <Mail size={16} className="text-brand-400 mt-0.5 flex-shrink-0" />
                <a href="mailto:support@motoraconnect.com" className="text-surface-400 hover:text-brand-300 transition-colors text-sm">support@motoraconnect.com</a>
              </div>
              <div className="flex gap-3 items-start">
                <Facebook size={16} className="text-brand-400 mt-0.5 flex-shrink-0" />
                <a href="https://facebook.com/motoraconnect" target="_blank" rel="noopener noreferrer" className="text-surface-400 hover:text-brand-300 transition-colors text-sm">Facebook</a>
              </div>
              <div className="flex gap-3 items-start">
                <MapPin size={16} className="text-brand-400 mt-0.5 flex-shrink-0" />
                <span className="text-surface-400 text-sm">Pakistan</span>
              </div>
              <div className="flex gap-3 items-start">
                <Clock size={16} className="text-brand-400 mt-0.5 flex-shrink-0" />
                <div className="text-surface-400 text-sm">
                  <p>Mon - Fri: 9:00 AM - 6:00 PM</p>
                  <p>Sat: 10:00 AM - 2:00 PM</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-surface-800 pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-surface-500 text-sm">&copy; {year} Motoraconnect. {t('footer.copyright')}</p>
            <p className="text-surface-600 text-sm">{t('footer.madeWith')}</p>
            <div className="flex gap-6 items-center">
              <Link to="/privacy" className="text-surface-500 hover:text-brand-300 transition-colors text-sm">{t('common.privacy')}</Link>
              <Link to="/terms" className="text-surface-500 hover:text-brand-300 transition-colors text-sm">{t('common.terms')}</Link>
              <Link to="/data-collection" className="text-surface-500 hover:text-brand-300 transition-colors text-sm">{t('common.dataCollection')}</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
