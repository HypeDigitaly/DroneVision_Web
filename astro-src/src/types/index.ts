// ---------------------------------------------------------------------------
// index.ts — Barrel re-export for all type definitions
// Import from '@types' or 'src/types' to get everything at once.
// ---------------------------------------------------------------------------

export type { Language } from './i18n';
export { t } from '../utils/i18n';

export type {
  // Meta
  MetaSection,
  // Company
  CompanySection,
  // Contact
  ContactSection,
  // Social
  SocialSection,
  // Hero
  HeroSection,
  // Problem
  ProblemItem,
  ProblemSection,
  // Solution
  SolutionFeature,
  SolutionSection,
  // Services
  ServiceItem,
  ServicesSection,
  // Process
  ProcessStep,
  ProcessSection,
  // Stats
  StatItem,
  StatsSection,
  // Testimonials
  TestimonialItem,
  TestimonialsSection,
  // Pricing
  PricingFeature,
  PricingTier,
  PricingSection,
  // FAQ
  FaqItem,
  FaqSection,
  // CTA
  CtaSection,
  // Blog
  BlogSection,
  // Lead Magnet
  LeadMagnetField,
  LeadMagnetSection,
  // Admin
  AdminSection,
  // Footer
  FooterLink,
  FooterSection,
  // Branding
  BrandingSection,
} from './sections';

export type { SiteJson } from './site';

export type {
  // Base
  BaseProps,
  // Section props
  MetaProps,
  HeroProps,
  ProblemProps,
  SolutionProps,
  ServicesProps,
  ProcessProps,
  StatsProps,
  TestimonialsProps,
  PricingProps,
  FaqProps,
  CtaProps,
  BlogProps,
  LeadMagnetProps,
  FooterProps,
  BrandingProps,
  // UI atom props
  ButtonProps,
  SectionHeadingProps,
  IconProps,
  ImageProps,
  // Navigation / language
  LanguageSwitcherProps,
  NavLink,
  NavbarProps,
} from './components';

export type {
  // Form payloads
  ContactFormData,
  LeadMagnetFormData,
  // Admin queries
  AdminLeadsQuery,
  // Records and responses
  LeadRecord,
  ApiResponse,
  AdminLeadsResponse,
  // Netlify Function handler shapes
  NetlifyEvent,
  NetlifyFunctionResponse,
} from './netlify';
