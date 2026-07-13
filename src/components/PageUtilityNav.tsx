import { Button } from "./Button";

interface PageUtilityNavProps {
  backLabel?: string;
  onBack?: () => void;
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

export function PageUtilityNav({ backLabel = "Zurück", onBack }: PageUtilityNavProps) {
  return (
    <nav className="page-utility-nav" aria-label="Seitennavigation">
      {onBack && (
        <Button variant="secondary" className="button-nav button-nav-back" onClick={onBack}>
          <span className="button-symbol" aria-hidden="true">
            ←
          </span>
          <span>{backLabel}</span>
        </Button>
      )}
      <Button variant="tertiary" className="button-nav button-nav-top" onClick={scrollToTop}>
        <span className="button-symbol" aria-hidden="true">
          ↑
        </span>
        <span>Nach oben</span>
      </Button>
    </nav>
  );
}
