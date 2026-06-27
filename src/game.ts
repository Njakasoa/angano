import { UI } from "./ui/ui.ts";
import { Ambiance } from "./audio/ambiance.ts";
import { connectAngano } from "./net/online.ts";
import { AnganoClient } from "./net/transport.ts";
import type { PlayerPublic, NarratorPlayer, RoleInfo, GameConfig, Phase, AnganoServerMsg } from "./core/protocol.ts";

export class Game {
  private ui = new UI(document.getElementById("app")!);
  private amb = new Ambiance();
  private client?: AnganoClient;
  private lobby?: ReturnType<UI["showLobby"]>;

  private selfId = ""; private hostId = ""; private narratorId: string | null = null;
  private players: PlayerPublic[] = [];
  private role: RoleInfo | null = null;
  private narratorPlayers: NarratorPlayer[] = [];
  private log: string[] = [];
  private phase: Phase = "lobby";
  private prompt: { kind: string; targets: string[] } | null = null;
  private witchMode = false;
  private wolfVictim: string | null = null; private wolfIds: string[] = [];
  private voteTally: Record<string, number> = {};
  private deadReveal: Record<string, string> = {};
  private dying: string[] = [];
  private roleReveal = false;
  private journal: string[] = [];
  private story: Extract<AnganoServerMsg, { k: "story" }> | null = null;
  private storyIntroShown = false;
  private leaving = false;
  private currentName = ""; private currentRoom = ""; private reconnectTries = 0;

  start() {
    this.ui.onToggleMute = () => { this.amb.setMuted(!this.amb.isMuted); this.ui.setMuted(this.amb.isMuted); };
    const active = readActive(); // page was reloaded mid-game → rejoin automatically
    if (active) this.startConnect(active.name, active.room); else this.menu();
  }
  private get amNarrator() { return this.narratorId === this.selfId; }

  private menu() {
    this.leaving = true; this.client?.close(); this.client = undefined; this.amb.stop();
    try { sessionStorage.removeItem("angano_active"); } catch { /* */ }
    this.ui.leaveStage(); this.phase = "lobby"; this.role = null;
    this.ui.showMenu((name, room) => this.startConnect(name, room ?? randomCode()));
  }

  private startConnect(name: string, room: string) {
    this.reconnectTries = 0;
    this.connect(name, room).catch(() => { this.ui.toast("Connexion impossible — réessaie"); this.menu(); });
  }

  /** Reconnect to the same room reusing the cached guest id; the server resyncs us
   *  back into the running game. Falls back to the menu after repeated failures. */
  private async tryReconnect() {
    if (this.leaving) return;
    if (++this.reconnectTries > 6) { this.reconnectTries = 0; this.ui.toast("Reconnexion impossible"); this.menu(); return; }
    this.ui.toast(`Reconnexion… (${this.reconnectTries})`);
    await new Promise((r) => setTimeout(r, 700 * this.reconnectTries));
    if (this.leaving) return;
    try { await this.connect(this.currentName, this.currentRoom); this.reconnectTries = 0; }
    catch { void this.tryReconnect(); }
  }

