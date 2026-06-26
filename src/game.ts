import { UI } from "./ui/ui.ts";
import { Ambiance } from "./audio/ambiance.ts";
import { connectAngano } from "./net/online.ts";
import { AnganoClient } from "./net/transport.ts";
import type { PlayerPublic, NarratorPlayer, RoleInfo, GameConfig, Phase } from "./core/protocol.ts";

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
  private cupidPicks: string[] = [];
  private witchMode = false;
  private wolfVictim: string | null = null; private wolfIds: string[] = [];
  private voteTally: Record<string, number> = {};
  private deadReveal: Record<string, string> = {};
  private leaving = false;

  start() {
    this.ui.onToggleMute = () => { this.amb.setMuted(!this.amb.isMuted); this.ui.setMuted(this.amb.isMuted); };
    this.menu();
  }
  private get amNarrator() { return this.narratorId === this.selfId; }

  private menu() {
    this.leaving = true; this.client?.close(); this.client = undefined; this.amb.stop();
    this.ui.leaveStage(); this.phase = "lobby"; this.role = null;
    this.ui.showMenu((name, room) => void this.connect(name, room ?? randomCode()));
  }

  private async connect(name: string, room: string) {
    this.leaving = false;
    try {
      const ws = await connectAngano({ room, name });
      const client = new AnganoClient(ws); this.client = client;

      client.on("lobby", (m) => {
        this.selfId = m.selfId; this.hostId = m.hostId; this.narratorId = m.narratorId; this.players = m.players;
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

      client.on("role", (m) => { this.role = m.role; this.render(); });
      client.on("narrator", (m) => { this.narratorPlayers = m.players; this.log = m.log; this.render(); });

      client.on("phase", (m) => {
        if (!this.ui.inStage()) this.ui.enterStage();
        this.phase = m.phase; this.prompt = null; this.cupidPicks = []; this.witchMode = false;
        if (m.phase !== "vote") this.voteTally = {};
        if (m.phase !== "aube") this.deadReveal = {};
        this.amb.play(m.audioKey); this.ui.setMuted(this.amb.isMuted);
        this.ui.setBanner(m.imageKey, m.title, m.text, m.day);
        this.render();
      });

      client.on("prompt", (m) => { this.prompt = { kind: m.kind, targets: m.targets.map((t) => t.id) }; this.render(); });
      client.on("seerResult", (m) => { this.ui.toast(`${this.nameOf(m.targetId)} est… ${m.nameMg}`); });
      client.on("wolves", (m) => { this.wolfIds = m.wolfIds; this.wolfVictim = m.victimId; this.render(); });
      client.on("deaths", (m) => { for (const r of m.reveals) this.deadReveal[r.id] = r.roleId; this.render(); });
      client.on("voteState", (m) => { this.voteTally = {}; for (const t of m.tally) this.voteTally[t.id] = t.votes; this.render(); });
      client.on("voteResult", (m) => { this.ui.toast(m.eliminatedId ? `${this.nameOf(m.eliminatedId)} est éliminé (${m.nameMg}).` : "Personne n'est éliminé."); });
      client.on("state", (m) => { this.players = m.players; this.phase = m.phase; this.render(); });

      client.on("finish", (m) => {
        this.phase = "finished"; this.amb.play("revelation");
        const reveal: Record<string, string> = {}; m.reveal.forEach((r) => (reveal[r.id] = r.roleId));
        this.ui.setBanner("revelation_phase", winnerTitle(m.winner), m.text, 0);
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
      client.onClose = () => { if (this.leaving) return; this.ui.toast("Déconnecté"); this.menu(); };
    } catch (e) {
      console.error(e); this.ui.toast("Connexion impossible — réessaie"); this.menu();
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
      selected: this.cupidPicks,
      votes: this.phase === "vote" ? this.voteTally : undefined,
      roles: this.amNarrator ? Object.fromEntries(this.narratorPlayers.map((p) => [p.id, p.roleId ?? "mponina"])) : undefined,
      reveal: this.phase === "aube" ? this.deadReveal : undefined,
    });

    if (this.amNarrator) {
      this.ui.setPanel(
        h("div", { class: "nar-title" }, "🎙️ Vue du narrateur"),
        h("div", { class: "nar-log" }, ...this.log.slice(-8).map((l) => h("div", {}, l))),
        h("button", { class: "btn big", onclick: () => this.client?.nextPhase() }, "Continuer ▶"),
      );
      return;
    }

    const nodes: (HTMLElement | string)[] = [];
    if (this.role) nodes.push(this.ui.roleCard(this.role));
    if (this.wolfIds.length > 1 && this.role?.team === "songomby" && (this.phase === "songomby")) {
      nodes.push(h("div", { class: "hint" }, "Tes complices : " + this.wolfIds.filter((w) => w !== this.selfId).map((w) => this.nameOf(w)).join(", ")));
    }
    nodes.push(...this.actionPanel(h));
    this.ui.setPanel(...nodes);
  }

  private actionPanel(h: UI["el"]): (HTMLElement | string)[] {
    if (!this.prompt || this.amNarrator) {
      const p = this.players.find((x) => x.id === this.selfId);
      if (p && !p.alive) return [h("div", { class: "hint" }, "Tu es mort·e — observe la partie. 👻")];
      return this.phase === "debat" ? [h("div", { class: "hint" }, "Débattez à voix haute. Le narrateur lancera le vote.")]
        : [h("div", { class: "hint" }, "La nuit fait son œuvre… patiente.")];
    }
    switch (this.prompt.kind) {
      case "cupidon": return [h("div", { class: "hint" }, `Désigne deux amoureux (${this.cupidPicks.length}/2).`)];
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
    if (k === "cupidon") {
      if (this.cupidPicks.includes(id)) return;
      this.cupidPicks.push(id);
      if (this.cupidPicks.length === 2) { this.client?.action(this.cupidPicks[0]!, this.cupidPicks[1]!); this.prompt = null; }
      this.render(); return;
    }
    if (k === "vote") { this.client?.vote(id); return; } // can change until tally
    if (k === "ombiasy") { if (this.witchMode) { this.client?.action(id, "poison"); this.witchMode = false; this.prompt = null; this.render(); } return; }
    // seer / wolves / hunter: single pick
    this.client?.action(id);
    this.prompt = null; this.render();
  }

  private nameOf(id: string) { return this.players.find((p) => p.id === id)?.name ?? this.narratorPlayers.find((p) => p.id === id)?.name ?? "?"; }
}

function randomCode(): string { const a = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; return Array.from({ length: 4 }, () => a[(Math.random() * a.length) | 0]).join(""); }
function winnerTitle(w: string): string { return w === "village" ? "Le village l'emporte 🎉" : w === "songomby" ? "Les Songomby l'emportent 🐺" : "Les amoureux l'emportent 💕"; }
