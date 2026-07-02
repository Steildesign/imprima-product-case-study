# Imprima App + Portfolio Case Study Design

Stand: 2026-07-02

## Ziel

Imprima wird als klickbarer, deutschsprachiger Portfolio-Prototyp gebaut: eine realistisch wirkende Desktop-Produkt-App fuer Buchproduktion plus eine Case-Study-Seite, die Problem, Prozess, Designentscheidungen und UI-System erklaert.

Das Projekt basiert auf realer Verlagserfahrung, bleibt aber ein Eigenprojekt mit Mock-Daten. Es soll Produktdenken, Domaenenverstaendnis und visuelle Umsetzung zeigen, ohne Backend-Komplexitaet einzufuehren.

## Produktthese

Imprima ist eine zentrale Produktionsuebersicht, die jeder Rolle im Buchprozess zeigt, wo jedes Kapitel steht, wer worauf wartet und ob der Drucktermin haelt.

Die Kernbotschaft der Case Study lautet: Eine einzige Quelle der Wahrheit ersetzt E-Mail-Threads, Excel-Listen, PDF-Markups und muendliche Zurufe.

## Zielgruppen

- Katrin, Herstellungsleitung: braucht eine schnelle Uebersicht ueber Titel, Deadlines, Engpaesse und Risiko.
- Markus, Setzer / Mediengestalter: braucht eine klare Arbeitsschlange mit aktuellem Stand, Korrektureingang und Version.
- Sabine, Redakteurin: braucht Kontrolle ueber Korrekturlaufe, Freigaben und offene Rueckmeldungen.

Autor:innen koennen in Kommentaren und Verantwortlichkeiten vorkommen, sind aber keine Hauptnutzer der App.

## Umfang

Der Prototyp besteht aus zwei Bereichen:

1. Produktprototyp
   - Projektuebersicht
   - Buch-Cockpit
   - Korrektur- und Freigabe-Flow
   - Preflight und Druckfreigabe
   - kompakte Produktions-Timeline mit Risiko

2. Portfolio Case Study
   - Hero mit Logo, Claim und Kurzpositionierung
   - Ausgangslage und Problem
   - Personas und Jobs to be Done
   - Prozess: Flow, Struktur, Hi-Fi-System
   - Designentscheidungen
   - Design-System und Komponenten
   - Produkt-Screens
   - Reflexion und Ausblick

## Nicht im Scope

- Kein Backend
- Keine Datenbank
- Kein Login
- Keine echte Rechteverwaltung
- Keine Datei-Uploads
- Keine InDesign-, PDF- oder WCAG-Pruefung mit echter Analyse
- Kein Chat
- Keine Rechnungen oder kaufmaennischen Workflows

Diese Punkte koennen als Ausblick in der Case Study erscheinen, werden aber nicht funktional gebaut.

## Navigationsmodell

Die App startet auf der Projektuebersicht. Von dort fuehrt ein Klick auf ein Projekt ins Buch-Cockpit. Im Buch-Cockpit wechseln Tabs zwischen Uebersicht, Korrekturen, Preflight und Risiko. Die Case Study ist ueber einen klaren Navigationspunkt erreichbar und wirkt wie die Portfolio-Praesentation des Produkts, nicht wie ein Einstellungsbereich der App.

Empfohlene Hauptnavigation:

- Uebersicht
- Projekte
- Aufgaben
- Korrekturen
- Freigaben
- Dateien
- Kalender
- Berichte
- Case Study

Die Navigationssprache orientiert sich am gelieferten Imprima UI Kit: linke Navy-Sidebar, aktive Zustaende in Marken-Gruen, kompakte Zeilen und klare Icons.

## Screen 1: Projektuebersicht

Zweck: Katrin sieht alle laufenden Titel, sortiert nach Dringlichkeit und Risiko.

Inhalte:

