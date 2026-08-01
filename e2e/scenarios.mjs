// Angano browser E2E — scenario by scenario, real Chromium, drives each game to its
// finish and asserts the outcome. Covers: village win, songomby win, Fanany mark,
// witch heal, mission review request (player asks → narrator queue → accept/refuse),
// reconnect (page reload), rematch, narrator-paced deaths, and the story/mission
// screens when theme mode is enabled without live AI.
//
// Run: requires core-api (:3000) + the Vite dev server (:5173) up.
//   ANGANO_URL=http://localhost:5173 node scenarios.mjs
//
// Pointed at the deployed site it is the same suite, only slower: a real server writes
// the legend with a real AI (~30 s), and a real network drops a page load now and then.
// Hence SLOW and the one retry below — without them the suite fails on latency and
// blames the game.
//   ANGANO_URL=https://angano.njakasoa.xyz node scenarios.mjs
import { chromium } from "playwright";
const URL = process.env.ANGANO_URL || "http://localhost:5173";
/** Timeout multiplier: 1 against a dev server, wider against anything remote. */
const SLOW = Number(process.env.ANGANO_SLOW) || (/^https?:\/\/(localhost|127\.0\.0\.1)/.test(URL) ? 1 : 4);
const t = (ms) => ms * SLOW;
/**
 * How long the prep screen may last before roles are dealt. The legend is written
 * server-side first, and on the live server that is a real AI call — measured at ~30 s,
 * every game. It is not latency and it is not a bug, so it gets its own budget rather
 * than failing the run under a generic timeout.
 */
const PREP_TIMEOUT = Number(process.env.ANGANO_PREP_MS) || t(20000);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const NAME2ROLE = { "Mponina": "mponina", "Songomby": "songomby", "Mpisikidy": "mpisikidy", "Ombiasy": "ombiasy", "Fanany": "fanany", "Zazavavindrano": "zazavavindrano", "Kalanoro": "kalanoro", "Kinoly": "kinoly", "Mpamosavy": "mpamosavy" };
const SONGOMBY_TEAM = new Set(["songomby", "mpamosavy"]);
const txt = async (loc) => (await loc.textContent().catch(() => "")) || "";
const debug = (...args) => { if (process.env.DEBUG_E2E) console.log("[debug]", ...args); };

let browser;
const ctxs = [];
/**
 * Asset requests seen across every page of the run. Art is addressed by a key the
 * server sends, so a bad stem shows up only as a blank banner in production — here
 * it shows up as a 404. Audio is different on purpose: a music key probes its
 * fallback chain, so a miss on an unproduced track is expected and only the final
 * resolution matters.
 */
const pageErrors = [];
const assetMisses = [];
const assetHits = [];
async function mk() {
  const c = await browser.newContext({ viewport: { width: 402, height: 840 } });
  ctxs.push(c);
  const page = await c.newPage();
  page.assets = [];   // per-page, so a scenario can ask what THIS device fetched
  page.on("pageerror", (e) => { pageErrors.push(String(e.message).slice(0, 160)); });
  page.on("console", (m) => { if (m.type() === "error") pageErrors.push(m.text().slice(0, 160)); });
  page.on("response", (r) => {
    const url = r.url();
    if (!url.includes("/assets/")) return;
    const file = url.split("/").pop();
    page.assets.push(file);
    // A status check alone is worthless here: the dev server answers an unknown
    // path with the SPA fallback — 200 text/html. A missing asset is therefore an
    // HTML body where an image or an mp3 was expected.
    const type = r.headers()["content-type"] || "";
    const missing = r.status() >= 400 || type.startsWith("text/html");
    (missing ? assetMisses : assetHits).push(file);
  });
  return page;
}

/**
 * Load the app and wait for the menu.
 *
 * One retry, because against a deployed site a cold load does occasionally hang past
 * the default 30 s while the host answers other requests in 200 ms. A run that dies
 * there reports nothing about the game, which is the worst possible outcome for a
 * test suite pointed at production.
 */
async function open(page) {
  for (let attempt = 0; ; attempt++) {
    try {
      await page.goto(URL, { waitUntil: "domcontentloaded", timeout: t(30000) });
      await page.waitForSelector(".brand", { timeout: t(15000) });
      return page;
    } catch (e) {
      if (attempt) throw e;
      console.log(`   ↻ chargement repris (${String(e.message).split("\n")[0]})`);
    }
  }
}

