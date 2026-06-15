import Hero from '../components/Hero';
import Services from '../components/Services';
import FeaturedVehicles from '../components/FeaturedVehicles';
import HowItWorks from '../components/HowItWorks';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, Star, ExternalLink, Handshake } from 'lucide-react';

const testimonials = [
  {
    name: 'Ahmed R.',
    country: 'Pakistan',
    text: 'JDM Global helped me import a Toyota Land Cruiser safely. Their auction verification saved me from a vehicle with hidden damage.',
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

export default function HomePage() {
  return (
    <>
      <Hero />

      <Services />

      <FeaturedVehicles />

      <HowItWorks />

      {/* Testimonials */}
      <section className="section-padding bg-surface-50">
        <div className="container-wide">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-surface-900 mb-4">
              What Our Clients Say
            </h2>
            <p className="text-lg text-surface-500">Trusted by vehicle buyers worldwide</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="card p-8">
                <div className="flex gap-1 mb-4">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-surface-600 leading-relaxed mb-6">"{t.text}"</p>
                <div>
                  <p className="font-semibold text-surface-900">{t.name}</p>
                  <p className="text-sm text-surface-500">{t.country}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="section-padding bg-white">
        <div className="container-wide">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-surface-900 mb-4">
              Consultation Packages
            </h2>
            <p className="text-lg text-surface-500">Choose the level of support that fits your needs</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {pricingPlans.map((plan) => (
              <div
                key={plan.name}
                className={`card p-8 relative ${
                  plan.featured
                    ? 'border-2 border-brand-500 shadow-lg shadow-brand-500/10'
                    : ''
                }`}
              >
                {plan.featured && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                    Most Popular
                  </span>
                )}
                <h3 className="text-xl font-bold text-surface-900 mb-1">{plan.name}</h3>
                <p className="text-surface-500 text-sm mb-4">{plan.description}</p>
                <p className="text-3xl font-display font-bold text-surface-900 mb-6">
                  {plan.price}
                  <span className="text-base font-normal text-surface-500">/session</span>
                </p>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((f) => (
                    <li key={f} className="flex gap-2 text-sm text-surface-600">
                      <CheckCircle className="w-4 h-4 text-brand-500 shrink-0 mt-0.5" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  to={`/consultation?plan=${plan.name.toLowerCase()}`}
                  className={plan.featured ? 'btn-primary w-full justify-center' : 'btn-secondary w-full justify-center'}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trusted Partner */}
      <section className="section-padding bg-white">
        <div className="container-wide text-center">
          <div className="inline-flex items-center gap-2 bg-brand-50 text-brand-600 border border-brand-200 rounded-full px-4 py-1.5 text-sm font-medium mb-6">
            <Handshake className="w-4 h-4" />
            Trusted Partner
          </div>
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-surface-900 mb-4">
            Afridi Trading
          </h2>
          <p className="text-surface-500 max-w-xl mx-auto mb-6">
            Our recommended exporter partner for seamless Japanese vehicle purchasing and shipping. Reliable service with proven track record.
          </p>
          <a
            href="https://afriditrading.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
          >
            <ExternalLink className="w-4 h-4" />
            Visit Afridi Trading
          </a>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-gradient-to-br from-surface-900 to-brand-950">
        <div className="container-narrow text-center">
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-white mb-4">
            Ready to Find Your Perfect Japanese Vehicle?
          </h2>
          <p className="text-surface-300 text-lg mb-8 max-w-2xl mx-auto">
            Start with a free consultation or use our tools to research and calculate your import costs.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/consultation" className="btn-accent">
              Book Free Consultation
            </Link>
            <Link to="/calculator" className="btn-secondary border-surface-600 text-white hover:bg-white/10">
              <ArrowRight className="w-4 h-4" />
              Try the Calculator
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
