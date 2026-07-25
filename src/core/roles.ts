import type { Team } from "./protocol.ts";
import { LEGACY_IMAGE_ALIAS } from "../audio/manifest.ts";

/**
 * Client mirror of the role catalog (display only — the server is authoritative).
 * `powers` lists the painted banners for that role's abilities: several of them
 * illustrate passives or day-time actions that no phase banner ever shows, so the
 * codex is the only place they can be seen.
 */
export interface RoleDef { id: string; nameMg: string; desc: string; team: Team; asset: string; optional: boolean; powers?: { art: string; label: string }[] }

export const ROLES: Record<string, RoleDef> = {
  mponina: { id: "mponina", nameMg: "Mponina", team: "village", asset: "role_mponina", optional: false, desc: "Aucun pouvoir nocturne. Observe, débat et vote pour chasser les monstres." },
  songomby: { id: "songomby", nameMg: "Songomby", team: "songomby", asset: "role_songomby", optional: false, desc: "Bête mangeuse d'hommes, rapide comme le vent. Chaque nuit, les Songomby choisissent ensemble une victime à dévorer.", powers: [{ art: "power_songomby_chasse", label: "La chasse" }] },
  mpisikidy: { id: "mpisikidy", nameMg: "Mpisikidy", team: "village", asset: "role_mpisikidy", optional: true, desc: "Devin du Sikidy. Chaque nuit, lis les signes d'un joueur : tu découvres son rôle apparent, sauf si les signes sont masqués.", powers: [{ art: "power_mpisikidy_sikidy", label: "Le sikidy" }] },
  ombiasy: { id: "ombiasy", nameMg: "Ombiasy", team: "village", asset: "role_ombiasy", optional: true, desc: "Guérisseur et gardien spirituel. Une fois, sauve la victime ; une fois, accomplis un rituel d'exil contre un joueur dangereux.", powers: [{ art: "power_ombiasy_remede", label: "Le remède" }, { art: "power_ombiasy_exil", label: "Le rituel d'exil" }] },
  fanany: { id: "fanany", nameMg: "Fanany", team: "village", asset: "role_fanany", optional: true, desc: "Serpent des ancêtres. Chaque jour, marque secrètement un joueur : si tu meurs avant le prochain jour, la vengeance des Razana l'emporte.", powers: [{ art: "power_fanany_marque", label: "La Marque funeste" }, { art: "power_fanany_vengeance", label: "La vengeance des Razana" }] },
  zazavavindrano: { id: "zazavavindrano", nameMg: "Zazavavindrano", team: "village", asset: "role_zazavavindrano", optional: true, desc: "Esprit des eaux sacrées. Chaque nuit, lie un joueur au Fady des eaux : si une force hostile le trouble, tu sentiras sa trace.", powers: [{ art: "power_zaza_fady", label: "Le Fady des eaux" }] },
  kalanoro: { id: "kalanoro", nameMg: "Kalanoro", team: "village", asset: "role_kalanoro", optional: true, desc: "Gardien des traces inversées. Chaque nuit, piste un joueur différent de la nuit précédente : tu sauras s'il a quitté sa place.", powers: [{ art: "power_kalanoro_traces", label: "Les pas inversés" }] },
  kinoly: { id: "kinoly", nameMg: "Kinoly", team: "neutre", asset: "role_kinoly", optional: true, desc: "Revenant neutre dormant. La première fois que tu devrais mourir la nuit, tu survis et t'éveilles ; ensuite, tu peux hanter un joueur chaque nuit. Le vote te tue normalement. Paraît Mponina au Mpisikidy.", powers: [{ art: "power_kinoly_eveil", label: "L'éveil" }, { art: "power_kinoly_hantise", label: "La hantise" }, { art: "power_kinoly_masque", label: "Le masque du sikidy" }] },
  mpamosavy: { id: "mpamosavy", nameMg: "Mpamosavy", team: "songomby", asset: "role_mpamosavy", optional: true, desc: "Humain à double vie et sorcier nocturne. Chaque nuit, maudis un joueur différent de la nuit précédente : son pouvoir échoue.", powers: [{ art: "power_mpamosavy_malediction", label: "La malédiction" }] },
};

export const OPTIONAL_ROLES = Object.values(ROLES).filter((r) => r.optional);
export const roleDef = (id: string): RoleDef => ROLES[id] ?? ROLES.mponina!;

/**
 * Art stem → file. Game art ships as WebP (`scripts/optimize-images.ts`); only the
 * brand assets stay PNG, for scrapers.
 *
 * The alias lets an older API keep working after a rename: a missing
 * `background-image` fails silently, so a stale key would blank the banner with
 * nothing in the console to explain it.
 */
export const imageUrl = (stem: string) => `/assets/images/${LEGACY_IMAGE_ALIAS[stem] ?? stem}.webp`;

/** Lobby presets (host picks one to fill the role config quickly). */
export interface Preset { name: string; songomby: number; roles: string[]; min: number }
export const PRESETS: Preset[] = [
  { name: "Classique", songomby: 1, roles: ["mpisikidy", "ombiasy", "fanany"], min: 5 },
  { name: "Fady & Traces", songomby: 1, roles: ["mpisikidy", "ombiasy", "fanany", "zazavavindrano", "kalanoro"], min: 6 },
  { name: "Esprits", songomby: 1, roles: ["mpisikidy", "ombiasy", "zazavavindrano", "kalanoro", "fanany"], min: 7 },
  { name: "Nuit dangereuse", songomby: 1, roles: ["mpisikidy", "ombiasy", "zazavavindrano", "kalanoro", "kinoly", "mpamosavy", "fanany"], min: 8 },
];
