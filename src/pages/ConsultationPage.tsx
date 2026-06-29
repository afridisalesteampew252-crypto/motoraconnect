import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { CheckCircle, Clock, Terminal, User, Mail, Phone, Globe, MessageSquare, ArrowRight } from 'lucide-react';

const packages = [
  {
    id: 'basic',
    name: 'Basic',
    price: '$20',
    duration: '30 min',
    color: 'brand',
    features: ['Price estimate for 1 vehicle', 'Import duty overview', 'Email support'],
  },
  {
    id: 'premium',
    name: 'Premium',
    price: '$75',
    duration: '90 min',
    color: 'emerald',
    features: ['Price estimates for 3 vehicles', 'Auction sheet verification', 'Full cost breakdown', 'Exporter referral', 'Priority support'],
  },
  {
    id: 'vip',
    name: 'VIP',
    price: '$100',
    duration: 'Unlimited',
    color: 'amber',
    features: ['Unlimited consultations', '5+ vehicle estimates', 'Live negotiation support', 'Preferred exporter referral', 'Post-purchase assistance'],
  },
];

const pkgStyles: Record<string, { ring: string; badge: string; check: string }> = {
  brand: { ring: 'border-brand-500/50', badge: 'bg-brand-500/10 border-brand-500/20 text-brand-400', check: 'text-brand-400' },
  emerald: { ring: 'border-emerald-500/50', badge: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400', check: 'text-emerald-400' },
  amber: { ring: 'border-amber-500/50', badge: 'bg-amber-500/10 border-amber-500/20 text-amber-400', check: 'text-amber-400' },
};

export default function ConsultationPage() {
  const [searchParams] = useSearchParams();
  const [selectedPackage, setSelectedPackage] = useState('basic');
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', country: '', vehicle_interest: '', budget_range: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    const plan = searchParams.get('plan');
    if (plan && packages.some((p) => p.id === plan)) setSelectedPackage(plan);
  }, [searchParams]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setFormError(null);
  }

  function validateForm(): boolean {
    if (!formData.name.trim() || formData.name.length > 100) {
      setFormError('Please enter a valid name (1-100 characters)');
      return false;
    }
    if (!formData.email.includes('@') || formData.email.length > 254) {
      setFormError('Please enter a valid email address');
      return false;
    }
    if (formData.phone && formData.phone.length > 50) {
      setFormError('Phone number is too long');
      return false;
    }
    if (formData.message && formData.message.length > 2000) {
      setFormError('Message must be under 2000 characters');
      return false;
    }
    return true;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validateForm()) return;
    setSubmitting(true);
    try {
      const { error } = await supabase.from('consultations').insert({
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone?.trim() || null,
        country: formData.country?.trim() || null,
        vehicle_interest: formData.vehicle_interest?.trim() || null,
        budget_range: formData.budget_range || null,
        message: formData.message?.trim() || null,
        package_type: selectedPackage,
      });
      if (!error) setSubmitted(true);
      else setFormError('Failed to book consultation. Please try again.');
    } catch {
      setFormError('An unexpected error occurred. Please try again.');
    }
    setSubmitting(false);
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-surface-950 flex items-center justify-center px-4">
        <div className="bg-surface-900/50 border border-surface-800 rounded-2xl p-12 text-center max-w-lg w-full">
          <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-emerald-400" />
          </div>
          <p className="text-xs text-emerald-400 font-mono mb-3">status: booked</p>
          <h2 className="text-2xl font-display font-bold text-white mb-3">Consultation Booked!</h2>
          <p className="text-surface-400 mb-8">
            Our team will contact you within 24 hours to confirm your session and provide next steps.
          </p>
          <Link to="/" className="btn-primary">
            Return Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-950">
      {/* Header */}
      <div className="page-header">
        <div className="relative z-10 container-wide">
          <div className="flex items-center gap-3 mb-4">
            <Terminal className="w-4 h-4 text-emerald-400" />
            <span className="text-emerald-400 font-mono text-sm">// book_consultation</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-display font-bold text-white mb-4 tracking-tight">
            Book a Consultation
          </h1>
          <p className="text-surface-400 text-lg max-w-2xl">
            Get expert advice from our Japanese vehicle specialists. Choose a package and tell us what you need.
          </p>
        </div>
      </div>

      <div className="container-wide py-8">
        {/* Package selection */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {packages.map((pkg) => {
            const s = pkgStyles[pkg.color];
            const active = selectedPackage === pkg.id;
            return (
              <button
                key={pkg.id}
                onClick={() => setSelectedPackage(pkg.id)}
                className={`relative bg-surface-900/50 border-2 rounded-2xl p-6 text-left transition-all duration-200 ${
                  active ? s.ring + ' bg-surface-800/50' : 'border-surface-700 hover:border-surface-600'
                }`}
              >
                {active && (
                  <span className={`absolute top-4 right-4 text-xs font-mono px-2 py-0.5 rounded-lg border ${s.badge}`}>
                    selected
                  </span>
                )}
                <div className="flex items-center gap-2 mb-3">
                  <h3 className="font-semibold text-white text-lg">{pkg.name}</h3>
                </div>
                <p className="text-2xl font-display font-bold text-white mb-1">
                  {pkg.price}
                  <span className="text-sm font-normal text-surface-500">/session</span>
                </p>
                <div className="flex items-center gap-1.5 text-sm text-surface-500 font-mono mb-4">
                  <Clock className="w-3.5 h-3.5" />
                  {pkg.duration}
                </div>
                <ul className="space-y-2">
                  {pkg.features.map((f) => (
                    <li key={f} className="flex gap-2 text-sm text-surface-400">
                      <CheckCircle className={`w-3.5 h-3.5 ${s.check} shrink-0 mt-0.5`} />
                      {f}
                    </li>
                  ))}
                </ul>
              </button>
            );
          })}
        </div>

        {/* Booking form */}
        <div className="bg-surface-900/50 border border-surface-800 rounded-2xl p-6 sm:p-8 max-w-3xl">
          <h2 className="text-lg font-semibold text-white mb-6">Your Details</h2>
          {formError && (
            <div className="mb-5 bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl text-sm">
              {formError}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="label-field flex items-center gap-1"><User className="w-3 h-3" />Full Name</label>
                <input type="text" name="name" required value={formData.name} onChange={handleChange} className="input-field" placeholder="Your full name" />
              </div>
              <div>
                <label className="label-field flex items-center gap-1"><Mail className="w-3 h-3" />Email</label>
                <input type="email" name="email" required value={formData.email} onChange={handleChange} className="input-field" placeholder="your@email.com" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="label-field flex items-center gap-1"><Phone className="w-3 h-3" />Phone (optional)</label>
                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="input-field" placeholder="+1 234 567 890" />
              </div>
              <div>
                <label className="label-field flex items-center gap-1"><Globe className="w-3 h-3" />Country</label>
                <input type="text" name="country" value={formData.country} onChange={handleChange} className="input-field" placeholder="Your country" />
              </div>
            </div>

            <div>
              <label className="label-field">Vehicle of Interest</label>
              <input type="text" name="vehicle_interest" value={formData.vehicle_interest} onChange={handleChange} className="input-field" placeholder="e.g. Toyota Land Cruiser 300, 2024" />
            </div>

            <div>
              <label className="label-field">Budget Range</label>
              <select name="budget_range" value={formData.budget_range} onChange={handleChange} className="input-field">
                <option value="">Select budget range</option>
                <option value="under-10k">Under $10,000</option>
                <option value="10k-25k">$10,000 – $25,000</option>
                <option value="25k-50k">$25,000 – $50,000</option>
                <option value="50k-100k">$50,000 – $100,000</option>
                <option value="100k+">$100,000+</option>
              </select>
            </div>

            <div>
              <label className="label-field flex items-center gap-1"><MessageSquare className="w-3 h-3" />Additional Details</label>
              <textarea name="message" rows={4} value={formData.message} onChange={handleChange} className="input-field resize-none" placeholder="Tell us about your needs, concerns, or questions..." />
            </div>

            <button type="submit" disabled={submitting} className="btn-primary w-full justify-center disabled:opacity-50">
              <ArrowRight className="w-4 h-4" />
              {submitting ? 'Booking...' : `Book ${packages.find((p) => p.id === selectedPackage)?.name} — ${packages.find((p) => p.id === selectedPackage)?.price}`}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
