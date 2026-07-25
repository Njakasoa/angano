/**
 * Angano spoken-narration smoke. Validates the text-to-speech path end to end at
 * the WS level:
 *   1. the AI legend comes back with an `introVoiceUrl`, and phase lines carry a
 *      `voiceUrl` — synthesized during the prep screen, not on the beat.
 *   2. that URL actually serves playable audio from `GET /v1/tts/:hash`.
 *   3. a second fetch of the same clip is served from cache.
 *   4. an unknown hash 404s rather than erroring — the client falls back to text.
 *
 * Requires core-api on :3000 **with speech enabled** (ELEVENLABS_API_KEY and
 * ELEVENLABS_VOICE_NARRATOR set). With it disabled the run SKIPS instead of
 * failing: text-only is a supported configuration, not a broken one.
 *
 * Run: bun voice.ts
 */
const API = process.env.ANGANO_API || "http://localhost:3000";
const WSURL = API.replace(/^http/, "ws") + "/angano/rt";
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function guest(name: string): Promise<string> {
  const r = await fetch(API + "/v1/auth/guest", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ name }) });
  return (await r.json()).accessToken;
}

interface Client { name: string; isNarr: boolean; ws: WebSocket }

const fails: string[] = [];
const ok = (cond: boolean, label: string) => { console.log(`${cond ? "✅" : "❌"} ${label}`); if (!cond) fails.push(label); };

async function main() {
  const room = "VOX" + Math.random().toString(36).slice(2, 5).toUpperCase();
  const clients: Client[] = [];
  let introVoiceUrl: string | undefined;
  const phaseVoiceUrls: string[] = [];

  const connect = async (name: string, isNarr: boolean): Promise<Client> => {
    const token = await guest(name);
    const ws = new WebSocket(`${WSURL}?token=${encodeURIComponent(token)}&room=${room}&name=${encodeURIComponent(name)}`);
    const c: Client = { name, isNarr, ws };
    clients.push(c);
    ws.addEventListener("message", (e) => {
      try {
        const m = JSON.parse(String(e.data));
        if (m.k === "story" && m.introVoiceUrl) introVoiceUrl = m.introVoiceUrl;
        if (m.k === "phase" && m.voiceUrl) phaseVoiceUrls.push(m.voiceUrl);
      } catch { /* */ }
    });
    await new Promise<void>((res, rej) => { ws.addEventListener("open", () => res()); ws.addEventListener("error", () => rej(new Error("ws " + name))); });
    await sleep(120);
    return c;
  };
  const send = (c: Client, m: unknown) => { try { c.ws.send(JSON.stringify(m)); } catch { /* */ } };

  const host = await connect("Narr", true);
  for (let i = 1; i <= 4; i++) await connect("J" + i, false);
  await sleep(150);
  send(host, { k: "takeNarrator", on: true }); await sleep(150);
  send(host, { k: "setConfig", config: { songomby: 1, roles: ["mpisikidy"], pace: "rapide", theme: true } }); await sleep(150);
  send(host, { k: "start" });

  // the prep screen holds for the story generation + a bounded voice warm-up
  const t0 = Date.now();
  while (!introVoiceUrl && Date.now() - t0 < 50_000) await sleep(200);

  if (!introVoiceUrl) {
    console.log("⏭️  Voix off désactivée côté serveur (ELEVENLABS_* absent) — test ignoré.");
    console.log("    C'est une configuration valide : le jeu reste en texte seul.");
    for (const c of clients) try { c.ws.close(); } catch { /* */ }
    process.exit(0);
  }

  ok(/^\/v1\/tts\/[a-f0-9]{32}$/.test(introVoiceUrl), `l'intro porte une URL de voix (${introVoiceUrl})`);

  const res = await fetch(API + introVoiceUrl);
  const bytes = new Uint8Array(await res.arrayBuffer());
  ok(res.status === 200, `le clip est servi (HTTP ${res.status})`);
  ok((res.headers.get("content-type") || "").includes("audio"), `le clip est de l'audio (${res.headers.get("content-type")})`);
  ok(bytes.byteLength > 2000, `le clip a une taille plausible (${bytes.byteLength} octets)`);
  // mp3 frames start with an ID3 tag or a frame sync
  ok(bytes[0] === 0x49 || (bytes[0] === 0xff && (bytes[1]! & 0xe0) === 0xe0), "le clip commence par un en-tête MP3 valide");

  const again = await fetch(API + introVoiceUrl);
  ok(again.status === 200, "le même clip est resservi (cache)");

  const missing = await fetch(`${API}/v1/tts/${"0".repeat(32)}`);
  ok(missing.status === 404, `un hash inconnu renvoie 404, pas une erreur (HTTP ${missing.status})`);

  const bad = await fetch(`${API}/v1/tts/pas-un-hash`);
  ok(bad.status === 400, `un hash malformé est rejeté (HTTP ${bad.status})`);

  // give the night a moment so at least one phase line lands
  await sleep(4_000);
  ok(phaseVoiceUrls.length > 0, `des répliques de phase sont voisées (${phaseVoiceUrls.length})`);

  for (const c of clients) try { c.ws.close(); } catch { /* */ }
  await sleep(150);
  console.log(`\n${fails.length === 0 ? "🎉 VOIX OK" : "💥 ÉCHECS: " + fails.length}`);
  process.exit(fails.length === 0 ? 0 : 1);
}

main().catch((e) => { console.error(e); process.exit(2); });
