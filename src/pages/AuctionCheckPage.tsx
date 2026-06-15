import { useState } from 'react';
import { Shield, Upload, CheckCircle, AlertTriangle, Info, FileText } from 'lucide-react';

interface GradeInfo {
  grade: string;
  label: string;
  color: string;
  bgColor: string;
  description: string;
}

const exteriorGrades: GradeInfo[] = [
  { grade: '5', label: 'Excellent', color: 'text-emerald-700', bgColor: 'bg-emerald-50', description: 'Like new condition. Minimal to no wear.' },
  { grade: '4.5', label: 'Very Good', color: 'text-brand-700', bgColor: 'bg-brand-50', description: 'Minor scratches/dents. Very well maintained.' },
  { grade: '4', label: 'Good', color: 'text-sky-700', bgColor: 'bg-sky-50', description: 'Light scratches, small dents. Good overall condition.' },
  { grade: '3.5', label: 'Average', color: 'text-amber-700', bgColor: 'bg-amber-50', description: 'Normal wear for age. Some repairs may be needed.' },
  { grade: '3', label: 'Below Average', color: 'text-orange-700', bgColor: 'bg-orange-50', description: 'Noticeable wear. Multiple repairs likely.' },
  { grade: '2', label: 'Poor', color: 'text-red-700', bgColor: 'bg-red-50', description: 'Significant damage or heavy wear. Major repairs needed.' },
];

const interiorGrades: GradeInfo[] = [
  { grade: 'A', label: 'Excellent', color: 'text-emerald-700', bgColor: 'bg-emerald-50', description: 'Like new. Minimal wear on seats and trim.' },
  { grade: 'B', label: 'Very Good', color: 'text-brand-700', bgColor: 'bg-brand-50', description: 'Light wear. Clean and well-kept interior.' },
  { grade: 'C', label: 'Average', color: 'text-amber-700', bgColor: 'bg-amber-50', description: 'Normal wear for mileage. Some stains or minor damage.' },
  { grade: 'D', label: 'Below Average', color: 'text-red-700', bgColor: 'bg-red-50', description: 'Heavy wear. Cigarette burns, stains, or damage.' },
];

const auctionMarks = [
  { mark: 'A1', meaning: 'Light scratch', severity: 'low' },
  { mark: 'A2', meaning: 'Scratch requiring repair', severity: 'medium' },
  { mark: 'U1', meaning: 'Small dent (fingertip size)', severity: 'low' },
  { mark: 'U2', meaning: 'Dent requiring repair', severity: 'medium' },
  { mark: 'U3', meaning: 'Large dent', severity: 'high' },
  { mark: 'S1', meaning: 'Slight rust', severity: 'low' },
  { mark: 'S2', meaning: 'Rust requiring repair', severity: 'medium' },
  { mark: 'W1', meaning: 'Windshield crack / replaced panel', severity: 'high' },
  { mark: 'W2', meaning: 'Panel replacement', severity: 'high' },
  { mark: 'P', meaning: 'Previous repair/paint', severity: 'medium' },
  { mark: 'X', meaning: 'Needs replacement', severity: 'high' },
];

function getSeverityColor(severity: string) {
  if (severity === 'low') return 'bg-emerald-100 text-emerald-700';
  if (severity === 'medium') return 'bg-amber-100 text-amber-700';
  return 'bg-red-100 text-red-700';
}

