import type { Team } from "./protocol.ts";

/** Client mirror of the role catalog (display only — the server is authoritative). */
export interface RoleDef { id: string; nameMg: string; desc: string; team: Team; asset: string; optional: boolean }

export const ROLES: Record<string, RoleDef> = {
  mponina: { id: "mponina", nameMg: "Mponina", team: "village", asset: "role_mponina", optional: false, desc: "Aucun pouvoir nocturne. Observe, débat et vote pour chasser les monstres." },
  songomby: { id: "songomby", nameMg: "Songomby", team: "songomby", asset: "role_songomby", optional: false, desc: "Chaque nuit, les Songomby choisissent ensemble une victime à dévorer." },
  mpisikidy: { id: "mpisikidy", nameMg: "Mpisikidy", team: "village", asset: "role_mpisikidy", optional: true, desc: "Chaque nuit, le sikidy te révèle le rôle d'un joueur — mais les traces peuvent brouiller la lecture." },
  ombiasy: { id: "ombiasy", nameMg: "Ombiasy", team: "village", asset: "role_ombiasy", optional: true, desc: "Un remède (sauver la victime) et un poison (tuer), chacun utilisable une seule fois." },
  mpihaza: { id: "mpihaza", nameMg: "Mpihaza", team: "village", asset: "role_mpihaza", optional: true, desc: "Quand tu meurs, tu décoches une dernière flèche et emportes un joueur." },
  zazavavindrano: { id: "zazavavindrano", nameMg: "Zazavavindrano", team: "village", asset: "role_zazavavindrano", optional: true, desc: "Chaque nuit, pose un fady d'eau sur un joueur. Si une force hostile le trouble, tu sentiras sa trace." },
  kalanoro: { id: "kalanoro", nameMg: "Kalanoro", team: "village", asset: "role_kalanoro", optional: true, desc: "Chaque nuit, lis les pas d'un joueur : tu sauras s'il a quitté sa place cette nuit." },
  kinoly: { id: "kinoly", nameMg: "Kinoly", team: "neutre", asset: "role_kinoly", optional: true, desc: "Revenant neutre. Chaque nuit, hante un joueur ; gagne personnellement s'il survit après avoir vu une cible hantée mourir au vote. Paraît Mponina au Mpisikidy." },
  mpamosavy: { id: "mpamosavy", nameMg: "Mpamosavy", team: "songomby", asset: "role_mpamosavy", optional: true, desc: "Chaque nuit, tu maudis un joueur : son pouvoir nocturne échoue." },
};

export const OPTIONAL_ROLES = Object.values(ROLES).filter((r) => r.optional);
export const roleDef = (id: string): RoleDef => ROLES[id] ?? ROLES.mponina!;
export const imageUrl = (stem: string) => `/assets/images/${stem}.png`;

/** Lobby presets (host picks one to fill the role config quickly). */
export interface Preset { name: string; songomby: number; roles: string[]; min: number }
export const PRESETS: Preset[] = [
  { name: "Classique", songomby: 1, roles: ["mpisikidy", "ombiasy", "mpihaza"], min: 5 },
  { name: "Fady & Traces", songomby: 1, roles: ["mpisikidy", "ombiasy", "mpihaza", "zazavavindrano", "kalanoro"], min: 6 },
  { name: "Esprits", songomby: 1, roles: ["mpisikidy", "ombiasy", "zazavavindrano", "kalanoro", "mpihaza"], min: 7 },
  { name: "Nuit dangereuse", songomby: 1, roles: ["mpisikidy", "ombiasy", "zazavavindrano", "kalanoro", "kinoly", "mpamosavy", "mpihaza"], min: 8 },
];
