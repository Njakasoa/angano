import type { PlayerPublic, RoleInfo, GameConfig } from "../core/protocol.ts";
import { OPTIONAL_ROLES, roleDef, imageUrl } from "../core/roles.ts";

type El = HTMLElement;
function h(tag: string, props: Record<string, unknown> = {}, ...kids: (El | string)[]): El {
  const e = document.createElement(tag);
  for (const [k, v] of Object.entries(props)) {
    if (k === "class") e.className = String(v);
    else if (k.startsWith("on") && typeof v === "function") e.addEventListener(k.slice(2).toLowerCase(), v as EventListener);
    else if (k === "html") e.innerHTML = String(v);
    else if (v !== false && v != null) e.setAttribute(k, String(v));
  }
  for (const c of kids) e.append(c);
  return e;
}
const AV = ["🦊", "🐼", "🐯", "🐸", "🐵", "🦁", "🐶", "🐱", "🐰", "🐻", "🦉", "🐺", "🐗", "🦝", "🐮", "🐲"];
export function avatarFor(id: string): string { let n = 0; for (let i = 0; i < id.length; i++) n = (n + id.charCodeAt(i)) % AV.length; return AV[n]!; }

export interface VillageOpts {
  targets?: string[];                 // clickable player ids
  onPick?: (id: string) => void;
  selected?: string[];                // highlighted picks
  votes?: Record<string, number>;     // vote tallies
  roles?: Record<string, string>;     // id -> roleId (narrator / finish reveal)
  reveal?: Record<string, string>;    // id -> roleId revealed dead
}

export class UI {
  private screen?: El;
  // persistent stage refs
  private bannerImg?: El; private bannerTitle?: El; private bannerText?: El; private dayEl?: El;
  private villageEl?: El; private panelEl?: El; private muteBtn?: HTMLButtonElement; private timerBar?: El;
  onToggleMute?: () => void;

  constructor(private root: El) {}
  private mount(el: El) { this.screen?.remove(); this.screen = el; this.root.append(el); }
  private name(): string { return (localStorage.getItem("angano_name") || "").trim(); }
  private saveName(n: string) { localStorage.setItem("angano_name", n); }

  // ── menu ──
  showMenu(onPlay: (name: string, room: string | null) => void) {
    const nameInput = h("input", { class: "field", placeholder: "Ton pseudo", maxlength: "16", value: this.name() }) as HTMLInputElement;
    const codeInput = h("input", { class: "field", placeholder: "Code (ex: AB12)", maxlength: "8", style: "text-transform:uppercase" }) as HTMLInputElement;
    const go = (room: string | null) => { const n = nameInput.value.trim() || "Joueur"; this.saveName(n); onPlay(n, room); };
    this.mount(h("div", { class: "screen center" },
      h("div", { class: "card" },
        h("div", { class: "brand" }, "ANGANO"),
        h("div", { class: "tag" }, "Le village, la nuit, et les monstres cachés parmi vous."),
        h("label", { class: "lbl" }, "Pseudo"), nameInput,
        h("button", { class: "btn big", onclick: () => go(null) }, "Créer une partie"),
        h("div", { class: "or" }, "ou rejoindre avec un code"),
        h("div", { class: "row" }, codeInput, h("button", { class: "btn ghost", onclick: () => go(codeInput.value.trim().toUpperCase() || null) }, "Rejoindre")),
        h("div", { class: "foot" }, "Jeu de déduction · 4 joueurs + narrateur recommandés"),
      ),
    ));
  }

  // ── lobby ──
  showLobby(o: { selfId: string; onStart: () => void; onLeave: () => void; onNarrator: (on: boolean) => void; onConfig: (c: GameConfig) => void }) {
    const codeEl = h("div", { class: "code" }, "····");
    const list = h("div", { class: "players" });
    const narBtn = h("button", { class: "btn ghost small" }, "Devenir narrateur") as HTMLButtonElement;
    const songInput = h("input", { class: "field mini", type: "number", min: "1", max: "5", value: "1" }) as HTMLInputElement;
    const roleToggles = h("div", { class: "role-toggles" });
    const startBtn = h("button", { class: "btn big", onclick: o.onStart }, "Lancer la partie") as HTMLButtonElement;
    const hint = h("div", { class: "tag" }, "");
    const cfg = h("div", { class: "config" },
      h("label", { class: "lbl" }, "Songomby"), songInput,
      h("label", { class: "lbl" }, "Rôles spéciaux"), roleToggles);

    const pushConfig = () => o.onConfig({ songomby: Math.max(1, Math.min(5, parseInt(songInput.value) || 1)), roles: [...roleToggles.querySelectorAll<HTMLButtonElement>(".chip.on")].map((b) => b.getAttribute("data-r")!) });
    OPTIONAL_ROLES.forEach((r) => {
      roleToggles.append(h("button", { class: "chip on" + (r.team === "songomby" ? " evil" : ""), "data-r": r.id, title: r.desc, onclick: (e: Event) => { (e.currentTarget as HTMLButtonElement).classList.toggle("on"); pushConfig(); } }, r.nameMg));
    });
    songInput.onchange = pushConfig;
    narBtn.onclick = () => o.onNarrator(narBtn.getAttribute("data-on") !== "1");

    this.mount(h("div", { class: "screen center" },
      h("div", { class: "card wide" },
        h("div", { class: "brand small" }, "SALON"),
        h("div", { class: "tag" }, "Partage ce code :"), codeEl,
        narBtn,
        list,
        cfg,
        hint,
        h("div", { class: "row center" }, startBtn, h("button", { class: "btn ghost", onclick: o.onLeave }, "Quitter")),
      ),
    ));

    const render = (m: { code: string; hostId: string; narratorId: string | null; selfId: string; config: GameConfig; players: PlayerPublic[] }) => {
      codeEl.textContent = m.code;
      const isHost = m.selfId === m.hostId;
      const amNar = m.narratorId === m.selfId;
      narBtn.textContent = amNar ? "Quitter le rôle de narrateur" : "Devenir narrateur";
      narBtn.setAttribute("data-on", amNar ? "1" : "0");
      list.innerHTML = "";
      m.players.forEach((p) => list.append(h("div", { class: "player" },
        h("span", { class: "pa" }, avatarFor(p.id)),
        h("span", {}, p.name + (p.id === m.selfId ? " (toi)" : "")),
        p.id === m.narratorId ? h("span", { class: "host" }, "🎙️ narrateur") : (p.id === m.hostId ? h("span", { class: "host" }, "👑 hôte") : ""),
      )));
      cfg.style.display = isHost ? "" : "none";
      songInput.value = String(m.config.songomby);
      roleToggles.querySelectorAll<HTMLButtonElement>(".chip").forEach((b) => b.classList.toggle("on", m.config.roles.includes(b.getAttribute("data-r")!)));
      startBtn.style.display = isHost ? "" : "none";
      const seats = m.players.filter((p) => p.id !== m.narratorId).length;
      hint.textContent = isHost ? (seats < 4 ? `Encore ${4 - seats} joueur(s) (hors narrateur).` : "") : "En attente de l'hôte…";
    };
    return { render };
  }

