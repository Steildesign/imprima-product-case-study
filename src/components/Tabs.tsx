interface TabItem {
  id: string;
  label: string;
  disabled?: boolean;
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
          disabled={item.disabled}
          aria-pressed={item.id === activeId}
          className={`tab${item.id === activeId ? " is-active" : ""}`}
          onClick={() => {
            if (!item.disabled) {
              onChange(item.id);
            }
          }}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}
