"use client";

interface ResultCardProps {
  label: string;
  value: string | number;
  sublabel?: string;
  variant?: 'default' | 'success' | 'warning' | 'neutral';
  size?: 'normal' | 'large';
}

/* A tile inside the outputs readout: status colours are allowed as text
   here because the ground is navy deep in both themes */
export function ResultCard({ label, value, sublabel, variant = 'default', size = 'normal' }: ResultCardProps) {
  const variantStyles = {
    default: 'text-accent-text',
    success: 'text-success',
    warning: 'text-error',
    neutral: 'text-text-strong',
  };
  const sizeStyles = { normal: 'text-2xl', large: 'text-3xl' };

  return (
    <div className="bg-surface-card rounded-lg p-3 flex flex-col items-center justify-center text-center min-h-[80px] min-w-0">
      <div className="text-[11px] text-text-body uppercase tracking-wide mb-0.5">{label}</div>
      <div className={`font-bold roi-result-value ${sizeStyles[size]} ${variantStyles[variant]}`}>{value}</div>
      {sublabel && <div className="text-[11px] text-text-dim mt-0.5">{sublabel}</div>}
    </div>
  );
}
