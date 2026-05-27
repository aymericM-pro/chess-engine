export interface UserProfile {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  bio: string;
  countryCode: string;
  color: "Blancs" | "Noirs" | "Les deux";
  elo: number;
  joinedYear: number;
}

export type ProfileColor = UserProfile["color"];

export const PROFILE_COLORS: ProfileColor[] = ["Blancs", "Noirs", "Les deux"];

export const EMPTY_USER: UserProfile = {
  username: "",
  firstName: "",
  lastName: "",
  email: "",
  bio: "",
  countryCode: "FR",
  color: "Les deux",
  elo: 1200,
  joinedYear: new Date().getFullYear(),
};

export const COUNTRIES = [
  { code: "FR", label: "France",      flag: "🇫🇷" },
  { code: "DE", label: "Allemagne",   flag: "🇩🇪" },
  { code: "GB", label: "Royaume-Uni", flag: "🇬🇧" },
  { code: "US", label: "États-Unis",  flag: "🇺🇸" },
  { code: "ES", label: "Espagne",     flag: "🇪🇸" },
  { code: "RU", label: "Russie",      flag: "🇷🇺" },
];

export function toProfileColor(value: string | null | undefined): ProfileColor {
  return PROFILE_COLORS.includes(value as ProfileColor) ? (value as ProfileColor) : "Les deux";
}
