"use client";

import { useState, useEffect } from "react";
import { Users, Car, Fuel, MapPin, RefreshCcw } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { showSuccess, showError, confirmAction } from "@/lib/alerts";

export default function DashboardPage() {
  const [metricas, setMetricas] = useState({
    propietarios: 0,
    vehiculos: 0,
    litrosTotales: 0,
    turno: "CAJUATA"
  });
  const [loading, setLoading] = useState(true);

  const cargarMetricas = async () => {
    try {
      const data = await apiFetch("/dashboard/metricas");
      setMetricas({
        propietarios: data.totalPropietarios,
        vehiculos: data.totalVehiculos,
        litrosTotales: data.litrosTotalesDespachados,
        turno: data.comunidadEnTurno
      });
    } catch (err) {
      showError("Error al cargar métricas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarMetricas();
  }, []);

  const cambiarTurno = async () => {
    const nuevoTurno = metricas.turno === "CAJUATA" ? "SIQUIMIRANI" : "CAJUATA";
    const confirmado = await confirmAction("¿Cambiar Turno Activo?", `El sistema autorizará únicamente a los vehículos de la comunidad ${nuevoTurno}.`);

    if (confirmado) {
      try {
        await apiFetch("/turnos/cambiar", {
          method: "POST",
          body: JSON.stringify({ comunidad: nuevoTurno })
        });
        showSuccess("Turno Actualizado", `Comunidad activa: ${nuevoTurno}`);
        cargarMetricas();
      } catch (err: any) {
        showError("Error al cambiar turno");
      }
    }
  };

  if (loading) return null;

  return (
    <div className="space-y-8 font-sans w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-xs font-extrabold uppercase tracking-widest text-amber-600">Oficina Central</span>
          <h1 className="text-3xl font-extrabold text-slate-900 font-display">Métricas de Operación</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-3xl shadow-card border border-slate-200">
          <div className="w-12 h-12 bg-green-50 text-green-700 rounded-2xl flex items-center justify-center mb-4"><Users size={24} /></div>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Propietarios</p>
          <p className="text-4xl font-black text-slate-900 font-display">{metricas.propietarios}</p>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-card border border-slate-200">
          <div className="w-12 h-12 bg-green-50 text-green-700 rounded-2xl flex items-center justify-center mb-4"><Car size={24} /></div>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Vehículos Activos</p>
          <p className="text-4xl font-black text-slate-900 font-display">{metricas.vehiculos}</p>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-card border border-slate-200">
          <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center mb-4"><Fuel size={24} /></div>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Litros Despachados</p>
          <p className="text-4xl font-black text-slate-900 font-display">{metricas.litrosTotales.toFixed(1)} <span className="text-lg text-slate-400">L</span></p>
        </div>

        <div className="bg-green-950 p-6 rounded-3xl shadow-xl border border-green-900 relative overflow-hidden flex flex-col justify-between">
          <div className="relative z-10">
            <div className="w-12 h-12 bg-white/10 text-amber-400 rounded-2xl flex items-center justify-center mb-4"><MapPin size={24} /></div>
            <p className="text-xs font-bold text-green-200 uppercase tracking-widest">Comunidad en Turno</p>
            <p className="text-3xl font-black text-white font-display mt-1">{metricas.turno}</p>
          </div>
          <button
            onClick={cambiarTurno}
            className="relative z-10 w-full mt-6 bg-amber-500 hover:bg-amber-600 text-green-950 py-3 rounded-xl font-bold uppercase tracking-wider text-xs transition-colors shadow-md flex items-center justify-center gap-2"
          >
            <RefreshCcw size={16} /> Cambiar Turno
          </button>
        </div>
      </div>
    </div>
  );
}