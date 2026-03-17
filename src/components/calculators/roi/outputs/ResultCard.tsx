"use client";

interface ResultCardProps {
  label: string;
  value: string | number;
  sublabel?: string;
  variant?: 'default' | 'success' | 'warning' | 'neutral';
  size?: 'normal' | 'large';
}

export function ResultCard({ label, value, sublabel, variant = 'default', size = 'normal' }: ResultCardProps) {
  const variantStyles = {
    default: 'text-[var(--roi-accent)]',
    success: 'text-[var(--roi-benefit)]',
    warning: 'text-[var(--roi-cost)]',
    neutral: 'text-[var(--roi-text-primary)]',
  };
  const sizeStyles = { normal: 'text-2xl', large: 'text-3xl' };

  return (
    <div className="roi-card p-3 flex flex-col items-center justify-center text-center min-h-[80px]">
      <div className="text-[10px] text-[var(--roi-text-secondary)] uppercase tracking-wide mb-0.5">{label}</div>
      <div className={`font-bold roi-result-value ${sizeStyles[size]} ${variantStyles[variant]}`}>{value}</div>
      {sublabel && <div className="text-[10px] text-[var(--roi-text-muted)] mt-0.5">{sublabel}</div>}
    </div>
  );
}
