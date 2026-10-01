"use client";

import { useState, useEffect } from "react";
import { Users, X, Search, Check } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { showError } from "@/lib/alerts";
import { Propietario } from "@/types/propietario";

interface ModalBuscarPropietarioProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (propietario: Propietario) => void;
  idSeleccionado?: number;
}

export function ModalBuscarPropietario({ isOpen, onClose, onSelect, idSeleccionado }: ModalBuscarPropietarioProps) {
  const [propietarios, setPropietarios] = useState<Propietario[]>([]);
  const [cargando, setCargando] = useState(false);
  const [busqueda, setBusqueda] = useState("");

  useEffect(() => {
    if (isOpen && propietarios.length === 0) {
      const cargar = async () => {
        try {
          setCargando(true);
          const data = await apiFetch("/propietarios");
          setPropietarios(data);
        } catch (err) {
          showError("No se pudo cargar la lista");
        } finally {
          setCargando(false);
        }
      };
      cargar();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const filtrados = propietarios.filter((p) =>
    p.nombreCompleto?.toLowerCase().includes(busqueda.toLowerCase()) || p.ci?.includes(busqueda)
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col">

        <div className="bg-green-900 p-4 text-white flex justify-between items-center shrink-0">
          <h2 className="text-sm font-bold uppercase tracking-wider flex items-center gap-2 font-display">
            <Users size={16} className="text-amber-400" /> Elegir propietario
          </h2>
          <button onClick={onClose} className="hover:bg-white/10 p-1.5 rounded-lg transition-colors"><X size={18} /></button>
        </div>

        <div className="p-3 border-b border-slate-100 shrink-0 bg-slate-50/50">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
            <input
              type="text"
              autoFocus
              placeholder="Buscar por nombre o CI..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-700 outline-none transition-all text-sm font-sans"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2 max-h-[400px]">
          {cargando ? (
            <p className="text-center py-8 font-bold text-slate-400 text-xs font-sans">Cargando base de datos...</p>
          ) : filtrados.length === 0 ? (
            <p className="text-center py-8 font-bold text-slate-400 text-xs font-sans">No se encontraron resultados</p>
          ) : (
            filtrados.map((p) => {
              const activo = idSeleccionado === p.idPropietario;
              return (
                <button
                  type="button"
                  key={p.idPropietario}
                  onClick={() => { onSelect(p); setBusqueda(""); }}
                  className={`w-full flex items-center justify-between gap-3 p-2.5 rounded-xl transition-colors text-left ${activo ? "bg-green-50" : "hover:bg-slate-50"}`}
                >
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-slate-100 flex items-center justify-center text-green-800 font-bold uppercase shrink-0 font-display text-xs">
                      {p.nombreCompleto.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 text-xs leading-tight font-sans">{p.nombreCompleto}</p>
                      <p className="text-[10px] font-mono text-slate-500 tracking-tight">CI: {p.ci}</p>
                    </div>
                  </div>
                  {activo && <Check size={16} className="text-green-700 shrink-0" />}
                </button>
              );
            })
          )}
        </div>

      </div>
    </div>
  );
}