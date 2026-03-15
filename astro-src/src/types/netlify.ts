// ---------------------------------------------------------------------------
// netlify.ts — Request / response types for Netlify Functions
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Inbound form payloads
// ---------------------------------------------------------------------------

/** Payload submitted by the contact form */
export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  message: string;
  /** Honeypot field — must be empty on legitimate submissions */
  _honeypot?: string;
}

/** Payload submitted by the lead-magnet / newsletter form */
export interface LeadMagnetFormData {
  name: string;
  email: string;
  /** Honeypot field — must be empty on legitimate submissions */
  _honeypot?: string;
}

// ---------------------------------------------------------------------------
// Admin query parameters
// ---------------------------------------------------------------------------

/** Query-string parameters accepted by the admin leads endpoint */
export interface AdminLeadsQuery {
  source?: string;
  limit?: number;
  offset?: number;
  /** Simple password guard for the admin endpoint */
  password?: string;
}

// ---------------------------------------------------------------------------
// Data records
// ---------------------------------------------------------------------------

/** A single lead record as stored in Netlify Blobs and returned by the API */
export interface LeadRecord {
  id: string;
  /** Form origin, e.g. "contact" | "lead-magnet" | "newsletter" */
  source: string;
  name: string;
  email: string;
  company?: string;
  phone?: string;
  message?: string;
  /** ISO 8601 timestamp */
  submittedAt: string;
}

// ---------------------------------------------------------------------------
// API responses
// ---------------------------------------------------------------------------

/** Generic API response envelope used by all Netlify Functions */
export interface ApiResponse {
  success: boolean;
  error?: string;
  /** ID of the newly created lead record (contact / lead-magnet submissions) */
  leadId?: string;
  /** ID returned by the newsletter provider after subscriber creation */
  subscriberId?: string;
}

/** Paginated response for the admin leads listing endpoint */
export interface AdminLeadsResponse {
  leads: LeadRecord[];
  total: number;
  offset: number;
  limit: number;
}

// ---------------------------------------------------------------------------
// Netlify Function handler shapes
// ---------------------------------------------------------------------------

/** Minimal subset of the Netlify Functions v2 event object */
export interface NetlifyEvent {
  httpMethod: string;
  path: string;
  headers: Record<string, string | undefined>;
  queryStringParameters: Record<string, string | undefined> | null;
  body: string | null;
  isBase64Encoded: boolean;
}

/** Return value expected from a Netlify Function handler */
export interface NetlifyFunctionResponse {
  statusCode: number;
  headers?: Record<string, string>;
  body: string;
}
