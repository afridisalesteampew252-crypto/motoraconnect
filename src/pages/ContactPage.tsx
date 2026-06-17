import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Mail, MapPin, Clock, Send, CheckCircle, Terminal, MessageCircle, Facebook } from 'lucide-react';

const contactInfo = [
  { icon: MessageCircle, label: 'WhatsApp', value: '+1 (555) 907-2666', href: 'https://wa.me/15559072666', color: 'emerald' },
  { icon: Mail, label: 'Email', value: 'support@motoraconnect.com', href: 'mailto:support@motoraconnect.com', color: 'brand' },
  { icon: Facebook, label: 'Facebook', value: 'Motoraconnect', href: 'https://facebook.com/motoraconnect', color: 'cyan' },
  { icon: MapPin, label: 'Location', value: 'Pakistan (Remote worldwide)', href: null, color: 'amber' },
  { icon: Clock, label: 'Hours', value: 'Mon–Fri 9AM–6PM PKT · Sat 10AM–2PM', href: null, color: 'amber' },
];

const colorStyles: Record<string, string> = {
  brand: 'bg-brand-500/10 border-brand-500/20 text-brand-400',
  emerald: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
  cyan: 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400',
  amber: 'bg-amber-500/10 border-amber-500/20 text-amber-400',
};

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const { error } = await supabase.from('contacts').insert(formData);
      if (!error) setSubmitted(true);
    } catch {
      // silent
    }
    setSubmitting(false);
  }

  return (
    <div className="min-h-screen bg-surface-950">
      {/* Header */}
      <div className="page-header">
        <div className="relative z-10 container-wide">
          <div className="flex items-center gap-3 mb-4">
            <Terminal className="w-4 h-4 text-emerald-400" />
            <span className="text-emerald-400 font-mono text-sm">// contact_us</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-display font-bold text-white mb-4 tracking-tight">
            Get in Touch
          </h1>
          <p className="text-surface-400 text-lg max-w-2xl">
            Have a question about importing a Japanese vehicle? We'll get back to you within 24 hours.
          </p>
        </div>
      </div>

      <div className="container-wide py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Contact info */}
          <div className="space-y-4">
            {contactInfo.map((item) => (
              <div key={item.label} className="bg-surface-900/50 border border-surface-800 rounded-2xl p-5">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 ${colorStyles[item.color]}`}>
                    <item.icon className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs text-surface-500 font-mono mb-0.5">{item.label.toLowerCase()}</p>
                    {item.href ? (
                      <a href={item.href} className="text-sm text-white hover:text-emerald-400 transition-colors">{item.value}</a>
                    ) : (
                      <p className="text-sm text-white">{item.value}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Form */}
          <div className="lg:col-span-2">
            {submitted ? (
              <div className="bg-surface-900/50 border border-surface-800 rounded-2xl p-12 text-center">
                <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-8 h-8 text-emerald-400" />
                </div>
                <p className="text-xs text-emerald-400 font-mono mb-3">status: sent</p>
                <h2 className="text-2xl font-display font-bold text-white mb-3">Message Sent!</h2>
                <p className="text-surface-400 mb-6">We'll get back to you within 24 hours.</p>
                <button
                  onClick={() => { setSubmitted(false); setFormData({ name: '', email: '', subject: '', message: '' }); }}
                  className="btn-secondary"
                >
                  Send Another
                </button>
              </div>
            ) : (
              <div className="bg-surface-900/50 border border-surface-800 rounded-2xl p-6 sm:p-8">
                <h2 className="text-lg font-semibold text-white mb-6">Send a Message</h2>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="label-field">Name</label>
                      <input type="text" name="name" required value={formData.name} onChange={handleChange} className="input-field" placeholder="Your name" />
                    </div>
                    <div>
                      <label className="label-field">Email</label>
                      <input type="email" name="email" required value={formData.email} onChange={handleChange} className="input-field" placeholder="your@email.com" />
                    </div>
                  </div>

                  <div>
                    <label className="label-field">Subject</label>
                    <input type="text" name="subject" value={formData.subject} onChange={handleChange} className="input-field" placeholder="What is this about?" />
                  </div>

                  <div>
                    <label className="label-field">Message</label>
                    <textarea name="message" required rows={6} value={formData.message} onChange={handleChange} className="input-field resize-none" placeholder="Tell us how we can help..." />
                  </div>

                  <button type="submit" disabled={submitting} className="btn-primary disabled:opacity-50">
                    <Send className="w-4 h-4" />
                    {submitting ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
