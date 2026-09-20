"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Fuel, LayoutGrid, Car, Gauge, History, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { href: "/dashboard", icon: LayoutGrid, label: "Inicio" },
  { href: "/dashboard/vehiculos", icon: Car, label: "Vehículos" },
  { href: "/dashboard/bomba", icon: Gauge, label: "Bomba" },
  { href: "/dashboard/historial", icon: History, label: "Historial" },
];

export function DashboardNav() {
  const pathname = usePathname();

  return (
    <nav className="flex h-screen w-16 flex-col items-center justify-between border-r border-estacion-800 bg-estacion-950 py-5">
      <div className="flex flex-col items-center gap-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-ambar-600">
          <Fuel className="h-5 w-5 text-white" />
        </div>

        <div className="flex flex-col items-center gap-1.5">
          {items.map(({ href, icon: Icon, label }) => {
            const active = pathname === href || (href !== "/dashboard" && pathname?.startsWith(href));
            return (
              <Link
                key={href}
                href={href}
                title={label}
                className={cn(
                  "flex h-11 w-11 items-center justify-center rounded-xl transition-colors",
                  active
                    ? "bg-ambar-600 text-white"
                    : "text-white/50 hover:bg-white/5 hover:text-white"
                )}
              >
                <Icon className="h-5 w-5" />
              </Link>
            );
          })}
        </div>
      </div>

      <Link
        href="/dashboard/configuracion"
        title="Configuración"
        className="flex h-11 w-11 items-center justify-center rounded-xl text-white/50 hover:bg-white/5 hover:text-white"
      >
        <Settings className="h-5 w-5" />
      </Link>
    </nav>
  );
}
