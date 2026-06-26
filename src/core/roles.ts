import type { Team } from "./protocol.ts";

/** Client mirror of the role catalog (display only — the server is authoritative). */
export interface RoleDef { id: string; nameMg: string; desc: string; team: Team; asset: string; optional: boolean }

export const ROLES: Record<string, RoleDef> = {
  mponina: { id: "mponina", nameMg: "Mponina", team: "village", asset: "introduction_phase", optional: false, desc: "Villageois sans pouvoir. Démasque les Songomby et vote le jour." },
  songomby: { id: "songomby", nameMg: "Songomby", team: "songomby", asset: "loup_garou_petite_fille_phase", optional: false, desc: "Chaque nuit, dévore une victime avec les autres Songomby." },
  mpisikidy: { id: "mpisikidy", nameMg: "Mpisikidy", team: "village", asset: "voyante_phase", optional: true, desc: "Chaque nuit, sonde le rôle d'un joueur — le sikidy révèle la vérité." },
  ombiasy: { id: "ombiasy", nameMg: "Ombiasy", team: "village", asset: "sorciere_phase", optional: true, desc: "Possède 1 remède (sauver la victime) et 1 poison (tuer), une fois chacun." },
  cupidon: { id: "cupidon", nameMg: "Cupidon", team: "village", asset: "cupidon_phase", optional: true, desc: "La 1re nuit, lie deux amoureux. Si l'un meurt, l'autre le suit." },
  mpihaza: { id: "mpihaza", nameMg: "Mpihaza", team: "village", asset: "vote_phase", optional: true, desc: "En mourant, il décoche une dernière flèche et emporte un joueur." },
};

export const OPTIONAL_ROLES = Object.values(ROLES).filter((r) => r.optional);
export const roleDef = (id: string): RoleDef => ROLES[id] ?? ROLES.mponina!;
export const imageUrl = (stem: string) => `/assets/images/${stem}.png`;
