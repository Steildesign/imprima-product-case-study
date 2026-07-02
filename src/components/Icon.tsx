interface IconProps {
  name:
    | "overview"
    | "projects"
    | "tasks"
    | "corrections"
    | "approval"
    | "files"
    | "calendar"
    | "reports"
    | "case";
}

export function Icon({ name }: IconProps) {
  return <span className={`nav-icon nav-icon-${name}`} aria-hidden="true" />;
}
