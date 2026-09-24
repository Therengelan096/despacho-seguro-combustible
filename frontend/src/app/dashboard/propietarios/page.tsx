'use client';

import { useState } from "react";
import Link from "next/link";
import { UserPlus, Search, Smartphone, MapPin, Users, ChevronLeft, ChevronRight, Edit, X, ShieldCheck } from "lucide-react";
import { usePropietarios } from "@/hooks/usePropietarios";
import { Propietario } from "@/types/propietario";

export default function PropietariosPage() {
  const {
    loading,
    searchTerm,
    handleSearch,
    currentData,
    currentPage,
    setCurrentPage,
    totalPages,
    totalFiltrados,
    startIndex,
    itemsPerPage,
    toggleEstado,
    actualizarPropietario
  } = usePropietarios(12);

  const [propEdit, setPropEdit] = useState<Propietario | null>(null);
  const [editForm, setEditForm] = useState({ nombre: "", apellidoPaterno: "", apellidoMaterno: "", celular: "" });

  function getInitials(name: string) {
    if (!name) return "U";
    const parts = name.split(" ");
    return parts.length >= 2 ? `${parts[0][0]}${parts[1][0]}`.toUpperCase() : name.substring(0, 2).toUpperCase();
  }

  const abrirEdicion = (p: Propietario) => {
    setEditForm({
      nombre: p.nombre || "",
      apellidoPaterno: p.apellidoPaterno || "",
      apellidoMaterno: p.apellidoMaterno || "",
      celular: p.celular || ""
    });
    setPropEdit(p);
  };

  const handleGuardarEdicion = async () => {
    if (!editForm.nombre || !editForm.apellidoPaterno) return;
    const exito = await actualizarPropietario(propEdit!.ci, editForm);
    if (exito) setPropEdit(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-xs font-extrabold uppercase tracking-widest text-ypfb-red font-sans">GESTIÓN DE CLIENTES</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">Propietarios Registrados</h1>
        </div>

        <Link
          href="/dashboard/propietarios/nuevo"
          className="px-5 py-3 bg-ypfb-blue hover:bg-ypfb-darkblue text-white font-bold text-xs rounded-xl shadow-md transition flex items-center space-x-2 shrink-0 font-sans"
        >
          <UserPlus size={16} />
          <span>REGISTRAR PROPIETARIO</span>
        </Link>
      </div>

      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3.5 top-3.5 text-slate-400" size={16} />
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Buscar por nombre o CI..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-sans focus:outline-none focus:ring-2 focus:ring-ypfb-blue"
          />
        </div>
      </div>

      <div className="flex flex-col h-full space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
          {loading ? (
             <div className="col-span-full py-20 text-center text-slate-400 font-bold uppercase text-sm">Cargando...</div>
          ) : currentData.map((prop) => {
            const inactivo = prop.estado === "INACTIVO";
            return (
              <div
                key={prop.idPropietario}
                className={`p-5 rounded-2xl border transition flex flex-col justify-between shadow-card ${
                  inactivo ? "bg-slate-50 border-slate-200 opacity-60" : "bg-white border-slate-200 hover:border-ypfb-blue"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className={`w-10 h-10 rounded-xl font-bold flex items-center justify-center text-sm shrink-0 font-display ${
                        inactivo ? "bg-slate-300 text-slate-600" : "bg-slate-100 text-ypfb-blue"
                      }`}>
                        {getInitials(prop.nombreCompleto)}
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-bold text-slate-900 text-sm truncate font-sans" title={prop.nombreCompleto}>{prop.nombreCompleto}</h3>
                        <span className="text-[11px] text-slate-400 font-mono tracking-tight">CI: {prop.ci}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 text-xs text-slate-600 font-sans mb-4">
                    <div className="flex justify-between items-center">
                      <span className="flex items-center space-x-1.5 text-slate-400"><Smartphone size={14} className="text-ypfb-blue" /><span>Celular:</span></span>
                      <span className="font-semibold font-mono tracking-tight">{prop.celular || "No registrado"}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="flex items-center space-x-1.5 text-slate-400"><MapPin size={14} className="text-ypfb-blue" /><span>Comunidad:</span></span>
                      <span className="font-semibold truncate max-w-[120px] text-right font-sans" title={prop.comunidad}>{prop.comunidad}</span>
                    </div>
                  </div>
                </div>

                <div className="border-t border-slate-200/60 pt-4 flex items-center justify-between mt-4">
                  <div className="flex items-center gap-2">
                    <button onClick={() => toggleEstado(prop.ci, prop.estado || "ACTIVO")} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${inactivo ? "bg-slate-300" : "bg-ypfb-blue"}`}>
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${inactivo ? "translate-x-1" : "translate-x-6"}`} />
                    </button>
                    <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded tracking-wider ${inactivo ? "bg-slate-200 text-slate-500" : "bg-blue-50 text-ypfb-blue"}`}>
                      {prop.estado || "ACTIVO"}
                    </span>
                  </div>

                  <button onClick={() => abrirEdicion(prop)} disabled={inactivo} className="flex items-center gap-1.5 text-[10px] font-bold text-slate-600 bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-md hover:bg-slate-200 transition-colors uppercase disabled:opacity-50">
                    <Edit size={12} /> Editar
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center items-center space-x-2 pt-4 font-mono">
            <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="p-2 rounded-lg border border-slate-200 bg-white text-slate-600 disabled:opacity-50 hover:bg-slate-50 transition"><ChevronLeft size={18} /></button>
            <div className="flex space-x-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button key={page} onClick={() => setCurrentPage(page)} className={`w-9 h-9 rounded-lg text-sm font-bold transition ${currentPage === page ? "bg-ypfb-blue text-white shadow-md" : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"}`}>{page}</button>
              ))}
            </div>
            <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="p-2 rounded-lg border border-slate-200 bg-white text-slate-600 disabled:opacity-50 hover:bg-slate-50 transition"><ChevronRight size={18} /></button>
          </div>
        )}
      </div>

      {propEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col">
            <div className="bg-ypfb-navy p-5 text-white flex justify-between items-center">
              <h2 className="text-sm font-bold uppercase tracking-wider flex items-center gap-2 font-display">
                <Edit size={18} className="text-ypfb-yellow" /> Editar Propietario
              </h2>
              <button onClick={() => setPropEdit(null)} className="hover:bg-white/10 p-1.5 rounded-lg transition-colors"><X size={20} /></button>
            </div>

            <div className="p-6 font-sans">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1.5 block">Nombre</label>
                  <input value={editForm.nombre} onChange={(e) => setEditForm({...editForm, nombre: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm outline-none focus:border-ypfb-blue" />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1.5 block">Apellido Paterno</label>
                  <input value={editForm.apellidoPaterno} onChange={(e) => setEditForm({...editForm, apellidoPaterno: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm outline-none focus:border-ypfb-blue" />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1.5 block">Apellido Materno</label>
                  <input value={editForm.apellidoMaterno} onChange={(e) => setEditForm({...editForm, apellidoMaterno: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm outline-none focus:border-ypfb-blue" />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1.5 block">Celular</label>
                  <input value={editForm.celular} onChange={(e) => setEditForm({...editForm, celular: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-mono tracking-widest font-semibold outline-none focus:border-ypfb-blue" />
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-100 p-3 rounded-xl flex items-start gap-3 mt-2">
                <ShieldCheck size={18} className="text-ypfb-blue shrink-0 mt-0.5" />
                <p className="text-[11px] text-ypfb-blue font-medium leading-relaxed">
                  Por seguridad y regulaciones, el <strong className="font-bold">CI</strong> y la <strong className="font-bold">Comunidad</strong> están bloqueados para modificaciones directas.
                </p>
              </div>
            </div>

            <div className="bg-slate-50 px-6 py-4 flex justify-end gap-3 border-t border-slate-100">
              <button onClick={() => setPropEdit(null)} className="px-5 py-2.5 rounded-xl font-bold text-slate-500 bg-white border border-slate-200 hover:bg-slate-50 transition-colors text-xs uppercase tracking-wider">Cancelar</button>
              <button onClick={handleGuardarEdicion} className="px-5 py-2.5 bg-ypfb-blue text-white rounded-xl font-bold uppercase tracking-wider text-xs hover:bg-ypfb-darkblue transition-colors shadow-md">Guardar Cambios</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}