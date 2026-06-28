/**
 * Angano story protocol smoke. Validates the story wiring end-to-end at the WS
 * level with the mandatory human narrator:
 *   1. a game cannot start without a narrator.
 *   2. theme + narrator + 4 players -> story, private playerStory, narrator
 *      mission sheets, prep phase, night, and finish.
 *
 * With AI_API_TOKEN unset the server falls back to DEFAULT_STORY.
 * Run: bun story.ts   (needs core-api on :3000)
 */
const API = process.env.ANGANO_API || "http://localhost:3000";
const WSURL = API.replace(/^http/, "ws") + "/angano/rt";
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
const SONGOMBY_TEAM = new Set(["songomby", "mpamosavy"]);

async function guest(name: string): Promise<string> {
  const r = await fetch(API + "/v1/auth/guest", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ name }) });
  return (await r.json()).accessToken;
}

interface Client {
  name: string;
  selfId: string;
  roleId: string;
  isHost: boolean;
  isNarr: boolean;
  ws: WebSocket;
  story: any | null;
  playerStory: any | null;
  sawNight: boolean;
  errors: string[];
  missionSheets: any[];
}

class Game {
  room = "STY" + Math.random().toString(36).slice(2, 5).toUpperCase();
  clients: Client[] = [];
  players: any[] = [];
  narratorId: string | null = null;
  finished: { winner: string } | null = null;

  roleById() { const m: Record<string, string> = {}; for (const c of this.clients) if (c.roleId) m[c.selfId] = c.roleId; return m; }
  aliveIds() { return this.players.filter((p) => p.alive).map((p) => p.id); }
  firstAliveSongombyTeam() { const r = this.roleById(); return this.aliveIds().find((id) => SONGOMBY_TEAM.has(r[id]!)); }
  firstAliveNonSongombyTeam() { const r = this.roleById(); return this.aliveIds().find((id) => r[id] && !SONGOMBY_TEAM.has(r[id]!)); }

  send(c: Client, m: any) { try { c.ws.send(JSON.stringify(m)); } catch { /* */ } }

  onMessage(c: Client, m: any) {
    switch (m.k) {
      case "lobby": c.selfId = m.selfId; this.players = m.players; this.narratorId = m.narratorId; break;
      case "role": c.roleId = m.role.roleId; break;
      case "playerStory": c.playerStory = m.story; break;
      case "story": c.story = m; break;
      case "narrator": c.missionSheets = m.missionSheets ?? []; break;
      case "state": this.players = m.players; if (["zazavavindrano", "mpamosavy", "mpisikidy", "kalanoro", "kinoly", "songomby", "ombiasy"].includes(m.phase)) c.sawNight = true; break;
      case "deaths": for (const id of m.ids) { const p = this.players.find((x) => x.id === id); if (p) p.alive = false; } break;
      case "voteResult": if (m.eliminatedId) { const p = this.players.find((x) => x.id === m.eliminatedId); if (p) p.alive = false; } break;
      case "phase": if (c.isNarr && m.phase === "debat") this.send(c, { k: "nextPhase" }); break;
      case "prompt": this.handlePrompt(c, m); break;
      case "finish": if (!this.finished) this.finished = { winner: m.winner }; break;
      case "error": c.errors.push(m.message); break;
    }
  }
  handlePrompt(c: Client, m: any) {
    const targets: string[] = m.targets.map((t: any) => t.id);
    const pick = (id?: string) => this.send(c, { k: "action", targetId: id && targets.includes(id) ? id : targets[0] });
    switch (m.kind) {
      case "zazavavindrano": case "kalanoro": case "kinoly": case "mpisikidy": case "mpamosavy": case "mpihaza": pick(targets[0]); break;
      case "songomby": pick(this.firstAliveNonSongombyTeam()); break;
      case "ombiasy": this.send(c, { k: "action", targetId: null, extra: "skip" }); break;
      case "vote": this.send(c, { k: "vote", targetId: this.firstAliveSongombyTeam() ?? targets[0] }); break;
    }
  }
  async connect(name: string, isHost: boolean, isNarr: boolean): Promise<Client> {
    const token = await guest(name);
    const ws = new WebSocket(`${WSURL}?token=${encodeURIComponent(token)}&room=${this.room}&name=${encodeURIComponent(name)}`);
    const c: Client = { name, selfId: "", roleId: "", isHost, isNarr, ws, story: null, playerStory: null, sawNight: false, errors: [], missionSheets: [] };
    this.clients.push(c);
    ws.addEventListener("message", (e) => { try { this.onMessage(c, JSON.parse(String(e.data))); } catch { /* */ } });
    await new Promise<void>((res, rej) => { ws.addEventListener("open", () => res()); ws.addEventListener("error", () => rej(new Error("ws " + name))); });
    await sleep(120);
    return c;
  }
  close() { for (const c of this.clients) try { c.ws.close(); } catch { /* */ } }
}

const fails: string[] = [];
const ok = (cond: boolean, label: string) => { console.log(`${cond ? "✅" : "❌"} ${label}`); if (!cond) fails.push(label); };

async function runWithoutNarratorRejected() {
  const g = new Game();
  const host = await g.connect("Host", true, false);
  for (let i = 1; i <= 4; i++) await g.connect("J" + i, false, false);
  await sleep(150);
  g.send(host, { k: "start" });
  await sleep(300);
  ok(host.errors.some((message) => /narrateur/i.test(message)), "la partie est refusée sans narrateur");
  ok(!g.clients.some((c) => c.roleId), "aucun rôle n'est distribué sans narrateur");
  g.close();
  await sleep(150);
}

async function runStoryWithNarrator() {
  const g = new Game();
  const host = await g.connect("Narr", true, true);
  for (let i = 1; i <= 4; i++) await g.connect("J" + i, false, false);
  await sleep(150);
  g.send(host, { k: "takeNarrator", on: true }); await sleep(150);
  g.send(host, { k: "setConfig", config: { songomby: 1, roles: ["mpisikidy"], pace: "rapide", theme: true } }); await sleep(150);
  g.send(host, { k: "start" });

  const t0 = Date.now();
  while (!g.finished && Date.now() - t0 < 60000) await sleep(150);

  const players = g.clients.filter((c) => !c.isNarr);
  ok(g.clients.every((c) => !!c.story?.title), "une histoire (story) est distribuée à tous");
  ok(players.every((c) => !!c.playerStory?.mission), "chaque joueur reçoit sa fiche personnage privée");
  ok(host.missionSheets.length === 4, `le narrateur reçoit les 4 fiches missions (= ${host.missionSheets.length})`);
  ok(players.some((c) => c.sawNight), "la prépa cède la place à la nuit");
  ok(!!g.narratorId, "le siège narrateur reste actif pendant la partie");
  ok(!!g.finished, `la partie atteint la fin (winner=${g.finished?.winner})`);
  g.close();
  await sleep(150);
}

async function main() {
  await runWithoutNarratorRejected();
  console.log();
  await runStoryWithNarrator();
  console.log(`\n${fails.length === 0 ? "🎉 STORY OK" : "💥 ÉCHECS: " + fails.length}`);
  process.exit(fails.length === 0 ? 0 : 1);
}
main().catch((e) => { console.error(e); process.exit(2); });
