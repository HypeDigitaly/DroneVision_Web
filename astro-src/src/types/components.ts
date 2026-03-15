import type { Language } from './i18n';
import type {
  BlogSection,
  BrandingSection,
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

// ---------------------------------------------------------------------------
// Shared base for all section component props
// ---------------------------------------------------------------------------

export interface BaseProps {
  /** Active language. Defaults to 'cs' when omitted. */
  lang?: Language;
}

// ---------------------------------------------------------------------------
// Section component prop interfaces
// ---------------------------------------------------------------------------

export interface MetaProps extends BaseProps {
  meta: MetaSection;
}

export interface HeroProps extends BaseProps {
  hero: HeroSection;
}

export interface ProblemProps extends BaseProps {
  problem: ProblemSection;
}

export interface SolutionProps extends BaseProps {
  solution: SolutionSection;
}

export interface ServicesProps extends BaseProps {
  services: ServicesSection;
}

export interface ProcessProps extends BaseProps {
  process: ProcessSection;
}

export interface StatsProps extends BaseProps {
  stats: StatsSection;
}

export interface TestimonialsProps extends BaseProps {
  testimonials: TestimonialsSection;
}

export interface PricingProps extends BaseProps {
  pricing: PricingSection;
}

export interface FaqProps extends BaseProps {
  faq: FaqSection;
}

export interface CtaProps extends BaseProps {
  cta: CtaSection;
}

export interface BlogProps extends BaseProps {
  blog: BlogSection;
}

export interface LeadMagnetProps extends BaseProps {
  leadMagnet: LeadMagnetSection;
}

export interface FooterProps extends BaseProps {
  footer: FooterSection;
  social: SocialSection;
}

export interface BrandingProps extends BaseProps {
  branding: BrandingSection;
}

// ---------------------------------------------------------------------------
// Shared UI atom props
// ---------------------------------------------------------------------------

export interface ButtonProps extends BaseProps {
  href: string;
  text: string;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  external?: boolean;
}

export interface SectionHeadingProps extends BaseProps {
  headline: string;
  subheadline?: string;
  align?: 'left' | 'center' | 'right';
}

export interface IconProps {
  name: string;
  size?: number;
  className?: string;
}

export interface ImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  loading?: 'eager' | 'lazy';
  className?: string;
}

// ---------------------------------------------------------------------------
// Language switcher
// ---------------------------------------------------------------------------

export interface LanguageSwitcherProps {
  currentLang: Language;
  availableLanguages: Language[];
  /** Current page path used to build alternate-language hrefs */
  currentPath: string;
}

// ---------------------------------------------------------------------------
// Navigation
// ---------------------------------------------------------------------------

export interface NavLink {
  label_cs: string;
  label_en: string;
  href: string;
  /** Render as CTA button rather than plain link */
  isButton?: boolean;
}

export interface NavbarProps extends BaseProps {
  logo: string;
  siteName: string;
  links: NavLink[];
  social: SocialSection;
}

// ---------------------------------------------------------------------------
// Quiz
// ---------------------------------------------------------------------------

/** Props for the solar-panel degradation quiz component. */
export interface QuizProps extends BaseProps {
  // lang? is inherited from BaseProps — no additional required props
}
