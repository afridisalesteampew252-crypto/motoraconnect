import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'Vehicles', path: '/vehicles' },
  { name: 'Calculator', path: '/calculator' },
  { name: 'Auction Check', path: '/auction-check' },
  { name: 'Blog', path: '/blog' },
  { name: 'Contact', path: '/contact' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const location = useLocation();

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
          hasScrolled ? 'border-b border-surface-200/80' : ''
        }`}
      >
        <div className="bg-white/80 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-20">
              <Link
                to="/"
                className="font-display text-2xl font-bold bg-gradient-to-r from-brand-600 to-accent-500 bg-clip-text text-transparent hover:opacity-80 transition-opacity"
              >
                JDM Global
              </Link>

              <div className="hidden md:flex items-center gap-8">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`font-medium transition-colors duration-200 relative group ${
                      location.pathname === link.path
                        ? 'text-brand-600'
                        : 'text-surface-700 hover:text-brand-600'
                    }`}
                  >
                    {link.name}
                    <span
                      className={`absolute bottom-0 left-0 h-0.5 bg-brand-600 transition-all duration-300 ${
                        location.pathname === link.path
                          ? 'w-full'
                          : 'w-0 group-hover:w-full'
                      }`}
                    />
                  </Link>
                ))}
              </div>

              <Link
                to="/consultation"
                className="hidden md:inline-flex btn-accent px-5 py-2.5 text-sm"
              >
                Book Consultation
              </Link>

              <button
                onClick={() => setIsOpen(!isOpen)}
                className="md:hidden p-2 text-surface-800 hover:text-brand-600 transition-colors"
                aria-label="Toggle menu"
              >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile overlay */}
      <div
        className={`fixed inset-0 z-30 md:hidden transition-all duration-300 ${
          isOpen ? 'visible' : 'invisible'
        }`}
      >
        <div
          className={`absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity duration-300 ${
            isOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={() => setIsOpen(false)}
        />
        <div
          className={`absolute top-20 left-0 right-0 bg-white/95 backdrop-blur-xl border-b border-surface-200 transition-all duration-300 ${
            isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
          }`}
        >
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="flex flex-col gap-1">
              {navLinks.map((link, i) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`py-3 px-4 rounded-xl font-medium text-lg transition-all duration-200 ${
                    location.pathname === link.path
                      ? 'text-brand-600 bg-brand-50'
                      : 'text-surface-800 hover:text-brand-600 hover:bg-surface-50'
                  }`}
                  style={{
                    transitionDelay: isOpen ? `${i * 40}ms` : '0ms',
                  }}
                >
                  {link.name}
                </Link>
              ))}
              <Link
                to="/consultation"
                onClick={() => setIsOpen(false)}
                className="btn-accent text-center mt-4"
                style={{
                  transitionDelay: isOpen ? `${navLinks.length * 40}ms` : '0ms',
                }}
              >
                Book Consultation
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="h-20" />
    </>
  );
}
