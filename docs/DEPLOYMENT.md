# Deployment

Imprima ist eine statische React/Vite-Anwendung. Der Produktions-Build wird in `dist/` erzeugt.

## Build

```bash
npm ci
npm run check
```

## Vercel

1. GitHub-Repository in Vercel importieren.
2. Framework-Preset `Vite` verwenden.
3. Build Command `npm run build` und Output Directory `dist` beibehalten.

`vercel.json` enthaelt den SPA-Fallback fuer direkte Case-Study- und Status-URLs.

## Netlify

1. GitHub-Repository in Netlify importieren.
2. Build Command `npm run build` und Publish Directory `dist` verwenden.

`public/_redirects` wird beim Build nach `dist/_redirects` kopiert und aktiviert den SPA-Fallback.

## GitHub Pages

GitHub Pages ist moeglich, braucht wegen der pfadbasierten Routen jedoch eine zusaetzliche 404-Fallback-Loesung oder Hash-Routing. Fuer die erste Portfolio-Demo sind Vercel oder Netlify deshalb robuster.

## Verifikation

Nach dem Deployment diese URLs direkt aufrufen und neu laden:

- `/`
- `/case-study`
- `/status/storytelling-heute`
- `/?view=reports&project=kunst-des-satzes`
