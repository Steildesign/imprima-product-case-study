import type { ReactNode } from "react";
import type { NavIconName } from "../domain/navigation";

interface IconProps {
  name: NavIconName;
}

const paths: Record<NavIconName, ReactNode> = {
  overview: (
    <>
      <path d="M4 5h7v6H4z" />
      <path d="M13 5h7v4h-7z" />
      <path d="M13 11h7v8h-7z" />
      <path d="M4 13h7v6H4z" />
    </>
  ),
  projects: (
    <>
      <path d="M4 6.5h6l1.7 2H20v9H4z" />
      <path d="M4 9h16" />
    </>
  ),
  tasks: (
    <>
      <path d="m5 7 1.7 1.7L10 5.5" />
      <path d="M13 7h6" />
      <path d="m5 13 1.7 1.7 3.3-3.2" />
      <path d="M13 13h6" />
      <path d="M13 18h6" />
    </>
  ),
  corrections: (
    <>
      <path d="M5 17.5 6.2 13 16 3.2l3 3L9.2 16z" />
      <path d="m14.5 4.7 3 3" />
      <path d="M5 20h14" />
    </>
  ),
  approval: (
    <>
      <path d="M12 3.5 18 6v5.1c0 3.8-2.2 6.8-6 8.4-3.8-1.6-6-4.6-6-8.4V6z" />
      <path d="m8.8 12 2.1 2.1 4.4-4.6" />
    </>
  ),
  files: (
    <>
      <path d="M7 3.8h6l4 4V20H7z" />
      <path d="M13 3.8V8h4" />
      <path d="M10 12h4.5" />
      <path d="M10 16h4.5" />
    </>
  ),
  calendar: (
    <>
      <path d="M6 5h12v14H6z" />
      <path d="M6 9h12" />
      <path d="M9 3.5V6" />
      <path d="M15 3.5V6" />
      <path d="M9 13h1.5" />
      <path d="M13.5 13H15" />
    </>
  ),
  reports: (
    <>
      <path d="M5 19V5" />
      <path d="M5 19h14" />
      <path d="M8.5 16v-4" />
      <path d="M12 16V8" />
      <path d="M15.5 16v-6" />
      <path d="M8 7.5h8" />
    </>
  ),
  communication: (
    <>
      <path d="M5 6h14v9H9l-4 4z" />
      <path d="M8.5 10h7" />
      <path d="M8.5 13h4.5" />
    </>
  ),
};

export function Icon({ name }: IconProps) {
  return (
    <svg className="nav-icon" aria-hidden="true" viewBox="0 0 24 24">
      {paths[name]}
    </svg>
  );
}
