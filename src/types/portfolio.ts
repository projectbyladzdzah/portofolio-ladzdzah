export interface DriverStat {
  label: string;
  value: string | number;
}

export interface TelemetryBar {
  label: string;
  percent: number;
}

export interface DriverHeroData {
  number: string;
  country: string;
  countryCode: string;
  flagEmoji: string;
  firstName: string;
  lastName: string;
  team: string;
  role: string;
  photo: string;
  banner?: string;
  banners?: string[];
  eyebrow: string;
  quote: string;
  bioSummary: string;
  stats: DriverStat[];
  telemetryBars: TelemetryBar[];
}

export interface BiographyData {
  heading: string;
  kicker: string;
  quote: string;
  quoteAuthor: string;
  paragraphs: string[];
  skills: string[];
}

export interface ProjectItem {
  id: string;
  title: string;
  category: 'web' | 'photo' | 'other';
  year: string;
  description: string;
  tags: string[];
  image: string;
  liveUrl?: string;
  githubUrl?: string;
  featured?: boolean;
}

export interface CareerItem {
  id: string;
  year: string;
  role: string;
  team: string;
  description: string;
  points?: string;
  status?: string;
}

export interface AwardItem {
  id: string;
  year: string;
  title: string;
  subtitle: string;
  position: string; // e.g. '1ST PLACE (GOLD)'
  issuer?: string;
  category?: string;
  description?: string;
  certificateUrl?: string; // Data URL or path for PDF or JPG/PNG
  certificateType?: 'pdf' | 'image';
  certificateFileName?: string;
  certificateImage?: string; // fallback
  credentialId?: string;
}

export interface ContactData {
  heading: string;
  description: string;
  email: string;
  phone: string;
  github: string;
  linkedin: string;
  base: string;
}

export interface SecurityConfig {
  pinEnabled: boolean;
  pin: string;
}

export interface PortfolioData {
  hero: DriverHeroData;
  ticker: string[];
  biography: BiographyData;
  projects: ProjectItem[];
  career: CareerItem[];
  awards: AwardItem[];
  contact: ContactData;
  security: SecurityConfig;
}
