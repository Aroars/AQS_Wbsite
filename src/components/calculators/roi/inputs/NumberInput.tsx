"use client";
import { useState, useEffect, useRef } from 'react';
import { formatCurrency, formatNumber, parseCurrency, parseNumber } from '../format';
import { Tooltip } from '../Tooltip';

interface NumberInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  type?: 'currency' | 'number' | 'percent';
  min?: number;
  max?: number;
  step?: number;
  suffix?: string;
  decimals?: number;
  className?: string;
  tooltip?: React.ReactNode;
  isDefault?: boolean;
}

export function NumberInput({
  label, value, onChange, type = 'number', min, max, step = 1,
  suffix, decimals = 0, className = '', tooltip, isDefault = false,
}: NumberInputProps) {
  const [displayValue, setDisplayValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isFocused) {
      if (type === 'currency') setDisplayValue(formatCurrency(value, decimals));
      else if (type === 'percent') setDisplayValue(formatNumber(value * 100, decimals));
      else setDisplayValue(formatNumber(value, decimals));
    }
  }, [value, type, decimals, isFocused]);

  const handleFocus = () => {
    setIsFocused(true);
    setDisplayValue(type === 'percent' ? String(value * 100) : String(value));
    setTimeout(() => inputRef.current?.select(), 0);
  };

  const handleBlur = () => {
    setIsFocused(false);
    let parsed: number;
    if (type === 'currency') parsed = parseCurrency(displayValue);
    else if (type === 'percent') parsed = parseNumber(displayValue) / 100;
    else parsed = parseNumber(displayValue);
    if (min !== undefined && parsed < min) parsed = min;
    if (max !== undefined && parsed > max) parsed = max;
    onChange(parsed);
  };

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <label className={`text-sm text-[var(--roi-text-secondary)] ${!label ? 'hidden' : ''}`}>
        {tooltip ? <Tooltip content={tooltip}>{label}</Tooltip> : label}
      </label>
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          inputMode="decimal"
          value={displayValue}
          onChange={(e) => setDisplayValue(e.target.value)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          step={step}
          className={`roi-input w-full h-10 px-3 rounded-md text-right ${isDefault ? 'roi-is-default' : ''}`}
        />
        {suffix && !isFocused && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--roi-text-muted)] pointer-events-none">{suffix}</span>
        )}
      </div>
    </div>
  );
}
