import type { Context } from "@netlify/functions";
import { getStore } from "@netlify/blobs";

const ALLOWED_CLICK_LABELS = new Set([
  "reserve_seat",
  "pay_full_hero",
  "pay_full",
  "pay_instalments",
  "clarity_30",
  "clarity_60",
  "whatsapp_support",
  "whatsapp_goga",
  "join_footer",
  "join_header",
]);

function todayKey(): string {
  return new Date().toISOString().slice(0, 10); // YYYY-MM-DD (UTC)
}

export default async (req: Request, _context: Context) => {
  if (req.method !== "POST") {
    return new Response(null, { status: 405 });
  }

  let body: { type?: string; label?: string };
  try {
    body = await req.json();
  } catch {
    return new Response(null, { status: 400 });
  }

  const isPageview = body.type === "pageview";
  const isClick = body.type === "click" && typeof body.label === "string" && ALLOWED_CLICK_LABELS.has(body.label);

  if (!isPageview && !isClick) {
    return new Response(null, { status: 400 });
  }

  const store = getStore({ name: "analytics", consistency: "strong" });
  const day = todayKey();

  async function bump(key: string) {
    const current = (await store.get(key, { type: "json" })) || { pageviews: 0, clicks: {} };
    if (isPageview) {
      current.pageviews = (current.pageviews || 0) + 1;
    } else if (isClick && body.label) {
      current.clicks = current.clicks || {};
      current.clicks[body.label] = (current.clicks[body.label] || 0) + 1;
    }
    await store.setJSON(key, current);
  }

  await Promise.all([bump("totals"), bump(`day:${day}`)]);

  return new Response(null, { status: 204 });
};
