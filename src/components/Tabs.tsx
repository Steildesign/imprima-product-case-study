interface TabItem<TId extends string> {
  id: TId;
  label: string;
  disabled?: boolean;
}

interface TabsProps<TId extends string> {
  items: ReadonlyArray<TabItem<TId>>;
  activeId: TId;
  onChange: (id: TId) => void;
}

export function Tabs<TId extends string>({ items, activeId, onChange }: TabsProps<TId>) {
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
