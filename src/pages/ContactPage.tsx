import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle, MessageSquare } from 'lucide-react';

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
      // handle error
    }
    setSubmitting(false);
  }

  return (
    <div className="min-h-screen bg-surface-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-surface-900 to-brand-950 pt-12 pb-20">
        <div className="container-wide">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-white mb-4">
            Contact Us
          </h1>
          <p className="text-surface-300 text-lg max-w-2xl">
            Have a question about importing a Japanese vehicle? Reach out and our team will get back to you within 24 hours.
          </p>
        </div>
      </div>

      <div className="container-wide -mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact info */}
          <div className="space-y-6">
            <div className="card p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-brand-500/10 flex items-center justify-center">
                  <Mail className="w-5 h-5 text-brand-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-surface-900">Email</h3>
                  <a href="mailto:info@jdmglobal.com" className="text-sm text-brand-600 hover:text-brand-700">
                    info@jdmglobal.com
                  </a>
                </div>
              </div>
            </div>

            <div className="card p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-brand-500/10 flex items-center justify-center">
                  <Phone className="w-5 h-5 text-brand-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-surface-900">Phone</h3>
                  <p className="text-sm text-surface-600">+92 (300) 123-4567</p>
                </div>
              </div>
            </div>

            <div className="card p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-brand-500/10 flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-brand-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-surface-900">Location</h3>
                  <p className="text-sm text-surface-600">Pakistan (Remote consultations worldwide)</p>
                </div>
              </div>
            </div>

            <div className="card p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-brand-500/10 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-brand-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-surface-900">Business Hours</h3>
                  <p className="text-sm text-surface-600">Mon - Fri: 9:00 AM - 6:00 PM (PKT)</p>
                  <p className="text-sm text-surface-500">Sat: 10:00 AM - 2:00 PM</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-2">
            {submitted ? (
              <div className="card p-12 text-center">
                <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-8 h-8 text-emerald-600" />
                </div>
                <h2 className="text-2xl font-display font-bold text-surface-900 mb-3">
                  Message Sent!
                </h2>
                <p className="text-surface-500 mb-6">
                  Thank you for reaching out. We'll get back to you within 24 hours.
                </p>
                <button onClick={() => { setSubmitted(false); setFormData({ name: '', email: '', subject: '', message: '' }); }} className="btn-secondary">
                  Send Another Message
                </button>
              </div>
            ) : (
              <div className="card p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-brand-500/10 flex items-center justify-center">
                    <MessageSquare className="w-5 h-5 text-brand-600" />
                  </div>
                  <h2 className="text-xl font-semibold text-surface-900">Send a Message</h2>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="label-field">Name</label>
                      <input
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="input-field"
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label className="label-field">Email</label>
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

                  <div>
                    <label className="label-field">Subject</label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="input-field"
                      placeholder="What is this about?"
                    />
                  </div>

                  <div>
                    <label className="label-field">Message</label>
                    <textarea
                      name="message"
                      required
                      rows={6}
                      value={formData.message}
                      onChange={handleChange}
                      className="input-field resize-none"
                      placeholder="Tell us how we can help..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn-primary w-full sm:w-auto justify-center disabled:opacity-60"
                  >
                    <Send className="w-4 h-4" />
                    {submitting ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="h-16" />
    </div>
  );
}