- Suchfeld fuer Titel, Verlag oder ISBN
- Filter fuer Verlag, Phase und Risiko
- Button "Neues Projekt" als nicht-funktionaler Primaerbutton
- Tabelle oder tabellenartige Karten mit Titel, Verlag, Seiten, Deadline, Fortschritt, Status und Risiko
- Pagination oder kompakter Ergebniszaehler

Interaktionen:

- Klick auf ein Projekt oeffnet das Buch-Cockpit.
- Filterchips veraendern sichtbar die dargestellte Liste.
- Risiko-Filter zeigt nur gelbe und rote Projekte.

## Screen 2: Buch-Cockpit

Zweck: Ein Titel wird mit allen wichtigen Dimensionen auf einer Seite steuerbar.

Inhalte:

- Breadcrumb "Projekte > Titel"
- Titel, Verlag, ISBN, Seitenumfang, Deadline und Projektleitung
- Status-Badge, Gesamtfortschritt, Deadline-Countdown
- Kapitel-Tabelle mit Kapitelname, Seitenbereich, verantwortlicher Person, Status, aktuellem Korrekturlauf, Blocker-Hinweis und Risiko
- Seitenkarte fuer Projektfortschritt
- Team-/Verantwortlichenkarte
- Blocker-Karte mit kritischen Hinweisen

Interaktionen:

- Tabs wechseln zwischen Uebersicht, Korrekturen, Preflight und Risiko.
- Kapitelzeilen koennen einen Detailzustand hervorheben, muessen aber keinen eigenen Vollscreen oeffnen.

## Screen 3: Korrektur- und Freigabe-Flow

Zweck: Der kritischste Mikro-Loop wird sichtbar: V1, V2, Autorenkorrektur, Schlusskorrektur, Freigabe.

Inhalte:

- horizontale Fortschrittsleiste mit Schritten
- aktueller Schritt mit Verantwortlichem, Faelligkeit und Fortschritt
- Ablaufkarte mit erledigten, aktiven und geplanten Stationen
- Feedback- und Kommentarspalte
- Versionschip "gilt jetzt"
- offene Punkte und Blocker

Interaktionen:

- Klick auf Schritte aktualisiert die Detailkarte.
- Kommentare koennen als bereits vorhandene Mock-Kommentare angezeigt werden.

## Screen 4: Preflight und Druckfreigabe

Zweck: Imprima zeigt den Uebergang in die Druckvorstufe und bindet Barrierefreiheit als Produkt-Schritt ein.

Inhalte:

- Preflight-Tabs: PDF-Export, Bericht, Freigabe
- Checkliste mit PDF/X-Konformitaet, eingebetteten Schriften, Barrierefreiheit WCAG 2.1, Bildaufloesung, Farbraum, Links und Dokumentinformationen
- Ergebnis-Karte mit Erfolg, Teilwarnungen oder Blocker
- Button "Druckfreigabe erteilen"
- Button "Bericht herunterladen" als nicht-funktionaler Sekundaerbutton

Interaktionen:

- Preflight erneut ausfuehren kann den Status visuell aktualisieren oder einen bestaetigenden Zustand zeigen.
- Druckfreigabe oeffnet eine leichte Bestaetigung innerhalb des Screens, kein komplexer Modal-Flow.

## Screen 5: Produktions-Timeline und Risiko

Zweck: Herstellung sieht, ob der Termin ueber Titel und Phasen hinweg haelt.

Inhalte:

- kompakte Gantt-artige Timeline
- Titelzeilen mit Status-Badge
- Phasenbalken fuer Satz, Korrektur, Preflight und Freigabe
- Meilensteine fuer kritische Termine
- Risiko-Ueberblick mit hoch, mittel und niedrig

Interaktionen:

- Auswahl eines Titels kann die Risiko-Zusammenfassung aktualisieren.

## Case-Study-Seite

