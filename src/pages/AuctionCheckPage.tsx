import { useState, useRef } from 'react';
import { Shield, Upload, CheckCircle, Info, FileText, Terminal, AlertTriangle, FileUp } from 'lucide-react';
import { useAuthSafe } from '@/hooks/useAuth';
import { submitAuctionVerification } from '@/services/auctionService';

const exteriorGrades = [
  { grade: '5', label: 'Excellent', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20', description: 'Like new condition. Minimal to no wear.' },
  { grade: '4.5', label: 'Very Good', color: 'text-brand-400', bg: 'bg-brand-500/10 border-brand-500/20', description: 'Minor scratches/dents. Very well maintained.' },
  { grade: '4', label: 'Good', color: 'text-sky-400', bg: 'bg-sky-500/10 border-sky-500/20', description: 'Light scratches, small dents. Good overall.' },
  { grade: '3.5', label: 'Average', color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20', description: 'Normal wear for age. Some repairs may be needed.' },
  { grade: '3', label: 'Below Average', color: 'text-orange-400', bg: 'bg-orange-500/10 border-orange-500/20', description: 'Noticeable wear. Multiple repairs likely.' },
  { grade: '2', label: 'Poor', color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20', description: 'Significant damage. Major repairs needed.' },
];

const interiorGrades = [
  { grade: 'A', label: 'Excellent', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20', description: 'Like new. Minimal wear on seats and trim.' },
  { grade: 'B', label: 'Very Good', color: 'text-brand-400', bg: 'bg-brand-500/10 border-brand-500/20', description: 'Light wear. Clean and well-kept interior.' },
  { grade: 'C', label: 'Average', color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20', description: 'Normal wear for mileage. Some stains or minor damage.' },
  { grade: 'D', label: 'Below Average', color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20', description: 'Heavy wear. Burns, stains, or damage.' },
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

function severityStyle(s: string) {
  if (s === 'low') return 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20';
  if (s === 'medium') return 'bg-amber-500/15 text-amber-400 border border-amber-500/20';
  return 'bg-red-500/15 text-red-400 border border-red-500/20';
}

export default function AuctionCheckPage() {
  const auth = useAuthSafe();
  const [auctionId, setAuctionId] = useState('');
  const [notes, setNotes] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!auctionId.trim() || !auth?.user?.id) return;

    setSubmitting(true);
    try {
      await submitAuctionVerification(auth.user.id, {
        lotNumber: auctionId,
        notes: notes,
        sheetFile: file || undefined
      });
      setSubmitted(true);
    } catch (error) {
      console.error('Submission failed:', error);
      alert('Failed to submit verification request. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  return (
    <div className="min-h-screen bg-surface-950">
      {/* Header */}
      <div className="page-header">
        <div className="relative z-10 container-wide">
          <div className="flex items-center gap-3 mb-4">
            <Terminal className="w-4 h-4 text-emerald-400" />
            <span className="text-emerald-400 font-mono text-sm">// auction_verification</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-display font-bold text-white mb-4 tracking-tight">
            Auction Sheet Checker
          </h1>
          <p className="text-surface-400 text-lg max-w-2xl">
            Submit an auction sheet for expert verification. We check for hidden damage, grade accuracy, and provide a detailed condition report.
          </p>
        </div>
      </div>

      <div className="container-wide py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Submit form */}
          <div className="lg:col-span-1">
            <div className="bg-surface-900/50 border border-surface-800 rounded-2xl p-6 sticky top-28">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                  <Shield className="w-4 h-4 text-emerald-400" />
                </div>
                <h2 className="text-lg font-semibold text-white">Verify Auction Sheet</h2>
              </div>

              {submitted ? (
                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="w-5 h-5 text-emerald-400" />
                    <span className="font-semibold text-emerald-400">Request Submitted</span>
                  </div>
                  <p className="text-sm text-emerald-200/70">
                    We'll verify lot <span className="font-mono">{auctionId}</span> and send you a detailed report within 24-48 hours.
                  </p>
                  <button onClick={() => { setSubmitted(false); setAuctionId(''); }} className="mt-4 text-sm text-emerald-400 font-mono hover:text-emerald-300">
                    submit_another()
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="label-field">Auction Lot / Reference Number</label>
                    <input
                      type="text"
                      placeholder="e.g. USS-12345"
                      value={auctionId}
                      onChange={(e) => setAuctionId(e.target.value)}
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label className="label-field">Upload Auction Sheet</label>
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      onChange={handleFileChange} 
                      className="hidden" 
                      accept="image/*,application/pdf"
                    />
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors cursor-pointer ${
                        file ? 'border-emerald-500 bg-emerald-500/5' : 'border-surface-700 hover:border-emerald-500/50'
                      }`}
                    >
                      {file ? (
                        <>
                          <FileUp className="w-7 h-7 text-emerald-400 mx-auto mb-2" />
                          <p className="text-sm text-emerald-200">{file.name}</p>
                          <p className="text-xs text-emerald-500/60 mt-1 font-mono">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                        </>
                      ) : (
                        <>
                          <Upload className="w-7 h-7 text-surface-500 mx-auto mb-2" />
                          <p className="text-sm text-surface-400">Click or drag to upload</p>
                          <p className="text-xs text-surface-600 mt-1 font-mono">PNG, JPG, PDF up to 10MB</p>
                        </>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="label-field">Additional Notes</label>
                    <textarea
                      rows={3}
                      placeholder="Any specific concerns..."
                      className="input-field resize-none"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                    />
                  </div>

                  <button 
                    type="submit" 
                    disabled={submitting || !auctionId}
                    className={`btn-primary w-full justify-center ${submitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {submitting ? (
                      <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    ) : (
                      <Shield className="w-4 h-4" />
                    )}
                    {submitting ? 'Submitting...' : 'Request Verification'}
                  </button>
                  <p className="text-xs text-surface-600 text-center font-mono">24-48 hour turnaround</p>
                </form>
              )}
            </div>
          </div>

          {/* Reference guide */}
          <div className="lg:col-span-2 space-y-5">
            {/* Grades */}
            <div className="bg-surface-900/50 border border-surface-800 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-9 h-9 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center">
                  <FileText className="w-4 h-4 text-brand-400" />
                </div>
                <h2 className="text-lg font-semibold text-white">Understanding Auction Grades</h2>
              </div>

              <h3 className="text-sm font-mono text-surface-400 mb-3">exterior_grades</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                {exteriorGrades.map((g) => (
                  <div key={g.grade} className={`border rounded-xl p-3.5 ${g.bg}`}>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-lg font-bold font-mono ${g.color}`}>{g.grade}</span>
                      <span className={`text-sm font-medium ${g.color}`}>{g.label}</span>
                    </div>
                    <p className="text-sm text-surface-400">{g.description}</p>
                  </div>
                ))}
              </div>

              <h3 className="text-sm font-mono text-surface-400 mb-3">interior_grades</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {interiorGrades.map((g) => (
                  <div key={g.grade} className={`border rounded-xl p-3.5 ${g.bg}`}>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-lg font-bold font-mono ${g.color}`}>{g.grade}</span>
                      <span className={`text-sm font-medium ${g.color}`}>{g.label}</span>
                    </div>
                    <p className="text-sm text-surface-400">{g.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Marks table */}
            <div className="bg-surface-900/50 border border-surface-800 rounded-2xl p-6">
              <h3 className="text-base font-semibold text-white mb-2">Common Auction Sheet Marks</h3>
              <p className="text-sm text-surface-500 font-mono mb-4">damage_marks_reference</p>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-surface-800">
                      <th className="text-left py-2 px-3 text-xs font-mono text-surface-500">mark</th>
                      <th className="text-left py-2 px-3 text-xs font-mono text-surface-500">meaning</th>
                      <th className="text-left py-2 px-3 text-xs font-mono text-surface-500">severity</th>
                    </tr>
                  </thead>
                  <tbody>
                    {auctionMarks.map((m) => (
                      <tr key={m.mark} className="border-b border-surface-800/50 hover:bg-surface-800/30 transition-colors">
                        <td className="py-2.5 px-3 font-mono font-bold text-white">{m.mark}</td>
                        <td className="py-2.5 px-3 text-sm text-surface-400">{m.meaning}</td>
                        <td className="py-2.5 px-3">
                          <span className={`text-xs font-mono px-2 py-0.5 rounded-lg ${severityStyle(m.severity)}`}>
                            {m.severity}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Tips */}
            <div className="bg-surface-900/50 border border-surface-800 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Info className="w-5 h-5 text-brand-400" />
                <h3 className="font-semibold text-white">Verification Tips</h3>
              </div>
              <div className="space-y-3">
                {[
                  'Always request the original Japanese auction sheet, not a translated version',
                  'Check if the grade matches the damage marks shown on the vehicle diagram',
                  '"W" marks indicate panel replacements — these suggest accident history',
                  'Verify the odometer reading against the mileage grade',
                  'Grade 3.5 and below vehicles often have hidden issues not visible in photos',
                ].map((tip, i) => (
                  <div key={i} className="flex gap-3 items-start">
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <p className="text-sm text-surface-300">{tip}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
