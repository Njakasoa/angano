// Angano browser E2E — scenario by scenario, real Chromium, drives each game to its
// finish and asserts the outcome. Covers: village win, songomby win, hunter chain,
// witch heal, reconnect (page reload), rematch, narrator-paced deaths.
//
// Run: requires core-api (:3000) + the Vite dev server (:5173) up.
//   ANGANO_URL=http://localhost:5173 node scenarios.mjs
import { chromium } from "playwright";
const URL = process.env.ANGANO_URL || "http://localhost:5173";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const NAME2ROLE = { "Mponina": "mponina", "Songomby": "songomby", "Mpisikidy": "mpisikidy", "Ombiasy": "ombiasy", "Mpihaza": "mpihaza", "Zazavavindrano": "zazavavindrano", "Kalanoro": "kalanoro", "Kinoly": "kinoly", "Mpamosavy": "mpamosavy" };
const SONGOMBY_TEAM = new Set(["songomby", "mpamosavy"]);
const txt = async (loc) => (await loc.textContent().catch(() => "")) || "";

let browser;
const ctxs = [];
async function mk() { const c = await browser.newContext({ viewport: { width: 402, height: 840 } }); ctxs.push(c); return c.newPage(); }

async function setup({ nPlayers, roles, songomby = 1, manualDeaths = false, pace = "rapide" }) {
  const host = await mk();
  await host.goto(URL, { waitUntil: "domcontentloaded" }); await host.waitForSelector(".brand");
  await host.fill('input[placeholder="Ton pseudo"]', "Narr");
  await host.getByRole("button", { name: "Créer une partie" }).click();
  await host.waitForSelector(".code"); await sleep(250);
  const code = (await txt(host.locator(".code"))).trim();
  await host.getByRole("button", { name: "Devenir narrateur" }).click(); await sleep(150);
  // role chips: force to the requested set
  const want = new Set(roles); const chips = host.locator(".role-toggles .chip"); const n = await chips.count();
  for (let i = 0; i < n; i++) { const c = chips.nth(i); const r = await c.getAttribute("data-r"); const on = ((await c.getAttribute("class")) || "").includes("on"); if (want.has(r) !== on) await c.click(); }
  for (let k = 1; k < songomby; k++) await host.locator(".stepper .btn.step", { hasText: "+" }).click().catch(() => {});
  await host.selectOption("select.field.mini2", pace).catch(() => {});
  if (manualDeaths) await host.getByRole("button", { name: /Morts annoncées/ }).click();
  const players = [];
  for (let i = 1; i <= nPlayers; i++) {
    const p = await mk(); await p.goto(URL, { waitUntil: "domcontentloaded" }); await p.waitForSelector(".brand");
    await p.fill('input[placeholder="Ton pseudo"]', "J" + i);
    await p.fill('input[placeholder^="Code"]', code);
    await p.getByRole("button", { name: "Rejoindre" }).click(); await p.waitForSelector(".players");
    players.push(p);
  }
  await sleep(500);
  await host.getByRole("button", { name: "Lancer la partie" }).click();
  await sleep(1400);
  const roleByName = {};
  for (let i = 0; i < players.length; i++) {
    const nm = (await txt(players[i].locator(".rc-name").first())).trim();
    roleByName["J" + (i + 1)] = NAME2ROLE[nm] || "mponina";
  }
  return { host, players, code, roleByName };
}

async function aliveNames(host) {
  const cards = host.locator(".village .pcard:not(.dead) .pc-name");
  const n = await cards.count(); const out = [];
  for (let i = 0; i < n; i++) out.push((await txt(cards.nth(i))).replace(" (toi)", "").trim());
  return out;
}
async function finishWinner(players) {
  for (const p of players) {
    const fb = p.locator(".finish-banner");
    if (await fb.count()) { const cls = (await fb.getAttribute("class")) || ""; return cls.includes("evil") ? "songomby" : "village"; }
  }
  return null;
}
async function drivePlayer(p, mode, voteName) {
  const passer = p.getByRole("button", { name: "Passer" });
  if (await passer.count().catch(() => 0)) {
    if (mode.ombiasy === "heal") { const heal = p.getByRole("button", { name: /Soigner/ }); if (await heal.count()) { await heal.click().catch(() => {}); return; } }
    await passer.first().click().catch(() => {}); return;
  }
  const title = await txt(p.locator(".phase-title"));
  const targets = p.locator(".pcard.target");
  const tc = await targets.count().catch(() => 0); if (!tc) return;
  if (/Vote/i.test(title) && voteName) {
    const card = p.locator(`.pcard.target:has-text("${voteName}")`);
    if (await card.count().catch(() => 0)) { await card.first().click().catch(() => {}); return; }
  }
  await targets.first().click().catch(() => {});
}
async function driveToFinish({ host, players, roleByName }, mode, maxMs = 70000) {
  const t0 = Date.now(); let hunterSeen = false; let healSeen = false;
  while (Date.now() - t0 < maxMs) {
    if (await finishWinner(players)) break;
    const nt = await txt(host.locator(".phase-title"));
    if (/Débat|Aube|Mpihaza/i.test(nt)) { const b = host.locator(".panel .btn.big"); if (await b.count().catch(() => 0)) await b.first().click().catch(() => {}); }
    if (/Mpihaza/i.test(nt)) hunterSeen = true;
    if (/soigne/i.test(await txt(host.locator(".nar-log")))) healSeen = true;
    const alive = await aliveNames(host);
    let voteName;
    if (mode.vote === "village") voteName = alive.find((nm) => SONGOMBY_TEAM.has(roleByName[nm]));
    else if (mode.vote === "songomby") voteName = alive.find((nm) => !SONGOMBY_TEAM.has(roleByName[nm]));
    else if (mode.vote === "name") voteName = mode.voteName && alive.includes(mode.voteName) ? mode.voteName : alive.find((nm) => !SONGOMBY_TEAM.has(roleByName[nm]));
    for (const p of players) await drivePlayer(p, mode, voteName).catch(() => {});
    await sleep(220);
  }
  return { winner: await finishWinner(players), hunterSeen, healSeen };
}
async function teardown() { for (const c of ctxs.splice(0)) await c.close().catch(() => {}); }

