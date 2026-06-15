import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Calendar, Clock, CheckCircle, Star, User, Mail, Phone, Globe, MessageSquare } from 'lucide-react';

const packages = [
  {
    id: 'basic',
    name: 'Basic',
    price: '$20',
    duration: '30 min',
    features: ['Price estimate for 1 vehicle', 'Import duty overview', 'Email support'],
  },
  {
    id: 'premium',
    name: 'Premium',
    price: '$75',
    duration: '90 min',
    features: ['Price estimates for 3 vehicles', 'Auction sheet verification', 'Full cost breakdown', 'Exporter referral', 'Priority support'],
  },
  {
    id: 'vip',
    name: 'VIP',
    price: '$100',
    duration: 'Unlimited',
    features: ['Unlimited consultations', '5+ vehicle estimates', 'Live negotiation support', 'Preferred exporter referral', 'Post-purchase assistance'],
  },
];

export default function ConsultationPage() {
  const [searchParams] = useSearchParams();
  const [selectedPackage, setSelectedPackage] = useState('basic');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    country: '',
    vehicle_interest: '',
    budget_range: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const plan = searchParams.get('plan');
    if (plan && packages.some((p) => p.id === plan)) {
      setSelectedPackage(plan);
    }
  }, [searchParams]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const { error } = await supabase.from('consultations').insert({
        ...formData,
        package_type: selectedPackage,
      });
      if (!error) setSubmitted(true);
    } catch {
      // handle error
    }
    setSubmitting(false);
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-surface-50 flex items-center justify-center">
        <div className="card p-12 text-center max-w-lg">
          <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-emerald-600" />
          </div>
          <h2 className="text-2xl font-display font-bold text-surface-900 mb-3">
            Consultation Booked!
          </h2>
          <p className="text-surface-500 mb-6">
            Thank you for your booking. Our team will contact you within 24 hours to confirm your session and provide next steps.
          </p>
          <Link to="/" className="btn-primary">
            Return Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-surface-900 to-brand-950 pt-12 pb-20">
        <div className="container-wide">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-white mb-4">
            Book a Consultation
          </h1>
          <p className="text-surface-300 text-lg max-w-2xl">
            Get expert advice from our Japanese vehicle specialists. Choose a package that fits your needs and budget.
          </p>
        </div>
      </div>

      <div className="container-wide -mt-8">
        {/* Package selection */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {packages.map((pkg) => (
            <button
              key={pkg.id}
              onClick={() => setSelectedPackage(pkg.id)}
              className={`card p-6 text-left transition-all duration-200 ${
                selectedPackage === pkg.id
                  ? 'border-2 border-brand-500 shadow-lg shadow-brand-500/10'
                  : 'hover:border-brand-300'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-surface-900">{pkg.name}</h3>
                {selectedPackage === pkg.id && (
                  <CheckCircle className="w-5 h-5 text-brand-600" />
                )}
              </div>
              <p className="text-2xl font-display font-bold text-surface-900 mb-1">
                {pkg.price}
                <span className="text-sm font-normal text-surface-500">/session</span>
              </p>
              <div className="flex items-center gap-1 text-sm text-surface-500 mb-3">
                <Clock className="w-3.5 h-3.5" />
                {pkg.duration}
              </div>
              <ul className="space-y-1.5">
                {pkg.features.map((f) => (
                  <li key={f} className="flex gap-2 text-sm text-surface-600">
                    <CheckCircle className="w-3.5 h-3.5 text-brand-500 shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>
            </button>
          ))}
        </div>

        {/* Booking form */}
        <div className="card p-8 max-w-3xl">
          <h2 className="text-xl font-semibold text-surface-900 mb-6">Your Details</h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="label-field">
                  <User className="w-3.5 h-3.5 inline mr-1" />
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="Your full name"
                />
              </div>
              <div>
                <label className="label-field">
                  <Mail className="w-3.5 h-3.5 inline mr-1" />
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="your@email.com"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="label-field">
                  <Phone className="w-3.5 h-3.5 inline mr-1" />
                  Phone (optional)
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="+1 234 567 890"
                />
              </div>
              <div>
                <label className="label-field">
                  <Globe className="w-3.5 h-3.5 inline mr-1" />
                  Country
                </label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="Your country"
                />
              </div>
            </div>

            <div>
              <label className="label-field">Vehicle of Interest</label>
              <input
                type="text"
                name="vehicle_interest"
                value={formData.vehicle_interest}
                onChange={handleChange}
                className="input-field"
                placeholder="e.g. Toyota Land Cruiser 300, 2024"
              />
            </div>

            <div>
              <label className="label-field">Budget Range</label>
              <select name="budget_range" value={formData.budget_range} onChange={handleChange} className="input-field">
                <option value="">Select budget range</option>
                <option value="under-10k">Under $10,000</option>
                <option value="10k-25k">$10,000 - $25,000</option>
                <option value="25k-50k">$25,000 - $50,000</option>
                <option value="50k-100k">$50,000 - $100,000</option>
                <option value="100k+">$100,000+</option>
              </select>
            </div>

            <div>
              <label className="label-field">
                <MessageSquare className="w-3.5 h-3.5 inline mr-1" />
                Additional Details
              </label>
              <textarea
                name="message"
                rows={4}
                value={formData.message}
                onChange={handleChange}
                className="input-field resize-none"
                placeholder="Tell us about your needs, concerns, or any questions..."
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="btn-primary w-full justify-center disabled:opacity-60"
            >
              {submitting ? 'Booking...' : `Book ${packages.find((p) => p.id === selectedPackage)?.name} Consultation`}
            </button>
          </form>
        </div>
      </div>

      <div className="h-16" />
    </div>
  );
}
