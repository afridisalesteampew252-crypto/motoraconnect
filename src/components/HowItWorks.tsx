import { useEffect, useRef, useState } from 'react';
import { Search, Calculator, ShieldCheck, MessageSquare, CreditCard, Truck, Terminal } from 'lucide-react';

const steps = [
  { number: 1, title: 'Research', description: 'Browse our vehicle database and guides to find the right car', icon: Search },
  { number: 2, title: 'Calculate', description: 'Estimate your total import cost with our calculator', icon: Calculator },
  { number: 3, title: 'Verify', description: 'Get auction sheets checked by our experts', icon: ShieldCheck },
  { number: 4, title: 'Consult', description: 'Book a session with our vehicle specialists', icon: MessageSquare },
  { number: 5, title: 'Purchase', description: 'Buy through our trusted exporter partners', icon: CreditCard },
  { number: 6, title: 'Deliver', description: 'Receive your vehicle at your doorstep', icon: Truck },
];

export default function HowItWorks() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState<Set<number>>(new Set());

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const step = parseInt(entry.target.getAttribute('data-step') || '0');
            setVisible((prev) => new Set(prev).add(step));
          }
        });
      },
      { threshold: 0.2 }
    );

    const els = sectionRef.current?.querySelectorAll('[data-step]');
    els?.forEach((el) => observer.observe(el));
    return () => els?.forEach((el) => observer.unobserve(el));
  }, []);

  return (
    <section ref={sectionRef} className="section-padding bg-surface-900">
      <div className="container-narrow">
        <div className="flex items-center gap-3 mb-4">
          <Terminal className="w-5 h-5 text-emerald-400" />
          <span className="text-emerald-400 font-mono text-sm">// process</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-display font-bold text-white mb-4">
          How It Works
        </h2>
        <p className="text-surface-400 text-lg mb-16">From research to delivery, we guide you every step</p>

        <div className="relative">
          {/* Center line */}
          <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2 bg-gradient-to-b from-emerald-500/30 via-brand-500/30 to-cyan-500/30" />

          <div className="space-y-8 lg:space-y-12">
            {steps.map((step, index) => {
              const isEven = index % 2 === 0;
              const Icon = step.icon;
              const isVisible = visible.has(step.number);

              return (
                <div
                  key={step.number}
                  data-step={step.number}
                  className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                >
                  {/* Desktop */}
                  <div className="hidden lg:grid grid-cols-[1fr_auto_1fr] gap-8 items-center">
                    <div className={isEven ? '' : 'order-3'}>
                      <div className={!isEven ? 'text-left' : 'text-right'}>
                        <h3 className="text-xl font-bold text-white mb-1">{step.title}</h3>
                        <p className="text-surface-400">{step.description}</p>
                      </div>
                    </div>

                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 rounded-2xl bg-surface-800 border border-surface-700 text-emerald-400 flex items-center justify-center text-xl font-bold font-mono">
                        {String(step.number).padStart(2, '0')}
                      </div>
                      <Icon className="w-4 h-4 text-surface-500 mt-2" />
                    </div>

                    <div className={isEven ? 'order-3' : ''}>
                      <div className={isEven ? 'text-left' : 'text-right'}>
                        <h3 className="text-xl font-bold text-white mb-1">{step.title}</h3>
                        <p className="text-surface-400">{step.description}</p>
                      </div>
                    </div>
                  </div>

                  {/* Mobile / tablet */}
                  <div className="lg:hidden flex gap-5 items-start">
                    <div className="flex flex-col items-center shrink-0">
                      <div className="w-12 h-12 rounded-xl bg-surface-800 border border-surface-700 text-emerald-400 flex items-center justify-center font-bold font-mono">
                        {String(step.number).padStart(2, '0')}
                      </div>
                      {step.number < steps.length && (
                        <div className="w-px h-6 bg-surface-700 mt-1" />
                      )}
                    </div>
                    <div className="pb-2">
                      <div className="flex items-center gap-2 mb-1">
                        <Icon className="w-4 h-4 text-emerald-400" />
                        <h3 className="text-lg font-bold text-white">{step.title}</h3>
                      </div>
                      <p className="text-surface-400">{step.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
