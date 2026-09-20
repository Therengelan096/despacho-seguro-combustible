import { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-panel border border-arena-200 bg-white shadow-[0_1px_0_rgba(12,20,22,0.04)]",
        className
      )}
      {...props}
    />
  );
}

/** Barra de título estilo "placa de estación" usada para separar secciones de un formulario */
export function SectionHeader({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-lg bg-petroleo-700 px-4 py-2.5">
      <h3 className="text-sm font-semibold tracking-wide text-white">{children}</h3>
    </div>
  );
}
