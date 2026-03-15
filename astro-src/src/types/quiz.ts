// ---------------------------------------------------------------------------
// quiz.ts — Types for the solar-panel degradation quiz feature
// ---------------------------------------------------------------------------

export type Language = 'cs' | 'en';

export type QuizStep = 'capacity' | 'year' | 'result' | 'expansion' | 'contact' | 'thankyou';

export type ManufactureYearRange = '2008-2014' | '2015-2019' | '2020+';

export interface DegradationConfig {
  rate: number;
  label_cs: string;
  label_en: string;
}

export type DegradationMap = Record<ManufactureYearRange, DegradationConfig>;

export interface QuizState {
  step: QuizStep;
  capacityKw: number | null;
  yearRange: ManufactureYearRange | null;
  annualLossKc: number | null;
  planExpansion: boolean | null;
}

export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
}

export interface ConsentRecord {
  /** ISO 8601 timestamp of when consent was granted */
  timestamp: string;
  policyVersion: string;
  consentText: string;
}

export interface LeadSubmissionPayload {
  name: string;
  email: string;
  phone: string;
  capacityKw: number;
  panelYear: ManufactureYearRange;
  planExpansion: boolean;
  consent: ConsentRecord;
  _honeypot?: string;
}

export interface LeadSubmissionResponse {
  status: 'created' | 'updated' | 'error';
  message: string;
  code?: string;
  errors?: Array<{ field: string; message: string }>;
}

export interface PricingTier {
  maxKw: number;
  price: number;
  label: string;
}
