/**
 * Emit `docs/audio-a-generer.md` — every sound the game expects, and the command that
 * makes it.
 *
 *   bun run doc:audio
 *
 * Written for one workflow in particular: listening to the soundtrack and rejecting
 * what does not work. The generator skips any file already on disk, so **deleting a
 * file is how you ask for it again** — this table says which command to run for each,
 * and with which voice. Nothing you kept is ever re-billed.
 *
 * Everything under `public/assets/audio` is committed, so `git status` lists what you
 * deleted and `git checkout -- <file>` takes back a deletion you regret.
 */
import { AMBIANCE, FOLEY, NIGHT_SFX, PACKS, SFX, VOICE } from "./audio-plan.ts";

const AUDIO = new URL("../public/assets/audio/", import.meta.url).pathname;
const OUT = new URL("../docs/audio-a-generer.md", import.meta.url).pathname;

async function seconds(file: string): Promise<number> {
  const p = Bun.spawn(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", AUDIO + file],
    { stdout: "pipe", stderr: "ignore" });
  return Number((await new Response(p.stdout).text()).trim()) || 0;
}

interface Row { family: string; key: string; file: string; cmd: string; directed?: string }

const rows: Row[] = [
  ...SFX.map((s) => ({ family: "bruitage", key: s.key, file: s.file, cmd: "--sfx" })),
  ...VOICE.map((v) => ({ family: "voix statique", key: `${v.text.slice(0, 44)}…`, file: v.file, cmd: "--voice" })),
  ...NIGHT_SFX.map((s) => ({ family: "tour de nuit", key: s.key, file: s.file, cmd: "--sfx" })),
  ...AMBIANCE.map((a) => ({ family: "ambiance", key: a.key, file: a.file, cmd: "--ambiance" })),
  ...FOLEY.map((f) => ({ family: "lit foley", key: f.key, file: f.file, cmd: "--foley" })),
  ...PACKS.flatMap((p) => p.lines.map((l) => ({
    family: `pack · ${p.id}`, key: l.label, file: l.file,
    cmd: `--pack=${p.id}`, directed: l.direction ? "oui" : "non",
  }))),
];

let table = "";
let missing = 0;
let kb = 0;
let sec = 0;
for (const r of rows) {
  const f = Bun.file(AUDIO + r.file);
  const size = (await f.exists()) ? Math.round(f.size / 1024) : 0;
  const d = size ? await seconds(r.file) : 0;
  if (!size) missing++;
  kb += size;
  sec += d;
  table += `| \`${r.file}\` | ${size || "**à générer**"} | ${d ? d.toFixed(1) : "—"} | ${r.family} | ${r.key} | ${r.directed ?? "—"} | \`${r.cmd}\` |\n`;
}

const onDisk = new Set<string>();
for await (const f of new Bun.Glob("*.mp3").scan({ cwd: AUDIO })) onDisk.add(f);
const expected = new Set(rows.map((r) => r.file));
const orphans = [...onDisk].filter((f) => !expected.has(f)).sort();

const doc = `# Angano — inventaire audio

> Généré par \`bun run doc:audio\`. Ne pas éditer à la main.

**${rows.length} fichiers attendus** · ${missing} à générer · ${(kb / 1024).toFixed(1)} Mo · ${(sec / 60).toFixed(1)} min

## Régénérer un son

Le générateur **saute tout fichier déjà présent**. Supprimer un fichier est donc la
façon de le redemander, et rien de ce que tu gardes n'est réenregistré ni refacturé.

\`\`\`bash
set -a; . ../core-api/.env; set +a          # la clé ElevenLabs vit là, et nulle part ailleurs
bun scripts/generate-audio.ts <commande>    # la commande de la ligne, colonne de droite
\`\`\`

Tout est commité : \`git status --short public/assets/audio\` liste ce qui a été
supprimé, \`git checkout -- <fichier>\` annule une suppression regrettée.

Une ligne **dirigée** porte sa propre version balisée pour eleven_v3 ; les autres
reçoivent une balise unique déduite de leur rôle. Voir \`docs/direction-sonore.md\`.

## Les conteurs

| Légende | Voix | Lignes |
|---|---|--:|
${PACKS.map((p) => `| \`${p.id}\` | \`${p.voice}\` | ${p.lines.length} |`).join("\n")}

## Tous les fichiers

| fichier | Ko | s | famille | clé / label | dirigé | commande |
|---|--:|--:|---|---|:-:|---|
${table}
${orphans.length ? `## Orphelins\n\nSur le disque mais référencés nulle part — supprimables :\n\n${orphans.map((f) => `- \`${f}\``).join("\n")}\n` : "Aucun orphelin : tout ce qui est sur le disque est référencé.\n"}`;

await Bun.write(OUT, doc);
console.log(`✓ docs/audio-a-generer.md — ${rows.length} fichiers · ${missing} à générer · ${orphans.length} orphelins`);
