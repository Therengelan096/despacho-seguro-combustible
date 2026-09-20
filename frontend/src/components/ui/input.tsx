"use client";

import { InputHTMLAttributes, forwardRef, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: ReactNode;
  mono?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, icon, mono, id, ...props }, ref) => {
    const inputId = id ?? props.name;
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-estacion-800">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-estacion-600">
              {icon}
            </span>
          )}
          <input
            id={inputId}
            ref={ref}
            className={cn(
              "h-11 w-full rounded-xl border border-arena-200 bg-white px-3.5 text-sm text-estacion-900 outline-none transition-colors placeholder:text-estacion-600/50",
              "focus:border-ambar-500 focus:ring-2 focus:ring-ambar-500/20",
              icon && "pl-10",
              mono && "font-mono tracking-wide",
              error && "border-riesgo-600 focus:border-riesgo-600 focus:ring-riesgo-600/20",
              className
            )}
            {...props}
          />
        </div>
        {error && <span className="text-xs text-riesgo-600">{error}</span>}
      </div>
    );
  }
);
Input.displayName = "Input";
