// ---------------------------------------------------------------------------
// sections.ts — All section-level interfaces for site.json
// All bilingual text uses flat _cs / _en suffix keys (no nested wrapper type).
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Meta
// ---------------------------------------------------------------------------

export interface MetaSection {
  name: string;
  tagline?: string;
  tagline_cs?: string;
  tagline_en?: string;
  /** SEO meta description — recommended 160 chars max */
  description?: string;
  description_cs?: string;
  description_en?: string;
  siteUrl: string;
  /** Path to logo, e.g. /images/logo.svg */
  logo: string;
  ogImage: string;
  favicon: string;
  /** Primary language tag, e.g. "cs" */
  lang: string;
  alternateLanguages: string[];
  /** Google Analytics measurement ID, e.g. G-XXXXXXXXXX */
  gaId?: string;
}

// ---------------------------------------------------------------------------
// Company
// ---------------------------------------------------------------------------

export interface CompanySection {
  name: string;
  /** 8-digit Czech company ID (IČO) */
  ico?: string;
  /** Czech VAT number (DIČ) */
  dic?: string;
  address: string;
  city: string;
  zipCode: string;
  country: string;
}

// ---------------------------------------------------------------------------
// Contact
// ---------------------------------------------------------------------------

export interface ContactSection {
  email: string;
  phone: string;
  address?: string;
  calendarLink?: string;
  formNotificationEmails: string[];
}

// ---------------------------------------------------------------------------
// Social
// ---------------------------------------------------------------------------

export interface SocialSection {
  linkedin?: string;
  facebook?: string;
  instagram?: string;
  twitter?: string;
  youtube?: string;
}

// ---------------------------------------------------------------------------
// Hero
// ---------------------------------------------------------------------------

export interface HeroSection {
  headline_cs: string;
  headline_en: string;
  subheadline_cs: string;
  subheadline_en: string;
  eyebrow_cs?: string;
  eyebrow_en?: string;
  ctaPrimary?: {
    text_cs: string;
    text_en: string;
    href: string;
  };
  ctaSecondary?: {
    text_cs: string;
    text_en: string;
    href: string;
  };
  backgroundImage?: string;
  backgroundVideo?: string;
}

// ---------------------------------------------------------------------------
// Problem
// ---------------------------------------------------------------------------

export interface ProblemItem {
  icon: string;
  title_cs: string;
  title_en: string;
  description_cs: string;
  description_en: string;
}

export interface ProblemSection {
  enabled: boolean;
  headline_cs: string;
  headline_en: string;
  items: ProblemItem[];
}

// ---------------------------------------------------------------------------
// Solution
// ---------------------------------------------------------------------------

export interface SolutionFeature {
  title_cs: string;
  title_en: string;
  description_cs: string;
  description_en: string;
  icon?: string;
}

export interface SolutionSection {
  enabled: boolean;
  headline_cs?: string;
  headline_en?: string;
  description_cs?: string;
  description_en?: string;
  features: SolutionFeature[];
}

// ---------------------------------------------------------------------------
// Services
// ---------------------------------------------------------------------------

export interface ServiceItem {
  title_cs: string;
  title_en: string;
  description_cs: string;
  description_en: string;
  /** Bilingual feature bullet list */
  features: { text_cs: string; text_en: string }[];
  price?: string;
  priceFrequency?: string;
  icon?: string;
  image?: string;
}

export interface ServicesSection {
  enabled: boolean;
  headline_cs: string;
  headline_en: string;
  items: ServiceItem[];
}

// ---------------------------------------------------------------------------
// Process
// ---------------------------------------------------------------------------

export interface ProcessStep {
  number: number;
  title_cs: string;
  title_en: string;
  description_cs: string;
  description_en: string;
  icon?: string;
}

export interface ProcessSection {
  enabled: boolean;
  headline_cs: string;
  headline_en: string;
  steps: ProcessStep[];
}

// ---------------------------------------------------------------------------
// Stats
// ---------------------------------------------------------------------------

export interface StatItem {
  value: string;
  label_cs: string;
  label_en: string;
  suffix?: string;
}

export interface StatsSection {
  enabled: boolean;
  items: StatItem[];
}

// ---------------------------------------------------------------------------
// Testimonials
// ---------------------------------------------------------------------------

export interface TestimonialItem {
  quote_cs: string;
  quote_en: string;
  author: string;
  company: string;
  role_cs: string;
  role_en: string;
  image?: string;
  /** Star rating 1–5 */
  rating?: number;
}

export interface TestimonialsSection {
  enabled: boolean;
  headline_cs?: string;
  headline_en?: string;
  items: TestimonialItem[];
}

// ---------------------------------------------------------------------------
// Pricing
// ---------------------------------------------------------------------------

export interface PricingFeature {
  text_cs: string;
  text_en: string;
  included: boolean;
}

export interface PricingTier {
  name_cs: string;
  name_en: string;
  price: string;
  currency: string;
  period_cs: string;
  period_en: string;
  setupFee?: string;
  description_cs: string;
  description_en: string;
  features: PricingFeature[];
  cta: {
    text_cs: string;
    text_en: string;
    href: string;
  };
  highlighted?: boolean;
}

export interface PricingSection {
  enabled: boolean;
  headline_cs?: string;
  headline_en?: string;
  tiers: PricingTier[];
}

// ---------------------------------------------------------------------------
// FAQ
// ---------------------------------------------------------------------------

export interface FaqItem {
  question_cs: string;
  question_en: string;
  answer_cs: string;
  answer_en: string;
}

export interface FaqSection {
  enabled: boolean;
  headline_cs?: string;
  headline_en?: string;
  items: FaqItem[];
}

// ---------------------------------------------------------------------------
// CTA (call-to-action banner)
// ---------------------------------------------------------------------------

export interface CtaSection {
  enabled: boolean;
  headline_cs: string;
  headline_en: string;
  subheadline_cs: string;
  subheadline_en: string;
  buttonText_cs: string;
  buttonText_en: string;
  buttonHref: string;
}

// ---------------------------------------------------------------------------
// Blog
// ---------------------------------------------------------------------------

export interface BlogSection {
  enabled: boolean;
  postsPerPage: number;
  categories: string[];
}

// ---------------------------------------------------------------------------
// Lead Magnet
// ---------------------------------------------------------------------------

export interface LeadMagnetField {
  name: string;
  /** Accepted values: text | email | phone | select */
  type: string;
  label_cs: string;
  label_en: string;
  required: boolean;
}

export interface LeadMagnetSection {
  enabled: boolean;
  title_cs: string;
  title_en: string;
  description_cs: string;
  description_en: string;
  pdfUrl: string;
  formFields: LeadMagnetField[];
}

// ---------------------------------------------------------------------------
// Admin
// ---------------------------------------------------------------------------

export interface AdminSection {
  notificationEmails: string[];
  enabledModules: {
    leads: boolean;
    newsletter: boolean;
    blogComments: boolean;
  };
}

// ---------------------------------------------------------------------------
// Footer
// ---------------------------------------------------------------------------

export interface FooterLink {
  label_cs: string;
  label_en: string;
  href: string;
}

export interface FooterSection {
  copyright_cs: string;
  copyright_en: string;
  links: FooterLink[];
  legalPages: {
    privacyPolicy: boolean;
    termsOfService: boolean;
    cookiePolicy: boolean;
  };
}

// ---------------------------------------------------------------------------
// Branding
// ---------------------------------------------------------------------------

export interface BrandingSection {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
    border: string;
  };
  fonts: {
    heading: string;
    body: string;
  };
  spacing: {
    unit: string;
  };
  borderRadius: string;
}
