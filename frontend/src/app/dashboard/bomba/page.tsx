"use client";

import {
  Wifi,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  XOctagon,
} from "lucide-react";
import dynamic from "next/dynamic";
import { useState } from "react";
import { useBomba } from "@/hooks/useBomba";

const VehicleViewer = dynamic(
  () => import("@/components/bomba/vehicle-viewer"),
  {
    ssr: false,
    loading: () => (
      <div className="h-64 w-full animate-pulse rounded-2xl bg-slate-100 md:h-80" />
    ),
  },
);

export default function BombaPage() {
  const {
    posData,
    scanning,
    consultarTarjeta,
    procesando,
    confirmarDespacho,
    rechazarAlarma,
  } = useBomba();
  const [litros, setLitros] = useState("");

  // Pantalla de Espera (Antes de escanear)
  if (!posData) {
    return (
      <div className="h-[calc(100vh-120px)] flex flex-col items-center justify-center bg-white rounded-3xl border-2 border-dashed border-slate-200 shadow-sm p-8 text-center font-sans">
        <div
          className={`relative flex h-32 w-32 items-center justify-center rounded-full mb-8 ${scanning ? "bg-ypfb-blue" : "bg-slate-100"}`}
        >
          <Wifi
            size={64}
            className={
              scanning ? "text-ypfb-yellow animate-pulse" : "text-slate-300"
            }
          />
          {scanning && (
            <span className="absolute inset-0 rounded-full border-4 border-ypfb-yellow animate-ping opacity-20"></span>
          )}
        </div>
        <h2 className="text-3xl font-black text-slate-800 font-display mb-2">
          {scanning ? "Buscando Tarjeta NFC..." : "Terminal de Caseta"}
        </h2>
        <p className="text-slate-500 mb-10 text-lg">
          Acerque el tag NFC del cliente al lector para verificar su identidad y
          cupo.
        </p>
        <button
          onClick={consultarTarjeta}
          disabled={scanning}
          className="px-10 py-5 bg-ypfb-yellow text-ypfb-navy hover:bg-ypfb-gold rounded-2xl font-black uppercase tracking-widest text-lg transition-all shadow-[0_8px_20px_-8px_rgba(255,199,44,0.6)] disabled:opacity-50"
        >
          {scanning ? "ESPERANDO LECTURA..." : "INICIAR ESCANEO NFC"}
        </button>
      </div>
    );
  }

  // Cálculos para la barra de progreso
  const porcentajeConsumido = Math.min(
    100,
    (posData.litrosConsumidos / posData.cupoMaximo) * 100,
  );
  const porcentajeDisponible = 100 - porcentajeConsumido;
  const cupoAgotado = posData.cupoDisponible <= 0;

  return (
    <div className="h-[calc(100vh-120px)] flex flex-col lg:flex-row gap-6 font-sans">
      {/* PANEL IZQUIERDO: AUTO Y CUPO */}
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

      {/* PANEL DERECHO: DATOS Y ACCIONES */}
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
              {procesando ? "REGISTRANDO..." : "Registrar despacho"}
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
