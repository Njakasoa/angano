/**
 * Angano AI-conteur protocol smoke. Validates the story wiring END-TO-END at the WS
 * level, in both narrator modes, using the FALLBACK story (no AI token needed):
 *   1. theme + "Meneur humain" : narrator + 4 players → a `story` msg is delivered,
 *      the prep "roles" phase yields to the night, the game runs to a finish.
 *   2. theme + "Conteur IA"    : 5 players, NO narrator seat → everyone plays, a
 *      `story` msg is delivered, the game runs to a finish (host paces).
 * With AI_API_TOKEN unset the server falls back to DEFAULT_STORY ("L'ombre sur les
 * rizières" / "Ambodivoara"). Run: bun story.ts   (needs core-api on :3000)
 */
const API = process.env.ANGANO_API || "http://localhost:3000";
const WSURL = API.replace(/^http/, "ws") + "/angano/rt";
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
const EVIL = new Set(["songomby", "kinoly", "mpamosavy"]);

async function guest(name: string): Promise<string> {
  const r = await fetch(API + "/v1/auth/guest", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ name }) });
  return (await r.json()).accessToken;
}

interface Client { name: string; selfId: string; roleId: string; isHost: boolean; isNarr: boolean; ws: WebSocket; story: any | null; sawNight: boolean; }

class Game {
  room = "STY" + Math.random().toString(36).slice(2, 5).toUpperCase();
  clients: Client[] = [];
  players: any[] = [];        // public roster (alive flags) from state/lobby
  narratorId: string | null = null;
  finished: { winner: string } | null = null;
  currentDay = 0;

  roleById() { const m: Record<string, string> = {}; for (const c of this.clients) if (c.roleId) m[c.selfId] = c.roleId; return m; }
  aliveIds() { return this.players.filter((p) => p.alive).map((p) => p.id); }
  firstAliveEvil() { const r = this.roleById(); return this.aliveIds().find((id) => EVIL.has(r[id]!)); }
  firstAliveVillager() { const r = this.roleById(); return this.aliveIds().find((id) => r[id] && !EVIL.has(r[id]!)); }

  send(c: Client, m: any) { try { c.ws.send(JSON.stringify(m)); } catch { /* */ } }

  onMessage(c: Client, m: any) {
    switch (m.k) {
      case "lobby": c.selfId = m.selfId; this.players = m.players; this.narratorId = m.narratorId; break;
      case "role": c.roleId = m.role.roleId; break;
      case "story": c.story = m; break;
      case "state": this.players = m.players; if (["zazavavindrano", "mpamosavy", "mpisikidy", "kalanoro", "songomby", "ombiasy"].includes(m.phase)) c.sawNight = true; break;
      case "deaths": for (const id of m.ids) { const p = this.players.find((x) => x.id === id); if (p) p.alive = false; } break;
      case "voteResult": if (m.eliminatedId) { const p = this.players.find((x) => x.id === m.eliminatedId); if (p) p.alive = false; } break;
      case "phase": this.currentDay = m.day; if ((c.isNarr || (c.isHost && !this.narratorId)) && (m.phase === "debat")) this.send(c, { k: "nextPhase" }); break;
      case "prompt": this.handlePrompt(c, m); break;
      case "finish": if (!this.finished) this.finished = { winner: m.winner }; break;
    }
  }
  handlePrompt(c: Client, m: any) {
    const targets: string[] = m.targets.map((t: any) => t.id);
    const pick = (id?: string) => this.send(c, { k: "action", targetId: id && targets.includes(id) ? id : targets[0] });
    switch (m.kind) {
      case "zazavavindrano": case "kalanoro": case "mpisikidy": case "mpamosavy": case "mpihaza": pick(targets[0]); break;
      case "songomby": pick(this.firstAliveVillager()); break;
      case "ombiasy": this.send(c, { k: "action", targetId: null, extra: "skip" }); break;
      case "vote": this.send(c, { k: "vote", targetId: this.firstAliveEvil() ?? targets[0] }); break;
    }
  }
  async connect(name: string, isHost: boolean, isNarr: boolean): Promise<Client> {
    const token = await guest(name);
    const ws = new WebSocket(`${WSURL}?token=${encodeURIComponent(token)}&room=${this.room}&name=${encodeURIComponent(name)}`);
    const c: Client = { name, selfId: "", roleId: "", isHost, isNarr, ws, story: null, sawNight: false };
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

async function run(mode: "humain" | "ia") {
  const g = new Game();
  const host = await g.connect("Narr", true, mode === "humain");
  const nP = mode === "humain" ? 4 : 5;
  for (let i = 1; i <= nP; i++) await g.connect("J" + i, false, false);
  await sleep(150);
  if (mode === "humain") { g.send(host, { k: "takeNarrator", on: true }); await sleep(150); }
  g.send(host, { k: "setConfig", config: { songomby: 1, roles: ["mpisikidy"], pace: "rapide", theme: true, conteur: mode } }); await sleep(150);
  g.send(host, { k: "start" });

  // wait for the story + the game to leave the prep screen, then drive to finish
  const t0 = Date.now();
  while (!g.finished && Date.now() - t0 < 60000) await sleep(150);

  const players = g.clients.filter((c) => !c.isNarr);
  const someStory = g.clients.find((c) => c.story);
  ok(!!someStory, `[${mode}] une histoire (story) est distribuée`);
  ok(someStory?.story?.title === "L'ombre sur les rizières", `[${mode}] fallback DEFAULT_STORY (titre)`);
  ok(players.some((c) => c.sawNight), `[${mode}] la prépa cède la place à la nuit`);
  if (mode === "ia") ok(g.narratorId === null, "[ia] aucun siège narrateur (tout le monde joue)");
  ok(!!g.finished, `[${mode}] la partie atteint la fin (winner=${g.finished?.winner})`);
  g.close();
  await sleep(150);
}

async function main() {
  await run("humain");
  console.log();
  await run("ia");
  console.log(`\n${fails.length === 0 ? "🎉 CONTEUR OK" : "💥 ÉCHECS: " + fails.length}`);
  process.exit(fails.length === 0 ? 0 : 1);
}
main().catch((e) => { console.error(e); process.exit(2); });
