import { Button } from "../components/Button";

interface CaseStudyProps {
  onOpenPrototype: () => void;
}

export function CaseStudy({ onOpenPrototype }: CaseStudyProps) {
  return (
    <section className="screen">
      <header className="screen-header">
        <div>
          <p className="eyebrow">Case Study</p>
          <h1>Imprima UX/Product Case Study</h1>
          <p className="muted">Die vollstaendige Case-Study-Seite entsteht im naechsten Task.</p>
        </div>
        <Button onClick={onOpenPrototype}>Prototyp ansehen</Button>
      </header>
    </section>
  );
}
