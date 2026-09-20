"use client";

import { useEffect, useState } from "react";
import { RadialBarChart, RadialBar, PolarAngleAxis } from "recharts";
import { Play, Square, Droplets } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SurtidorAnimado } from "@/components/bomba/surtidor-animado";

const PRECIO_LITRO = 3.72; // Bs — valor de referencia, vendrá de la API

export default function BombaPage() {
  const [despachando, setDespachando] = useState(false);
  const [litros, setLitros] = useState(0);
  const [nivelTanque, setNivelTanque] = useState(68);

  useEffect(() => {
    if (!despachando) return;
    const interval = setInterval(() => {
      setLitros((prev) => Math.round((prev + 0.15) * 100) / 100);
      setNivelTanque((prev) => Math.max(prev - 0.05, 0));
    }, 150);
    return () => clearInterval(interval);
  }, [despachando]);

  function toggle() {
    if (despachando) {
      setDespachando(false);
    } else {
      setLitros(0);
      setDespachando(true);
    }
  }

  const nivelData = [{ name: "nivel", value: nivelTanque, fill: "var(--color-ambar-500)" }];

  return (
    <div className="mx-auto max-w-5xl px-8 py-12">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-ambar-600">
        Surtidor 01
      </p>
      <h1 className="mt-2 font-display text-3xl font-semibold text-estacion-950">
        Bomba de gasolina
      </h1>
      <p className="mt-1 text-sm text-estacion-600">
        Vista de diseño — la conexión con el hardware y la API se integrará después.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_1.1fr]">
        <Card className="flex flex-col items-center justify-center bg-estacion-950 py-10">
          <SurtidorAnimado despachando={despachando} />
        </Card>

        <div className="flex flex-col gap-6">
          <Card className="grid grid-cols-2 gap-6 p-6">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-estacion-600">
                Litros despachados
              </p>
              <p className="mt-1 font-display text-4xl font-semibold tabular-nums text-estacion-950">
                {litros.toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-estacion-600">
                Monto (Bs)
              </p>
              <p className="mt-1 font-display text-4xl font-semibold tabular-nums text-ambar-600">
                {(litros * PRECIO_LITRO).toFixed(2)}
              </p>
            </div>

            <div className="col-span-2">
              <Button onClick={toggle} variant={despachando ? "outline" : "primary"} className="w-full">
                {despachando ? (
                  <>
                    <Square className="h-4 w-4" /> Detener despacho
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4" /> Iniciar despacho
                  </>
                )}
              </Button>
            </div>
          </Card>

          <Card className="flex items-center gap-6 p-6">
            <div className="relative h-28 w-28 shrink-0">
              <RadialBarChart
                width={112}
                height={112}
                innerRadius={38}
                outerRadius={54}
                data={nivelData}
                startAngle={90}
                endAngle={-270}
              >
                <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                <RadialBar background dataKey="value" cornerRadius={8} />
              </RadialBarChart>
              <div className="absolute inset-0 flex items-center justify-center font-display text-lg font-semibold text-estacion-950">
                {Math.round(nivelTanque)}%
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-estacion-900">
                <Droplets className="h-4 w-4 text-petroleo-600" />
                <p className="font-medium">Nivel del tanque</p>
              </div>
              <p className="mt-1 text-sm text-estacion-600">
                {nivelTanque < 20
                  ? "Nivel bajo — programar reabastecimiento."
                  : "Nivel dentro de lo esperado."}
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
