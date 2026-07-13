import { Button } from "./Button";

export interface ActionNoticeModel {
  id: number;
  message: string;
  onUndo?: () => void;
}

export function ActionNotice({ notice, onDismiss }: { notice: ActionNoticeModel; onDismiss: () => void }) {
  return (
    <aside className="action-notice" role="status" aria-live="polite">
      <span className="action-notice-mark" aria-hidden="true">✓</span>
      <strong>{notice.message}</strong>
      {notice.onUndo && (
        <Button variant="tertiary" onClick={notice.onUndo}>
          Rückgängig
        </Button>
      )}
      <button type="button" className="action-notice-close" aria-label="Meldung schließen" onClick={onDismiss}>
        ×
      </button>
    </aside>
  );
}
