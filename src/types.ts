export const cities = ["Salto", "Itu", "Tietê", "Cabreúva"] as const;
export type City = (typeof cities)[number];
export type PointStatus = "pending" | "published" | "inactive";
export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  active: boolean;
  disposal_instructions: {
    examples: string[];
    prepare: string[];
    avoid: string[];
    impact: string;
    sources: { title: string; url: string }[];
  };
}
export interface DisposalPoint {
  id: string;
  name: string;
  description: string;
  city: City;
  neighborhood: string;
  street: string;
  number: string;
  postal_code: string;
  latitude: number | null;
  longitude: number | null;
  coordinates_verified: boolean;
  opening_hours: string;
  phone: string;
  website: string;
  source_url: string;
  verified_at: string | null;
  status: PointStatus;
  point_type: "permanent" | "campaign";
  expires_at: string | null;
  observations: string;
  not_accepted: string;
  verification_notes: string;
  sources?: { title: string; url: string }[];
  coordinate_source_url?: string;
  categories: Category[];
  created_at?: string;
  updated_at?: string;
}
export interface Filters {
  city: string;
  category: string;
  search: string;
}
export interface CommunityRecord {
  id: string;
  status: string;
  created_at: string;
  [key: string]: unknown;
}
