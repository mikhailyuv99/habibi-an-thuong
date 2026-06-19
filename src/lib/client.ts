import clientRaw from "../../data/client.json";
import strategyRaw from "../../data/strategy.json";
import configRaw from "../../data/template.config.json";

export type Review = {
  author: string;
  text: string;
  rating: number | null;
};

export type MenuItem = {
  name: string;
  description?: string;
  price?: string;
  photo?: string;
};

export type MenuCategory = {
  category: string;
  items: MenuItem[];
};

export type ReviewTheme = {
  name: string;
  note: string;
};

export type FaqItem = {
  question: string;
  answer: string;
};

export type ClientData = {
  slug: string;
  name: string;
  category: string;
  address: string;
  phone: string;
  website: string | null;
  maps_url: string;
  google_feature_id?: string;
  google_maps_cid?: string;
  hours: string[] | null;
  hours_note: string | null;
  reserve_url: string | null;
  menu_url: string | null;
  rating: number | null;
  review_count: number | null;
  reviews: Review[];
  photos: string[];
  menu: MenuCategory[];
  services_or_menu: string[];
  review_themes: ReviewTheme[];
  owner_name: string | null;
  owner_story: string | null;
  faq: FaqItem[];
  private_dining_note: string | null;
  social_url: string | null;
  logo_url: string | null;
  owner_provided_notes: string;
  headline: string | null;
};

export type Archetype =
  | "LUXURY"
  | "LOCAL TRUST"
  | "MODERN PREMIUM"
  | "FAMILY BUSINESS"
  | "CRAFTSMAN"
  | "EXPERIENCE DRIVEN"
  | "HIGH VOLUME"
  | "COMMUNITY";

export type CtaAction = {
  label: string;
  action: "tel" | "directions" | "url" | "scroll" | "none";
  target: string | null;
};

export type SectionId =
  | "hero"
  | "owner-story"
  | "menu-highlights"
  | "atmosphere"
  | "social-proof"
  | "faq"
  | "private-dining"
  | "visit"
  | "footer";

export type StrategyData = {
  business: { name: string; slug: string | null; category: string };
  archetype: {
    assigned: Archetype;
    rationale: string;
    runner_up_rejected: { name: string; reason: string };
  };
  positioning: {
    category: { value: string; evidence: string };
    price_level: { value: string; evidence: string };
    customer_type: { value: string; evidence: string };
    main_selling_point: { value: string; evidence: string };
    competitive_advantage: { value: string; evidence: string };
  };
  cta: {
    primary: CtaAction;
    secondary: CtaAction;
    utility: string[];
  };
  section_order: Array<{
    id: SectionId;
    purpose: string;
    layout_pattern: string;
    density: "tight" | "medium" | "open";
  }>;
  design_direction: {
    tone: string;
    typography: { headings: string; body: string };
    color: string;
    layout_rhythm: string;
    imagery_priority: string;
    do_not: string[];
  };
  gaps: string[];
  confidence: "high" | "medium" | "low";
};

export type ModuleToggle = "auto" | "on" | "off";

export type MenuHighlightsMode = "menu" | "categories" | "review-led" | "sparse";

export type TemplateConfig = {
  template: "sit-down-restaurant";
  version: string;
  modules: {
    social_proof: ModuleToggle;
    owner_story: ModuleToggle;
    faq: ModuleToggle;
    private_dining: ModuleToggle;
    full_menu_link: ModuleToggle;
  };
  expression: {
    hero_pattern: "auto" | "A" | "B";
    hours_in_hero: "auto" | "show" | "hide";
    menu_highlights_mode: "auto" | MenuHighlightsMode;
    menu_highlights_max: "auto" | "4" | "6" | "8";
    typography: { headings: string; body: string };
    colors: {
      accent: string;
      accent_bright?: string;
      surface: string;
      surface_muted?: string;
      text: string;
      text_soft?: string;
      dark?: string;
    };
    density: Partial<
      Record<"hero" | "menu_highlights" | "atmosphere" | "social_proof" | "visit", "tight" | "medium" | "open">
    >;
  };
};

export const client = clientRaw as ClientData;
export const strategy = strategyRaw as StrategyData;
export const templateConfig = configRaw as TemplateConfig;

export const phoneHref = client.phone.replace(/\s/g, "");
