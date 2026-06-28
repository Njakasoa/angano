import type { AnganoClientMsg, AnganoServerMsg, GameConfig, MissionStatus } from "../core/protocol.ts";

/** Typed wrapper over the Angano websocket. No game logic — the server owns it. */
export class AnganoClient {
  private ws: WebSocket;
  private handlers: Record<string, (m: AnganoServerMsg) => void> = {};
  onClose?: () => void;

  constructor(ws: WebSocket) {
    this.ws = ws;
    ws.addEventListener("message", (e) => this.dispatch(String(e.data)));
    ws.addEventListener("close", () => this.onClose?.());
  }

  on<K extends AnganoServerMsg["k"]>(k: K, fn: (m: Extract<AnganoServerMsg, { k: K }>) => void) {
    (this.handlers as Record<string, unknown>)[k] = fn as (m: AnganoServerMsg) => void;
    return this;
  }

  takeNarrator(on: boolean) { this.send({ k: "takeNarrator", on }); }
  setConfig(config: GameConfig) { this.send({ k: "setConfig", config }); }
  start() { this.send({ k: "start" }); }
  action(targetId: string | null, extra?: string) { this.send({ k: "action", targetId, extra }); }
  vote(targetId: string | null) { this.send({ k: "vote", targetId }); }
  missionStatus(playerId: string, status: MissionStatus) { this.send({ k: "missionStatus", playerId, status }); }
  nextPhase() { this.send({ k: "nextPhase" }); }
  rematch() { this.send({ k: "rematch" }); }
  close() { try { this.ws.close(); } catch { /* */ } }

  private send(m: AnganoClientMsg) { if (this.ws.readyState === WebSocket.OPEN) this.ws.send(JSON.stringify(m)); }
  private dispatch(raw: string) {
    let m: AnganoServerMsg;
    try { m = JSON.parse(raw); } catch { return; }
    this.handlers[m.k]?.(m);
  }
}
