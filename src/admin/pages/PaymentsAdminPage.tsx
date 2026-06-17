import { useState } from 'react';
import { DollarSign, CreditCard, TrendingUp, Users, ExternalLink, Terminal } from 'lucide-react';

const consultationPackages = [
  { name: 'Basic', price: 20, duration: '30 min' },
  { name: 'Premium', price: 75, duration: '90 min' },
  { name: 'VIP', price: 100, duration: 'Unlimited' },
];

export default function PaymentsAdminPage() {
  const [stripeConnected, setStripeConnected] = useState(false);

  return (
    <div>
      <div className="flex items-center gap-3 mb-3">
        <Terminal className="w-4 h-4 text-emerald-400" />
        <span className="text-emerald-400 font-mono text-sm">// payments</span>
      </div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-display font-bold text-white">Payments</h1>
      </div>

      {!stripeConnected ? (
        <div className="bg-surface-900/50 border border-surface-800 rounded-2xl p-8 max-w-2xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-11 h-11 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-brand-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Connect Stripe</h2>
              <p className="text-sm text-surface-500 font-mono">accept_payments()</p>
            </div>
          </div>

          <div className="bg-surface-800/50 border border-surface-700 rounded-xl p-6 mb-6">
            <p className="text-surface-400 mb-4 text-sm leading-relaxed">
              To accept payments through your website, you need to connect a Stripe account. Stripe handles secure payment processing, invoicing, and payout management.
            </p>
            <div className="space-y-3">
              {[
                { step: '1', text: <>Create a <a href="https://dashboard.stripe.com/register" target="_blank" rel="noopener noreferrer" className="text-brand-400 hover:underline">Stripe account</a> if you don't have one</> },
                { step: '2', text: <>Get your Stripe secret key from the <a href="https://dashboard.stripe.com/apikeys" target="_blank" rel="noopener noreferrer" className="text-brand-400 hover:underline">Developers section</a></> },
                { step: '3', text: 'Add it to your project\'s Stripe configuration' },
              ].map(({ step, text }) => (
                <div key={step} className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-lg bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">{step}</span>
                  <p className="text-sm text-surface-400">{text}</p>
                </div>
              ))}
            </div>
          </div>

          <button onClick={() => setStripeConnected(true)} className="btn-primary w-full justify-center">
            <CreditCard className="w-4 h-4" />
            Connect Stripe Account
          </button>

          <p className="text-xs text-surface-600 text-center mt-4 font-mono">
            Stripe connection requires configuration. Visit <a href="https://bolt.new/setup/stripe" target="_blank" rel="noopener noreferrer" className="text-surface-500 hover:underline">bolt.new/setup/stripe</a> to set up.
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {[
              { label: 'Total Revenue', value: '$0', sub: 'No transactions yet', icon: TrendingUp, color: 'emerald' },
              { label: 'Paid Consultations', value: '0', sub: 'This month', icon: Users, color: 'brand' },
              { label: 'Pending Payouts', value: '$0', sub: 'Next payout: N/A', icon: DollarSign, color: 'amber' },
            ].map(({ label, value, sub, icon: Icon, color }) => (
              <div key={label} className="bg-surface-900/50 border border-surface-800 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm text-surface-500 font-medium">{label}</p>
                  <div className={`w-10 h-10 rounded-xl border flex items-center justify-center bg-${color}-500/10 border-${color}-500/20 text-${color}-400`}>
                    <Icon className="w-5 h-5" />
                  </div>
                </div>
                <p className="text-3xl font-display font-bold text-white">{value}</p>
                <p className="text-xs text-surface-500 mt-1 font-mono">{sub}</p>
              </div>
            ))}
          </div>

          <div className="bg-surface-900/50 border border-surface-800 rounded-2xl p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-white">Consultation Pricing</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {consultationPackages.map((pkg) => (
                <div key={pkg.name} className="bg-surface-800/50 border border-surface-700 rounded-xl p-5">
                  <h3 className="font-semibold text-white mb-1">{pkg.name}</h3>
                  <p className="text-2xl font-display font-bold text-white">${pkg.price}</p>
                  <p className="text-sm text-surface-500">{pkg.duration} session</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-surface-900/50 border border-surface-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Recent Transactions</h2>
            <div className="text-center py-12">
              <CreditCard className="w-12 h-12 text-surface-700 mx-auto mb-3" />
              <p className="text-surface-500 font-mono">no_transactions_found</p>
              <p className="text-sm text-surface-600">Transactions will appear here when customers pay for consultations</p>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <a href="https://dashboard.stripe.com" target="_blank" rel="noopener noreferrer" className="btn-secondary text-sm">
              <ExternalLink className="w-4 h-4" />
              Open Stripe Dashboard
            </a>
          </div>
        </>
      )}
    </div>
  );
}