  private async connect(name: string, room: string) {
    this.leaving = false;
    this.currentName = name; this.currentRoom = room;
    try { sessionStorage.setItem("angano_active", JSON.stringify({ room, name })); } catch { /* */ }
    const ws = await connectAngano({ room, name });
    {
      const client = new AnganoClient(ws); this.client = client;

      client.on("lobby", (m) => {
        this.selfId = m.selfId; this.hostId = m.hostId; this.narratorId = m.narratorId; this.players = m.players;
        this.journal = []; this.story = null; this.storyIntroShown = false; // fresh game / rematch
        if (this.phase !== "lobby" || this.ui.inStage()) { this.ui.leaveStage(); }
        this.phase = "lobby";
        if (!this.lobby || !document.querySelector(".players")) {
          this.lobby = this.ui.showLobby({
            selfId: m.selfId,
            onStart: () => client.start(),
            onLeave: () => this.menu(),
            onNarrator: (on) => client.takeNarrator(on),
            onConfig: (c: GameConfig) => client.setConfig(c),
          });
        }
        this.lobby.render(m);
      });

      client.on("role", (m) => { this.role = m.role; this.roleReveal = true; this.render(); });
      client.on("story", (m) => { this.story = m; this.render(); });
      client.on("narrator", (m) => { this.narratorPlayers = m.players; this.log = m.log; this.render(); });

      client.on("phase", (m) => {
        const prev = this.phase;
        if (!this.ui.inStage()) this.ui.enterStage();
        this.phase = m.phase; this.prompt = null; this.witchMode = false;
        if (m.phase !== "vote") this.voteTally = {};
        if (m.phase !== "aube") this.deadReveal = {};
        this.amb.play(m.audioKey); this.ui.setMuted(this.amb.isMuted);
        // headline flourish on day phases + once when the night falls (not on every night sub-step)
        const headline = m.phase === "debat" || m.phase === "vote" || (isNight(m.phase) && !isNight(prev));
        const firstNight = isNight(m.phase) && !isNight(prev) && m.day === 1;
        if (this.story && firstNight && !this.storyIntroShown) {
          this.storyIntroShown = true;
          this.ui.phaseIntro(m.imageKey, this.story.title, this.story.intro);
        } else if (headline && prev !== m.phase) {
          this.ui.phaseIntro(m.imageKey, m.title, m.text);
        }
        this.ui.setBanner(m.imageKey, m.title, m.text, m.day);
        this.ui.setTimer(m.durationMs);
        this.render();
      });

      client.on("prompt", (m) => { this.prompt = { kind: m.kind, targets: m.targets.map((t) => t.id) }; this.render(); });
      client.on("seerResult", (m) => { this.ui.toast(`Le sikidy révèle : ${this.nameOf(m.targetId)} est… ${m.nameMg}.`); this.note(`🔮 ${this.nameOf(m.targetId)} → ${m.nameMg}`); });
      client.on("trackResult", (m) => { this.ui.toast(m.visited ? `Pas inversés : ${this.nameOf(m.targetId)} a quitté sa place cette nuit.` : `${this.nameOf(m.targetId)} semble être resté immobile.`); this.note(`👣 ${this.nameOf(m.targetId)} ${m.visited ? "a quitté sa place" : "est resté immobile"}`); });
      client.on("fadyTrace", (m) => { this.ui.toast(`Le fady d'eau sur ${this.nameOf(m.targetId)} a été troublé — une présence hostile est venue.`); this.note(`💧 fady troublé sur ${this.nameOf(m.targetId)} (présence hostile)`); });
      client.on("blocked", () => { this.ui.toast("Une malédiction a brouillé ton pouvoir cette nuit."); this.note("🚫 ton pouvoir a été bloqué cette nuit"); });
      client.on("wolves", (m) => { this.wolfIds = m.wolfIds; this.wolfVictim = m.victimId; this.render(); });
      client.on("deaths", (m) => {
        for (const r of m.reveals) this.deadReveal[r.id] = r.roleId;
        this.dying = m.ids; this.render();
        setTimeout(() => { this.dying = []; this.render(); }, 800);
      });
      client.on("voteState", (m) => { this.voteTally = {}; for (const t of m.tally) this.voteTally[t.id] = t.votes; this.render(); });
      client.on("voteResult", (m) => { this.ui.toast(m.eliminatedId ? `${this.nameOf(m.eliminatedId)} est éliminé (${m.nameMg}).` : "Personne n'est éliminé."); });
      client.on("state", (m) => { this.players = m.players; this.phase = m.phase; this.render(); });

      client.on("finish", (m) => {
        this.phase = "finished"; this.amb.play("revelation");
        const reveal: Record<string, string> = {}; m.reveal.forEach((r) => (reveal[r.id] = r.roleId));
        const vimg = m.winner === "songomby" ? "scene_victory_songomby" : "scene_victory_village";
        this.ui.phaseIntro(vimg, winnerTitle(m.winner), m.text);
        this.ui.setBanner(vimg, winnerTitle(m.winner), m.text, 0);
        this.ui.setVillage(this.players, this.selfId, this.narratorId, { roles: reveal });
        const h = this.ui.el;
        this.ui.setPanel(
          h("div", { class: "finish-banner " + (m.winner === "songomby" ? "evil" : "good") }, m.text),
          h("div", { class: "row center" },
            this.selfId === this.hostId ? h("button", { class: "btn big", onclick: () => client.rematch() }, "Rejouer") : h("div", { class: "tag" }, "L'hôte peut relancer…"),
            h("button", { class: "btn ghost", onclick: () => this.menu() }, "Menu"),
          ),
        );
      });

      client.on("error", (m) => this.ui.toast(m.message));
      client.onClose = () => {
        if (this.leaving) return;
        if (this.phase === "finished") { this.ui.toast("Déconnecté"); this.menu(); return; }
        this.ui.toast("Connexion perdue…"); void this.tryReconnect();
      };
    }
  }

