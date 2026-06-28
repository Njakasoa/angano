/**
 * Client mirror of core-api's Angano protocol (src/games/angano/protocol.ts).
 * Server-authoritative: secret info only reaches the entitled client. Keep in sync
 * with the backend. V2 = fady / traces / esprits (no lovers mechanic).
 */
export type Team = "village" | "songomby" | "neutre";
export type Phase =
  | "lobby" | "roles"
  | "zazavavindrano" | "mpamosavy" | "mpisikidy" | "kalanoro" | "kinoly" | "songomby" | "ombiasy"
  | "aube" | "debat" | "vote" | "finished";

export interface PlayerPublic { id: string; name: string; alive: boolean; isNarrator: boolean }
export interface NarratorPlayer extends PlayerPublic { roleId?: string }
export interface RoleInfo { roleId: string; team: Team; nameMg: string; desc: string }
export type Pace = "rapide" | "normal" | "lent";
export interface GameConfig { songomby: number; roles: string[]; pace?: Pace; manualDeaths?: boolean; theme?: boolean }
export interface StoryAmbiance { night: string; dawn: string; debate: string; vote: string }
export interface StoryComposition { songomby: number; roles: string[]; pace: Pace }
export type MissionStatus = "pending" | "validated" | "failed";
export type RewardStatus = "locked" | "unlocked" | "used";
export interface RewardInfo {
  id: string;
  name: string;
  desc: string;
  status: RewardStatus;
  requiredTitles: number;
  uses: number;
  usesLeft: number;
  sourceMissionId: string;
}
export interface PlayerMissionSheet {
  playerId: string;
  missionId: string;
  slot: number;
  title: string;
  background: string;
  rumor: string;
  secret: string;
  mission: string;
  successCondition: string;
  unlocks: string[];
  rewards: RewardInfo[];
  titleReward: string;
  rewardTitle: string;
  titlesEarned: number;
  status: MissionStatus;
}
export interface NarratorMissionSheet extends PlayerMissionSheet {
  playerName: string;
  roleId: string;
  nameMg: string;
  alive: boolean;
}
export interface PersonalWinner {
  id: string;
  name: string;
  roleId: string;
  nameMg: string;
  reason: string;
}

export type AnganoClientMsg =
  | { k: "hello"; name: string }
  | { k: "takeNarrator"; on: boolean }
  | { k: "setConfig"; config: GameConfig }
  | { k: "start" }
  | { k: "action"; targetId: string | null; extra?: string }
  | { k: "vote"; targetId: string | null }
  | { k: "missionStatus"; playerId: string; status: MissionStatus }
  | { k: "nextPhase" }
  | { k: "rematch" };

export type AnganoServerMsg =
  | { k: "lobby"; code: string; hostId: string; narratorId: string | null; selfId: string; config: GameConfig; players: PlayerPublic[] }
  | { k: "role"; role: RoleInfo }
  | { k: "playerStory"; story: PlayerMissionSheet }
  | { k: "story"; title: string; villageName: string; intro: string; ambiance: StoryAmbiance; roleEpithets: Record<string, string>; composition?: StoryComposition; narratorScript?: string[] }
  | { k: "narrator"; players: NarratorPlayer[]; log: string[]; missionSheets?: NarratorMissionSheet[] }
  | { k: "phase"; phase: Phase; day: number; audioKey: string; imageKey: string; durationMs: number; title: string; text: string }
  | { k: "prompt"; kind: string; targets: PlayerPublic[]; options?: string[]; deadline: number }
  | { k: "seerResult"; targetId: string; roleId: string; nameMg: string; team?: Team }
  | { k: "trackResult"; targetId: string; visited: boolean; destinationId?: string | null }
  | { k: "fadyTrace"; targetId: string }
  | { k: "blocked" }
  | { k: "wolves"; wolfIds: string[]; victimId: string | null }
  | { k: "deaths"; ids: string[]; reveals: { id: string; roleId: string; nameMg: string }[]; text: string }
  | { k: "voteState"; tally: { id: string; votes: number }[] }
  | { k: "voteResult"; eliminatedId: string | null; roleId?: string; nameMg?: string }
  | { k: "state"; phase: Phase; day: number; players: PlayerPublic[] }
  | { k: "finish"; winner: Team; text: string; reveal: { id: string; name: string; roleId: string; nameMg: string }[]; missions?: NarratorMissionSheet[]; personalWinners?: PersonalWinner[] }
  | { k: "error"; message: string };
