export interface DutyRate {
  minCC: number;
  maxCC: number | null;
  rate: number;
  label: string;
}

export interface CountryDuty {
  name: string;
  code: string;
  dutyRates: DutyRate[];
  salesTax: number;
  additionalTax: number;
  shippingEstimate: number;
  currency: string;
  currencyRate: number;
}

export const countries: CountryDuty[] = [
  {
    name: 'Pakistan',
    code: 'PK',
    dutyRates: [
      { minCC: 0, maxCC: 1000, rate: 0.50, label: 'Up to 1000cc' },
      { minCC: 1001, maxCC: 1500, rate: 0.60, label: '1001-1500cc' },
      { minCC: 1501, maxCC: 1800, rate: 0.70, label: '1501-1800cc' },
      { minCC: 1801, maxCC: null, rate: 0.80, label: 'Above 1800cc' },
    ],
    salesTax: 0.17,
    additionalTax: 0.06,
    shippingEstimate: 1800,
    currency: 'PKR',
    currencyRate: 278,
  },
  {
    name: 'Kenya',
    code: 'KE',
    dutyRates: [
      { minCC: 0, maxCC: null, rate: 0.25, label: 'All vehicles' },
    ],
    salesTax: 0.16,
    additionalTax: 0.20,
    shippingEstimate: 2200,
    currency: 'KES',
    currencyRate: 153,
  },
  {
    name: 'Tanzania',
    code: 'TZ',
    dutyRates: [
      { minCC: 0, maxCC: null, rate: 0.25, label: 'All vehicles' },
    ],
    salesTax: 0.18,
    additionalTax: 0.10,
    shippingEstimate: 2400,
    currency: 'TZS',
    currencyRate: 2560,
  },
  {
    name: 'Uganda',
    code: 'UG',
    dutyRates: [
      { minCC: 0, maxCC: null, rate: 0.15, label: 'Below 1500cc' },
      { minCC: 1501, maxCC: null, rate: 0.25, label: 'Above 1500cc' },
    ],
    salesTax: 0.18,
    additionalTax: 0.06,
    shippingEstimate: 2500,
    currency: 'UGX',
    currencyRate: 3790,
  },
  {
    name: 'UAE',
    code: 'AE',
    dutyRates: [
      { minCC: 0, maxCC: null, rate: 0.05, label: 'All vehicles' },
    ],
    salesTax: 0.05,
    additionalTax: 0,
    shippingEstimate: 1200,
    currency: 'AED',
    currencyRate: 3.67,
  },
  {
    name: 'Bangladesh',
    code: 'BD',
    dutyRates: [
      { minCC: 0, maxCC: 1500, rate: 0.25, label: 'Up to 1500cc' },
      { minCC: 1501, maxCC: null, rate: 0.100, label: 'Above 1500cc' },
    ],
    salesTax: 0.15,
    additionalTax: 0.05,
    shippingEstimate: 1600,
    currency: 'BDT',
    currencyRate: 110,
  },
];

export const shippingCosts: Record<string, number> = {
  PK: 1800,
  KE: 2200,
  TZ: 2400,
  UG: 2500,
  AE: 1200,
  BD: 1600,
};

export function calculateImportCost(
  vehiclePriceJPY: number,
  engineCC: number,
  countryCode: string
) {
  const country = countries.find(c => c.code === countryCode);
  if (!country) return null;

  const dutyRate = country.dutyRates.find(
    d => engineCC >= d.minCC && (d.maxCC === null || engineCC <= d.maxCC)
  );
  if (!dutyRate) return null;

  const vehiclePriceUSD = vehiclePriceJPY / 150;
  const cifValue = vehiclePriceUSD + country.shippingEstimate;
  const importDuty = cifValue * dutyRate.rate;
  const afterDuty = cifValue + importDuty;
  const salesTax = afterDuty * country.salesTax;
  const additionalTax = afterDuty * country.additionalTax;
  const totalUSD = cifValue + importDuty + salesTax + additionalTax;
  const totalLocal = totalUSD * country.currencyRate;

  return {
    vehiclePriceJPY,
    vehiclePriceUSD: Math.round(vehiclePriceUSD),
    shippingUSD: country.shippingEstimate,
    cifValueUSD: Math.round(cifValue),
    dutyRate: dutyRate.rate,
    dutyLabel: dutyRate.label,
    importDutyUSD: Math.round(importDuty),
    salesTaxUSD: Math.round(salesTax),
    additionalTaxUSD: Math.round(additionalTax),
    totalUSD: Math.round(totalUSD),
    totalLocal: Math.round(totalLocal),
    currency: country.currency,
    countryName: country.name,
  };
}
