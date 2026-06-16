import { useState } from 'react';
import { Calculator, Globe, Info, ChevronDown, ChevronUp, Terminal, ArrowRight } from 'lucide-react';
import { countries, calculateImportCost } from '../data/calculator';
import { Link } from 'react-router-dom';

type CalcResult = NonNullable<ReturnType<typeof calculateImportCost>>;

export default function CalculatorPage() {
  const [vehiclePriceJPY, setVehiclePriceJPY] = useState('');
  const [engineCC, setEngineCC] = useState('');
  const [countryCode, setCountryCode] = useState('PK');
  const [result, setResult] = useState<CalcResult | null>(null);
  const [showBreakdown, setShowBreakdown] = useState(true);

  function handleCalculate() {
    const price = parseFloat(vehiclePriceJPY);
    const cc = parseInt(engineCC);
    if (!price || !cc) return;
    setResult(calculateImportCost(price, cc, countryCode));
  }

  const selectedCountry = countries.find((c) => c.code === countryCode);

  return (
    <div className="min-h-screen bg-surface-950">
      {/* Header */}
      <div className="page-header">
        <div className="relative z-10 container-wide">
          <div className="flex items-center gap-3 mb-4">
            <Terminal className="w-4 h-4 text-emerald-400" />
            <span className="text-emerald-400 font-mono text-sm">// import_calculator</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-display font-bold text-white mb-4 tracking-tight">
            Import Cost Calculator
          </h1>
          <p className="text-surface-400 text-lg max-w-2xl">
            Estimate total landed cost — vehicle price, shipping, duties, taxes, and fees for your destination.
          </p>
        </div>
      </div>

      <div className="container-wide py-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Input */}
          <div className="lg:col-span-2">
            <div className="bg-surface-900/50 border border-surface-800 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                  <Calculator className="w-4 h-4 text-emerald-400" />
                </div>
                <h2 className="text-lg font-semibold text-white">Vehicle Details</h2>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="label-field">Vehicle Price (JPY)</label>
                  <input
                    type="number"
                    placeholder="e.g. 5000000"
                    value={vehiclePriceJPY}
                    onChange={(e) => setVehiclePriceJPY(e.target.value)}
                    className="input-field"
                  />
                  <p className="text-xs text-surface-600 font-mono mt-1">auction price in Japanese Yen</p>
                </div>

                <div>
                  <label className="label-field">Engine Capacity (CC)</label>
                  <input
                    type="number"
                    placeholder="e.g. 2700"
                    value={engineCC}
                    onChange={(e) => setEngineCC(e.target.value)}
                    className="input-field"
                  />
                  <p className="text-xs text-surface-600 font-mono mt-1">affects duty rates in most countries</p>
                </div>

                <div>
                  <label className="label-field">Destination Country</label>
                  <select value={countryCode} onChange={(e) => setCountryCode(e.target.value)} className="input-field">
                    {countries.map((c) => <option key={c.code} value={c.code}>{c.name}</option>)}
                  </select>
                </div>

                {selectedCountry && (
                  <div className="bg-surface-800/50 border border-surface-700 rounded-xl p-4">
                    <div className="flex items-center gap-2 text-sm text-surface-400 mb-3">
                      <Globe className="w-3.5 h-3.5 text-brand-400" />
                      <span className="font-mono">{selectedCountry.name} duty rates</span>
                    </div>
                    <div className="space-y-1.5">
                      {selectedCountry.dutyRates.map((d, i) => (
                        <div key={i} className="flex justify-between text-sm">
                          <span className="text-surface-500">{d.label}</span>
                          <span className="font-mono font-medium text-white">{(d.rate * 100).toFixed(0)}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <button onClick={handleCalculate} className="btn-primary w-full justify-center">
                  <Calculator className="w-4 h-4" />
                  Calculate
                </button>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="lg:col-span-3">
            {result ? (
              <div className="bg-surface-900/50 border border-surface-800 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-white">Cost Breakdown</h2>
                  <button
                    onClick={() => setShowBreakdown(!showBreakdown)}
                    className="text-sm text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-mono"
                  >
                    {showBreakdown ? 'hide' : 'show'}
                    {showBreakdown ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>

                {/* Total */}
                <div className="bg-gradient-to-br from-emerald-500/10 to-brand-500/10 border border-emerald-500/20 rounded-2xl p-6 mb-6">
                  <p className="text-sm text-surface-400 font-mono mb-2">total_landed_cost</p>
                  <p className="text-4xl font-display font-bold text-white">
                    ${result.totalUSD.toLocaleString()}
                    <span className="text-lg text-surface-500 font-normal ml-2">USD</span>
                  </p>
                  <p className="text-lg text-surface-400 mt-1 font-mono">
                    {result.totalLocal.toLocaleString()} {result.currency}
                  </p>
                </div>

                {showBreakdown && (
                  <div className="space-y-0">
                    {[
                      { label: 'Vehicle Price (FOB)', value: `$${result.vehiclePriceUSD.toLocaleString()}` },
                      { label: 'Shipping (RO/RO)', value: `$${result.shippingUSD.toLocaleString()}` },
                      { label: 'CIF Value', value: `$${result.cifValueUSD.toLocaleString()}` },
                      { label: `Import Duty (${(result.dutyRate * 100).toFixed(0)}% — ${result.dutyLabel})`, value: `$${result.importDutyUSD.toLocaleString()}` },
                      { label: 'Sales Tax / VAT', value: `$${result.salesTaxUSD.toLocaleString()}` },
                      ...(result.additionalTaxUSD > 0 ? [{ label: 'Additional Tax', value: `$${result.additionalTaxUSD.toLocaleString()}` }] : []),
                    ].map((row, i) => (
                      <div key={i} className="flex justify-between items-center py-3 border-b border-surface-800">
                        <span className="text-surface-400 text-sm">{row.label}</span>
                        <span className="font-mono font-semibold text-white">{row.value}</span>
                      </div>
                    ))}
                  </div>
                )}

                <div className="mt-6 flex items-start gap-3 bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
                  <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-200/80">
                    Estimates only. Actual costs vary based on vehicle age, specific port charges, insurance, and current exchange rates.
                  </p>
                </div>

                <div className="mt-4">
                  <Link to="/consultation" className="btn-accent w-full justify-center text-sm">
                    <ArrowRight className="w-4 h-4" />
                    Get Precise Quote — Book Consultation
                  </Link>
                </div>
              </div>
            ) : (
              <div className="bg-surface-900/50 border border-surface-800 rounded-2xl p-12 text-center h-full flex flex-col items-center justify-center min-h-64">
                <div className="w-14 h-14 rounded-2xl bg-surface-800 border border-surface-700 flex items-center justify-center mx-auto mb-4">
                  <Calculator className="w-6 h-6 text-surface-500" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">No calculation yet</h3>
                <p className="text-surface-500 text-sm font-mono">fill in details and hit calculate</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