  // ── in-game stage (persistent) ──
  enterStage() {
    this.bannerImg = h("div", { class: "banner-img" });
    this.bannerTitle = h("div", { class: "phase-title" });
    this.bannerText = h("div", { class: "phase-text" });
    this.dayEl = h("div", { class: "day-badge" });
    this.muteBtn = h("button", { class: "mute", onclick: () => this.onToggleMute?.() }, "🔊") as HTMLButtonElement;
    this.timerBar = h("div", { class: "timer-bar hidden" });
    this.villageEl = h("div", { class: "village" });
    this.panelEl = h("div", { class: "panel" });
    this.mount(h("div", { class: "screen stage" },
      h("div", { class: "banner" }, this.bannerImg, this.dayEl, this.muteBtn, h("div", { class: "banner-txt" }, this.bannerTitle, this.bannerText), this.timerBar),
      this.villageEl,
      this.panelEl,
    ));
  }
  inStage() { return !!this.villageEl; }
  leaveStage() { this.bannerImg = this.villageEl = this.panelEl = this.timerBar = undefined; }

  /** Animate the phase countdown bar (depletes over `ms`). 0 hides it. */
  setTimer(ms: number) {
    const b = this.timerBar; if (!b) return;
    if (!ms || ms <= 0) { b.classList.add("hidden"); return; }
    b.classList.remove("hidden");
    b.style.transition = "none"; b.style.transform = "scaleX(1)";
    void b.offsetWidth; // force reflow so the next transition runs
    b.style.transition = `transform ${ms}ms linear`; b.style.transform = "scaleX(0)";
  }

  setBanner(imageKey: string, title: string, text: string, day: number) {
    if (this.bannerImg) this.bannerImg.style.backgroundImage = `url(${imageUrl(imageKey)})`;
    if (this.bannerTitle) this.bannerTitle.textContent = title;
    if (this.bannerText) this.bannerText.textContent = text;
    if (this.dayEl) this.dayEl.textContent = day > 0 ? `Jour ${day}` : "";
  }
  setMuted(m: boolean) { if (this.muteBtn) this.muteBtn.textContent = m ? "🔇" : "🔊"; }

  setVillage(players: PlayerPublic[], selfId: string, narratorId: string | null, opts: VillageOpts = {}) {
    const v = this.villageEl; if (!v) return;
    v.innerHTML = "";
    players.filter((p) => p.id !== narratorId).forEach((p) => {
      const clickable = opts.targets?.includes(p.id);
      const roleId = opts.reveal?.[p.id] ?? opts.roles?.[p.id];
      const card = h("div", {
        class: ["pcard", !p.alive ? "dead" : "", p.id === selfId ? "me" : "", clickable ? "target" : "", opts.selected?.includes(p.id) ? "sel" : ""].filter(Boolean).join(" "),
        ...(clickable ? { onclick: () => opts.onPick?.(p.id) } : {}),
      },
        h("div", { class: "pc-ava" }, p.alive ? avatarFor(p.id) : "✝"),
        h("div", { class: "pc-name" }, p.name + (p.id === selfId ? " (toi)" : "")),
        roleId ? h("div", { class: "pc-role" }, roleDef(roleId).nameMg) : "",
        opts.votes?.[p.id] ? h("div", { class: "pc-votes" }, "🗳 " + opts.votes[p.id]) : "",
      );
      v.append(card);
    });
  }

  setPanel(...nodes: (El | string)[]) { const p = this.panelEl; if (!p) return; p.innerHTML = ""; p.append(...nodes); }

  roleCard(role: RoleInfo): El {
    const teamCls = role.team === "songomby" ? "evil" : "good";
    return h("div", { class: "rolecard " + teamCls },
      h("div", { class: "rc-img", style: `background-image:url(${imageUrl(roleDef(role.roleId).asset)})` }),
      h("div", { class: "rc-body" },
        h("div", { class: "rc-name" }, role.nameMg),
        h("div", { class: "rc-desc" }, role.desc),
      ),
    );
  }

  toast(msg: string) {
    const t = h("div", { class: "toast" }, msg);
    this.root.append(t);
    setTimeout(() => t.remove(), 3200);
  }

  el = h;
}
