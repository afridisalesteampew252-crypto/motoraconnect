import { useState } from 'react';
import { Calculator, Globe, Info, ChevronDown, ChevronUp } from 'lucide-react';
import { countries, calculateImportCost } from '../data/calculator';

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
    const calc = calculateImportCost(price, cc, countryCode);
    setResult(calc);
  }

  const selectedCountry = countries.find((c) => c.code === countryCode);

  return (
    <div className="min-h-screen bg-surface-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-surface-900 to-brand-950 pt-12 pb-20">
        <div className="container-wide">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-white mb-4">
            Import Cost Calculator
          </h1>
          <p className="text-surface-300 text-lg max-w-2xl">
            Estimate your total landed cost including vehicle price, shipping, import duties, taxes, and fees for your destination country.
          </p>
        </div>
      </div>

      <div className="container-wide -mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Input form */}
          <div className="lg:col-span-2">
            <div className="card p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-brand-500/10 flex items-center justify-center">
                  <Calculator className="w-5 h-5 text-brand-600" />
                </div>
                <h2 className="text-xl font-semibold text-surface-900">Vehicle Details</h2>
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
                  <p className="text-xs text-surface-400 mt-1">
                    Price at Japanese auction (in Japanese Yen)
                  </p>
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
                  <p className="text-xs text-surface-400 mt-1">
                    Engine displacement affects duty rates in most countries
                  </p>
                </div>

                <div>
                  <label className="label-field">Destination Country</label>
                  <select
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    className="input-field"
                  >
                    {countries.map((c) => (
                      <option key={c.code} value={c.code}>{c.name}</option>
                    ))}
                  </select>
                </div>

                {selectedCountry && (
                  <div className="bg-surface-50 rounded-xl p-4">
                    <div className="flex items-center gap-2 text-sm text-surface-600 mb-2">
                      <Globe className="w-4 h-4 text-brand-500" />
                      {selectedCountry.name} Duty Rates
                    </div>
                    <div className="space-y-1">
                      {selectedCountry.dutyRates.map((d, i) => (
                        <div key={i} className="flex justify-between text-sm">
                          <span className="text-surface-500">{d.label}</span>
                          <span className="font-medium text-surface-700">{(d.rate * 100).toFixed(0)}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <button onClick={handleCalculate} className="btn-primary w-full justify-center">
                  <Calculator className="w-5 h-5" />
                  Calculate Import Cost
                </button>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="lg:col-span-3">
            {result ? (
              <div className="card p-8">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-xl font-semibold text-surface-900">Cost Breakdown</h2>
                  <button
                    onClick={() => setShowBreakdown(!showBreakdown)}
                    className="text-sm text-brand-600 hover:text-brand-700 flex items-center gap-1"
                  >
                    {showBreakdown ? 'Hide' : 'Show'} details
                    {showBreakdown ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>

                {/* Total */}
                <div className="bg-gradient-to-br from-brand-50 to-accent-50 rounded-2xl p-6 mb-8">
                  <p className="text-sm text-surface-600 mb-1">Total Estimated Landed Cost</p>
                  <p className="text-3xl sm:text-4xl font-display font-bold text-surface-900">
                    ${result.totalUSD.toLocaleString()} <span className="text-lg text-surface-500">USD</span>
                  </p>
                  <p className="text-lg text-surface-600 mt-1">
                    {result.totalLocal.toLocaleString()} {result.currency}
                  </p>
                </div>

                {showBreakdown && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-3 border-b border-surface-100">
                      <span className="text-surface-600">Vehicle Price (FOB)</span>
                      <span className="font-semibold text-surface-900">${result.vehiclePriceUSD.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-surface-100">
                      <span className="text-surface-600">Shipping (RO/RO estimate)</span>
                      <span className="font-semibold text-surface-900">${result.shippingUSD.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-surface-100">
                      <span className="text-surface-600">CIF Value</span>
                      <span className="font-semibold text-surface-900">${result.cifValueUSD.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-surface-100">
                      <div>
                        <span className="text-surface-600">Import Duty</span>
                        <span className="text-xs text-surface-400 ml-2">({(result.dutyRate * 100).toFixed(0)}% - {result.dutyLabel})</span>
                      </div>
                      <span className="font-semibold text-surface-900">${result.importDutyUSD.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-surface-100">
                      <span className="text-surface-600">Sales Tax / VAT</span>
                      <span className="font-semibold text-surface-900">${result.salesTaxUSD.toLocaleString()}</span>
                    </div>
                    {result.additionalTaxUSD > 0 && (
                      <div className="flex justify-between items-center py-3 border-b border-surface-100">
                        <span className="text-surface-600">Additional Tax</span>
                        <span className="font-semibold text-surface-900">${result.additionalTaxUSD.toLocaleString()}</span>
                      </div>
                    )}
                  </div>
                )}

                <div className="mt-8 flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4">
                  <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <p className="text-sm text-amber-800">
                    These estimates are for guidance only. Actual costs may vary based on vehicle age, condition, specific port charges, insurance, and current exchange rates. Book a consultation for a precise calculation.
                  </p>
                </div>
              </div>
            ) : (
              <div className="card p-12 text-center">
                <Calculator className="w-12 h-12 text-surface-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-surface-900 mb-2">No Calculation Yet</h3>
                <p className="text-surface-500">
                  Enter vehicle details on the left and click calculate to see your estimated import cost.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="h-16" />
    </div>
  );
}
