import { useState } from 'react';
import { DollarSign, CreditCard, TrendingUp, Users, ExternalLink, Settings } from 'lucide-react';

const consultationPackages = [
  { name: 'Basic', price: 20, duration: '30 min' },
  { name: 'Premium', price: 75, duration: '90 min' },
  { name: 'VIP', price: 100, duration: 'Unlimited' },
];

export default function PaymentsAdminPage() {
  const [stripeConnected, setStripeConnected] = useState(false);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-surface-900">Payments</h1>
      </div>

      {!stripeConnected ? (
        /* Stripe onboarding */
        <div className="card p-8 max-w-2xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-brand-500/10 flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-brand-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-surface-900">Connect Stripe</h2>
              <p className="text-sm text-surface-500">Accept payments for consultations</p>
            </div>
          </div>

          <div className="bg-surface-50 rounded-xl p-6 mb-6">
            <p className="text-surface-600 mb-4">
              To accept payments through your website, you need to connect a Stripe account. Stripe handles secure payment processing, invoicing, and payout management.
            </p>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-brand-100 text-brand-700 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">1</span>
                <p className="text-sm text-surface-600">Create a <a href="https://dashboard.stripe.com/register" target="_blank" rel="noopener noreferrer" className="text-brand-600 hover:underline">Stripe account</a> if you don't have one</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-brand-100 text-brand-700 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">2</span>
                <p className="text-sm text-surface-600">Get your Stripe secret key from the <a href="https://dashboard.stripe.com/apikeys" target="_blank" rel="noopener noreferrer" className="text-brand-600 hover:underline">Developers section</a></p>
              </div>
              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-brand-100 text-brand-700 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">3</span>
                <p className="text-sm text-surface-600">Add it to your project's Stripe configuration</p>
              </div>
            </div>
          </div>

          <button
            onClick={() => setStripeConnected(true)}
            className="btn-primary w-full justify-center"
          >
            <CreditCard className="w-5 h-5" />
            Connect Stripe Account
          </button>

          <p className="text-xs text-surface-400 text-center mt-4">
            Stripe connection requires configuration. Visit <a href="https://bolt.new/setup/stripe" target="_blank" rel="noopener noreferrer" className="text-brand-500 hover:underline">bolt.new/setup/stripe</a> to set up.
          </p>
        </div>
      ) : (
        /* Stripe connected dashboard */
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-surface-500 font-medium">Total Revenue</p>
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-emerald-600" />
                </div>
              </div>
              <p className="text-3xl font-bold text-surface-900">$0</p>
              <p className="text-xs text-surface-400 mt-1">No transactions yet</p>
            </div>

            <div className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-surface-500 font-medium">Paid Consultations</p>
                <div className="w-10 h-10 rounded-xl bg-brand-500/10 flex items-center justify-center">
                  <Users className="w-5 h-5 text-brand-600" />
                </div>
              </div>
              <p className="text-3xl font-bold text-surface-900">0</p>
              <p className="text-xs text-surface-400 mt-1">This month</p>
            </div>

            <div className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-surface-500 font-medium">Pending Payouts</p>
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-amber-600" />
                </div>
              </div>
              <p className="text-3xl font-bold text-surface-900">$0</p>
              <p className="text-xs text-surface-400 mt-1">Next payout: N/A</p>
            </div>
          </div>

          {/* Pricing configuration */}
          <div className="card p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-surface-900">Consultation Pricing</h2>
              <button className="btn-secondary text-sm px-4 py-2">
                <Settings className="w-4 h-4" />
                Edit Prices
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {consultationPackages.map((pkg) => (
                <div key={pkg.name} className="border border-surface-200 rounded-xl p-5">
                  <h3 className="font-semibold text-surface-900 mb-1">{pkg.name}</h3>
                  <p className="text-2xl font-display font-bold text-surface-900">${pkg.price}</p>
                  <p className="text-sm text-surface-500">{pkg.duration} session</p>
                </div>
              ))}
            </div>
          </div>

          {/* Recent transactions */}
          <div className="card p-6">
            <h2 className="text-xl font-semibold text-surface-900 mb-4">Recent Transactions</h2>
            <div className="text-center py-12">
              <CreditCard className="w-12 h-12 text-surface-300 mx-auto mb-3" />
              <p className="text-surface-500">No transactions yet</p>
              <p className="text-sm text-surface-400">Transactions will appear here when customers pay for consultations</p>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <a
              href="https://dashboard.stripe.com"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary text-sm"
            >
              <ExternalLink className="w-4 h-4" />
              Open Stripe Dashboard
            </a>
          </div>
        </>
      )}
    </div>
  );
}
