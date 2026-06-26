const API_BASE =
  (import.meta.env.VITE_API_BASE as string | undefined) ?? "https://api.njakasoa.xyz";

/** Open the Angano websocket as an anonymous guest (token cached for stable id). */
export async function connectAngano(opts: { room: string; name: string }): Promise<WebSocket> {
  const token = await guestToken();
  const q = new URLSearchParams({ token, room: opts.room, name: opts.name });
  const ws = new WebSocket(`${API_BASE.replace(/^http/, "ws")}/angano/rt?${q.toString()}`);
  await new Promise<void>((resolve, reject) => {
    const to = setTimeout(() => reject(new Error("ws timeout")), 8000);
    ws.addEventListener("open", () => { clearTimeout(to); resolve(); }, { once: true });
    ws.addEventListener("error", () => { clearTimeout(to); reject(new Error("ws error")); }, { once: true });
  });
  return ws;
}

async function guestToken(): Promise<string> {
  try {
    const raw = sessionStorage.getItem("angano_guest");
    if (raw) {
      const { token, exp } = JSON.parse(raw) as { token: string; exp: number };
      if (token && exp > Date.now() + 10_000) return token;
    }
  } catch { /* ignore */ }
  const res = await fetch(`${API_BASE}/v1/auth/guest`, { method: "POST" });
  if (!res.ok) throw new Error(`guest auth failed: ${res.status}`);
  const { accessToken, expiresIn } = (await res.json()) as { accessToken: string; expiresIn?: number };
  try { sessionStorage.setItem("angano_guest", JSON.stringify({ token: accessToken, exp: Date.now() + (expiresIn ?? 900) * 1000 })); } catch { /* */ }
  return accessToken;
}