export default function AuctionCheckPage() {
  const [auctionId, setAuctionId] = useState('');
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (auctionId.trim()) setSubmitted(true);
  }

  return (
    <div className="min-h-screen bg-surface-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-surface-900 to-brand-950 pt-12 pb-20">
        <div className="container-wide">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-white mb-4">
            Auction Sheet Checker
          </h1>
          <p className="text-surface-300 text-lg max-w-2xl">
            Submit a Japanese auction sheet for expert verification. We check for hidden damage, grade accuracy, and provide a detailed condition report.
          </p>
        </div>
      </div>

      <div className="container-wide -mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Submit form */}
          <div className="lg:col-span-1">
            <div className="card p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-brand-500/10 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-brand-600" />
                </div>
                <h2 className="text-xl font-semibold text-surface-900">Verify an Auction Sheet</h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="label-field">Auction Lot / Reference Number</label>
                  <input
                    type="text"
                    placeholder="e.g. USS-12345 or lot number"
                    value={auctionId}
                    onChange={(e) => setAuctionId(e.target.value)}
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="label-field">Upload Auction Sheet Image</label>
                  <div className="border-2 border-dashed border-surface-200 rounded-xl p-8 text-center hover:border-brand-400 transition-colors cursor-pointer">
                    <Upload className="w-8 h-8 text-surface-400 mx-auto mb-2" />
                    <p className="text-sm text-surface-500">
                      Click or drag to upload
                    </p>
                    <p className="text-xs text-surface-400 mt-1">
                      PNG, JPG up to 10MB
                    </p>
                  </div>
                </div>

                <div>
                  <label className="label-field">Additional Notes</label>
                  <textarea
                    rows={3}
                    placeholder="Any specific concerns or questions about this vehicle..."
                    className="input-field resize-none"
                  />
                </div>

                <button type="submit" className="btn-primary w-full justify-center">
                  <Shield className="w-5 h-5" />
                  Request Verification
                </button>

                <p className="text-xs text-surface-400 text-center">
                  Verification typically takes 24-48 hours. You'll receive results via email.
                </p>
              </form>

              {submitted && (
                <div className="mt-4 bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <CheckCircle className="w-5 h-5 text-emerald-600" />
                    <span className="font-medium text-emerald-800">Request Submitted</span>
                  </div>
                  <p className="text-sm text-emerald-700">
                    We'll verify the auction sheet for lot {auctionId} and send you a detailed report.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Reference guide */}
          <div className="lg:col-span-2 space-y-6">
            {/* Exterior grades */}
            <div className="card p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-brand-500/10 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-brand-600" />
                </div>
                <h2 className="text-xl font-semibold text-surface-900">Understanding Auction Grades</h2>
              </div>

              <h3 className="font-semibold text-surface-900 mb-4">Exterior Grades</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                {exteriorGrades.map((g) => (
                  <div key={g.grade} className={`${g.bgColor} rounded-xl p-4`}>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-lg font-bold ${g.color}`}>{g.grade}</span>
                      <span className={`text-sm font-medium ${g.color}`}>{g.label}</span>
                    </div>
                    <p className="text-sm text-surface-600">{g.description}</p>
                  </div>
                ))}
              </div>

              <h3 className="font-semibold text-surface-900 mb-4">Interior Grades</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {interiorGrades.map((g) => (
                  <div key={g.grade} className={`${g.bgColor} rounded-xl p-4`}>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-lg font-bold ${g.color}`}>{g.grade}</span>
                      <span className={`text-sm font-medium ${g.color}`}>{g.label}</span>
                    </div>
                    <p className="text-sm text-surface-600">{g.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Auction marks */}
            <div className="card p-8">
              <h3 className="font-semibold text-surface-900 mb-4">Common Auction Sheet Marks</h3>
              <p className="text-sm text-surface-500 mb-4">
                Japanese auction sheets use specific marks to indicate damage types and severity on a vehicle diagram.
              </p>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-surface-200">
                      <th className="text-left py-3 px-4 text-sm font-semibold text-surface-900">Mark</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-surface-900">Meaning</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-surface-900">Severity</th>
                    </tr>
                  </thead>
                  <tbody>
                    {auctionMarks.map((m) => (
                      <tr key={m.mark} className="border-b border-surface-100">
                        <td className="py-3 px-4 font-mono font-semibold text-surface-900">{m.mark}</td>
                        <td className="py-3 px-4 text-sm text-surface-600">{m.meaning}</td>
                        <td className="py-3 px-4">
                          <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${getSeverityColor(m.severity)}`}>
                            {m.severity.charAt(0).toUpperCase() + m.severity.slice(1)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Tips */}
            <div className="card p-8">
              <div className="flex items-center gap-3 mb-4">
                <Info className="w-5 h-5 text-brand-600" />
                <h3 className="font-semibold text-surface-900">Verification Tips</h3>
              </div>
              <div className="space-y-3">
                {[
                  'Always request the original Japanese auction sheet, not a translated version',
                  'Check if the grade matches the damage marks shown on the diagram',
                  'Look for "W" marks indicating panel replacements - these suggest accident history',
                  'Verify the odometer reading against the mileage grade',
                  'Grade 3.5 and below vehicles often have hidden issues not visible in photos',
                ].map((tip, i) => (
                  <div key={i} className="flex gap-3 items-start">
                    <CheckCircle className="w-4 h-4 text-brand-500 shrink-0 mt-0.5" />
                    <p className="text-sm text-surface-600">{tip}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="h-16" />
    </div>
  );
}
