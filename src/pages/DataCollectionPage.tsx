import { Terminal, Database, Globe, UserCheck, Shield, Cookie, MapPin, Clock, Mail, AlertCircle, CheckCircle, Info } from 'lucide-react';

const regions = [
  {
    region: 'European Union / EEA',
    regulation: 'GDPR',
    flag: '🇪🇺',
    rights: [
      'Right to Access (Article 15)',
      'Right to Rectification (Article 16)',
      'Right to Erasure ("Right to be Forgotten") (Article 17)',
      'Right to Restriction of Processing (Article 18)',
      'Right to Data Portability (Article 20)',
      'Right to Object (Article 21)',
      'Rights related to Automated Decision-Making (Article 22)',
      'Right to Lodge a Complaint with Supervisory Authority',
    ],
    authority: 'Your national Data Protection Authority (DPA)',
    notes: 'Data transfers outside EEA require adequate safeguards. We use Standard Contractual Clauses for such transfers.',
  },
  {
    region: 'California, USA',
    regulation: 'CCPA / CPRA',
    flag: '🇺🇸',
    rights: [
      'Right to Know what personal information is collected',
      'Right to Delete personal information',
      'Right to Opt-Out of the "sale" of personal information',
      'Right to Non-Discrimination for exercising rights',
      'Right to Correct inaccurate personal information',
      'Right to Limit use of sensitive personal information',
    ],
    authority: 'California Attorney General or California Privacy Protection Agency',
    notes: 'We do not "sell" personal information as defined under CCPA. Do Not Sell My Personal Information link available upon request.',
  },
  {
    region: 'Japan',
    regulation: 'APPI',
    flag: '🇯🇵',
    rights: [
      'Right to Request Disclosure',
      'Right to Request Correction',
      'Right to Request Deletion',
      'Right to Limit Use',
      'Right to Complain to Personal Information Protection Commission',
    ],
    authority: 'Personal Information Protection Commission (PPC)',
    notes: 'We comply with APPI requirements for handling personal information of Japanese residents.',
  },
  {
    region: 'United Kingdom',
    regulation: 'UK GDPR',
    flag: '🇬🇧',
    rights: [
      'Right to Access',
      'Right to Rectification',
      'Right to Erasure',
      'Right to Restrict Processing',
      'Right to Data Portability',
      'Right to Object',
      'Rights regarding Automated Decision-Making',
    ],
    authority: 'Information Commissioner\'s Office (ICO)',
    notes: 'Post-Brexit, UK GDPR applies independently. We maintain UK-specific compliance measures.',
  },
  {
    region: 'Australia',
    regulation: 'Privacy Act 1988',
    flag: '🇦🇺',
    rights: [
      'Right to Access',
      'Right to Correction',
      'Right to Complain to OAIC',
      'Right to Compensation for Interference with Privacy',
    ],
    authority: 'Office of the Australian Information Commissioner (OAIC)',
    notes: 'Applicable Australian Privacy Principles (APPs) govern data handling for Australian residents.',
  },
  {
    region: 'Canada',
    regulation: 'PIPEDA',
    flag: '🇨🇦',
    rights: [
      'Right to Access',
      'Right to Correction',
      'Right to Know How Information is Used',
      'Right to Withdraw Consent',
      'Right to File a Complaint',
    ],
    authority: 'Office of the Privacy Commissioner of Canada (OPC)',
    notes: 'Provincial laws may also apply (e.g., Quebec\'s Privacy Act).',
  },
];

const dataCategories = [
  {
    category: 'Identity Data',
    icon: UserCheck,
    examples: ['Name', 'Email address', 'Phone number', 'Country of residence'],
    purpose: 'Account creation, service delivery, communication',
    retention: 'Account duration + 30 days',
    legalBasis: 'Contract performance, Legitimate interest',
  },
  {
    category: 'Account Data',
    icon: Shield,
    examples: ['Email', 'Password (hashed)', 'Account preferences', 'User settings'],
    purpose: 'Authentication, account management, security',
    retention: 'Account duration + 30 days',
    legalBasis: 'Contract performance, Legal obligation',
  },
  {
    category: 'Transaction Data',
    icon: Database,
    examples: ['Consultation bookings', 'Payment records', 'Service usage'],
    purpose: 'Service delivery, billing, record-keeping',
    retention: '7 years (tax/legal requirements)',
    legalBasis: 'Contract performance, Legal obligation',
  },
  {
    category: 'Technical Data',
    icon: Globe,
    examples: ['IP address', 'Browser type', 'Device information', 'Operating system'],
    purpose: 'Security, analytics, service optimization',
    retention: '2 years (anonymized after)',
    legalBasis: 'Legitimate interest',
  },
  {
    category: 'Usage Data',
    icon: Terminal,
    examples: ['Pages visited', 'Feature usage', 'Click patterns', 'Session duration'],
    purpose: 'Service improvement, analytics, user experience',
    retention: '2 years',
    legalBasis: 'Consent, Legitimate interest',
  },
  {
    category: 'Marketing Data',
    icon: Mail,
    examples: ['Email preferences', 'Newsletter subscriptions', 'Communication history'],
    purpose: 'Marketing communications (with consent)',
    retention: 'Until consent withdrawn',
    legalBasis: 'Consent',
  },
];