const results = [];
const ok = (label, cond, extra = "") => { console.log(`${cond ? "✅" : "❌"} ${label}${extra ? " — " + extra : ""}`); results.push([label, cond]); };

async function scVillageWin() {
  const g = await setup({ nPlayers: 6, roles: ["mpisikidy", "ombiasy", "mpihaza", "zazavavindrano", "kalanoro"] });
  const r = await driveToFinish(g, { vote: "village", ombiasy: "skip" });
  ok("Victoire VILLAGE atteinte", r.winner === "village", `winner=${r.winner}`);
  await teardown();
}
async function scSongombyWin() {
  const g = await setup({ nPlayers: 5, roles: ["mpisikidy"] });
  const r = await driveToFinish(g, { vote: "songomby", ombiasy: "skip" });
  ok("Victoire SONGOMBY atteinte", r.winner === "songomby", `winner=${r.winner}`);
  await teardown();
}
async function scHunterChain() {
  const g = await setup({ nPlayers: 5, roles: ["mpihaza", "mpisikidy"] });
  const hunter = Object.keys(g.roleByName).find((n) => g.roleByName[n] === "mpihaza");
  const r = await driveToFinish(g, { vote: "name", voteName: hunter, ombiasy: "skip" });
  ok("Chaîne du CHASSEUR (prompt de tir vu)", r.hunterSeen, `hunter=${hunter}`);
  ok("Partie terminée après le chasseur", !!r.winner, `winner=${r.winner}`);
  await teardown();
}
async function scWitchHeal() {
  const g = await setup({ nPlayers: 5, roles: ["ombiasy", "mpisikidy"] });
  const r = await driveToFinish(g, { vote: "village", ombiasy: "heal" });
  ok("Sorcière a SOIGNÉ (heal appliqué)", r.healSeen);
  ok("Partie terminée", !!r.winner, `winner=${r.winner}`);
  await teardown();
}
async function scReconnect() {
  const g = await setup({ nPlayers: 5, roles: ["mpisikidy", "ombiasy"] });
  await sleep(800);
  await g.players[1].reload({ waitUntil: "domcontentloaded" });
  await sleep(2500);
  const back = await g.players[1].locator(".screen.stage").count();
  ok("Reconnexion (reload) → retour dans la partie", back > 0);
  const r = await driveToFinish(g, { vote: "village", ombiasy: "skip" });
  ok("Partie terminée malgré la reconnexion", !!r.winner, `winner=${r.winner}`);
  await teardown();
}
async function scRematch() {
  const g = await setup({ nPlayers: 5, roles: ["mpisikidy"] });
  const r1 = await driveToFinish(g, { vote: "village", ombiasy: "skip" });
  ok("1re partie terminée", !!r1.winner, `winner=${r1.winner}`);
  const rematch = g.host.getByRole("button", { name: /Rejouer/ });
  if (await rematch.count()) await rematch.click();
  await sleep(800);
  const inLobby = await g.host.locator(".players").count();
  ok("Rematch → retour au salon", inLobby > 0);
  if (inLobby) { await g.host.getByRole("button", { name: "Lancer la partie" }).click(); await sleep(1200); }
  const r2 = await driveToFinish(g, { vote: "village", ombiasy: "skip" });
  ok("2e partie terminée (rematch)", !!r2.winner, `winner=${r2.winner}`);
  await teardown();
}
async function scManualDeaths() {
  const g = await setup({ nPlayers: 5, roles: ["mpisikidy", "ombiasy", "mpamosavy"], manualDeaths: true });
  const r = await driveToFinish(g, { vote: "village", ombiasy: "skip" }, 90000);
  ok("Morts annoncées par narrateur → partie terminée", !!r.winner, `winner=${r.winner}`);
  await teardown();
}

async function main() {
  browser = await chromium.launch();
  const scs = [["villageWin", scVillageWin], ["songombyWin", scSongombyWin], ["hunterChain", scHunterChain], ["witchHeal", scWitchHeal], ["reconnect", scReconnect], ["rematch", scRematch], ["manualDeaths", scManualDeaths]];
  for (const [name, fn] of scs) {
    console.log(`\n=== ${name} ===`);
    try { await fn(); } catch (e) { console.log(`❌ ${name} a crashé: ${e.message}`); results.push([name, false]); await teardown(); }
  }
  await browser.close();
  const pass = results.filter((r) => r[1]).length;
  console.log(`\n${pass}/${results.length} assertions OK`);
  process.exit(pass === results.length ? 0 : 1);
}
main();
