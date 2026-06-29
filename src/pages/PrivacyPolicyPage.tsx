import { Terminal, Shield, Globe, Lock, UserCheck, Mail, FileText, Calendar } from 'lucide-react';

const sections = [
  {
    id: 'introduction',
    title: 'Introduction',
    icon: FileText,
    content: `Motoraconnect ("we," "our," or "us") is committed to protecting your privacy and personal data. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services.

We operate in compliance with applicable data protection laws including:
- EU General Data Protection Regulation (GDPR)
- California Consumer Privacy Act (CCPA)
- Japan's Act on the Protection of Personal Information (APPI)
- Other applicable international privacy regulations`,
  },
  {
    id: 'data-controller',
    title: 'Data Controller',
    icon: UserCheck,
    content: `Motoraconnect is the data controller for the personal data collected through this website. We determine the purposes and means of processing your personal data.

Contact Information:
- Email: privacy@motoraconnect.com
- Address: Pakistan (Remote worldwide operations)

For EU residents: We have designated a representative within the European Union for GDPR compliance purposes.`,
  },
  {
    id: 'data-collected',
    title: 'Data We Collect',
    icon: Globe,
    content: `We collect the following categories of personal data:

**Directly Provided Information:**
- Name and contact details (email, phone number)
- Account credentials (email, password - hashed)
- Vehicle preferences and interests
- Budget information
- Consultation requests and messages
- Country of residence

**Automatically Collected Information:**
- IP address and geolocation data
- Browser type and version
- Device information
- Usage data and analytics
- Cookies and similar technologies

**Third-Party Sources:**
- Authentication data from social providers (if applicable)
- Payment processing data (handled by payment processors)`,
  },
  {
    id: 'legal-basis',
    title: 'Legal Basis for Processing',
    icon: Shield,
    content: `We process your personal data under the following legal bases:

**Consent (GDPR Article 6(1)(a)):**
- Marketing communications
- Optional data collection (cookies, analytics)
- Third-party data sharing

**Contract Performance (GDPR Article 6(1)(b)):**
- Account creation and management
- Service delivery
- Consultation bookings
- Transaction processing

**Legitimate Interests (GDPR Article 6(1)(f)):**
- Fraud prevention
- Security monitoring
- Service improvement
- Analytics and research

**Legal Obligation (GDPR Article 6(1)(c)):**
- Tax and accounting records
- Regulatory compliance
- Legal proceedings`,
  },
  {
    id: 'data-use',
    title: 'How We Use Your Data',
    icon: FileText,
    content: `Your personal data is used for:

- **Service Delivery:** Providing consultation services, vehicle searches, and import calculators
- **Account Management:** Creating and managing your user account
- **Communication:** Responding to inquiries, sending service updates
- **Marketing:** Promotional communications (with consent)
- **Analytics:** Understanding user behavior to improve services
- **Security:** Preventing fraud and unauthorized access
- **Legal Compliance:** Meeting regulatory and legal requirements`,
  },
  {
    id: 'data-sharing',
    title: 'Data Sharing & Transfers',
    icon: Globe,
    content: `We may share your data with:

**Service Providers:**
- Cloud hosting providers (Supabase)
- Payment processors
- Email service providers
- Analytics providers

**Legal Requirements:**
- Law enforcement agencies (when legally required)
- Regulatory bodies
- Courts and tribunals

**Business Transfers:**
- In connection with merger, acquisition, or sale of assets

**International Transfers:**
Your data may be transferred to countries outside your residence. We ensure appropriate safeguards through:
- Standard Contractual Clauses (SCCs)
- Adequacy decisions
- Binding corporate rules
- Your explicit consent`,
  },
  {
    id: 'data-retention',
    title: 'Data Retention',
    icon: Calendar,
    content: `We retain your personal data only as long as necessary:

- **Account Data:** Duration of account + 30 days (deletion upon request)
- **Transaction Records:** 7 years (legal/ tax requirements)
- **Consultation Records:** 3 years
- **Marketing Data:** Until consent withdrawn
- **Analytics Data:** 2 years (anonymized)
- **Security Logs:** 1 year

After the retention period, data is securely deleted or anonymized.`,
  },
  {
    id: 'your-rights',
    title: 'Your Rights',
    icon: Lock,
    content: `Under applicable data protection laws, you have the right to:

**GDPR Rights (EU/EEA Residents):**
- Right to Access (Article 15)
- Right to Rectification (Article 16)
- Right to Erasure (Article 17)
- Right to Restriction (Article 18)
- Right to Data Portability (Article 20)
- Right to Object (Article 21)
- Rights related to automated decision-making (Article 22)

**CCPA Rights (California Residents):**
- Right to Know what personal information is collected
- Right to Delete personal information
- Right to Opt-Out of sale of personal information
- Right to Non-Discrimination

**APPI Rights (Japan Residents):**
- Right to request disclosure
- Right to request correction
- Right to request deletion

To exercise these rights, contact us at: privacy@motoraconnect.com`,
  },
  {
    id: 'cookies',
    title: 'Cookies & Tracking',
    icon: Shield,
    content: `We use cookies and similar technologies for:

**Essential Cookies (No consent required):**
- Authentication and session management
- Security and fraud prevention
- Basic functionality

**Analytics Cookies (Consent required):**
- Usage patterns and statistics
- Performance monitoring

**Marketing Cookies (Consent required):**
- Personalized advertising
- Conversion tracking

You can manage cookie preferences through your browser settings or our cookie consent tool.`,
  },
  {
    id: 'security',
    title: 'Data Security',
    icon: Lock,
    content: `We implement appropriate technical and organizational measures:

- Encryption in transit (TLS 1.3) and at rest (AES-256)
- Access controls and authentication
- Regular security assessments
- Staff training on data protection
- Incident response procedures
- Secure data centers with physical security

While we strive to protect your data, no method of transmission is 100% secure.`,
  },
  {
    id: 'children',
    title: "Children\u2019s Privacy",
    icon: UserCheck,
    content: `Our services are not intended for individuals under 18 years of age. We do not knowingly collect personal data from children.

If we discover we have collected data from a minor, we will promptly delete it. Parents or guardians who believe their child has provided personal data should contact us immediately.`,
  },
  {
    id: 'updates',
    title: 'Policy Updates',
    icon: FileText,
    content: `We may update this Privacy Policy periodically. Significant changes will be notified via:

- Email notification (for account holders)
- Banner on our website
- Update to the "Last Updated" date

Continued use of our services after changes constitutes acceptance of the updated policy.`,
  },
  {
    id: 'contact',
    title: 'Contact Us',
    icon: Mail,
    content: `For privacy-related inquiries or to exercise your rights:

**Email:** privacy@motoraconnect.com
**WhatsApp:** +1 (555) 907-2666
**Facebook:** facebook.com/motoraconnect

**Supervisory Authority:**
EU residents have the right to lodge a complaint with their local data protection authority.
California residents may contact the California Attorney General.`,
  },
];

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-surface-950">
      {/* Header */}
      <div className="page-header">
        <div className="relative z-10 container-wide">
          <div className="flex items-center gap-3 mb-4">
            <Terminal className="w-4 h-4 text-emerald-400" />
            <span className="text-emerald-400 font-mono text-sm">// privacy_policy</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-display font-bold text-white mb-4 tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-surface-400 text-lg max-w-2xl">
            Your privacy matters. Learn how we collect, use, and protect your personal data in compliance with international regulations.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-surface-500">
            <span className="inline-flex items-center gap-2 bg-surface-800/50 px-3 py-1.5 rounded-lg">
              <Shield className="w-4 h-4 text-emerald-400" />
              GDPR Compliant
            </span>
            <span className="inline-flex items-center gap-2 bg-surface-800/50 px-3 py-1.5 rounded-lg">
              <Globe className="w-4 h-4 text-brand-400" />
              CCPA Compliant
            </span>
            <span className="inline-flex items-center gap-2 bg-surface-800/50 px-3 py-1.5 rounded-lg">
              <Lock className="w-4 h-4 text-cyan-400" />
              APPI Compliant
            </span>
          </div>
          <p className="mt-6 text-xs text-surface-600 font-mono">Last Updated: June 26, 2026</p>
        </div>
      </div>

      {/* Content */}
      <div className="container-wide py-8 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Table of Contents */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-surface-900/50 border border-surface-800 rounded-2xl p-5">
              <h3 className="text-sm font-semibold text-white mb-4">Contents</h3>
              <nav className="space-y-2">
                {sections.map((section) => (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    className="block text-sm text-surface-400 hover:text-emerald-400 transition-colors"
                  >
                    {section.title}
                  </a>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {sections.map((section) => (
              <section
                key={section.id}
                id={section.id}
                className="bg-surface-900/50 border border-surface-800 rounded-2xl p-6 sm:p-8"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                    <section.icon className="w-5 h-5 text-emerald-400" />
                  </div>
                  <h2 className="text-xl font-semibold text-white">{section.title}</h2>
                </div>
                <div className="prose prose-invert prose-sm max-w-none">
                  {section.content.split('\n\n').map((paragraph, i) => (
                    <div key={i} className="text-surface-300 leading-relaxed mb-4 last:mb-0">
                      {paragraph.split('\n').map((line, j) => {
                        if (line.startsWith('**') && line.endsWith('**')) {
                          return <p key={j} className="font-semibold text-white mt-4 mb-2">{line.replace(/\*\*/g, '')}</p>;
                        }
                        if (line.startsWith('- ')) {
                          return <li key={j} className="ml-4 text-surface-400">{line.slice(2)}</li>;
                        }
                        return <p key={j}>{line}</p>;
                      })}
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
