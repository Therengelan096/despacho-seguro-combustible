"use client";

import { useMemo, useState } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Search } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Recarga } from "@/types/recarga";

// Datos de ejemplo — reemplazar por services/recargas.ts (GET)
const data: Recarga[] = [
  { id: "1", fecha: "2026-09-10 08:12", placa: "1234-ABC", propietario: "Juana Quispe", litros: 32.4, monto: 120.53, estado: "completada" },
  { id: "2", fecha: "2026-09-10 09:47", placa: "5678-XYZ", propietario: "Mario Condori", litros: 18.1, monto: 67.33, estado: "completada" },
  { id: "3", fecha: "2026-09-09 17:20", placa: "9012-QRS", propietario: "Elsa Mamani", litros: 40.0, monto: 148.8, estado: "pendiente" },
  { id: "4", fecha: "2026-09-09 15:03", placa: "3456-LMN", propietario: "Freddy Choque", litros: 12.6, monto: 46.87, estado: "rechazada" },
];

const estadoStyles: Record<Recarga["estado"], string> = {
  completada: "bg-exito-600/10 text-exito-600",
  pendiente: "bg-ambar-500/10 text-ambar-600",
  rechazada: "bg-riesgo-600/10 text-riesgo-600",
};

const columns: ColumnDef<Recarga>[] = [
  { accessorKey: "fecha", header: "Fecha" },
  {
    accessorKey: "placa",
    header: "Placa",
    cell: (info) => <span className="font-mono">{info.getValue<string>()}</span>,
  },
  { accessorKey: "propietario", header: "Propietario" },
  {
    accessorKey: "litros",
    header: "Litros",
    cell: (info) => info.getValue<number>().toFixed(2),
  },
  {
    accessorKey: "monto",
    header: "Monto (Bs)",
    cell: (info) => info.getValue<number>().toFixed(2),
  },
  {
    accessorKey: "estado",
    header: "Estado",
    cell: (info) => {
      const estado = info.getValue<Recarga["estado"]>();
      return (
        <span className={cn("rounded-full px-2.5 py-1 text-xs font-medium capitalize", estadoStyles[estado])}>
          {estado}
        </span>
      );
    },
  },
];

export default function HistorialPage() {
  const [filtro, setFiltro] = useState("");

  const table = useReactTable({
    data,
    columns,
    state: { globalFilter: filtro },
    onGlobalFilterChange: setFiltro,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  const totalLitros = useMemo(() => data.reduce((sum, r) => sum + r.litros, 0), []);

  return (
    <div className="mx-auto max-w-5xl px-8 py-12">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-ambar-600">
        Historial
      </p>
      <h1 className="mt-2 font-display text-3xl font-semibold text-estacion-950">
        Historial de recargas
      </h1>
      <p className="mt-1 text-sm text-estacion-600">
        {data.length} recargas · {totalLitros.toFixed(2)} litros despachados
      </p>

      <div className="mt-6 max-w-xs">
        <Input
          placeholder="Buscar por placa o propietario"
          icon={<Search className="h-4 w-4" />}
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
        />
      </div>

      <Card className="mt-6 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-arena-50 text-estacion-600">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="px-6 py-3 font-medium">
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-arena-200">
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="hover:bg-arena-50">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-6 py-3 text-estacion-800">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