Die Case Study ist deutsch, klar und portfolio-tauglich. Sie soll sich an der bestehenden TYMETRA-Praesentation orientieren, aber Imprima als eigenstaendiges Produkt zeigen.

Struktur:

1. Hero: Logo, Claim "Struktur schaffen. Korrekturen steuern. Druckfreigabe sichern.", Kurztext und Produkt-Screenshot
2. Problem: Flickenteppich aus E-Mail, Excel, PDF-Markup, InDesign-Staenden und Zurufen
3. Zielgruppen: Katrin, Markus, Sabine
4. Prozess: Makro-Flow Manuskript bis Druckfreigabe und Mikro-Loop Korrekturlauf
5. Designentscheidungen: Quelle der Wahrheit, eindeutiger Kapitelstatus, getrennte Sprachen fuer Zustand und Risiko, Sans im Tool, Barrierefreiheit als Produkt-Schritt, Gruen als Zielzustand
6. UI-System: Farben, Typografie, Status, Buttons, Formulare, Tabellen, Grid, Komponenten
7. Produkt-Screens: Projektuebersicht, Buch-Cockpit, Korrektur-Flow, Preflight, Timeline
8. Reflexion: Was der Prototyp zeigt und welche Integrationen spaeter denkbar sind

Meta-Block:

- Kunde: Eigenprojekt
- Disziplin: UX/UI, Product Design
- Jahr: 2026
- Rolle: Konzept, UX, UI, Design-System
- Typ: Case Study, basiert auf realer Verlagserfahrung
- Oekosystem: Desktop-Dashboard, optionaler Mobile-Check-in als Ausblick

## Design-System

Die gelieferten Boards "Imprima Ui UX Kit.png" und "Imprima_Logo_und_visuelle_Idenditaet.png" sind verbindliche visuelle Referenz.

Tokens:

- Marken-Gruen: #079D38
- Positiv-Gruen: #4FCF97
- Satz-Blau: #2F8DED
- Tiefes Navy: final als ein Token im Code definieren; Referenzbereich #0D1227 bis #0D172A
- Warmgrau: #F3F4EF
- Soft Grey: #CFCDD4
- Weiss: #FFFFFF

Typografie:

- Inter fuer Interface und Wortmarken-Anmutung
- grosse Headline- und Markenbereiche mit grosszuegigem Letterspacing
- Tabellen, Zahlen und Deadlines mit tabellarischen Ziffern

Status-System:

- Offen: neutraler grauer Badge
- Im Satz: blauer Badge
- In Korrektur: bernstein/orangefarbener Badge
- Final: Positiv-Gruen als Umriss mit Haken
- Preflight: violetter Badge
- Freigegeben: Positiv-Gruen gefuellt mit Haken
- Blocker: roter Umriss- oder Warnbadge

Risiko-System:

- Risiko ist kein Badge, sondern ein Punkt- oder Ampelsystem.
- Gruen bedeutet im Plan.
- Gelb bedeutet Puffer knapp.
- Rot bedeutet Termin gefaehrdet.
- Status und Risiko bleiben visuell getrennt.

Komponenten:

- Sidebar
- Topbar / Breadcrumb
- Projekt-Tabelle
- Status-Badge
- Risiko-Punkte
- Fortschrittsbalken
- Deadline-Countdown
- Kapitelzeile
- Personen-Chip / Avatar
- Tab-Leiste
- Korrekturlauf-Zeitleiste
- Versionschip
- Kommentar- und Blocker-Karte
- Preflight-Checklisten-Item
- Timeline-Balken
- Primaer-, Sekundaer- und Tertiaerbutton

## Logo und Assets

Die App soll die Imprima-Marke sichtbar tragen. Falls keine separate transparente Logo-Datei oder SVG vorliegt, wird fuer den Prototyp eine saubere CSS/SVG-nahe Annaherung des facettierten I-Zeichens plus typografische Wortmarke erstellt. Die Case Study kann die gelieferten Boards als Referenzbilder nutzen, sofern sie innerhalb des Projektordners als Assets abgelegt werden.

