"use client";

import { Wifi, CheckCircle2, AlertTriangle, ShieldCheck, XOctagon } from "lucide-react";
import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import { useBomba } from "@/hooks/useBomba";

const VehicleViewer = dynamic(
  () => import("@/components/bomba/vehicle-viewer"),
  {
    ssr: false,
    loading: () => (
      <div className="h-64 w-full animate-pulse rounded-2xl bg-slate-100 md:h-80" />
    ),
  }
);

export default function BombaPage() {
  const {
    posData,
    procesando,
    confirmarDespacho,
    rechazarAlarma,
  } = useBomba();

  const [litros, setLitros] = useState("");

  useEffect(() => {
    if (posData?.litrosSolicitados) {
      setLitros(posData.litrosSolicitados);
    }
  }, [posData]);

  if (!posData) {
    return (
      <div className="h-[calc(100vh-120px)] flex flex-col items-center justify-center bg-white rounded-3xl border-2 border-dashed border-slate-200 shadow-sm p-8 text-center font-sans">
        <div className="relative flex h-32 w-32 items-center justify-center rounded-full mb-8 bg-blue-50">
          <Wifi size={64} className="text-ypfb-blue animate-pulse" />
          <span className="absolute inset-0 rounded-full border-4 border-ypfb-blue animate-ping opacity-20"></span>
        </div>
        <h2 className="text-3xl font-black text-slate-800 font-display mb-2">
          Monitoreo Automático
        </h2>
        <p className="text-slate-500 mb-10 text-lg">
          Esperando conexión y escaneo físico desde el surtidor principal...
        </p>

        <div className="flex items-center gap-3 bg-blue-50 text-ypfb-blue px-6 py-3 rounded-full font-bold uppercase tracking-widest text-sm border border-blue-100 shadow-sm">
           <span className="relative flex h-3 w-3">
             <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-ypfb-blue opacity-75"></span>
             <span className="relative inline-flex rounded-full h-3 w-3 bg-ypfb-blue"></span>
           </span>
           Sistema en Línea y Escuchando
        </div>
      </div>
    );
  }

  const porcentajeConsumido = Math.min(
    100,
    (posData.litrosConsumidos / posData.cupoMaximo) * 100,
  );
  const porcentajeDisponible = 100 - porcentajeConsumido;
  const cupoAgotado = posData.cupoDisponible <= 0;

  return (
    <div className="h-[calc(100vh-120px)] flex flex-col lg:flex-row gap-6 font-sans">
      <div className="flex-1 bg-white rounded-3xl shadow-card border border-slate-200 p-8 flex flex-col items-center justify-center text-center">
        <VehicleViewer tipoVehiculo={posData.tipoVehiculo} />
        <span className="bg-slate-100 text-slate-500 font-bold px-4 py-1 rounded-full text-xs uppercase tracking-widest mb-2">
          Matrícula Asignada
        </span>
        <h2 className="text-5xl font-black font-mono tracking-[0.15em] text-slate-900 mb-12">
          {posData.placa}
        </h2>

        <div className="w-full max-w-sm">
          <div className="flex justify-between text-sm font-bold text-slate-600 mb-2 uppercase tracking-wider">
            <span>Consumido: {posData.litrosConsumidos} L</span>
            <span className={cupoAgotado ? "text-red-500" : "text-emerald-600"}>
              Restante: {posData.cupoDisponible} L
            </span>
          </div>

          <div className="h-6 w-full bg-slate-100 rounded-full overflow-hidden flex shadow-inner">
            <div
              style={{ width: `${porcentajeConsumido}%` }}
              className="bg-slate-400 h-full transition-all duration-1000"
            ></div>
            <div
              style={{ width: `${porcentajeDisponible}%` }}
              className={`h-full transition-all duration-1000 ${cupoAgotado ? "bg-red-500" : "bg-emerald-500"}`}
            ></div>
          </div>
          <p className="text-xs text-slate-400 mt-3 font-semibold uppercase tracking-widest">
            Cupo Máximo Semanal: {posData.cupoMaximo} L
          </p>
        </div>
      </div>

      <div className="flex-1 bg-white rounded-3xl shadow-card border border-slate-200 p-8 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between border-b border-slate-100 pb-6 mb-6">
            <h1 className="text-3xl font-black text-ypfb-navy font-display">
              Datos del Propietario
            </h1>
            {posData.estadoTurno === "AUTORIZADO" ? (
              <span className="bg-emerald-100 text-emerald-800 p-3 rounded-2xl shadow-sm">
                <CheckCircle2 size={32} />
              </span>
            ) : (
              <span className="bg-red-100 text-red-800 p-3 rounded-2xl shadow-sm">
                <AlertTriangle size={32} />
              </span>
            )}
          </div>

          <div className="space-y-6">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">
                Nombre Completo
              </p>
              <p className="text-2xl font-bold text-slate-900 leading-none">
                {posData.nombrePropietario}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                  Comunidad
                </p>
                <p className="text-lg font-bold text-slate-800">
                  {posData.comunidad}
                </p>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                  Tipo de Vehículo
                </p>
                <p className="text-lg font-bold text-slate-800 capitalize">
                  {posData.tipoVehiculo.toLowerCase()}
                </p>
              </div>
            </div>

            <div
              className={`p-5 rounded-2xl border-2 flex items-center gap-4 ${
                posData.estadoTurno === "AUTORIZADO"
                  ? "bg-emerald-50 border-emerald-200"
                  : "bg-red-50 border-red-200"
              }`}
            >
              <p className="text-sm font-bold text-slate-700">
                ESTADO DEL SISTEMA:{" "}
                <span
                  className={
                    posData.estadoTurno === "AUTORIZADO"
                      ? "text-emerald-700"
                      : "text-red-700"
                  }
                >
                  {posData.estadoTurno === "AUTORIZADO"
                    ? "HABILITADO PARA CARGAR"
                    : posData.estadoTurno.replace(/_/g, " ")}
                </span>
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4 mt-8">
          <div className="space-y-3">
            <label
              className="block text-xs font-bold text-slate-500 uppercase tracking-widest"
              htmlFor="litros"
            >
              Litros a despachar
            </label>
            <input
              id="litros"
              type="number"
              min="0.1"
              max={posData.cupoDisponible}
              step="0.1"
              value={litros}
              onChange={(event) => setLitros(event.target.value)}
              placeholder={`Máximo ${posData.cupoDisponible} L`}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 p-4 text-center text-xl font-bold outline-none focus:border-ypfb-blue focus:ring-2 focus:ring-ypfb-blue/20"
            />
            <button
              onClick={() => confirmarDespacho(Number(litros))}
              disabled={
                procesando ||
                posData.estadoTurno !== "AUTORIZADO" ||
                !litros ||
                Number(litros) <= 0 ||
                Number(litros) > posData.cupoDisponible
              }
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-5 rounded-2xl font-black text-xl tracking-wider uppercase transition-colors shadow-lg flex items-center justify-center gap-3 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <ShieldCheck size={28} />{" "}
              {procesando ? "ENVIANDO PERMISO..." : "APROBAR Y LIBERAR BOMBA"}
            </button>
          </div>

          <button
            onClick={rechazarAlarma}
            className="w-full bg-ypfb-red hover:bg-red-500 text-white py-5 rounded-2xl font-black text-xl tracking-wider uppercase transition-colors shadow-lg flex items-center justify-center gap-3"
          >
            <XOctagon size={28} /> Rechazar / Alarma
          </button>
        </div>
      </div>
    </div>
  );
}