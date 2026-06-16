import Hero from '../components/Hero';
import Services from '../components/Services';
import FeaturedVehicles from '../components/FeaturedVehicles';
import HowItWorks from '../components/HowItWorks';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, Star, ExternalLink, Handshake, Terminal, Zap, Shield, Globe, ChevronRight, Code2, BarChart3, Search } from 'lucide-react';

const testimonials = [
  {
    name: 'Ahmed R.',
    country: 'Pakistan',
    text: 'Motoraconnect helped me import a Toyota Land Cruiser safely. Their auction verification saved me from a vehicle with hidden damage.',
    rating: 5,
  },
  {
    name: 'James M.',
    country: 'Kenya',
    text: 'The import calculator was incredibly accurate. No surprises at customs. Their consultant guided me through every step.',
    rating: 5,
  },
  {
    name: 'Fatima K.',
    country: 'UAE',
    text: 'Excellent service from start to finish. The team found me exactly the vehicle I wanted at a great price.',
    rating: 5,
  },
];

const pricingPlans = [
  {
    name: 'Basic',
    price: '$20',
    description: 'Single consultation session',
    features: ['30-minute consultation', 'Price estimate for 1 vehicle', 'Import duty overview', 'Email support'],
    cta: 'Book Basic',
    featured: false,
  },
  {
    name: 'Premium',
    price: '$75',
    description: 'Comprehensive buying assistance',
    features: [
      '90-minute consultation',
      'Price estimates for 3 vehicles',
      'Auction sheet verification',
      'Full import cost breakdown',
      'Exporter referral',
      'Priority email & chat support',
    ],
    cta: 'Book Premium',
    featured: true,
  },
  {
    name: 'VIP',
    price: '$100',
    description: 'End-to-end buying support',
    features: [
      'Unlimited consultations',
      'Price estimates for 5+ vehicles',
      'Auction sheet verification',
      'Full import cost breakdown',
      'Preferred exporter referral',
      'Live negotiation support',
      'Post-purchase assistance',
    ],
    cta: 'Book VIP',
    featured: false,
  },
];

const features = [
  {
    icon: Search,
    title: 'Auction Intelligence',
    description: 'Real-time access to Japanese auction data with verified grading reports and transparent vehicle histories.',
    color: 'emerald',
  },
  {
    icon: BarChart3,
    title: 'Smart Calculators',
    description: 'Country-specific import cost calculators that factor in duties, taxes, shipping, and registration fees.',
    color: 'brand',
  },
  {
    icon: Shield,
    title: 'Verified Exporters',
    description: 'Vetted exporter network with track records. Never worry about scams or hidden costs again.',
    color: 'cyan',
  },
  {
    icon: Code2,
    title: 'Expert Guidance',
    description: '1-on-1 consultations with import specialists who know the process inside out for your destination.',
    color: 'amber',
  },
];

const colorMap: Record<string, string> = {
  emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  brand: 'bg-brand-500/10 text-brand-400 border-brand-500/20',
  cyan: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
  amber: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
};

