# Deployment

Imprima is a static React/Vite prototype. The production build is generated into `dist/`.

## Build

```bash
npm ci
npm run build
```

## Recommended Hosting

Use Vercel or Netlify for the first public demo. Both support single-page app fallbacks, which are needed for direct links such as:

- `/case-study`
- `/status/storytelling-heute`

Configure the host so every unknown route falls back to `index.html`.

## GitHub Pages

GitHub Pages can host the app, but direct SPA routes need extra handling. Without a fallback, opening `/case-study` or `/status/storytelling-heute` directly after a reload may return a 404.

Before using GitHub Pages, choose one of these approaches:

- Add a GitHub Pages 404 fallback that redirects to the app.
- Switch to hash routes for public demo links.
- Serve only the root route and navigate inside the app.

For this project, Vercel or Netlify is the cleaner first deployment target.