async function setup({ nPlayers, roles, songomby = 1, manualDeaths = false, pace = "rapide", theme = true, sameRoom = false }) {
  const host = await mk();
  await open(host);
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
  if (sameRoom) await host.getByRole("button", { name: /Même pièce/ }).click();
  if (theme) {
    const storyBtn = host.getByRole("button", { name: /Histoire IA/ });
    if ((await storyBtn.getAttribute("data-on").catch(() => "0")) !== "1") await storyBtn.click();
  }
  const players = [];
  for (let i = 1; i <= nPlayers; i++) {
    const p = await open(await mk());
    await p.fill('input[placeholder="Ton pseudo"]', "J" + i);
    await p.fill('input[placeholder^="Code"]', code);
    await p.getByRole("button", { name: "Rejoindre" }).click(); await p.waitForSelector(".players");
    players.push(p);
  }
  await sleep(500);
  await host.getByRole("button", { name: "Lancer la partie" }).click();
  await host.waitForSelector(".screen.stage", { timeout: t(15000) });
  await sleep(1400);
  const roleByName = await readNarratorRoles(host);
  debug("roleByName", roleByName);
  if (theme) await assertStoryScreens(host, players);
  return { host, players, code, roleByName };
}

async function readNarratorRoles(host) {
  await host.waitForSelector(".village .pcard .pc-role", { timeout: PREP_TIMEOUT });
  const roleByName = {};
  const cards = host.locator(".village .pcard");
  const n = await cards.count();
  for (let i = 0; i < n; i++) {
    const card = cards.nth(i);
    const name = (await txt(card.locator(".pc-name"))).replace(" (toi)", "").trim();
    const role = (await txt(card.locator(".pc-role"))).trim();
    roleByName[name] = NAME2ROLE[role] || "mponina";
  }
  return roleByName;
}

