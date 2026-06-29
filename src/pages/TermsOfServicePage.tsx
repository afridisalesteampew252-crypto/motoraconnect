import { Terminal, Scale, AlertTriangle, CreditCard, Globe, Shield, Clock, Mail, Gavel, Users, RefreshCw, Ban } from 'lucide-react';

const sections = [
  {
    id: 'acceptance',
    title: 'Acceptance of Terms',
    icon: Scale,
    content: `By accessing or using Motoraconnect's website and services, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.

These terms constitute a legally binding agreement between you ("User," "you," or "your") and Motoraconnect ("Company," "we," "us," or "our").

Your use of our services is also governed by our Privacy Policy and any other applicable policies.`,
  },
  {
    id: 'services',
    title: 'Description of Services',
    icon: Globe,
    content: `Motoraconnect provides the following services:

**Vehicle Import Consultation:**
- Expert guidance on importing Japanese vehicles
- Auction verification and analysis
- Import cost calculations
- Exporter referrals

**Online Platform:**
- Vehicle database and price information
- Import calculator tools
- Auction verification services
- Consultation booking system

**Disclaimer:** We act as consultants and facilitators. We are not a vehicle dealer, exporter, or importer. All vehicle purchases are made directly between you and third-party exporters.`,
  },
  {
    id: 'accounts',
    title: 'User Accounts',
    icon: Users,
    content: `**Account Registration:**
- You must provide accurate and complete information
- You are responsible for maintaining account security
- You must be at least 18 years old to create an account
- One account per individual

**Account Responsibilities:**
- Keep login credentials confidential
- Notify us immediately of unauthorized access
- All activities under your account are your responsibility
- Do not share accounts with others

**Account Termination:**
We reserve the right to suspend or terminate accounts that violate these terms or for any reason at our discretion.`,
  },
  {
    id: 'payments',
    title: 'Payments & Fees',
    icon: CreditCard,
    content: `**Consultation Fees:**
- Fees are displayed on our website before booking
- Payment is required at the time of booking
- All fees are in USD unless otherwise stated
- Fees may change without prior notice

**Payment Processing:**
- Payments are processed by third-party payment processors
- We do not store your complete payment card details
- By making a payment, you authorize us to charge your selected payment method

**Refunds:**
- Consultation fees are non-refundable unless we are unable to provide the service
- Requests for refunds must be made within 7 days of purchase
- Refunds for consultations already conducted are at our sole discretion`,
  },
  {
    id: 'user-conduct',
    title: 'User Conduct',
    icon: Ban,
    content: `You agree NOT to:

**Prohibited Activities:**
- Use our services for illegal purposes
- Provide false or misleading information
- Attempt to access restricted areas or systems
- Interfere with the proper functioning of our services
- Collect or harvest data of other users
- Use automated systems (bots, scrapers) without permission
- Infringe on intellectual property rights
- Transmit viruses, malware, or harmful code
- Harass, abuse, or harm other users or staff
- Engage in fraudulent activities

**Consequences:**
Violation of these rules may result in:
- Account suspension or termination
- Forfeiture of any paid fees
- Legal action where appropriate`,
  },
  {
    id: 'intellectual-property',
    title: 'Intellectual Property',
    icon: Shield,
    content: `**Our Content:**
All content on our website, including but not limited to:
- Text, graphics, logos, and branding
- Software and code
- Vehicle database and pricing information
- Consultation materials and guides
- Is the property of Motoraconnect and is protected by copyright and other laws.

**Your License:**
We grant you a limited, non-exclusive, non-transferable license to access and use our services for personal, non-commercial purposes.

**User Content:**
You retain ownership of content you submit. By submitting content, you grant us a license to use, display, and process it for service delivery.`,
  },
  {
    id: 'third-party',
    title: 'Third-Party Links & Services',
    icon: Globe,
    content: `Our services may contain links to third-party websites or services, including:

- Vehicle exporters
- Payment processors
- Analytics providers
- Social media platforms

**Disclaimer:**
- We are not responsible for third-party content or practices
- Your interactions with third parties are solely between you and them
- We do not endorse or guarantee third-party services
- Review third-party terms before engaging

**Exporter Referrals:**
While we vet exporters in our network, we do not guarantee:
- Vehicle condition or authenticity
- Exporter performance
- Delivery timelines
- Dispute resolution with exporters`,
  },
  {
    id: 'disclaimers',
    title: 'Disclaimers & Limitations',
    icon: AlertTriangle,
    content: `**No Guarantee of Results:**
- We provide guidance, not guaranteed outcomes
- Vehicle import involves risks beyond our control
- Pricing estimates are approximations
- Auction data may not always be accurate

**"As Is" Basis:**
Our services are provided "as is" and "as available" without warranties of any kind, either express or implied, including:
- Warranties of merchantability
- Fitness for a particular purpose
- Non-infringement
- Accuracy of information

**Limitation of Liability:**
To the maximum extent permitted by law:
- We are not liable for indirect, incidental, or consequential damages
- Our total liability does not exceed fees paid in the past 12 months
- We are not liable for third-party actions or decisions`,
  },
  {
    id: 'indemnification',
    title: 'Indemnification',
    icon: Gavel,
    content: `You agree to indemnify and hold harmless Motoraconnect, its officers, directors, employees, and agents from any claims, damages, losses, or expenses (including reasonable attorney's fees) arising from:

- Your use of our services
- Your violation of these terms
- Your violation of any rights of another party
- Your content or submissions
- Your interactions with third parties`,
  },
  {
    id: 'termination',
    title: 'Termination',
    icon: RefreshCw,
    content: `**By You:**
You may terminate your account at any time by contacting us or through account settings.

**By Us:**
We may suspend or terminate your access to our services:
- For violation of these terms
- For extended periods of inactivity
- For any reason at our discretion

**Effect of Termination:**
- Your right to use our services ceases immediately
- Paid services already rendered are non-refundable
- Provisions that by nature should survive will remain in effect`,
  },
  {
    id: 'disputes',
    title: 'Dispute Resolution',
    icon: Gavel,
    content: `**Informal Resolution:**
Before filing a claim, please contact us at legal@motoraconnect.com to attempt informal resolution.

**Governing Law:**
These terms are governed by the laws of Pakistan, without regard to conflict of law principles.

**Jurisdiction:**
Any disputes shall be resolved in the courts of Pakistan. Users outside Pakistan agree to submit to this jurisdiction.

**Class Action Waiver:**
You agree not to participate in class actions, class arbitrations, or representative actions against us.

**Statute of Limitations:**
You must bring claims within one (1) year from when the claim arose.`,
  },
  {
    id: 'changes',
    title: 'Changes to Terms',
    icon: Clock,
    content: `We reserve the right to modify these terms at any time.

**Notice of Changes:**
- Material changes will be notified via email
- Changes will be posted on our website
- Updated date will be displayed

**Acceptance of Changes:**
Continued use of our services after changes become effective constitutes acceptance of the modified terms.

**Your Options:**
If you do not agree with changes, you may:
- Stop using our services
- Request account deletion`,
  },
  {
    id: 'contact',
    title: 'Contact Information',
    icon: Mail,
    content: `For questions about these Terms of Service:

**Email:** legal@motoraconnect.com
**WhatsApp:** +1 (555) 907-2666
**Facebook:** facebook.com/motoraconnect

For general inquiries: support@motoraconnect.com
For privacy matters: privacy@motoraconnect.com`,
  },
];

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-surface-950">
      {/* Header */}
      <div className="page-header">
        <div className="relative z-10 container-wide">
          <div className="flex items-center gap-3 mb-4">
            <Terminal className="w-4 h-4 text-emerald-400" />
            <span className="text-emerald-400 font-mono text-sm">// terms_of_service</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-display font-bold text-white mb-4 tracking-tight">
            Terms of Service
          </h1>
          <p className="text-surface-400 text-lg max-w-2xl">
            Please read these terms carefully before using our services. By using Motoraconnect, you agree to these terms.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-surface-500">
            <span className="inline-flex items-center gap-2 bg-surface-800/50 px-3 py-1.5 rounded-lg">
              <Scale className="w-4 h-4 text-emerald-400" />
              Legal Agreement
            </span>
            <span className="inline-flex items-center gap-2 bg-surface-800/50 px-3 py-1.5 rounded-lg">
              <Globe className="w-4 h-4 text-brand-400" />
              International Users
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
                  <div className="w-10 h-10 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center">
                    <section.icon className="w-5 h-5 text-brand-400" />
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
