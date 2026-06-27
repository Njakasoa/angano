/**
 * Angano protocol smoke — 1 narrator + 10 players over WebSocket, drives a full game
 * to a village win and asserts the V2 mechanics + role secrecy. No browser; talks to
 * core-api directly. Run: bun smoke.ts   (needs core-api on :3000)
 *   ANGANO_API=http://localhost:3000 bun smoke.ts
 */
const API = process.env.ANGANO_API || "http://localhost:3000";
const WSURL = API.replace(/^http/, "ws") + "/angano/rt";
const ROOM = "ANG" + Math.random().toString(36).slice(2, 5).toUpperCase();

type Msg = any;
interface Client {
  name: string; selfId: string; roleId: string; ws: WebSocket;
  isNarrator: boolean; gotNarrator: boolean;
  roleMsgs: string[]; seerResults: Msg[]; trackResults: Msg[]; fadyTraces: Msg[]; blocked: number;
}

const clients: Client[] = [];
const byName: Record<string, Client> = {};
let roleById: Record<string, string> = {};
const idsByRole = (): Record<string, string[]> => {
  const m: Record<string, string[]> = {};
  for (const [id, r] of Object.entries(roleById)) (m[r] ??= []).push(id);
  return m;
};
const latest = { players: [] as Msg[], code: ROOM };
let currentDay = 0;
let finished: { winner: string; reveal: Msg[] } | null = null;

const aliveOf = (id: string) => latest.players.find((p) => p.id === id)?.alive;
const firstAliveByRole = (role: string) => latest.players.find((p) => p.alive && roleById[p.id] === role)?.id;
const plannedVictim = () => firstAliveByRole("mponina") ?? latest.players.find((p) => p.alive && roleById[p.id] && !["songomby", "kinoly", "mpamosavy"].includes(roleById[p.id]))?.id;
const chooseEvilToVote = () => { for (const role of ["mpamosavy", "songomby", "kinoly"]) { const id = firstAliveByRole(role); if (id) return id; } return undefined; };

async function guest(name: string): Promise<string> {
  const r = await fetch(API + "/v1/auth/guest", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ name }) });
  return (await r.json()).accessToken;
}
function send(c: Client, m: Msg) { try { c.ws.send(JSON.stringify(m)); } catch { /* */ } }

function onMessage(c: Client, m: Msg) {
  switch (m.k) {
    case "lobby": c.selfId = m.selfId; latest.players = m.players; latest.code = m.code; break;
    case "role": c.roleId = m.role.roleId; c.roleMsgs.push(m.role.roleId); break;
    case "narrator": c.gotNarrator = true; roleById = Object.fromEntries(m.players.map((p: Msg) => [p.id, p.roleId ?? "mponina"])); break;
    case "state": latest.players = m.players; break;
    case "deaths": for (const id of m.ids) { const p = latest.players.find((x) => x.id === id); if (p) p.alive = false; } break;
    case "voteResult": if (m.eliminatedId) { const p = latest.players.find((x) => x.id === m.eliminatedId); if (p) p.alive = false; } break;
    case "phase": currentDay = m.day; if (c.isNarrator && m.phase === "debat") send(c, { k: "nextPhase" }); break;
    case "prompt": handlePrompt(c, m); break;
    case "seerResult": c.seerResults.push(m); break;
    case "trackResult": c.trackResults.push(m); break;
    case "fadyTrace": c.fadyTraces.push(m); break;
    case "blocked": c.blocked++; break;
    case "finish": if (!finished) finished = { winner: m.winner, reveal: m.reveal }; break;
    case "error": console.log(`  [${c.name}] error: ${m.message}`); break;
  }
}
function handlePrompt(c: Client, m: Msg) {
  const targets: string[] = m.targets.map((t: Msg) => t.id);
  const pick = (id: string | undefined) => send(c, { k: "action", targetId: (id && targets.includes(id)) ? id : targets[0] });
  switch (m.kind) {
    case "zazavavindrano": pick(plannedVictim()); break;
    case "songomby": pick(plannedVictim()); break;
    case "mpisikidy": { const k = idsByRole().kinoly?.[0]; pick(k && aliveOf(k) ? k : targets[0]); break; } // inspect Kinoly → expect disguise
    case "kalanoro": pick(targets.find((t) => roleById[t] === "songomby") ?? targets[0]); break;
    case "mpamosavy": { const kal = idsByRole().kalanoro?.[0]; pick(currentDay === 1 && kal ? kal : plannedVictim()); break; } // night1 block Kalanoro
    case "ombiasy": send(c, { k: "action", targetId: null, extra: "skip" }); break;
    case "mpihaza": pick(targets[0]); break;
    case "vote": send(c, { k: "vote", targetId: chooseEvilToVote() ?? targets[0] }); break;
  }
}
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
async function connect(name: string): Promise<Client> {
  const token = await guest(name);
  const ws = new WebSocket(`${WSURL}?token=${encodeURIComponent(token)}&room=${ROOM}&name=${encodeURIComponent(name)}`);
  const c: Client = { name, selfId: "", roleId: "", ws, isNarrator: name === "Narr", gotNarrator: false, roleMsgs: [], seerResults: [], trackResults: [], fadyTraces: [], blocked: 0 };
  clients.push(c); byName[name] = c;
  ws.addEventListener("message", (e) => { try { onMessage(c, JSON.parse(String(e.data))); } catch { /* */ } });
  await new Promise<void>((res, rej) => { ws.addEventListener("open", () => res()); ws.addEventListener("error", () => rej(new Error("ws error " + name))); });
  await sleep(120);
  return c;
}