  // ── reactive render of the stage (village + panel) ──
  private render() {
    if (!this.ui.inStage() || this.phase === "finished") return;
    const h = this.ui.el;
    const active = this.prompt && !this.amNarrator;
    const targets = active ? this.prompt!.targets : undefined;

    this.ui.setVillage(this.players, this.selfId, this.narratorId, {
      targets,
      onPick: (id) => this.pick(id),
      votes: this.phase === "vote" ? this.voteTally : undefined,
      roles: this.amNarrator ? Object.fromEntries(this.narratorPlayers.map((p) => [p.id, p.roleId ?? "mponina"])) : undefined,
      reveal: this.phase === "aube" || this.dying.length ? this.deadReveal : undefined,
      dying: this.dying,
    });

    if (this.amNarrator) {
      const advLabel = this.phase === "aube" ? "🗣 Révéler / Continuer ▶" : this.phase === "debat" ? "Lancer le vote ▶" : "Continuer ▶";
      this.ui.setPanel(
        h("div", { class: "nar-title" }, "🎙️ Vue du narrateur"),
        ...(this.story ? [h("div", { class: "nar-script" }, h("div", { class: "ns-title" }, "📜 " + this.story.title), h("div", { class: "ns-intro" }, this.story.intro))] : []),
        h("div", { class: "nar-log" }, ...this.log.slice(-8).map((l) => h("div", {}, l))),
        h("button", { class: "btn big", onclick: () => this.client?.nextPhase() }, advLabel),
      );
      return;
    }

    const nodes: (HTMLElement | string)[] = [];
    if (this.role) { nodes.push(this.ui.roleCard(this.role, this.roleReveal, this.story?.roleEpithets?.[this.role.roleId])); this.roleReveal = false; }
    if (this.wolfIds.length > 1 && this.role?.team === "songomby" && (this.phase === "songomby")) {
      nodes.push(h("div", { class: "hint" }, "Tes complices : " + this.wolfIds.filter((w) => w !== this.selfId).map((w) => this.nameOf(w)).join(", ")));
    }
    nodes.push(...this.actionPanel(h));
    if (this.journal.length) {
      nodes.push(h("div", { class: "journal" },
        h("div", { class: "journal-title" }, "🔎 Tes découvertes"),
        ...this.journal.slice(-8).map((j) => h("div", { class: "journal-item" }, j)),
      ));
    }
    this.ui.setPanel(...nodes);
  }

