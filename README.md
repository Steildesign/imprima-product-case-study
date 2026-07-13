# Imprima

Imprima ist ein klickbarer UX/Product-Case-Study-Prototyp fuer professionelle Buchproduktion. Das Dashboard verbindet Projektsteuerung, Satzaufwand, Korrekturen, Freigaben, Produktionsplanung, Budgetsignale und externe Statuskommunikation in einer konsistenten Arbeitsoberflaeche.

## Produktumfang

- Projektuebersicht mit Fortschritt, Risiko, Status, ISBN, Titelnummer und Budgetsignal
- Buch-Cockpit mit editierbarer Kapitelstruktur und synchronisierten Projektwerten
- Satzprofile: Linearer Satz, Bildintegrierter Satz und Komplexes Seitenlayout
- Plan/Ist-Vergleich des Satzmixes inklusive Auftragsabweichung
- Projektanlage mit Verlagsschaetzung, Seitenpreisen und lokalen Mock-Daten
- Aufgabensteuerung mit Detailansicht, Statuswechsel und Undo-Rueckmeldung
- Korrektur- und Freigabe-Flow mit Preflight- und Risikosicht
- Taggenaue Produktions-Timeline fuer lange Laufzeiten, Kapazitaet und Urlaub
- Projektberichte, priorisierte Kommunikation und Imprima Assist
- Teilbare Statusseite fuer Redaktion und Autor:innen
- Separate Portfolio-Case-Study ausserhalb der App-Shell

## Technischer Scope

Der Prototyp basiert auf React, TypeScript und Vite. Veraenderte Projekte, Kapitel und Aufgaben werden im Browser per `localStorage` gespeichert. Es gibt bewusst kein Backend, keine Authentifizierung, keine Datenbank, keinen echten PDF-Export und keine produktive KI- oder Preflight-Schnittstelle.

## Routen

- `/` Produkt-Prototyp
- `/?view=projects&project=kunst-des-satzes` direktes Projektcockpit
- `/case-study` Portfolio-Case-Study
- `/status/storytelling-heute` externe Beispiel-Statusseite

## Lokal starten

Voraussetzung: Node.js 20.19 oder neuer.

```bash
npm ci
npm run dev
```

Vite startet standardmaessig unter `http://127.0.0.1:5173/`. Falls der Port belegt ist, waehlt Vite automatisch den naechsten freien Port.

## Qualitaet pruefen

```bash
npm run check
```

Der Befehl fuehrt die Vitest-Suite aus und erstellt anschliessend den produktiven TypeScript/Vite-Build.

## Deployment

Vercel und Netlify sind fuer die Portfolio-Demo vorbereitet. `vercel.json` und `public/_redirects` leiten direkte SPA-Routen wie `/case-study` und `/status/...` auf `index.html` zurueck.

Weitere Hinweise stehen in [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md).

## Lizenz

Der Quellcode steht unter der MIT-Lizenz. Imprima-Logo, Markenassets, UI-Kit-Bilder und Case-Study-Inhalte sind davon ausgenommen. Details stehen in [ASSET_LICENSE.md](ASSET_LICENSE.md).
