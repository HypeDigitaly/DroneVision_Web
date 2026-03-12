import type {
  AdminSection,
  BlogSection,
  BrandingSection,
  CompanySection,
  ContactSection,
  CtaSection,
  FaqSection,
  FooterSection,
  HeroSection,
  LeadMagnetSection,
  MetaSection,
  PricingSection,
  ProblemSection,
  ProcessSection,
  ServicesSection,
  SocialSection,
  SolutionSection,
  StatsSection,
  TestimonialsSection,
} from './sections';

/**
 * Root shape of src/data/site.json.
 *
 * Optional sections (pricing, blog, leadMagnet) may be omitted entirely
 * from site.json when the feature is not required for a given client.
 */
export interface SiteJson {
  meta: MetaSection;
  company: CompanySection;
  contact: ContactSection;
  social: SocialSection;
  hero: HeroSection;
  problem: ProblemSection;
  solution: SolutionSection;
  services: ServicesSection;
  process: ProcessSection;
  stats: StatsSection;
  testimonials: TestimonialsSection;
  pricing?: PricingSection;
  faq: FaqSection;
  cta: CtaSection;
  blog?: BlogSection;
  leadMagnet?: LeadMagnetSection;
  admin: AdminSection;
  footer: FooterSection;
  branding: BrandingSection;
}
