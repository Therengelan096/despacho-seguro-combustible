"use client";

import { SelectHTMLAttributes, forwardRef } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, id, children, ...props }, ref) => {
    const selectId = id ?? props.name;
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={selectId} className="text-sm font-medium text-estacion-800">
            {label}
          </label>
        )}
        <div className="relative">
          <select
            id={selectId}
            ref={ref}
            className={cn(
              "h-11 w-full appearance-none rounded-xl border border-arena-200 bg-white px-3.5 pr-9 text-sm text-estacion-900 outline-none transition-colors",
              "focus:border-ambar-500 focus:ring-2 focus:ring-ambar-500/20",
              error && "border-riesgo-600 focus:border-riesgo-600 focus:ring-riesgo-600/20",
              className
            )}
            {...props}
          >
            {children}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-estacion-600" />
        </div>
        {error && <span className="text-xs text-riesgo-600">{error}</span>}
      </div>
    );
  }
);
Select.displayName = "Select";
