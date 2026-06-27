/**
 * Angano protocol reconnect smoke. Validates: (1) a brand-new player can't join a
 * running game, (2) a mid-game disconnect keeps the seat, (3) reconnecting with the
 * SAME guest token resyncs back into the running stage, (4) other players are NOT
 * bounced to the lobby when someone drops/rejoins. Run: bun reconnect.ts (needs :3000)
 */
const API = process.env.ANGANO_API || "http://localhost:3000";
const WSURL = API.replace(/^http/, "ws") + "/angano/rt";
const ROOM = "REC" + Math.random().toString(36).slice(2, 5).toUpperCase();
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function guest(name: string): Promise<string> {
  const r = await fetch(API + "/v1/auth/guest", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ name }) });
  return (await r.json()).accessToken;
}
interface Conn { ws: WebSocket; msgs: any[]; }
function open(token: string, name: string): Conn {
  const ws = new WebSocket(`${WSURL}?token=${encodeURIComponent(token)}&room=${ROOM}&name=${encodeURIComponent(name)}`);
  const c: Conn = { ws, msgs: [] };
  ws.addEventListener("message", (e) => { try { c.msgs.push(JSON.parse(String(e.data))); } catch { /* */ } });
  return c;
}
const waitOpen = (c: Conn) => new Promise<void>((res, rej) => { c.ws.addEventListener("open", () => res()); c.ws.addEventListener("error", () => rej(new Error("ws err"))); });
const kinds = (c: Conn) => c.msgs.map((m) => m.k);
const last = (c: Conn, k: string) => [...c.msgs].reverse().find((m) => m.k === k);

async function main() {
  const fails: string[] = [];
  const ok = (cond: boolean, label: string) => { console.log(`${cond ? "✅" : "❌"} ${label}`); if (!cond) fails.push(label); };

  const tokens = { Narr: await guest("Narr"), P1: await guest("P1"), P2: await guest("P2"), P3: await guest("P3"), P4: await guest("P4"), P5: await guest("P5") };
  const narr = open(tokens.Narr, "Narr"); await waitOpen(narr);
  const p1 = open(tokens.P1, "P1"); await waitOpen(p1);
  const p2 = open(tokens.P2, "P2"); await waitOpen(p2);
  const p3 = open(tokens.P3, "P3"); await waitOpen(p3);
  const p4 = open(tokens.P4, "P4"); await waitOpen(p4);
  await sleep(150);

  narr.ws.send(JSON.stringify({ k: "takeNarrator", on: true })); await sleep(120);
  narr.ws.send(JSON.stringify({ k: "setConfig", config: { songomby: 1, roles: ["mpisikidy", "ombiasy"] } })); await sleep(120);
  narr.ws.send(JSON.stringify({ k: "start" })); await sleep(300);

  ok(p1.msgs.some((m) => m.k === "phase"), "le jeu démarre (P1 reçoit une phase)");
  const p1RoleBefore = last(p1, "role")?.role?.roleId;
  ok(!!p1RoleBefore, "P1 a reçu son rôle");

  const p5 = open(tokens.P5, "P5"); await waitOpen(p5); await sleep(200);
  ok(p5.msgs.some((m) => m.k === "error" && /en cours/i.test(m.message)), "un nouveau joueur ne peut pas rejoindre une partie en cours");

  const p2BeforeLobby = kinds(p2).filter((k) => k === "lobby").length;
  p1.ws.close(); await sleep(400);
  const p2AfterLobby = kinds(p2).filter((k) => k === "lobby").length;
  ok(p2AfterLobby === p2BeforeLobby, "les autres joueurs ne sont PAS renvoyés au salon quand P1 se déconnecte");

  const p1b = open(tokens.P1, "P1"); await waitOpen(p1b); await sleep(300);
  ok(kinds(p1b).includes("lobby") && kinds(p1b).includes("phase"), "P1 reconnecté est resynchronisé dans la partie");
  ok(last(p1b, "role")?.role?.roleId === p1RoleBefore, "P1 retrouve le MÊME rôle après reconnexion");
  ok(!p5.msgs.some((m) => m.k === "phase"), "le nouveau joueur refusé n'a jamais reçu d'état de jeu");

  console.log(`\n${fails.length === 0 ? "🎉 RECONNEXION OK" : "💥 ÉCHECS: " + fails.length}`);
  for (const c of [narr, p1b, p2, p3, p4, p5]) c.ws.close();
  await sleep(150);
  process.exit(fails.length === 0 ? 0 : 1);
}
main().catch((e) => { console.error(e); process.exit(2); });
