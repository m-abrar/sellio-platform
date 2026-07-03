import type { Property } from '@/types';

// Real-estate rule-of-thumb ratios, applied to actual property price/rate data.
// There is no historical income or occupancy data in the system, so these are
// disclosed estimates rather than measured performance.
const ASSUMED_MONTHLY_RENT_TO_PRICE_RATIO = 0.008; // ~0.8%/mo, a standard "1% rule" style estimate
const ASSUMED_SHORT_TERM_OCCUPANCY = 0.7; // 70% average occupancy for nightly rentals

export const INVESTMENT_METHODOLOGY_NOTE =
  'Estimates only. Sale-asset yield assumes achievable rent of ~0.8% of price per month, less HOA fees. '
  + 'Rental revenue assumes 70% average occupancy at the listed nightly rate. Not a guarantee of returns.';

export interface InvestmentMetric {
  kind: 'yield' | 'revenue';
  label: string;
  value: string;
  /** Underlying annual dollar figure the metric is derived from. */
  annualAmount: number;
  /** Sortable numeric value (yield %, or revenue $ for rentals). */
  sortValue: number;
}

function toNumber(value: unknown): number {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

/**
 * Real per-property investment metric derived from actual price/rate/HOA fields.
 * The API only exposes these under `pricing.*` (never the top-level model fields,
 * and never an `is_rental` flag) on both the list and detail endpoints, so rental
 * vs. sale is inferred from whether a nightly rate is actually present.
 * Returns null only when the property has no usable price data at all.
 */
export function getInvestmentMetric(property: Property): InvestmentMetric | null {
  const pricing = property.pricing;
  const price = toNumber(pricing?.base_price ?? property.base_price);
  const nightly = toNumber(pricing?.price_per_night ?? property.price_per_night);
  const hoaAnnual = toNumber(pricing?.hoa ?? property.hoa) * 12;

  if (nightly > 0) {
    const annualRevenue = nightly * 365 * ASSUMED_SHORT_TERM_OCCUPANCY;
    return {
      kind: 'revenue',
      label: 'Est. annual revenue',
      value: `$${Math.round(annualRevenue).toLocaleString()}`,
      annualAmount: annualRevenue,
      sortValue: annualRevenue,
    };
  }

  if (price > 0) {
    const estimatedAnnualRent = price * ASSUMED_MONTHLY_RENT_TO_PRICE_RATIO * 12;
    const netAnnualIncome = Math.max(estimatedAnnualRent - hoaAnnual, 0);
    const yieldPct = (netAnnualIncome / price) * 100;
    return {
      kind: 'yield',
      label: 'Est. net yield',
      value: `${yieldPct.toFixed(1)}%`,
      annualAmount: netAnnualIncome,
      sortValue: yieldPct,
    };
  }

  return null;
}

export interface RoiInputs {
  price: number;
  downPaymentPct: number; // 0-100
  interestRatePct: number; // annual, e.g. 6.5
  loanTermYears: number;
  annualIncome: number; // from InvestmentMetric.annualAmount
  hoaAnnual: number;
}

export interface RoiBreakdown {
  downPayment: number;
  loanAmount: number;
  monthlyMortgage: number;
  annualMortgage: number;
  netAnnualCashFlow: number;
  cashOnCashRoiPct: number | null; // null when there's no cash invested to divide by
}

/** Standard fixed-rate amortization math — real formula, user-controlled assumptions. */
export function calculateRoi(inputs: RoiInputs): RoiBreakdown {
  const { price, downPaymentPct, interestRatePct, loanTermYears, annualIncome, hoaAnnual } = inputs;

  const downPayment = price * (downPaymentPct / 100);
  const loanAmount = price - downPayment;
  const monthlyRate = interestRatePct / 100 / 12;
  const numPayments = loanTermYears * 12;

  let monthlyMortgage = 0;
  if (loanAmount > 0 && numPayments > 0) {
    monthlyMortgage = monthlyRate === 0
      ? loanAmount / numPayments
      : (loanAmount * monthlyRate * (1 + monthlyRate) ** numPayments) / ((1 + monthlyRate) ** numPayments - 1);
  }

  const annualMortgage = monthlyMortgage * 12;
  const netAnnualCashFlow = annualIncome - annualMortgage - hoaAnnual;
  const cashOnCashRoiPct = downPayment > 0 ? (netAnnualCashFlow / downPayment) * 100 : null;

  return {
    downPayment,
    loanAmount,
    monthlyMortgage,
    annualMortgage,
    netAnnualCashFlow,
    cashOnCashRoiPct,
  };
}