export default function HomePage() {
  return (
    <>
      <Hero />

      <Services />

      {/* Features Grid - Pro Developer Style */}
      <section className="section-padding bg-surface-950">
        <div className="container-wide">
          <div className="flex items-center gap-3 mb-4">
            <Terminal className="w-5 h-5 text-emerald-400" />
            <span className="text-emerald-400 font-mono text-sm">// core features</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-white mb-4">
            Built for serious buyers
          </h2>
          <p className="text-surface-400 text-lg mb-12 max-w-2xl">
            Every tool is designed to eliminate uncertainty and give you full control over the import process.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {features.map((f) => (
              <div
                key={f.title}
                className="group bg-surface-900/50 border border-surface-800 rounded-2xl p-6 hover:border-surface-700 hover:bg-surface-900/80 transition-all duration-300"
              >
                <div className={`w-10 h-10 rounded-lg border flex items-center justify-center mb-4 ${colorMap[f.color]}`}>
                  <f.icon className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{f.title}</h3>
                <p className="text-surface-400 text-sm leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <FeaturedVehicles />

      <HowItWorks />

      {/* Testimonials */}
      <section className="section-padding bg-surface-950">
        <div className="container-wide">
          <div className="flex items-center gap-3 mb-4">
            <Terminal className="w-5 h-5 text-emerald-400" />
            <span className="text-emerald-400 font-mono text-sm">// client feedback</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-white mb-12">
            Trusted worldwide
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {testimonials.map((t) => (
              <div key={t.name} className="bg-surface-900/50 border border-surface-800 rounded-2xl p-6">
                <div className="flex gap-1 mb-4">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-surface-300 leading-relaxed mb-6 text-sm">"{t.text}"</p>
                <div className="flex items-center gap-3 pt-4 border-t border-surface-800">
                  <div className="w-8 h-8 rounded-full bg-brand-500/20 flex items-center justify-center text-brand-400 text-xs font-bold">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{t.name}</p>
                    <p className="text-xs text-surface-500 font-mono">{t.country}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="section-padding bg-surface-900">
        <div className="container-wide">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-surface-800 border border-surface-700 rounded-lg px-4 py-2 text-sm mb-6">
              <Zap className="w-4 h-4 text-amber-400" />
              <span className="text-surface-300 font-mono text-xs">pricing_plans</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-white mb-4">
              Consultation Packages
            </h2>
            <p className="text-surface-400 text-lg">Choose the level of support that fits your needs</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-5xl mx-auto">
            {pricingPlans.map((plan) => (
              <div
                key={plan.name}
                className={`rounded-2xl p-8 relative ${
                  plan.featured
                    ? 'bg-surface-800 border-2 border-emerald-500/50 shadow-lg shadow-emerald-500/10'
                    : 'bg-surface-800/50 border border-surface-700'
                }`}
              >
                {plan.featured && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-500 text-surface-900 text-xs font-bold px-4 py-1 rounded-full">
                    Most Popular
                  </span>
                )}
                <h3 className="text-xl font-bold text-white mb-1">{plan.name}</h3>
                <p className="text-surface-500 text-sm mb-4">{plan.description}</p>
                <p className="text-3xl font-display font-bold text-white mb-6">
                  {plan.price}
                  <span className="text-base font-normal text-surface-500">/session</span>
                </p>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((f) => (
                    <li key={f} className="flex gap-2 text-sm text-surface-300">
                      <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  to={`/consultation?plan=${plan.name.toLowerCase()}`}
                  className={plan.featured ? 'inline-flex items-center justify-center gap-2 w-full bg-emerald-500 hover:bg-emerald-400 text-surface-900 font-semibold px-4 py-3 rounded-xl transition-colors' : 'inline-flex items-center justify-center gap-2 w-full bg-surface-700 hover:bg-surface-600 text-white font-semibold px-4 py-3 rounded-xl transition-colors'}
                >
                  {plan.cta}
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trusted Partner */}
      <section className="section-padding bg-surface-950">
        <div className="container-wide text-center">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-lg px-4 py-2 text-sm font-mono mb-6">
            <Handshake className="w-4 h-4" />
            trusted_partner
          </div>
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-white mb-4">
            Afridi Trading
          </h2>
          <p className="text-surface-400 max-w-xl mx-auto mb-6 text-sm leading-relaxed">
            Our recommended exporter partner for seamless Japanese vehicle purchasing and shipping. Reliable service with proven track record.
          </p>
          <a
            href="https://afriditrading.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-white text-surface-900 font-semibold px-6 py-3 rounded-xl hover:bg-surface-100 transition-all duration-200"
          >
            <ExternalLink className="w-4 h-4" />
            Visit Afridi Trading
          </a>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-600 via-brand-600 to-cyan-600">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
        <div className="relative z-10 section-padding">
          <div className="container-narrow text-center">
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-white mb-4">
              Ready to find your next vehicle?
            </h2>
            <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
              Start with a free consultation or use our tools to research and calculate your import costs.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/consultation" className="inline-flex items-center gap-2 bg-white text-surface-900 font-semibold px-6 py-3.5 rounded-xl hover:bg-surface-100 transition-all duration-200 shadow-lg">
                Book Free Consultation
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/calculator" className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white font-semibold px-6 py-3.5 rounded-xl hover:bg-white/20 transition-all duration-200 backdrop-blur-sm">
                Try the Calculator
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
