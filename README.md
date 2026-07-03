# Imprima

Imprima ist ein klickbarer UX/Product-Case-Study-Prototyp fuer professionelle Buchproduktion. Die App zeigt, wie Herstellung, Redaktion und externe Beteiligte Produktionsstand, Satzaufwand, Korrekturen, Freigaben und Statusberichte in einer schlanken Oberflaeche nachvollziehen koennen.

## Features

- Projektuebersicht mit Fortschritt, Risiko, Status und Satzprofil
- Buch-Cockpit fuer Kapitel, Korrekturen, Preflight und Timeline-Risiko
- Satzprofile: Linearer Satz, Bildintegrierter Satz, Komplexes Seitenlayout
- Projektanlage mit realistischen Mock-Daten
- Teilbare Produktionsstatus-Seite fuer Redaktion und Autor:innen
- Portfolio-Case-Study-Seite ausserhalb der App-Shell
- Statischer React/Vite-Prototyp ohne Backend

## Routen

- `/` Produkt-Prototyp
- `/case-study` Portfolio-Case-Study
- `/status/storytelling-heute` Beispiel fuer eine externe Produktionsstatus-Seite

## Lokal Starten

```bash
npm install
npm run dev
```

Vite startet standardmaessig lokal unter `http://127.0.0.1:5173/`.

## Qualitaet Pruefen

```bash
npm test
npm run build
```

## Deployment

Empfohlen: Vercel oder Netlify, weil direkte SPA-Routen wie `/case-study` und `/status/storytelling-heute` dort einfach per Fallback auf `index.html` funktionieren.

GitHub Pages ist ebenfalls moeglich, braucht aber eine SPA-Fallback-Konfiguration oder Hash-Routing, damit direkte Unterseiten nach Reload nicht als 404 enden.

Weitere Hinweise stehen in [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md).

## Open-Source-Hinweis

Der Quellcode ist unter MIT lizenziert. Markenassets, Logo, UI-Kit-Bilder und Case-Study-Inhalte sind davon ausgenommen und nicht automatisch zur freien Wiederverwendung lizenziert. Details stehen in [ASSET_LICENSE.md](ASSET_LICENSE.md).

## Scope

Imprima ist ein statischer Portfolio-Prototyp. Es gibt kein Backend, keine Authentifizierung, keine Datenbank, keinen echten PDF-Export und keine echte WCAG-/Preflight-Analyse. Alle Daten sind lokale Mock-Daten.
