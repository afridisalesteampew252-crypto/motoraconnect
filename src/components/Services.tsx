import { Link } from 'react-router-dom';
import { Database, Calculator, Shield, Users, Globe, BookOpen, ArrowRight } from 'lucide-react';

const services = [
  {
    title: 'Vehicle Price Database',
    description: 'Search real auction prices and market data for Japanese vehicles',
    icon: Database,
    bgColor: 'bg-brand-500/10',
    textColor: 'text-brand-600',
    link: '/vehicles',
  },
  {
    title: 'Import Cost Calculator',
    description: 'Calculate total landed cost including shipping, taxes, and fees',
    icon: Calculator,
    bgColor: 'bg-accent-500/10',
    textColor: 'text-accent-600',
    link: '/calculator',
  },
  {
    title: 'Auction Sheet Verification',
    description: 'Verify vehicle condition reports and authenticity from auction sheets',
    icon: Shield,
    bgColor: 'bg-emerald-500/10',
    textColor: 'text-emerald-600',
    link: '/auction-check',
  },
  {
    title: 'Expert Consultation',
    description: 'Get personal buying advice from our experienced vehicle experts',
    icon: Users,
    bgColor: 'bg-violet-500/10',
    textColor: 'text-violet-600',
    link: '/consultation',
  },
  {
    title: 'Exporter Referrals',
    description: 'Connect with our trusted network of reliable exporters and partners',
    icon: Globe,
    bgColor: 'bg-sky-500/10',
    textColor: 'text-sky-600',
    link: '/vehicles',
  },
  {
    title: 'Import Guides & Blog',
    description: 'Access free educational content about importing Japanese vehicles',
    icon: BookOpen,
    bgColor: 'bg-rose-500/10',
    textColor: 'text-rose-600',
    link: '/blog',
  },
];

export default function Services() {
  return (
    <section className="section-padding bg-white">
      <div className="container-wide">
        <div className="mb-16 text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-surface-900 mb-4">
            How We Help You
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-surface-500">
            Comprehensive tools and expert guidance for importing Japanese vehicles with confidence
          </p>
        </div>

        <div className="grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <div key={service.title} className="card-interactive flex flex-col p-8">
                <div className={`mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl ${service.bgColor}`}>
                  <Icon className={service.textColor} size={26} />
                </div>
                <h3 className="mb-3 text-xl font-semibold text-surface-900">{service.title}</h3>
                <p className="mb-6 flex-grow text-surface-500 leading-relaxed">{service.description}</p>
                <Link
                  to={service.link}
                  className="inline-flex items-center gap-2 font-medium text-brand-600 transition-all duration-200 hover:gap-3 group"
                >
                  Learn more
                  <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