  private actionPanel(h: UI["el"]): (HTMLElement | string)[] {
    if (this.phase === "roles") return [h("div", { class: "hint" }, "Le conteur prépare votre légende… ✨")];
    if (!this.prompt || this.amNarrator) {
      const p = this.players.find((x) => x.id === this.selfId);
      if (p && !p.alive) return [h("div", { class: "hint" }, "Tu es mort·e — observe la partie. 👻")];
      return this.phase === "debat" ? [h("div", { class: "hint" }, "Débattez à voix haute. Le narrateur lancera le vote.")]
        : [h("div", { class: "hint" }, "La nuit fait son œuvre… patiente.")];
    }
    switch (this.prompt.kind) {
      case "zazavavindrano": return [h("div", { class: "hint" }, "Pose un fady d'eau sur un joueur — touche une carte.")];
      case "kalanoro": return [h("div", { class: "hint" }, "Lis les pas d'un joueur — touche une carte.")];
      case "mpamosavy": return [h("div", { class: "hint" }, "Maudis un joueur pour faire échouer son pouvoir — touche une carte.")];
      case "mpisikidy": return [h("div", { class: "hint" }, "Sonde un joueur — touche une carte.")];
      case "songomby": return [h("div", { class: "hint" }, "Choisis ta victime — touche une carte.")];
      case "mpihaza": return [h("div", { class: "hint" }, "Décoche ta flèche — touche une carte.")];
      case "vote": return [h("div", { class: "hint" }, "Vote pour éliminer un suspect — touche une carte.")];
      case "ombiasy": {
        if (this.witchMode) return [h("div", { class: "hint" }, "Choisis qui empoisonner — touche une carte.")];
        return [
          h("div", { class: "hint" }, this.wolfVictim ? `Victime des Songomby : ${this.nameOf(this.wolfVictim)}.` : "Aucune victime cette nuit."),
          h("div", { class: "row center wrap" },
            this.wolfVictim ? h("button", { class: "btn", onclick: () => { this.client?.action(null, "heal"); this.prompt = null; this.render(); } }, "💚 Soigner") : "",
            h("button", { class: "btn", onclick: () => { this.witchMode = true; this.render(); } }, "☠️ Empoisonner"),
            h("button", { class: "btn ghost", onclick: () => { this.client?.action(null, "skip"); this.prompt = null; this.render(); } }, "Passer"),
          ),
        ];
      }
      default: return [];
    }
  }

  private pick(id: string) {
    if (!this.prompt) return;
    const k = this.prompt.kind;
    if (k === "vote") { this.client?.vote(id); return; } // can change until tally
    if (k === "ombiasy") { if (this.witchMode) { this.client?.action(id, "poison"); this.witchMode = false; this.prompt = null; this.render(); } return; }
    // zazavavindrano / kalanoro / mpamosavy / mpisikidy / songomby / mpihaza: single pick
    this.client?.action(id);
    this.prompt = null; this.render();
  }

  private note(entry: string) { this.journal.push(entry); if (this.journal.length > 20) this.journal.shift(); this.render(); }
  private nameOf(id: string) { return this.players.find((p) => p.id === id)?.name ?? this.narratorPlayers.find((p) => p.id === id)?.name ?? "?"; }
}

function readActive(): { room: string; name: string } | null {
  try { const r = sessionStorage.getItem("angano_active"); if (!r) return null; const a = JSON.parse(r); return a && a.room ? a : null; } catch { return null; }
}
const NIGHT_PHASES: Phase[] = ["zazavavindrano", "mpamosavy", "mpisikidy", "kalanoro", "songomby", "ombiasy"];
function isNight(p: Phase): boolean { return NIGHT_PHASES.includes(p); }
function randomCode(): string { const a = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; return Array.from({ length: 4 }, () => a[(Math.random() * a.length) | 0]).join(""); }
function winnerTitle(w: string): string { return w === "village" ? "Le village l'emporte 🎉" : w === "songomby" ? "Les Songomby l'emportent 🐺" : "Fin de partie"; }
