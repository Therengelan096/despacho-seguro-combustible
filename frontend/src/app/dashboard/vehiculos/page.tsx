'use client';

import { useState } from "react";
import Link from "next/link";
import { Plus, Car, Search, IdCard, Users, ChevronLeft, ChevronRight, Fuel, KeyRound, Edit, X, ShieldCheck, ChevronDown } from "lucide-react";
import { useVehiculos } from "@/hooks/useVehiculos";
import { Vehiculo } from "@/types/vehiculo";

const tipoLabel: Record<string, string> = {
  AUTOMOVIL: "Automóvil",
  MOTOCICLETA: "Motocicleta",
};

export default function VehiculosPage() {
  const { loading, searchTerm, handleSearch, currentData, currentPage, setCurrentPage, totalPages, totalFiltrados, startIndex, itemsPerPage, toggleEstado, cambiarPin, actualizarVehiculo, propietarios } = useVehiculos(8);

  const [vehiculoEdit, setVehiculoEdit] = useState<Vehiculo | null>(null);
  const [editForm, setEditForm] = useState({ codigoPlaca: "", tipo: "", idPropietario: "" });

  const [openEditTipo, setOpenEditTipo] = useState(false);
  const [openEditProp, setOpenEditProp] = useState(false);

  const abrirEdicion = (v: Vehiculo) => {
    // Corrección: Búsqueda flexible ignorando mayúsculas y aceptando coincidencias parciales
    // (ya que Vehiculos DTO no incluye el apellido materno)
    const propietarioEncontrado = propietarios.find(p =>
      p.nombreCompleto.toLowerCase().includes(v.nombrePropietario.toLowerCase().trim())
    );

    const propId = propietarioEncontrado?.idPropietario.toString() || "";

    setEditForm({ codigoPlaca: v.codigoPlaca, tipo: v.tipo, idPropietario: propId });
    setVehiculoEdit(v);
  };

  const handleGuardarEdicion = async () => {
    if (!editForm.codigoPlaca || !editForm.tipo || !editForm.idPropietario) return;
    const exito = await actualizarVehiculo(vehiculoEdit!.idVehiculo, {
      codigoPlaca: editForm.codigoPlaca,
      tipo: editForm.tipo,
      idPropietario: parseInt(editForm.idPropietario)
    });
    if (exito) setVehiculoEdit(null);
  };

  return (
    <section className="space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-xs font-extrabold uppercase tracking-widest text-amber-600 font-sans">SISTEMA NFC</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">Vehículos Registrados</h1>
        </div>
        <Link href="/dashboard/vehiculos/nuevo" className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-green-950 px-5 py-3 rounded-xl font-black transition-all shadow-md active:scale-95 uppercase tracking-wider text-xs shrink-0 font-sans">
          <Plus size={18} /> Nuevo Vehículo
        </Link>
      </div>

      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3.5 top-3.5 text-slate-400" size={16} />
          <input type="text" placeholder="Buscar por placa o propietario..." className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-sans focus:outline-none focus:ring-2 focus:ring-green-700" value={searchTerm} onChange={handleSearch} />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-card border border-slate-200 overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-green-950 uppercase tracking-wider font-sans">Placa</th>
                <th className="px-6 py-4 text-xs font-bold text-green-950 uppercase tracking-wider font-sans">Tipo</th>
                <th className="px-6 py-4 text-xs font-bold text-green-950 uppercase tracking-wider font-sans">Propietario</th>
                <th className="px-6 py-4 text-xs font-bold text-green-950 uppercase tracking-wider font-sans text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr><td colSpan={4} className="text-center py-16 text-slate-400 font-bold uppercase text-sm font-sans tracking-wider">Cargando...</td></tr>
              ) : currentData.map((v) => {
                const inactivo = v.estado === "INACTIVO";
                return (
                  <tr key={v.idVehiculo} className={`transition-colors group ${inactivo ? "bg-slate-50 opacity-60" : "hover:bg-green-50/50"}`}>
                    <td className="px-6 py-4 whitespace-nowrap align-middle">
                      <div className="flex items-center gap-3">
                        <div className={`h-10 w-10 rounded-xl flex items-center justify-center transition-all shadow-sm shrink-0 ${inactivo ? "bg-slate-200 text-slate-500" : "bg-slate-100 text-green-700"}`}>
                          <IdCard size={18} />
                        </div>
                        <p className="font-mono text-sm font-bold text-slate-900 tracking-tight">{v.codigoPlaca}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap align-middle">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase border font-sans ${inactivo ? "bg-slate-200 text-slate-600 border-slate-300" : "bg-green-50 text-green-700 border-green-100"}`}>
                        <Car size={12} /> {tipoLabel[v.tipo] ?? v.tipo}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap align-middle">
                      <span className="flex items-center gap-2 text-sm font-semibold text-slate-700 font-sans">
                        <Users size={14} className="text-slate-400" /> {v.nombrePropietario}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right align-middle">
                      <div className="flex items-center justify-end gap-3">
                        <button onClick={() => cambiarPin(v.idVehiculo)} disabled={inactivo} className="flex items-center gap-1.5 text-[10px] font-bold text-green-700 bg-green-50 border border-green-100 px-3 py-1.5 rounded-md hover:bg-green-700 hover:text-white transition-colors uppercase disabled:opacity-50 font-sans">
                          <KeyRound size={12} /> PIN
                        </button>

                        <button onClick={() => abrirEdicion(v)} disabled={inactivo} className="flex items-center gap-1.5 text-[10px] font-bold text-slate-600 bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-md hover:bg-slate-200 transition-colors uppercase disabled:opacity-50 font-sans">
                          <Edit size={12} /> Editar
                        </button>

                        <div className="flex items-center gap-2 border-l border-slate-200 pl-3">
                          <button onClick={() => toggleEstado(v.idVehiculo, v.estado || "ACTIVO")} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${inactivo ? "bg-slate-300" : "bg-green-700"}`}>
                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${inactivo ? "translate-x-1" : "translate-x-6"}`} />
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-slate-100 bg-white px-6 py-4">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-600 transition-colors hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white uppercase tracking-wider shadow-sm font-sans"
            >
              <ChevronLeft size={16} /> Anterior
            </button>

            <span className="text-xs font-bold text-slate-500 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100 shadow-sm font-sans">
              Página <span className="text-green-800 font-black">{currentPage}</span> de <span className="text-slate-800">{totalPages}</span>
            </span>

            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-600 transition-colors hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white uppercase tracking-wider shadow-sm font-sans"
            >
              Siguiente <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>

      {vehiculoEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col">
            <div className="bg-green-900 p-5 text-white flex justify-between items-center">
              <h2 className="text-sm font-bold uppercase tracking-wider flex items-center gap-2 font-display">
                <Edit size={18} className="text-amber-400" /> Editar Vehículo
              </h2>
              <button onClick={() => setVehiculoEdit(null)} className="hover:bg-white/10 p-1.5 rounded-lg transition-colors"><X size={20} /></button>
            </div>

            <div className="p-6 space-y-4 font-sans">
              <div>
                <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1.5 block font-sans">Código de Placa</label>
                <input value={editForm.codigoPlaca} onChange={(e) => setEditForm({...editForm, codigoPlaca: e.target.value.toUpperCase()})} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-mono tracking-widest font-semibold outline-none focus:border-green-700 transition-all focus:ring-2 focus:ring-green-700/20" />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1.5 block font-sans">Tipo de Vehículo</label>
                <div className="relative">
                  <div
                    onClick={() => setOpenEditTipo(!openEditTipo)}
                    className="w-full bg-slate-50 border border-slate-200 hover:border-green-700 rounded-xl p-3 text-sm outline-none cursor-pointer flex justify-between items-center transition-all focus:ring-2 focus:ring-green-700/20 font-sans"
                  >
                    <span className={editForm.tipo ? "text-slate-800 font-semibold" : "text-slate-400"}>
                      {editForm.tipo === "AUTOMOVIL" ? "Automóvil" : editForm.tipo === "MOTOCICLETA" ? "Motocicleta" : "Seleccionar tipo"}
                    </span>
                    <ChevronDown size={16} className={`text-slate-400 transition-transform duration-200 ${openEditTipo ? "rotate-180" : ""}`} />
                  </div>
                  {openEditTipo && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setOpenEditTipo(false)}></div>
                      <div className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden py-1">
                        {[{ value: "AUTOMOVIL", label: "Automóvil" }, { value: "MOTOCICLETA", label: "Motocicleta" }].map((t) => (
                          <div
                            key={t.value}
                            onClick={() => {
                              setEditForm({...editForm, tipo: t.value});
                              setOpenEditTipo(false);
                            }}
                            className={`px-4 py-2.5 text-sm cursor-pointer transition-colors font-sans ${
                              editForm.tipo === t.value ? "bg-green-50 text-green-800 font-bold" : "text-slate-600 hover:bg-slate-50 hover:text-green-800"
                            }`}
                          >
                            {t.label}
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1.5 block font-sans">Propietario</label>
                <div className="relative">
                  <div
                    onClick={() => setOpenEditProp(!openEditProp)}
                    className="w-full bg-slate-50 border border-slate-200 hover:border-green-700 rounded-xl p-3 text-sm outline-none cursor-pointer flex justify-between items-center transition-all focus:ring-2 focus:ring-green-700/20 font-sans"
                  >
                    <span className={editForm.idPropietario ? "text-slate-800 font-semibold truncate" : "text-slate-400"}>
                      {editForm.idPropietario
                        ? propietarios.find(p => p.idPropietario.toString() === editForm.idPropietario)?.nombreCompleto
                        : "Seleccione propietario"}
                    </span>
                    <ChevronDown size={16} className={`text-slate-400 shrink-0 transition-transform duration-200 ${openEditProp ? "rotate-180" : ""}`} />
                  </div>
                  {openEditProp && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setOpenEditProp(false)}></div>
                      <div className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-xl overflow-y-auto max-h-48 py-1">
                        {propietarios.map((p) => (
                          <div
                            key={p.idPropietario}
                            onClick={() => {
                              setEditForm({...editForm, idPropietario: p.idPropietario.toString()});
                              setOpenEditProp(false);
                            }}
                            className={`px-4 py-2.5 text-sm cursor-pointer transition-colors font-sans ${
                              editForm.idPropietario === p.idPropietario.toString() ? "bg-green-50 text-green-800 font-bold" : "text-slate-600 hover:bg-slate-50 hover:text-green-800"
                            }`}
                          >
                            {p.nombreCompleto} <span className="text-[11px] text-slate-400 ml-1 font-mono">(CI: {p.ci})</span>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="bg-green-50 border border-green-100 p-3 rounded-xl flex items-start gap-3 mt-4">
                <ShieldCheck size={18} className="text-green-700 shrink-0 mt-0.5" />
                <p className="text-[11px] text-green-800 font-medium leading-relaxed font-sans">
                  Por seguridad, el PIN y el Tag NFC están bloqueados. Para modificarlos, use las herramientas de Cambio de PIN o asigne un nuevo vehículo.
                </p>
              </div>
            </div>

            <div className="bg-slate-50 px-6 py-4 flex justify-end gap-3 border-t border-slate-100">
              <button onClick={() => setVehiculoEdit(null)} className="px-5 py-2.5 rounded-xl font-bold text-slate-500 bg-white border border-slate-200 hover:bg-slate-50 transition-colors text-xs uppercase tracking-wider font-sans">Cancelar</button>
              <button onClick={handleGuardarEdicion} className="px-5 py-2.5 bg-green-700 text-white rounded-xl font-bold uppercase tracking-wider text-xs hover:bg-green-800 transition-colors shadow-md font-sans">Guardar Cambios</button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}