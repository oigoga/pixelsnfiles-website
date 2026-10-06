# pixelsnfiles.com

One Netlify site that serves every PixelsnFiles page.

| Page | Path | Subdomain | Source |
| --- | --- | --- | --- |
| Home | pixelsnfiles.com | | `site/index.html` |
| Certificate check | pixelsnfiles.com/verify/ | verify.pixelsnfiles.com | `site/verify/index.html` |
| Cohort sales page | pixelsnfiles.com/cohort/ | cohort.pixelsnfiles.com | `site/cohort/` |
| Full Track sales page | pixelsnfiles.com/fulltrack/ | fulltrack.pixelsnfiles.com | `site/fulltrack/index.html` |

Routing lives in `netlify.toml`. Everything Netlify publishes is in `site/`.

## Adding a page

1. Create `site/<name>/index.html`.
2. Inside it, use absolute paths for links and files: `/<name>/photo.jpg` (not `photo.jpg`),
   `/images/favicon.svg` for shared images, and `https://pixelsnfiles.com/` to link home.
3. It is now live at `pixelsnfiles.com/<name>/`.
4. If it should have a subdomain too, copy one of the subdomain blocks in `netlify.toml`
   and follow the DNS steps below.

## Turning on a subdomain (one time per subdomain)

1. **Netlify**: Site configuration → Domain management → Add a domain alias →
   `verify.pixelsnfiles.com` (repeat for `cohort` and `fulltrack`).
2. **Namecheap** (the DNS host): Domain List → pixelsnfiles.com → Advanced DNS → Add new record:
   - Type `CNAME`, Host `verify`, Value `pixelsnfiles.netlify.app`, TTL Automatic
   - repeat for `cohort` and `fulltrack`
3. Back in Netlify, wait for the HTTPS certificate to cover the new names
   (Domain management → HTTPS → Renew certificate if it doesn't update by itself).

## Certificate register

Certificates are listed in the `REGISTER` array near the bottom of `site/verify/index.html`,
one line per certificate. Links of the form `pixelsnfiles.com/verify/?id=PNF-C01-012`
open the page with that certificate already checked, which is handy for QR codes.

## Cohort analytics

`netlify/functions/track.mts` and `stats.mts` count cohort page views and button clicks
without cookies. Totals are at `pixelsnfiles.com/cohort/stats.html`.