const cookieTypes = [
  {
    type: 'Essential Cookies',
    required: true,
    description: 'Necessary for basic website functionality',
    examples: ['Session management', 'Authentication', 'Security tokens'],
    retention: 'Session',
  },
  {
    type: 'Functional Cookies',
    required: false,
    description: 'Enable enhanced features and personalization',
    examples: ['Language preference', 'Theme settings', 'Saved preferences'],
    retention: '1 year',
  },
  {
    type: 'Analytics Cookies',
    required: false,
    description: 'Help us understand how visitors interact with our website',
    examples: ['Page views', 'Session duration', 'User flow'],
    retention: '2 years',
  },
  {
    type: 'Marketing Cookies',
    required: false,
    description: 'Used to deliver relevant advertisements',
    examples: ['Advertising IDs', 'Conversion tracking'],
    retention: '90 days',
  },
];

export default function DataCollectionPage() {
  return (
    <div className="min-h-screen bg-surface-950">
      {/* Header */}
      <div className="page-header">
        <div className="relative z-10 container-wide">
          <div className="flex items-center gap-3 mb-4">
            <Terminal className="w-4 h-4 text-emerald-400" />
            <span className="text-emerald-400 font-mono text-sm">// data_collection_rules</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-display font-bold text-white mb-4 tracking-tight">
            Data Collection Rules
          </h1>
          <p className="text-surface-400 text-lg max-w-2xl">
            Comprehensive information about what data we collect, how we use it, and your rights under international data protection laws.
          </p>
          <p className="mt-6 text-xs text-surface-600 font-mono">Last Updated: June 26, 2026</p>
        </div>
      </div>

      <div className="container-wide py-8 pb-24 space-y-12">
        {/* Summary */}
        <section className="bg-gradient-to-br from-emerald-500/10 to-brand-500/10 border border-emerald-500/20 rounded-2xl p-6 sm:p-8">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center shrink-0">
              <Info className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white mb-2">Your Data, Your Rights</h2>
              <p className="text-surface-300 leading-relaxed">
                We are committed to transparency about data collection. This page details what personal data we collect, the legal basis for processing, data retention periods, and your rights under various international regulations including GDPR, CCPA, APPI, and others.
              </p>
            </div>
          </div>
        </section>

        {/* Data Categories */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <Database className="w-5 h-5 text-emerald-400" />
            <h2 className="text-2xl font-display font-bold text-white">Categories of Data Collected</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {dataCategories.map((item) => (
              <div key={item.category} className="bg-surface-900/50 border border-surface-800 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-brand-500/10 border border-brand-500/20 flex items-center justify-center">
                    <item.icon className="w-5 h-5 text-brand-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">{item.category}</h3>
                </div>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="text-surface-500 font-mono">Examples:</span>
                    <p className="text-surface-300">{item.examples.join(', ')}</p>
                  </div>
                  <div>
                    <span className="text-surface-500 font-mono">Purpose:</span>
                    <p className="text-surface-300">{item.purpose}</p>
                  </div>
                  <div className="flex flex-wrap gap-4">
                    <div>
                      <span className="text-surface-500 font-mono">Retention:</span>
                      <p className="text-surface-300">{item.retention}</p>
                    </div>
                    <div>
                      <span className="text-surface-500 font-mono">Legal Basis:</span>
                      <p className="text-surface-300">{item.legalBasis}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Cookies */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <Cookie className="w-5 h-5 text-emerald-400" />
            <h2 className="text-2xl font-display font-bold text-white">Cookie Policy</h2>
          </div>
          <div className="bg-surface-900/50 border border-surface-800 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-surface-800">
                    <th className="text-left text-surface-400 font-semibold px-6 py-4">Cookie Type</th>
                    <th className="text-left text-surface-400 font-semibold px-6 py-4">Required</th>
                    <th className="text-left text-surface-400 font-semibold px-6 py-4">Description</th>
                    <th className="text-left text-surface-400 font-semibold px-6 py-4">Retention</th>
                  </tr>
                </thead>
                <tbody>
                  {cookieTypes.map((cookie) => (
                    <tr key={cookie.type} className="border-b border-surface-800/50 last:border-0">
                      <td className="px-6 py-4 text-white font-medium">{cookie.type}</td>
                      <td className="px-6 py-4">
                        {cookie.required ? (
                          <span className="inline-flex items-center gap-1 text-xs bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded-full">
                            <CheckCircle className="w-3 h-3" />
                            Required
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs bg-surface-700 text-surface-400 px-2 py-1 rounded-full">
                            Optional
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-surface-300">
                        <p>{cookie.description}</p>
                        <p className="text-surface-500 mt-1 text-xs">Examples: {cookie.examples.join(', ')}</p>
                      </td>
                      <td className="px-6 py-4 text-surface-400 font-mono">{cookie.retention}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Regional Rights */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <MapPin className="w-5 h-5 text-emerald-400" />
            <h2 className="text-2xl font-display font-bold text-white">Rights by Region</h2>
          </div>
          <p className="text-surface-400 mb-6">
            Your data protection rights vary based on your location. Find the rights applicable to you below.
          </p>
          <div className="space-y-6">
            {regions.map((region) => (
              <div key={region.region} className="bg-surface-900/50 border border-surface-800 rounded-2xl p-6">
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <span className="text-2xl">{region.flag}</span>
                  <h3 className="text-lg font-semibold text-white">{region.region}</h3>
                  <span className="text-xs bg-brand-500/10 text-brand-400 px-2 py-1 rounded-lg font-mono">{region.regulation}</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-surface-500 font-mono text-xs mb-3">YOUR RIGHTS</h4>
                    <ul className="space-y-2">
                      {region.rights.map((right) => (
                        <li key={right} className="flex items-start gap-2 text-surface-300 text-sm">
                          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                          {right}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-surface-500 font-mono text-xs mb-2">SUPERVISORY AUTHORITY</h4>
                      <p className="text-sm text-surface-300">{region.authority}</p>
                    </div>
                    <div>
                      <h4 className="text-surface-500 font-mono text-xs mb-2">NOTES</h4>
                      <p className="text-sm text-surface-400">{region.notes}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Exercise Rights */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <Shield className="w-5 h-5 text-emerald-400" />
            <h2 className="text-2xl font-display font-bold text-white">How to Exercise Your Rights</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-surface-900/50 border border-surface-800 rounded-2xl p-6">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-4">
                <span className="text-emerald-400 font-bold">1</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Submit a Request</h3>
              <p className="text-surface-400 text-sm">
                Contact us at <span className="text-emerald-400">privacy@motoraconnect.com</span> with your request. Include your name, email, and the specific right you wish to exercise.
              </p>
            </div>
            <div className="bg-surface-900/50 border border-surface-800 rounded-2xl p-6">
              <div className="w-10 h-10 rounded-lg bg-brand-500/10 border border-brand-500/20 flex items-center justify-center mb-4">
                <span className="text-brand-400 font-bold">2</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Identity Verification</h3>
              <p className="text-surface-400 text-sm">
                We will verify your identity to protect against unauthorized access. This may require confirming your email or providing proof of identity.
              </p>
            </div>
            <div className="bg-surface-900/50 border border-surface-800 rounded-2xl p-6">
              <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mb-4">
                <span className="text-cyan-400 font-bold">3</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Response Timeline</h3>
              <p className="text-surface-400 text-sm">
                We respond within <span className="text-white">30 days</span> (GDPR) or <span className="text-white">45 days</span> (CCPA). Complex requests may take longer with notification.
              </p>
            </div>
          </div>
        </section>

        {/* Data Transfers */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <Globe className="w-5 h-5 text-emerald-400" />
            <h2 className="text-2xl font-display font-bold text-white">International Data Transfers</h2>
          </div>
          <div className="bg-surface-900/50 border border-surface-800 rounded-2xl p-6">
            <div className="flex items-start gap-4 mb-6">
              <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-1" />
              <p className="text-surface-300">
                Your data may be transferred to and processed in countries other than your own. We ensure appropriate safeguards for such transfers.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-white font-semibold mb-3">Safeguard Mechanisms</h3>
                <ul className="space-y-2 text-sm text-surface-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    Standard Contractual Clauses (SCCs)
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    EU Adequacy Decisions
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    Binding Corporate Rules
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    Explicit Consent
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-3">Transfer Locations</h3>
                <ul className="space-y-2 text-sm text-surface-300">
                  <li className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-surface-500" />
                    Pakistan (Primary Operations)
                  </li>
                  <li className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-surface-500" />
                    United States (Cloud Hosting)
                  </li>
                  <li className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-surface-500" />
                    EU (When applicable)
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Contact */}
        <section className="bg-surface-900/50 border border-surface-800 rounded-2xl p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-6">
            <Mail className="w-5 h-5 text-emerald-400" />
            <h2 className="text-xl font-semibold text-white">Data Protection Contact</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <p className="text-surface-500 text-xs font-mono mb-1">PRIVACY OFFICER</p>
              <p className="text-white">privacy@motoraconnect.com</p>
            </div>
            <div>
              <p className="text-surface-500 text-xs font-mono mb-1">DATA REQUESTS</p>
              <p className="text-white">data-requests@motoraconnect.com</p>
            </div>
            <div>
              <p className="text-surface-500 text-xs font-mono mb-1">WHATSAPP</p>
              <p className="text-white">+1 (555) 907-2666</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
