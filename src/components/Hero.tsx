import { Link } from 'react-router-dom';
import { Car, Calculator, Shield } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-surface-900 via-surface-900 to-brand-950">
      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      {/* Floating orbs */}
      <div className="absolute top-1/4 left-[10%] w-72 h-72 bg-brand-500/10 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-1/4 right-[15%] w-96 h-96 bg-accent-500/8 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
      <div className="absolute top-1/2 right-0 w-64 h-64 bg-brand-600/8 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }} />

      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-brand-500/15 text-brand-300 border border-brand-500/25 rounded-full px-5 py-2 text-sm font-medium animate-fade-in">
            <Shield className="w-4 h-4" />
            Trusted Japanese Vehicle Consultancy
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-display font-bold leading-[1.1] animate-slide-up">
            <span className="block text-white">Buy Japanese Vehicles</span>
            <span className="block bg-gradient-to-r from-brand-400 via-brand-300 to-accent-400 bg-clip-text text-transparent">
              With Complete Confidence
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-surface-300 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed animate-slide-up-delay">
            Access premium Japanese vehicles directly from trusted auctions. Expert guidance,
            transparent pricing, and seamless import logistics for buyers worldwide.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2 animate-slide-up-delay-2">
            <Link to="/vehicles" className="btn-primary w-full sm:w-auto">
              <Car className="w-5 h-5" />
              Browse Vehicles
            </Link>
            <Link to="/calculator" className="btn-secondary w-full sm:w-auto border-surface-600 text-white hover:bg-white/10">
              <Calculator className="w-5 h-5" />
              Calculate Import Cost
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 pt-12 border-t border-surface-700/50 max-w-xl mx-auto animate-slide-up-delay-2">
            <div className="text-center">
              <p className="text-brand-400 text-2xl sm:text-3xl font-bold">500+</p>
              <p className="text-surface-500 text-sm">Vehicles Listed</p>
            </div>
            <div className="text-center">
              <p className="text-brand-400 text-2xl sm:text-3xl font-bold">30+</p>
              <p className="text-surface-500 text-sm">Countries Served</p>
            </div>
            <div className="text-center">
              <p className="text-brand-400 text-2xl sm:text-3xl font-bold">98%</p>
              <p className="text-surface-500 text-sm">Client Satisfaction</p>
            </div>
          </div>
        </div>
      </div>

      {/* Accent lines */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-brand-500/30 to-transparent" />
      <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-brand-500/20 to-transparent" />
    </section>
  );
}
