'use client';

import { useState } from "react";
import Link from "next/link";
import { UserPlus, Search, Smartphone, MapPin, ChevronLeft, ChevronRight, Edit } from "lucide-react";
import { usePropietarios } from "@/hooks/usePropietarios";
import { Propietario } from "@/types/propietario";
import { ModalEditarPropietario } from "@/components/propietarios/modal-editar-propietario";

export default function PropietariosPage() {
  const {
    loading,
    searchTerm,
    handleSearch,
    currentData,
    currentPage,
    setCurrentPage,
    totalPages,
    toggleEstado,
    actualizarPropietario
  } = usePropietarios(12);

  const [propEdit, setPropEdit] = useState<Propietario | null>(null);

  function getInitials(name: string) {
    if (!name) return "U";
    const parts = name.split(" ");
    return parts.length >= 2 ? `${parts[0][0]}${parts[1][0]}`.toUpperCase() : name.substring(0, 2).toUpperCase();
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-xs font-extrabold uppercase tracking-widest text-amber-600 font-sans">GESTIÓN DE CLIENTES</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">Propietarios Registrados</h1>
        </div>

        <Link href="/dashboard/propietarios/nuevo" className="px-5 py-3 bg-amber-500 hover:bg-amber-600 text-green-950 font-bold text-xs rounded-xl shadow-md transition flex items-center space-x-2 shrink-0 font-sans">
          <UserPlus size={16} />
          <span>REGISTRAR PROPIETARIO</span>
        </Link>
      </div>

      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3.5 top-3.5 text-slate-400" size={16} />
          <input type="text" value={searchTerm} onChange={handleSearch} placeholder="Buscar por nombre o CI..." className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-sans focus:outline-none focus:ring-2 focus:ring-green-700" />
        </div>
      </div>

      <div className="flex flex-col h-full space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
          {loading ? (
             <div className="col-span-full py-20 text-center text-slate-400 font-bold uppercase text-sm">Cargando...</div>
          ) : currentData.map((prop) => {
            const inactivo = prop.estado === "INACTIVO";
            return (
              <div key={prop.idPropietario} className={`p-4 xl:p-5 rounded-2xl border transition flex flex-col justify-between shadow-card w-full overflow-hidden ${inactivo ? "bg-slate-50 border-slate-200 opacity-60" : "bg-white border-slate-200 hover:border-green-700"}`}>
                <div className="w-full">
                  <div className="flex items-center gap-3 mb-4 w-full">
                    <div className={`w-10 h-10 rounded-xl font-bold flex items-center justify-center text-sm shrink-0 font-display ${inactivo ? "bg-slate-300 text-slate-600" : "bg-green-50 text-green-700"}`}>
                      {getInitials(prop.nombreCompleto)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-slate-900 text-sm truncate font-sans w-full" title={prop.nombreCompleto}>
                        {prop.nombreCompleto}
                      </h3>
                      <span className="text-[11px] text-slate-400 font-mono tracking-tight block truncate mt-0.5">CI: {prop.ci}</span>
                    </div>
                  </div>

                  <div className="space-y-2 text-xs text-slate-600 font-sans mb-4 w-full">
                    <div className="flex justify-between items-center w-full gap-2">
                      <span className="flex items-center space-x-1.5 text-slate-400 shrink-0">
                        <Smartphone size={14} className="text-green-700" />
                        <span>Celular:</span>
                      </span>
                      <span className="font-semibold font-mono tracking-tight truncate text-right">
                        {prop.celular || "No registrado"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center w-full gap-2">
                      <span className="flex items-center space-x-1.5 text-slate-400 shrink-0">
                        <MapPin size={14} className="text-green-700" />
                        <span>Comunidad:</span>
                      </span>
                      <span className="font-semibold truncate text-right font-sans flex-1" title={prop.comunidad}>
                        {prop.comunidad}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="border-t border-slate-200/60 pt-4 flex items-center justify-between mt-auto gap-2 w-full">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <button onClick={() => toggleEstado(prop.ci, prop.estado || "ACTIVO")} className={`relative inline-flex h-6 w-10 shrink-0 items-center rounded-full transition-colors ${inactivo ? "bg-slate-300" : "bg-green-700"}`}>
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${inactivo ? "translate-x-1" : "translate-x-5"}`} />
                    </button>
                    <span className={`text-[9px] sm:text-[10px] font-black uppercase px-2 py-0.5 rounded tracking-wider truncate ${inactivo ? "bg-slate-200 text-slate-500" : "bg-green-50 text-green-700"}`}>
                      {prop.estado || "ACTIVO"}
                    </span>
                  </div>
                  <button onClick={() => setPropEdit(prop)} disabled={inactivo} className="flex items-center gap-1.5 text-[10px] font-bold text-slate-600 bg-slate-100 border border-slate-200 px-2.5 py-1.5 rounded-md hover:bg-slate-200 transition-colors uppercase disabled:opacity-50 shrink-0">
                    <Edit size={12} /> Editar
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-slate-100 bg-white px-6 py-4 rounded-xl mt-4 shadow-sm">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-600 transition-colors hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white uppercase tracking-wider font-sans"
            >
              <ChevronLeft size={16} /> Anterior
            </button>

            <span className="text-xs font-bold text-slate-500 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100 font-sans">
              Página <span className="text-green-800 font-black">{currentPage}</span> de <span className="text-slate-800">{totalPages}</span>
            </span>

            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-600 transition-colors hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white uppercase tracking-wider font-sans"
            >
              Siguiente <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>

      <ModalEditarPropietario
        propietario={propEdit}
        onClose={() => setPropEdit(null)}
        onSave={actualizarPropietario}
      />
    </div>
  );
}