import { Link } from 'react-router-dom';
import { Database, Calculator, Shield, Users, Globe, BookOpen, ArrowRight, Terminal } from 'lucide-react';

const services = [
  {
    title: 'Vehicle Price Database',
    description: 'Search real auction prices and market data for Japanese vehicles',
    icon: Database,
    color: 'brand',
    link: '/vehicles',
  },
  {
    title: 'Import Cost Calculator',
    description: 'Calculate total landed cost including shipping, taxes, and fees',
    icon: Calculator,
    color: 'emerald',
    link: '/calculator',
  },
  {
    title: 'Auction Verification',
    description: 'Verify vehicle condition reports and authenticity from auction sheets',
    icon: Shield,
    color: 'cyan',
    link: '/auction-check',
  },
  {
    title: 'Expert Consultation',
    description: 'Get personal buying advice from our experienced vehicle experts',
    icon: Users,
    color: 'amber',
    link: '/consultation',
  },
  {
    title: 'Exporter Referrals',
    description: 'Connect with our trusted network of reliable exporters and partners',
    icon: Globe,
    color: 'brand',
    link: '/vehicles',
  },
  {
    title: 'Import Guides',
    description: 'Access free educational content about importing Japanese vehicles',
    icon: BookOpen,
    color: 'emerald',
    link: '/blog',
  },
];

const colorMap: Record<string, { bg: string; text: string; border: string; hoverBorder: string }> = {
  brand: { bg: 'bg-brand-500/10', text: 'text-brand-400', border: 'border-brand-500/20', hoverBorder: 'hover:border-brand-500/40' },
  emerald: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20', hoverBorder: 'hover:border-emerald-500/40' },
  cyan: { bg: 'bg-cyan-500/10', text: 'text-cyan-400', border: 'border-cyan-500/20', hoverBorder: 'hover:border-cyan-500/40' },
  amber: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/20', hoverBorder: 'hover:border-amber-500/40' },
};

export default function Services() {
  return (
    <section className="section-padding bg-surface-900">
      <div className="container-wide">
        <div className="flex items-center gap-3 mb-4">
          <Terminal className="w-5 h-5 text-emerald-400" />
          <span className="text-emerald-400 font-mono text-sm">// services</span>
        </div>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-white mb-4">
          How We Help You
        </h2>
        <p className="max-w-2xl text-surface-400 text-lg mb-12">
          Comprehensive tools and expert guidance for importing Japanese vehicles with confidence
        </p>

        <div className="grid gap-4 sm:gap-5 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => {
            const Icon = service.icon;
            const c = colorMap[service.color];
            return (
              <div key={service.title} className={`group bg-surface-800/30 border ${c.border} ${c.hoverBorder} rounded-2xl p-6 transition-all duration-300 hover:bg-surface-800/60`}>
                <div className={`mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl ${c.bg} border ${c.border}`}>
                  <Icon className={c.text} size={22} />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-white">{service.title}</h3>
                <p className="mb-5 text-surface-400 text-sm leading-relaxed">{service.description}</p>
                <Link
                  to={service.link}
                  className="inline-flex items-center gap-2 font-medium text-sm transition-all duration-200 hover:gap-3 group"
                >
                  <span className={c.text}>Explore</span>
                  <ArrowRight size={14} className={`${c.text} transition-transform group-hover:translate-x-1`} />
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
