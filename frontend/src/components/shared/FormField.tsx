import type { ReactNode } from 'react';

export const inputClass =
  "rounded-2xl border border-[#e7e8f2] bg-[#f9f9fd] px-4 py-2.5 font-['Quicksand',sans-serif] text-sm text-[#2b3073] placeholder:text-[#a098ae] focus:border-[#4d44b5] focus:outline-none";

interface FormFieldProps {
  label: string;
  children: ReactNode;
  hint?: string;
}

export default function FormField({ label, children, hint }: FormFieldProps) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="font-['Quicksand',sans-serif] text-sm font-semibold text-[#2b3073]">
        {label}
      </span>
      {children}
      {hint && (
        <span className="font-['Quicksand',sans-serif] text-xs text-[#a098ae]">{hint}</span>
      )}
    </label>
  );
}
