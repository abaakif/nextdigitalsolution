# LaunchDok Premium Website

## Live site (static)
Open `index.html` in a browser or serve with any static host. No build step required.

```
python -m http.server 8080
```

## Assets

Place brand assets in `image/` (or `public/` for Next.js):

| File | Purpose |
|------|---------|
| `image/navicon.png` | Favicon + nav icon (`launchdok-icon.png`) |
| `image/logo.png` | Full wordmark (`launchdok-logo.png`) |
| `image/hero.png` | Horizon background (`horizon-bg.png`) |

## Structure

```
index.html                 ← Premium homepage (no template CSS)
css/launchdok-premium.css  ← All styles (Sora, dark theme, animations)
js/launchdok.js            ← Horizon parallax, particles, scroll reveal
Client.html                ← Full portfolio grid
Client/                    ← Case studies & sample sites
launchdok-web/             ← Next.js + Tailwind + Framer Motion (optional)
```

## Next.js app

```bash
cd launchdok-web
npm install
npm run dev
```

Copy assets to `launchdok-web/public/`:
- `launchdok-icon.png`
- `launchdok-logo.png`
- `horizon-bg.png`

## Brand

- Background: `#050505` / `#0D0D0D`
- Orange: `#FF6A00`
- Text: `#FFFFFF` / `#A3A3A3`
- Font: Sora