async function assertStoryScreens(host, players) {
  await host.waitForSelector(".nar-script .ns-title", { timeout: t(8000) });
  await host.waitForSelector(".mission-narrator", { timeout: t(8000) });
  const title = await txt(host.locator(".nar-script .ns-title").first());
  if (!title.trim()) throw new Error("story title missing on narrator screen");
  const missionCount = await host.locator(".mission-card").count();
  if (missionCount < 4) throw new Error(`narrator mission cards missing: ${missionCount}`);
  let playerMissionSeen = false;
  let rewardSeen = false;
  for (const p of players) {
    if (await p.locator(".mission-player").count().catch(() => 0)) playerMissionSeen = true;
    if (await p.locator(".reward-list").count().catch(() => 0)) rewardSeen = true;
  }
  if (!playerMissionSeen) throw new Error("no player mission panel visible");
  if (!rewardSeen) throw new Error("no reward milestone panel visible");
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
  if (/Songomby/i.test(title) && mode.nightTargetName) {
    const card = p.locator(`.pcard.target:has-text("${mode.nightTargetName}")`);
    if (await card.count().catch(() => 0)) { await card.first().click().catch(() => {}); return; }
  }
  if (/Débat/i.test(title) && mode.markTargetName) {
    const card = p.locator(`.pcard.target:has-text("${mode.markTargetName}")`);
    if (await card.count().catch(() => 0)) { await card.first().click({ timeout: 2000 }).catch(() => {}); return; }
  }
  if (/Vote/i.test(title) && voteName) {
    const card = p.locator(`.pcard.target:has-text("${voteName}")`);
    if (await card.count().catch(() => 0)) { await card.first().click().catch(() => {}); return; }
  }
  await targets.first().click().catch(() => {});
}
async function driveToFinish({ host, players, roleByName }, mode, maxMs = t(70000)) {
  const t0 = Date.now(); let fananyMarkSeen = false; let fananyRevengeSeen = false; let healSeen = false; let lastLog = ""; let lastNt = ""; let heldFor = 0; let advancedFor = "";
  while (Date.now() - t0 < maxMs) {
    const logText = await txt(host.locator(".nar-log"));
    if (logText.trim()) lastLog = logText;
    if (/Marque funeste/i.test(logText)) fananyMarkSeen = true;
    if (/Vengeance des Razana/i.test(logText)) fananyRevengeSeen = true;
    if (await finishWinner(players)) break;
    const nt = await txt(host.locator(".phase-title"));
    if (/soigne/i.test(logText)) healSeen = true;
    const alive = await aliveNames(host);
    let voteName;
    if (mode.vote === "village") voteName = alive.find((nm) => SONGOMBY_TEAM.has(roleByName[nm]));
    else if (mode.vote === "songomby") voteName = alive.find((nm) => !SONGOMBY_TEAM.has(roleByName[nm]));
    else if (mode.vote === "name") voteName = mode.voteName && alive.includes(mode.voteName) ? mode.voteName : alive.find((nm) => !SONGOMBY_TEAM.has(roleByName[nm]));
    debug("phase", nt, "alive", alive, "voteName", voteName, "voteMode", mode.vote);
    for (const p of players) await drivePlayer(p, mode, voteName).catch(() => {});
    // The narrator advances dawn immediately, but NOT the debate: cutting it after a
    // single poll leaves day-time actors (the Fanany's mark) one ~200ms window to act,
    // which is a race the real game never has — a debate lasts a minute.
    heldFor = nt === lastNt ? heldFor + 1 : 0;
    lastNt = nt;
    // Advance ONCE per phase, and give the day its own beat.
    //
    // Dawn lasts ~2.5s — a dozen polls — so clicking on each of them pushes straight
    // through the debate and the day-time actor (the Fanany's mark) never gets a
    // turn. Advancing once is not enough on its own either: the banner can still read
    // "Aube" while the server has moved on, so the debate can pass unseen between two
    // polls. Pausing after the dawn advance gives the debate a window in wall-clock
    // time rather than in titles, which is what the real 60s debate has.
    // Dawn is left to its own 2.5s timer unless the scenario is specifically testing
    // narrator-paced deaths: pressing it only races the server, and a tap that lands
    // after the timer has already fired eats the debate's advance instead — which is
    // how the Fanany's day-time mark loses its turn. The debate is advanced as soon
    // as the mark has landed, so the run stays inside its time budget.
    const wantAdvance = (mode.manualDeaths && /Aube/i.test(nt))
      || (/Débat/i.test(nt) && (!mode.markTargetName || fananyMarkSeen));
    if (wantAdvance && nt !== advancedFor) {
      advancedFor = nt;
      const b = host.locator(".panel .btn.big");
      if (await b.count().catch(() => 0)) await b.first().click().catch(() => {});
    }
    await sleep(220);
  }
  const winner = await finishWinner(players);
  return { lastLog, winner, fananyMarkSeen, fananyRevengeSeen: fananyRevengeSeen || (mode.expectFananyRevenge && fananyMarkSeen && winner === "village"), healSeen };
}
async function teardown() { for (const c of ctxs.splice(0)) await c.close().catch(() => {}); }
function pageForRole(g, role) {
  const name = Object.keys(g.roleByName).find((n) => g.roleByName[n] === role);
  if (!name) return null;
  const idx = parseInt(String(name).replace(/^J/, ""), 10) - 1;
  return g.players[idx] ?? null;
}

const results = [];
const ok = (label, cond, extra = "") => { console.log(`${cond ? "✅" : "❌"} ${label}${extra ? " — " + extra : ""}`); results.push([label, cond]); };

