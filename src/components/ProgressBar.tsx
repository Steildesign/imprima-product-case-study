interface ProgressBarProps {
  value: number;
  label?: string;
}

export function ProgressBar({ value, label }: ProgressBarProps) {
  const normalized = Math.max(0, Math.min(100, value));

  return (
    <div
      className="progress-wrap"
      role="progressbar"
      aria-label={label ?? `Fortschritt ${normalized}%`}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={normalized}
    >
      <span className="progress-track">
        <span className="progress-fill" style={{ width: `${normalized}%` }} />
      </span>
      <span className="progress-value">{normalized}%</span>
    </div>
  );
}
