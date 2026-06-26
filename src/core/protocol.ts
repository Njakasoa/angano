/**
 * Client mirror of core-api's Angano protocol (src/games/angano/protocol.ts).
 * Server-authoritative: secret info (role / seerResult / wolves / narrator) only
 * reaches the entitled client. Keep in sync with the backend.
 */
export type Team = "village" | "songomby";
export type Phase =
  | "lobby" | "roles" | "cupidon" | "mpisikidy" | "songomby" | "ombiasy"
  | "aube" | "debat" | "vote" | "finished";

export interface PlayerPublic { id: string; name: string; alive: boolean; isNarrator: boolean }
export interface NarratorPlayer extends PlayerPublic { roleId?: string; loverId?: string }
export interface RoleInfo { roleId: string; team: Team; nameMg: string; desc: string; loverId?: string; loverName?: string }
export interface GameConfig { songomby: number; roles: string[] }

export type AnganoClientMsg =
  | { k: "hello"; name: string }
  | { k: "takeNarrator"; on: boolean }
  | { k: "setConfig"; config: GameConfig }
  | { k: "start" }
  | { k: "action"; targetId: string | null; extra?: string }
  | { k: "vote"; targetId: string | null }
  | { k: "nextPhase" }
  | { k: "rematch" };

export type AnganoServerMsg =
  | { k: "lobby"; code: string; hostId: string; narratorId: string | null; selfId: string; config: GameConfig; players: PlayerPublic[] }
  | { k: "role"; role: RoleInfo }
  | { k: "narrator"; players: NarratorPlayer[]; log: string[] }
  | { k: "phase"; phase: Phase; day: number; audioKey: string; imageKey: string; durationMs: number; title: string; text: string }
  | { k: "prompt"; kind: string; targets: PlayerPublic[]; options?: string[]; deadline: number }
  | { k: "seerResult"; targetId: string; roleId: string; nameMg: string }
  | { k: "wolves"; wolfIds: string[]; victimId: string | null }
  | { k: "deaths"; ids: string[]; reveals: { id: string; roleId: string; nameMg: string }[]; text: string }
  | { k: "voteState"; tally: { id: string; votes: number }[] }
  | { k: "voteResult"; eliminatedId: string | null; roleId?: string; nameMg?: string }
  | { k: "state"; phase: Phase; day: number; players: PlayerPublic[] }
  | { k: "finish"; winner: Team | "lovers"; text: string; reveal: { id: string; name: string; roleId: string; nameMg: string }[] }
  | { k: "error"; message: string };