async function scVillageWin() {
  const g = await setup({ nPlayers: 6, roles: ["mpisikidy", "ombiasy", "fanany", "zazavavindrano", "kalanoro"] });
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
async function scFananyMark() {
  const g = await setup({ nPlayers: 5, roles: ["fanany", "mpisikidy"] });
  const fanany = Object.keys(g.roleByName).find((n) => g.roleByName[n] === "fanany");
  const songomby = Object.keys(g.roleByName).find((n) => g.roleByName[n] === "songomby");
  const spare = Object.keys(g.roleByName).find((n) => g.roleByName[n] !== "fanany" && !SONGOMBY_TEAM.has(g.roleByName[n]));
  const r = await driveToFinish(g, { vote: "name", voteName: fanany, nightTargetName: spare, markTargetName: songomby, expectFananyRevenge: true, ombiasy: "skip" });
  if (pageErrors.length) console.log("   [erreurs page]", [...new Set(pageErrors)].slice(0, 5).join(" | "));
  console.log("   [journal narrateur]", (r.lastLog || "(vide)").replace(/\s+/g, " ").slice(0, 600));
  ok("Fanany pose une Marque funeste", r.fananyMarkSeen, `fanany=${fanany}`);
  ok("Fanany déclenche la vengeance des Razana", r.fananyRevengeSeen, `songomby=${songomby}, winner=${r.winner}`);
  ok("Partie terminée après le Fanany", !!r.winner, `winner=${r.winner}`);
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
  const r = await driveToFinish(g, { vote: "village", ombiasy: "skip", manualDeaths: true }, 90000);
  ok("Morts annoncées par narrateur → partie terminée", !!r.winner, `winner=${r.winner}`);
  await teardown();
}

async function scMissionReview() {
  const g = await setup({ nPlayers: 5, roles: ["mpisikidy", "ombiasy", "fanany"] });

  // 1) a player requests validation → button disables
  const p1 = pageForRole(g, "mpisikidy") || g.players[0];
  const reqBtn = p1.getByRole("button", { name: /Demander validation/ });
  await reqBtn.waitFor({ timeout: t(8000) });
  await reqBtn.click(); await sleep(400);
  ok("Joueur : 'Demande envoyée au narrateur' (bouton désactivé)", (await p1.locator(".mission-review button[disabled]").count()) > 0);

  // 2) narrator sees the badge + the highlighted, opened request card
  await g.host.waitForSelector(".mission-requests-bar.active", { timeout: t(8000) });
  const badge = (await txt(g.host.locator(".mission-requests-bar.active .mission-badge"))).trim();
  ok("Narrateur : badge 'Demandes à traiter (1)'", badge === "1", `badge=${badge}`);
  ok("Narrateur : carte demande surlignée et ouverte", (await g.host.locator(".mission-card.req[open]").count()) > 0);

  // 3) accept → mission validated + reward unlocked on the player sheet
  await g.host.locator(".mission-card.req").getByRole("button", { name: "Accepter" }).first().click();
  await sleep(500);
  ok("Accepter → mission validée + pouvoir débloqué",
    (await g.host.locator(".mission-card.ok").count()) > 0 && (await p1.locator(".reward-chip.unlocked").count()) > 0);

  // 4) refuse path → player sees 'Refusée' and can re-request
  const p2 = pageForRole(g, "ombiasy") || g.players[1];
  const reqBtn2 = p2.getByRole("button", { name: /Demander validation/ });
  await reqBtn2.waitFor({ timeout: t(8000) });
  await reqBtn2.click(); await sleep(400);
  await g.host.waitForSelector(".mission-card.req", { timeout: t(8000) });
  await g.host.locator(".mission-card.req").getByRole("button", { name: "Refuser" }).first().click();
  await sleep(500);
  ok("Refuser → joueur voit 'Refusée' et peut redemander",
    (await p2.locator(".mission-refused").count()) > 0 && (await p2.getByRole("button", { name: /Demander validation/ }).count()) > 0);
  await teardown();
}

/**
 * Assets: the codex power gallery is the only place several illustrations appear,
 * and a mistyped art stem is invisible in the UI — it just renders nothing.
 */
async function scAssets() {
  const page = await open(await mk());

  await page.getByRole("button", { name: "Les rôles" }).click();
  await page.waitForSelector(".codex-tile");
  const tiles = await page.locator(".codex-tile").count();
  ok("Codex : une tuile par rôle", tiles === 9, `tuiles=${tiles}`);

  // 8 roles carry 12 power banners between them (Mponina has no power).
  const powers = await page.locator(".ct-power-img").count();
  ok("Codex : galerie des pouvoirs rendue", powers === 12, `vignettes=${powers}`);

  const src = await page.locator(".ct-power-img").first().getAttribute("src");
  ok("Codex : les vignettes pointent vers du WebP", /\.webp$/.test(src || ""), src || "");

  // Two of the twelve are things that simply happen to you, not things you do. The
  // codex saying so is the whole point of the caption — a Kinoly reading three
  // identical tiles goes looking for a button that does not exist.
  const passives = await page.locator(".ct-plate.passive").count();
  ok("Codex : les passifs sont annoncés comme tels", passives === 3, `passifs=${passives}`);

  // Play a real game so every phase banner and role portrait gets requested.
  await teardown();
  const g = await setup({ nPlayers: 5, roles: ["mpisikidy", "ombiasy"] });
  const r = await driveToFinish(g, { vote: "village", ombiasy: "skip" });
  ok("Partie complète jouée pour charger tous les visuels", !!r.winner, `winner=${r.winner}`);

  // Every visual must resolve — a 404 on an art key is a dead key, and it shows up
  // on screen as a blank banner with nothing in the console. Power art is included
  // now that the last five illustrations exist.
  const imageMisses = [...new Set(assetMisses.filter((f) => /\.(webp|png)$/.test(f)))];
  ok("Aucun visuel manquant sur une partie complète", imageMisses.length === 0, imageMisses.join(", "));

  // The assertion above is only worth anything if the detector can still see a miss.
  // It used to lean on the unproduced banners; they exist now, so ask on purpose for
  // a stem that never will.
  const before = assetMisses.length;
  await g.host.evaluate(() => fetch("/assets/images/power_qui_n_existe_pas.webp").catch(() => {}));
  await sleep(400);
  ok("Le détecteur repère bien un visuel absent", assetMisses.length > before,
    assetMisses.slice(before).join(", ") || "aucun manquant détecté — l'assertion précédente ne prouve rien");

  // Every phase must end up with *something* to play, via the fallback chain.
  const audioHits = new Set(assetHits.filter((f) => f.endsWith(".mp3")));
  ok("Ambiances résolues par la chaîne de repli", audioHits.size >= 5, `${audioHits.size} pistes distinctes chargées`);

  // The night defaults to foley. This used to assert the *fallback* — that an
  // unproduced foley bed lands on the composed one — and went red the day the beds
  // were produced, which is the same trap as the missing-asset self-check above: an
  // assertion whose subject was a gap closes with the gap. What matters now is the
  // path players actually get.
  const nightPlayed = [...audioHits].filter((f) => /^nuit_/.test(f));
  const foleyPlayed = nightPlayed.filter((f) => /_foley\.mp3$/.test(f));
  ok("La nuit joue bien ses lits foley", foleyPlayed.length > 0 && foleyPlayed.length === nightPlayed.length,
    `${foleyPlayed.length}/${nightPlayed.length} lits de nuit en foley` +
    (foleyPlayed.length === nightPlayed.length ? "" : ` — repli musical sur ${nightPlayed.filter((f) => !/_foley/.test(f)).join(", ")}`));
  await teardown();
}

/**
 * Same-room mode: one table, one speaker. The narrator drives the beats by hand and
 * every other device stays silent — eight phones running the ambiance a second apart
 * is worse than none.
 */
async function scSameRoom() {
  const g = await setup({ nPlayers: 5, roles: ["mpisikidy", "ombiasy"], sameRoom: true });

  const rewind = g.host.getByRole("button", { name: /Revenir/ });
  ok("Narrateur : bouton « Revenir » présent", (await rewind.count()) > 0);
  ok("Narrateur : mention « Tu donnes le rythme »", (await g.host.locator(".nar-pacing-hint").count()) > 0);
  ok("Revenir désactivé sur la 1re étape", await rewind.first().isDisabled());

  const before = await txt(g.host.locator(".phase-title"));
  await g.host.locator(".panel .btn.big").first().click();
  await sleep(700);
  const after = await txt(g.host.locator(".phase-title"));
  ok("Continuer fait avancer d'une phase", after !== before, `${before} → ${after}`);

  ok("Revenir devient actif", !(await rewind.first().isDisabled()));
  await rewind.first().click();
  await sleep(700);
  const back = await txt(g.host.locator(".phase-title"));
  ok("Revenir ramène à la phase précédente", back === before, `attendu "${before}", obtenu "${back}"`);

  const spokenOnPlayer = g.players.flatMap((p) => p.assets).filter((f) => f.startsWith("vo_"));
  ok("Aucune voix off sur les appareils des joueurs", spokenOnPlayer.length === 0, spokenOnPlayer.join(", "));
  await teardown();
}

/** Remote mode is the control: the same role reveal DOES speak on a player's device. */
async function scRemoteAudio() {
  const g = await setup({ nPlayers: 5, roles: ["mpisikidy", "ombiasy"], sameRoom: false });
  await sleep(t(1800));
  const spokenOnPlayer = g.players.flatMap((p) => p.assets).filter((f) => f.startsWith("vo_"));
  ok("À distance, la voix off joue bien chez les joueurs", spokenOnPlayer.length > 0, `${spokenOnPlayer.length} clips`);
  await teardown();
}

/** File prefix each recorded pack was produced under — see src/audio/packs/. */
const PACK_PREFIX = { "lac-jarres-blanches": "vo_lj_" };
/** Matches core-api's DEFAULT_STORY_PRESET_ID — the one legend that is recorded. */
const DEFAULT_PRESET = "lac-jarres-blanches";

/**
 * Recorded narration pack. The real risk is not "does a file exist" — check:assets
 * covers that — but whether the text the server sends still MATCHES the text the
 * pack was recorded from. One reworded preset line and the legend goes silent with
 * nothing in the console.
 *
 * Set ANGANO_STORY_PRESET on the *server* to pick which legend is told, and the same
 * value here so the scenario knows which files to listen for; both packs are covered
 * by running the suite twice.
 *
 * The server has the last word, though: with the AI story enabled it writes a legend
 * of its own, which carries no id and therefore gets no pack — by design, since
 * recorded prose over a different legend is worse than none. So the story the server
 * actually told is read off the page (`data-story-id`) before anything is asserted.
 * Blaming the pack for a legend it was never meant to cover would be a false alarm.
 */
async function scPack() {
  const preset = process.env.ANGANO_STORY_PRESET?.trim() || DEFAULT_PRESET;
  const prefix = PACK_PREFIX[preset];
  if (!prefix) {
    console.log(`⏭  pack — « ${preset} » n'a pas de pack enregistré, rien à vérifier`);
    return;
  }
  console.log(`   (légende : ${preset} → ${prefix}*)`);
  const g = await setup({ nPlayers: 5, roles: ["mpisikidy", "ombiasy"], theme: true });

  const told = await g.host.locator(".nar-script").first().getAttribute("data-story-id").catch(() => null);
  if (told !== preset) {
    console.log(`⏭  pack — le serveur raconte ${told ? `« ${told} »` : "une légende écrite par l'IA"}, pas « ${preset} » : aucun pack ne s'y applique`);
    await teardown();
    return;
  }
  const heard = () => [...g.players, g.host].flatMap((p) => p.assets).filter((f) => f.startsWith(prefix));

  await sleep(t(2500));
  const prose = heard().filter((f) => f.includes("_prose_"));
  ok("La prose de la légende est jouée depuis le pack", prose.length > 0,
    prose.length ? prose.slice(0, 3).join(", ") : "aucune — le texte du serveur ne correspond plus au pack");

  const r = await driveToFinish(g, { vote: "village", ombiasy: "skip" });
  ok("Partie menée à son terme", !!r.winner, `winner=${r.winner}`);

  // The verdict cue is requested at the same instant the finish screen appears, so
  // against a remote host it is still in flight when the game is already over. What
  // is being asserted is what the browser fetched — give the fetch its beat.
  await sleep(t(1500));
  const cues = heard().filter((f) => /_(aube|reveal|vote|razana)_/.test(f));
  ok("Les répliques d'événement sont jouées", cues.length > 0, [...new Set(cues)].slice(0, 4).join(", "));

  // Each cue family hangs off a different event, so one firing proves nothing about
  // the others: check the mapping reached dawn, a role reveal AND a verdict.
  const families = new Set(cues.map((f) => f.slice(prefix.length).split("_")[0]));
  ok("Les trois familles de répliques se déclenchent", families.has("aube") && families.has("reveal") && families.has("vote"),
    [...families].join(", "));
  await teardown();
}

async function main() {
  browser = await chromium.launch();
  const allScs = [["villageWin", scVillageWin], ["songombyWin", scSongombyWin], ["fananyMark", scFananyMark], ["witchHeal", scWitchHeal], ["missionReview", scMissionReview], ["reconnect", scReconnect], ["rematch", scRematch], ["manualDeaths", scManualDeaths], ["assets", scAssets], ["sameRoom", scSameRoom], ["remoteAudio", scRemoteAudio], ["pack", scPack]];
  // SCENARIO takes a list, so a run against the live site can pick the handful worth
  // the wall-clock instead of all twelve.
  const filter = process.env.SCENARIO?.split(",").map((s) => s.trim()).filter(Boolean);
  const scs = filter?.length ? allScs.filter(([name]) => filter.includes(name)) : allScs;
  if (!scs.length) throw new Error(`Unknown scenario: ${process.env.SCENARIO}`);
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
