interface TabItem {
  id: string;
  label: string;
}

interface TabsProps {
  items: TabItem[];
  activeId: string;
  onChange: (id: string) => void;
}

export function Tabs({ items, activeId, onChange }: TabsProps) {
  return (
    <div className="tabs" role="group" aria-label="Ansichten">
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          aria-pressed={item.id === activeId}
          className={`tab${item.id === activeId ? " is-active" : ""}`}
          onClick={() => onChange(item.id)}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}
