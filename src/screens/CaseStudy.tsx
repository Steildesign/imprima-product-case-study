import { Wordmark } from "../components/Brand";
import { Button } from "../components/Button";

interface CaseStudyProps {
  onOpenPrototype: () => void;
}

const decisions = [
  "Eine Quelle der Wahrheit statt fünf verstreuter Kanäle.",
  "Ein eindeutiger Status je Kapitel erzwingt Klarheit im Team.",
  "Zustand, Risiko und Marke erhalten getrennte visuelle Rollen.",
  "Inter bleibt im Tool, weil Datendichte Ruhe und Lesbarkeit braucht.",
  "Barrierefreiheit ist ein Produkt-Schritt, kein Nachgedanke.",
  "Grün ist Zielzustand: Am Ende steht die Freigabe.",
];

const personas = [
  {
    name: "Katrin",
    role: "Herstellung",
    text: "Alle laufenden Titel, Deadlines und Risiken auf einen Blick.",
  },
  {
    name: "Markus",
    role: "Satz",
    text: "Eine klare Arbeitsschlange mit aktuellem Stand und Korrektureingang.",
  },
  {
    name: "Sabine",
    role: "Redaktion",
    text: "Korrekturläufe, Versionen und wartende Freigaben nachvollziehen.",
  },
];

const processSteps = ["Manuskript", "Satz", "Korrektur", "Freigabe", "Preflight", "WCAG-PDF", "Druckfreigabe"];

export function CaseStudy({ onOpenPrototype }: CaseStudyProps) {
  return (
    <article className="case-study">
      <section className="case-hero">
        <div>
          <p className="eyebrow">UX/UI | Product Design | 2026</p>
          <Wordmark />
          <h1>Struktur schaffen. Korrekturen steuern. Druckfreigabe sichern.</h1>
          <p>
            Imprima ist ein Dashboard für professionelle Buchproduktion. Von Satz über Korrektur bis zur Druckfreigabe
            macht es sichtbar, wo jedes Kapitel steht, wer worauf wartet und ob der Termin hält.
          </p>
          <Button onClick={onOpenPrototype}>Prototyp ansehen</Button>
        </div>

        <div className="case-meta">
          <dl>
            <div>
              <dt>Kunde</dt>
              <dd>Eigenprojekt</dd>
            </div>
            <div>
              <dt>Disziplin</dt>
              <dd>UX/UI, Product Design</dd>
            </div>
            <div>
              <dt>Rolle</dt>
              <dd>Konzept, UX, UI, Design-System</dd>
            </div>
            <div>
              <dt>Typ</dt>
              <dd>Case Study auf realer Verlagserfahrung</dd>
            </div>
          </dl>
        </div>
      </section>

      <section className="case-section case-two-col">
        <div>
          <p className="eyebrow">Ausgangslage</p>
          <h2>Der Status eines 600-Seiten-Bandes liegt heute oft in fünf Systemen.</h2>
        </div>
        <p>
          E-Mail-Threads, Excel-Listen, PDF-Markups, InDesign-Stände und mündliche Zurufe erzeugen Reibung.
          Herstellung, Redaktion und Satz sehen nicht dieselbe Wahrheit. Risiken werden sichtbar, wenn der Drucktermin
          bereits wackelt.
        </p>
      </section>

      <section className="case-section persona-grid" aria-label="Personas">
        <div className="case-section-heading">
          <p className="eyebrow">Personas</p>
          <h2>Herstellung, Satz und Redaktion brauchen dieselbe Sicht.</h2>
        </div>
        {personas.map(({ name, role, text }) => (
          <article className="panel" key={name}>
            <p className="panel-label">{role}</p>
            <h3>{name}</h3>
            <p>{text}</p>
          </article>
        ))}
      </section>

      <section className="case-section flow-band">
        <p className="eyebrow">Prozess</p>
        <h2>Vom Manuskript bis zur Druckfreigabe</h2>
        <ol className="flow-steps">
          {processSteps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      </section>

      <section className="case-section decision-grid">
        <div className="case-section-heading">
          <p className="eyebrow">Designentscheidungen</p>
          <h2>Produktentscheidungen für klare Freigaben.</h2>
        </div>
        {decisions.map((decision, index) => (
          <article className="decision-card" key={decision}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <p>{decision}</p>
          </article>
        ))}
      </section>

      <section className="case-section system-board">
        <div>
          <p className="eyebrow">Design System</p>
          <h2>Grünes Geschwister zu TYMETRA, aber eigenständiges Produkt.</h2>
          <p>
            Marken-Grün führt Interaktionen, Satz-Blau bleibt semantischer Status, Positiv-Grün signalisiert
            Fertigstellung und Freigabe.
          </p>
        </div>
        <img
          src="/brand/imprima-logo-identity.png"
          alt="Imprima Logo-Identität und visuelle Markenbausteine"
          width={1672}
          height={941}
          loading="lazy"
          decoding="async"
        />
        <img
          src="/brand/imprima-ui-kit.png"
          alt="Imprima UI Kit mit Komponenten, Farben und Produktscreens"
          width={1672}
          height={941}
          loading="lazy"
          decoding="async"
        />
      </section>

      <section className="case-section reflection">
        <p className="eyebrow">Reflexion</p>
        <h2>Der Prototyp zeigt den Happy Path, nicht die komplette Verlagssystem-Landschaft.</h2>
        <p>
          Eine spätere Produktversion könnte InDesign-Exports, echte PDF-Prüfungen, Rollenrechte und
          Verlagssystem-Integrationen anbinden. Für die Case Study reicht der klickbare Kern: Sichtbarkeit,
          Korrekturlauf, Risiko und Freigabe.
        </p>
      </section>
    </article>
  );
}
