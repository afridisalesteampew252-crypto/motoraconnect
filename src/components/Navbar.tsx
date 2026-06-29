import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, LogIn, LogOut, User } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import NotificationDropdown from './Notifications/NotificationDropdown';
import LanguageSwitcher from './LanguageSwitcher';

export default function Navbar() {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const location = useLocation();
  const { user, signOut } = useAuth();

  const navLinks = [
    { name: t('nav.home'), path: '/' },
    { name: t('nav.vehicles'), path: '/vehicles' },
    { name: t('nav.calculator'), path: '/calculator' },
    { name: t('nav.auctionCheck'), path: '/auction-check' },
    { name: t('nav.laws'), path: '/laws' },
    { name: t('nav.blog'), path: '/blog' },
    { name: t('nav.contact'), path: '/contact' },
  ];

  useEffect(() => {
    const handleScroll = () => setHasScrolled(window.scrollY > 0);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  return (
    <>
      <nav
        className={`fixed top-0 w-full z-40 transition-all duration-300 ${
          hasScrolled
            ? 'bg-surface-950/90 backdrop-blur-xl border-b border-surface-800/80'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link
              to="/"
              className="font-display text-xl font-bold text-white hover:opacity-80 transition-opacity tracking-tight"
            >
              Motoraconnect
            </Link>

            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`font-medium text-sm transition-colors duration-200 relative group ${
                    location.pathname === link.path
                      ? 'text-white'
                      : 'text-surface-400 hover:text-white'
                  }`}
                >
                  {link.name}
                  <span
                    className={`absolute -bottom-1 left-0 h-px bg-emerald-400 transition-all duration-300 ${
                      location.pathname === link.path
                        ? 'w-full'
                        : 'w-0 group-hover:w-full'
                    }`}
                  />
                </Link>
              ))}
            </div>

            <div className="hidden md:flex items-center gap-3">
              <LanguageSwitcher />
              {user ? (
                <div className="flex items-center gap-3">
                  <NotificationDropdown />
                  <Link
                    to="/dashboard"
                    className="inline-flex items-center gap-2 text-sm text-surface-400 hover:text-white transition-colors"
                  >
                    <User className="w-4 h-4" />
                    <span className="max-w-[120px] truncate">{user.email}</span>
                  </Link>
                  <button
                    onClick={signOut}
                    className="inline-flex items-center gap-1.5 text-sm text-surface-500 hover:text-red-400 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    to="/login"
                    className="inline-flex items-center gap-2 text-sm text-surface-400 hover:text-white border border-surface-700 px-3 py-1.5 rounded-lg hover:border-surface-600 transition-all duration-200"
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    {t('common.login')}
                  </Link>
                  <Link
                    to="/signup"
                    className="inline-flex items-center gap-2 text-sm bg-brand-500 text-white px-3 py-1.5 rounded-lg hover:bg-brand-400 transition-all duration-200"
                  >
                    {t('common.signup')}
                  </Link>
                </div>
              )}
              <Link
                to="/consultation"
                className="inline-flex items-center gap-2 bg-white text-surface-900 font-semibold text-sm px-4 py-2 rounded-lg hover:bg-surface-100 transition-colors"
              >
                {t('common.bookConsultation')}
              </Link>
            </div>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 text-surface-400 hover:text-white transition-colors"
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      <div
        className={`fixed inset-0 z-30 md:hidden transition-all duration-300 ${
          isOpen ? 'visible' : 'invisible'
        }`}
      >
        <div
          className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
            isOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={() => setIsOpen(false)}
        />
        <div
          className={`absolute top-20 left-0 right-0 bg-surface-900/95 backdrop-blur-xl border-b border-surface-800 transition-all duration-300 ${
            isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
          }`}
        >
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="flex flex-col gap-1">
              {navLinks.map((link, i) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`py-3 px-4 rounded-xl font-medium transition-all duration-200 ${
                    location.pathname === link.path
                      ? 'text-white bg-surface-800'
                      : 'text-surface-400 hover:text-white hover:bg-surface-800/50'
                  }`}
                  style={{ transitionDelay: isOpen ? `${i * 40}ms` : '0ms' }}
                >
                  {link.name}
                </Link>
              ))}
              <Link
                to="/consultation"
                onClick={() => setIsOpen(false)}
                className="mt-4 bg-white text-surface-900 font-semibold text-center py-3 px-4 rounded-xl hover:bg-surface-100 transition-colors"
              >
                {t('common.bookConsultation')}
              </Link>
              {user ? (
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-surface-800">
                  <Link
                    to="/dashboard"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-2 text-sm text-surface-400 hover:text-white transition-colors"
                  >
                    <User className="w-4 h-4" />
                    <span className="truncate max-w-[180px]">{user.email}</span>
                  </Link>
                  <button
                    onClick={() => { signOut(); setIsOpen(false); }}
                    className="flex items-center gap-1.5 text-sm text-surface-500 hover:text-red-400 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center gap-2 mt-3 pt-3 border-t border-surface-800 text-sm text-surface-400 hover:text-white transition-colors"
                >
                  <LogIn className="w-4 h-4" />
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="h-20" />
    </>
  );
}