Eine spaetere Version sollte das finale Logo als SVG oder transparentes PNG ersetzen.

## Mock-Daten

Die Daten werden lokal gepflegt und sollen realistisch, aber frei erfunden sein.

Beispielhafte Projekte:

- Die Kunst des Satzes, Verlag Zukunft, 312 Seiten, Status Im Satz, Risiko mittel
- Digital Mindset, Nova Books, 248 Seiten, Status In Korrektur, Risiko hoch
- Nachhaltig handeln, Gruen Verlag, 196 Seiten, Status Preflight, Risiko niedrig
- Storytelling heute, Vision Media, 276 Seiten, Status Im Satz, Risiko mittel
- Design Thinking im Unterricht, Nova Books, 224 Seiten, Status Offen, Risiko niedrig

Rollen:

- M. Schneider, Projektleiter
- J. Wegner, Satz
- L. Bauer, Korrektorat
- S. Klein, Autor
- S. Reuter, Redaktion

Die Daten sollen mindestens einen kritischen Blocker, einen fast fertigen Preflight und einen aktiven Autorenkorrektur-Schritt enthalten.

## Architektur

Empfohlener Stack:

- React
- Vite
- TypeScript, wenn im Projekt ohne Reibung verfuegbar
- lokale CSS-Dateien mit Design-Tokens
- lucide-react fuer Icons, falls installiert oder installierbar
- keine schwere UI-Bibliothek

Komponentenstruktur:

- App-Shell mit Navigation
- Datenmodul fuer Mock-Projekte
- Screen-Komponenten fuer Prototyp-Ansichten
- Case-Study-Komponenten
- wiederverwendbare UI-Komponenten fuer Badge, Button, Table, Progress, Timeline und Risk

## Datenfluss

Alle Mock-Daten liegen statisch im Frontend. Der aktuelle Screen, aktive Tabs, Filter und ausgewaehlte Projekte werden im lokalen React-State gehalten. Es gibt keine Persistenz. Aktionen wie "Druckfreigabe erteilen" koennen nur den UI-Zustand innerhalb der Session veraendern.

## Fehler-, Leer- und Ladezustaende

Da keine echten Requests existieren, werden Ladezustaende nur dort eingesetzt, wo sie die Produktrealitaet erklaeren, etwa "Preflight wird geprueft". Leere Suchergebnisse bekommen eine kurze, sachliche Empty State Message. Nicht-funktionale Aktionen zeigen keinen Fehler, sondern bleiben als Prototyp-Buttons sichtbar.

## Barrierefreiheit und UX-Qualitaet

- ausreichende Kontraste fuer Text, Buttons und Statusanzeigen
- Status nicht nur ueber Farbe, sondern auch ueber Text und Symbole
- klickbare Elemente mit sichtbarem Fokuszustand
- semantische Buttons und Tabellen, soweit praktisch
- keine ueberlappenden Texte bei Desktop- und mobilen Breiten
- responsive Verhalten mindestens fuer Desktop und Tablet; Mobile als einfache gestapelte Ansicht, nicht als vollstaendige Mobile-App

## Verifikation

Vor Abschluss der Umsetzung:

- App lokal starten
- Build ausfuehren
- Hauptflow manuell pruefen: Projektuebersicht -> Buch-Cockpit -> Korrekturen -> Preflight -> Case Study
- Screenshot-Pruefung auf Desktop-Breite
- mobile oder schmale Breite kurz pruefen, damit nichts ueberlappt
- Textfehler und Platzhalter suchen

## Offene Entscheidung

Der Arbeitsordner ist aktuell kein Git-Repository. Wenn GitHub vorbereitet werden soll, muss spaeter entschieden werden, ob hier ein neues Repo initialisiert oder in ein bestehendes Portfolio-Repo integriert wird.
