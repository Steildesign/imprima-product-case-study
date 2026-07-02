export function LogoMark() {
  return (
    <span className="logo-mark" aria-hidden="true">
      <span className="logo-facet logo-facet-top" />
      <span className="logo-facet logo-facet-stem" />
      <span className="logo-facet logo-facet-bottom" />
    </span>
  );
}

export function Wordmark() {
  return (
    <span className="wordmark">
      <LogoMark />
      <span className="wordmark-text">IMPRIMA</span>
    </span>
  );
}
