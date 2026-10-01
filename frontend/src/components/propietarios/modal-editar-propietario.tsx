"use client";

import { useState, useEffect } from "react";
import { Edit, X, ShieldCheck } from "lucide-react";
import { Propietario } from "@/types/propietario";

interface ModalEditarPropietarioProps {
  propietario: Propietario | null;
  onClose: () => void;
  onSave: (ci: string, payload: any) => Promise<boolean>;
}

export function ModalEditarPropietario({ propietario, onClose, onSave }: ModalEditarPropietarioProps) {
  const [editForm, setEditForm] = useState({ nombre: "", apellidoPaterno: "", apellidoMaterno: "", celular: "" });

  useEffect(() => {
    if (propietario) {
      setEditForm({
        nombre: propietario.nombre || "",
        apellidoPaterno: propietario.apellidoPaterno || "",
        apellidoMaterno: propietario.apellidoMaterno || "",
        celular: propietario.celular || ""
      });
    }
  }, [propietario]);

  if (!propietario) return null;

  const handleGuardar = async () => {
    if (!editForm.nombre || !editForm.apellidoPaterno) return;
    const exito = await onSave(propietario.ci, editForm);
    if (exito) onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        <div className="bg-green-900 p-5 text-white flex justify-between items-center">
          <h2 className="text-sm font-bold uppercase tracking-wider flex items-center gap-2 font-display">
            <Edit size={18} className="text-amber-400" /> Editar Propietario
          </h2>
          <button onClick={onClose} className="hover:bg-white/10 p-1.5 rounded-lg transition-colors"><X size={20} /></button>
        </div>

        <div className="p-6 font-sans">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1.5 block">Nombre</label>
              <input value={editForm.nombre} onChange={(e) => setEditForm({...editForm, nombre: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm outline-none focus:border-green-700 focus:ring-2 focus:ring-green-700/20" />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1.5 block">Apellido Paterno</label>
              <input value={editForm.apellidoPaterno} onChange={(e) => setEditForm({...editForm, apellidoPaterno: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm outline-none focus:border-green-700 focus:ring-2 focus:ring-green-700/20" />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1.5 block">Apellido Materno</label>
              <input value={editForm.apellidoMaterno} onChange={(e) => setEditForm({...editForm, apellidoMaterno: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm outline-none focus:border-green-700 focus:ring-2 focus:ring-green-700/20" />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1.5 block">Celular</label>
              <input value={editForm.celular} onChange={(e) => setEditForm({...editForm, celular: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-mono tracking-widest font-semibold outline-none focus:border-green-700 focus:ring-2 focus:ring-green-700/20" />
            </div>
          </div>

          <div className="bg-green-50 border border-green-100 p-3 rounded-xl flex items-start gap-3 mt-2">
            <ShieldCheck size={18} className="text-green-700 shrink-0 mt-0.5" />
            <p className="text-[11px] text-green-800 font-medium leading-relaxed">
              Por seguridad y regulaciones, el <strong className="font-bold">CI</strong> y la <strong className="font-bold">Comunidad</strong> están bloqueados para modificaciones directas.
            </p>
          </div>
        </div>

        <div className="bg-slate-50 px-6 py-4 flex justify-end gap-3 border-t border-slate-100">
          <button onClick={onClose} className="px-5 py-2.5 rounded-xl font-bold text-slate-500 bg-white border border-slate-200 hover:bg-slate-50 transition-colors text-xs uppercase tracking-wider">Cancelar</button>
          <button onClick={handleGuardar} className="px-5 py-2.5 bg-green-700 text-white rounded-xl font-bold uppercase tracking-wider text-xs hover:bg-green-800 transition-colors shadow-md">Guardar Cambios</button>
        </div>
      </div>
    </div>
  );
}