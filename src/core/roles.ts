import type { Team } from "./protocol.ts";

/** Client mirror of the role catalog (display only — the server is authoritative). */
export interface RoleDef { id: string; nameMg: string; desc: string; team: Team; asset: string; optional: boolean }

export const ROLES: Record<string, RoleDef> = {
  mponina: { id: "mponina", nameMg: "Mponina", team: "village", asset: "role_mponina", optional: false, desc: "Aucun pouvoir nocturne. Observe, débat et vote pour chasser les monstres." },
  songomby: { id: "songomby", nameMg: "Songomby", team: "songomby", asset: "role_songomby", optional: false, desc: "Bête mangeuse d'hommes, rapide comme le vent. Chaque nuit, les Songomby choisissent ensemble une victime à dévorer." },
  mpisikidy: { id: "mpisikidy", nameMg: "Mpisikidy", team: "village", asset: "role_mpisikidy", optional: true, desc: "Devin du Sikidy. Chaque nuit, lis les signes d'un joueur : tu découvres son rôle apparent, sauf si les signes sont masqués." },
  ombiasy: { id: "ombiasy", nameMg: "Ombiasy", team: "village", asset: "role_ombiasy", optional: true, desc: "Guérisseur et gardien spirituel. Une fois, sauve la victime ; une fois, accomplis un rituel d'exil contre un joueur dangereux." },
  fanany: { id: "fanany", nameMg: "Fanany", team: "village", asset: "role_fanany", optional: true, desc: "Serpent des ancêtres. Chaque jour, marque secrètement un joueur : si tu meurs avant le prochain jour, la vengeance des Razana l'emporte." },
  zazavavindrano: { id: "zazavavindrano", nameMg: "Zazavavindrano", team: "village", asset: "role_zazavavindrano", optional: true, desc: "Esprit des eaux sacrées. Chaque nuit, lie un joueur au Fady des eaux : si une force hostile le trouble, tu sentiras sa trace." },
  kalanoro: { id: "kalanoro", nameMg: "Kalanoro", team: "village", asset: "role_kalanoro", optional: true, desc: "Gardien des traces inversées. Chaque nuit, piste un joueur différent de la nuit précédente : tu sauras s'il a quitté sa place." },
  kinoly: { id: "kinoly", nameMg: "Kinoly", team: "neutre", asset: "role_kinoly", optional: true, desc: "Revenant neutre dormant. La première fois que tu devrais mourir la nuit, tu survis et t'éveilles ; ensuite, tu peux hanter un joueur chaque nuit. Le vote te tue normalement. Paraît Mponina au Mpisikidy." },
  mpamosavy: { id: "mpamosavy", nameMg: "Mpamosavy", team: "songomby", asset: "role_mpamosavy", optional: true, desc: "Humain à double vie et sorcier nocturne. Chaque nuit, maudis un joueur différent de la nuit précédente : son pouvoir échoue." },
};

export const OPTIONAL_ROLES = Object.values(ROLES).filter((r) => r.optional);
export const roleDef = (id: string): RoleDef => ROLES[id] ?? ROLES.mponina!;
export const imageUrl = (stem: string) => `/assets/images/${stem}.png`;

/** Lobby presets (host picks one to fill the role config quickly). */
export interface Preset { name: string; songomby: number; roles: string[]; min: number }
export const PRESETS: Preset[] = [
  { name: "Classique", songomby: 1, roles: ["mpisikidy", "ombiasy", "fanany"], min: 5 },
  { name: "Fady & Traces", songomby: 1, roles: ["mpisikidy", "ombiasy", "fanany", "zazavavindrano", "kalanoro"], min: 6 },
  { name: "Esprits", songomby: 1, roles: ["mpisikidy", "ombiasy", "zazavavindrano", "kalanoro", "fanany"], min: 7 },
  { name: "Nuit dangereuse", songomby: 1, roles: ["mpisikidy", "ombiasy", "zazavavindrano", "kalanoro", "kinoly", "mpamosavy", "fanany"], min: 8 },
];
