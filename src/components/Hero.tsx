import { Link } from 'react-router-dom';
import { ArrowRight, Terminal, Zap, Globe } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-surface-950">
      {/* Subtle grid */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      {/* Noise texture */}
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")' }} />

      {/* Accent orbs */}
      <div className="absolute top-1/3 left-[5%] w-96 h-96 bg-brand-500/8 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/4 right-[10%] w-80 h-80 bg-emerald-500/6 rounded-full blur-[100px]" />

      <div className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="space-y-10">
          {/* Terminal-style badge */}
          <div className="inline-flex items-center gap-2 bg-surface-800/60 border border-surface-700/50 rounded-lg px-4 py-2 text-sm backdrop-blur-sm">
            <Terminal className="w-4 h-4 text-emerald-400" />
            <span className="text-surface-400 font-mono text-xs">$</span>
            <span className="text-emerald-400 font-mono text-xs">motoraconnect</span>
            <span className="text-surface-500 font-mono text-xs">--init</span>
            <span className="w-2 h-4 bg-emerald-400 animate-pulse ml-1" />
          </div>

          {/* Heading */}
          <div className="space-y-6">
            <h1 className="text-5xl sm:text-6xl lg:text-8xl font-display font-extrabold leading-[0.95] tracking-tight">
              <span className="block text-white">Import cars</span>
              <span className="block text-white">from Japan</span>
              <span className="block bg-gradient-to-r from-emerald-400 via-brand-400 to-cyan-400 bg-clip-text text-transparent">
                like a pro.
              </span>
            </h1>

            <div className="max-w-xl space-y-4">
              <p className="text-surface-400 text-lg sm:text-xl leading-relaxed font-light">
                The smart platform that connects you to Japanese vehicle auctions with transparent pricing, verified data, and expert guidance.
              </p>

              {/* Code-style feature list */}
              <div className="bg-surface-900/60 border border-surface-800 rounded-xl p-4 font-mono text-sm space-y-2 backdrop-blur-sm">
                <div className="flex items-center gap-2">
                  <span className="text-surface-600">01</span>
                  <Zap className="w-3 h-3 text-emerald-400" />
                  <span className="text-surface-300">Real-time auction data & pricing</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-surface-600">02</span>
                  <Globe className="w-3 h-3 text-brand-400" />
                  <span className="text-surface-300">Import calculators for 30+ countries</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-surface-600">03</span>
                  <Terminal className="w-3 h-3 text-cyan-400" />
                  <span className="text-surface-300">Expert consultation & verified exporters</span>
                </div>
              </div>
            </div>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-start gap-4 pt-2">
            <Link to="/vehicles" className="group inline-flex items-center gap-2 bg-white text-surface-900 font-semibold px-6 py-3.5 rounded-xl hover:bg-surface-100 transition-all duration-200 shadow-lg shadow-white/5">
              Browse Vehicles
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <Link to="/calculator" className="group inline-flex items-center gap-2 bg-surface-800/50 border border-surface-700 text-surface-300 font-medium px-6 py-3.5 rounded-xl hover:bg-surface-800 hover:border-surface-600 transition-all duration-200 backdrop-blur-sm">
              Calculate Import Cost
            </Link>
          </div>

          {/* Stats bar */}
          <div className="flex flex-wrap items-center gap-8 pt-8 border-t border-surface-800/50">
            {[
              { value: '500+', label: 'Vehicles' },
              { value: '30+', label: 'Countries' },
              { value: '98%', label: 'Satisfaction' },
            ].map((stat) => (
              <div key={stat.label} className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-display font-bold text-white">{stat.value}</span>
                <span className="text-sm text-surface-500 font-mono">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top accent line */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent" />
    </section>
  );
}