async function main() {
  const names = ["Narr", ...Array.from({ length: 10 }, (_, i) => "P" + (i + 1))];
  for (const n of names) await connect(n); // sequential → Narr is host
  const narr = byName["Narr"]!;
  send(narr, { k: "takeNarrator", on: true }); await sleep(200);
  send(narr, { k: "setConfig", config: { songomby: 1, roles: ["mpisikidy", "ombiasy", "zazavavindrano", "kalanoro", "kinoly", "mpamosavy"], pace: "rapide" } }); await sleep(200);
  send(narr, { k: "start" });

  const t0 = Date.now();
  while (!finished && Date.now() - t0 < 80000) await sleep(150);

  const fails: string[] = [];
  const ok = (cond: boolean, label: string) => { console.log(`${cond ? "✅" : "❌"} ${label}`); if (!cond) fails.push(label); };

  ok(!!finished, "la partie atteint finish");
  ok(finished?.winner === "village", `le village gagne (winner=${finished?.winner})`);
  const evilRoles = new Set(["songomby", "kinoly", "mpamosavy"]);
  const evilInReveal = finished?.reveal.filter((r) => evilRoles.has(r.roleId)).length ?? 0;
  ok(evilInReveal === 3, `3 rôles maléfiques dans le reveal (=${evilInReveal})`);

  ok(byName["Narr"]!.gotNarrator, "le narrateur reçoit la god-view");
  ok(Object.keys(roleById).length === 10, `god-view couvre les 10 joueurs (=${Object.keys(roleById).length})`);
  const players = clients.filter((c) => !c.isNarrator);
  ok(players.every((c) => !c.gotNarrator), "aucun joueur ne reçoit la god-view");
  ok(players.every((c) => c.roleMsgs.length > 0 && c.roleMsgs.every((r) => r === c.roleId)), "chaque joueur ne reçoit que SON propre rôle");

  const find = (role: string) => players.find((c) => c.roleId === role);
  const seer = find("mpisikidy"), kal = find("kalanoro"), zaza = find("zazavavindrano"), kinoly = find("kinoly");
  ok(!!seer && seer.seerResults.length > 0, "le Mpisikidy reçoit un seerResult");
  ok(!!kal && kal.trackResults.length > 0, "le Kalanoro reçoit un trackResult");
  ok(!!zaza && zaza.fadyTraces.length > 0, "le Zazavavindrano sent une trace de fady");
  ok(clients.some((c) => c.blocked > 0), "un pouvoir a été bloqué par le Mpamosavy");
  const disguise = seer?.seerResults.filter((r) => r.targetId === kinoly?.selfId) ?? [];
  ok(disguise.length > 0 && disguise.every((r) => r.roleId === "mponina"), "le Kinoly apparaît « Mponina » à la divination");

  console.log(`\n${fails.length === 0 ? "🎉 TOUS LES TESTS PASSENT" : "💥 ÉCHECS: " + fails.length}`);
  for (const c of clients) c.ws.close();
  await sleep(200);
  process.exit(fails.length === 0 ? 0 : 1);
}
main().catch((e) => { console.error(e); process.exit(2); });
