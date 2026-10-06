import type { Context } from "@netlify/functions";
import { getStore } from "@netlify/blobs";

function dateKeyDaysAgo(n: number): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - n);
  return d.toISOString().slice(0, 10);
}

export default async (_req: Request, _context: Context) => {
  const store = getStore({ name: "analytics", consistency: "strong" });

  const totals = (await store.get("totals", { type: "json" })) || { pageviews: 0, clicks: {} };

  const last7 = [];
  for (let i = 6; i >= 0; i--) {
    const key = dateKeyDaysAgo(i);
    const day = (await store.get(`day:${key}`, { type: "json" })) || { pageviews: 0, clicks: {} };
    last7.push({ date: key, pageviews: day.pageviews || 0 });
  }

  return new Response(
    JSON.stringify({
      totals: {
        pageviews: totals.pageviews || 0,
        clicks: totals.clicks || {},
      },
      last7,
      generatedAt: new Date().toISOString(),
    }),
    { headers: { "content-type": "application/json" } }
  );
};
