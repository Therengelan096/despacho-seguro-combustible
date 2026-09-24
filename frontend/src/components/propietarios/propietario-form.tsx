"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { propietarioSchema, PropietarioFormValues } from "@/schemas/propietario-shema";
import { UserPlus, User, IdCard, Smartphone, MapPin, ChevronDown } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { showSuccess, showError } from "@/lib/alerts";

const Comunidad = [
  { value: "CAJUATA", label: "CAJUATA" },
  { value: "SIQUIMIRANI", label: "SIQUIMIRANI" },
];

interface PropietariosFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function PropietariosForm({ onSuccess, onCancel }: PropietariosFormProps) {
  const [openSelect, setOpenSelect] = useState(false);

  const { register, handleSubmit, setValue, watch, formState: { errors, isSubmitting } } = useForm<PropietarioFormValues>({
    resolver: zodResolver(propietarioSchema),
  });

  const comunidadActual = watch("comunidad");

  async function onSubmit(values: PropietarioFormValues) {
    try {
      await apiFetch("/propietarios", {
        method: "POST",
        body: JSON.stringify(values),
      });
      showSuccess("Registro Exitoso", "Propietario registrado exitosamente");
      if (onSuccess) onSuccess();
    } catch (error: any) {
      showError(error.message || "No se pudo guardar el registro");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full bg-white rounded-2xl shadow-card border border-slate-200 overflow-hidden">
      <div className="bg-ypfb-blue px-6 py-5 flex items-center gap-4">
        <div className="bg-ypfb-yellow p-2.5 rounded-xl shadow-lg shrink-0 text-ypfb-navy">
          <UserPlus size={22} />
        </div>
        <div>
          <p className="text-[10px] font-bold text-blue-200 uppercase tracking-widest font-sans">Nuevo registro</p>
          <h1 className="text-lg font-black text-white uppercase tracking-tight font-display">Propietario</h1>
        </div>
      </div>

      <div className="p-6">
        <h2 className="text-ypfb-blue font-bold border-b border-slate-100 pb-2 mb-4 flex items-center gap-2 font-display text-sm">
          <User size={16} /> Datos del propietario
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Campo label="Nombre" error={errors.nombre?.message}>
            <input {...register("nombre")} className={inputClass(errors.nombre)} placeholder="Ej. Juan" />
          </Campo>

          <Campo label="Apellido paterno" error={errors.apellidoPaterno?.message}>
            <input {...register("apellidoPaterno")} className={inputClass(errors.apellidoPaterno)} placeholder="Ej. Pérez" />
          </Campo>

          <Campo label="Apellido materno" error={errors.apellidoMaterno?.message}>
            <input {...register("apellidoMaterno")} className={inputClass(errors.apellidoMaterno)} placeholder="Ej. Gómez" />
          </Campo>

          <Campo label="CI" error={errors.ci?.message} icon={<IdCard size={14} />}>
            <input {...register("ci")} className={`${inputClass(errors.ci, true)} font-mono tracking-widest font-semibold`} placeholder="Ej. 1234567" />
          </Campo>

          <Campo label="Celular" error={errors.celular?.message} icon={<Smartphone size={14} />}>
            <input inputMode="numeric" {...register("celular")} className={`${inputClass(errors.celular, true)} font-mono tracking-widest font-semibold`} placeholder="Ej. 71234567" />
          </Campo>

          <Campo label="Comunidad" error={errors.comunidad?.message} icon={<MapPin size={14} />}>
            <div className="relative font-sans">
              <div
                onClick={() => setOpenSelect(!openSelect)}
                className={`w-full bg-slate-50 border rounded-xl p-2.5 text-sm outline-none cursor-pointer flex justify-between items-center transition-all pl-9 ${
                  errors.comunidad ? "border-red-300" : "border-slate-200 hover:border-ypfb-blue"
                }`}
              >
                <span className={comunidadActual ? "text-slate-800 font-semibold" : "text-slate-400"}>
                  {comunidadActual || "Seleccionar comunidad"}
                </span>
                <ChevronDown size={16} className={`text-slate-400 transition-transform duration-200 ${openSelect ? "rotate-180" : ""}`} />
              </div>

              {openSelect && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setOpenSelect(false)}></div>
                  <div className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden py-1">
                    {Comunidad.map((item) => (
                      <div
                        key={item.value}
                        onClick={() => {
                          setValue("comunidad", item.value, { shouldValidate: true });
                          setOpenSelect(false);
                        }}
                        className={`px-4 py-2 text-sm cursor-pointer transition-colors ${
                          comunidadActual === item.value
                            ? "bg-blue-50 text-ypfb-blue font-bold"
                            : "text-slate-600 hover:bg-slate-50 hover:text-ypfb-blue"
                        }`}
                      >
                        {item.label}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </Campo>
        </div>
      </div>

      <div className="flex justify-end gap-3 border-t border-slate-100 bg-slate-50/50 px-6 py-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-5 py-2 rounded-xl font-bold text-slate-500 bg-white border border-slate-200 hover:bg-slate-50 transition-colors text-xs uppercase tracking-wider font-sans"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-5 py-2 bg-ypfb-blue text-white rounded-xl font-bold uppercase tracking-wider text-xs hover:bg-ypfb-darkblue transition-colors shadow-md disabled:opacity-60 disabled:cursor-not-allowed font-sans"
        >
          {isSubmitting ? "Guardando..." : "Guardar Propietario"}
        </button>
      </div>
    </form>
  );
}

function inputClass(error?: { message?: string }, hasIcon: boolean = false) {
  return `w-full bg-slate-50 border rounded-xl p-2.5 text-sm font-sans outline-none focus:ring-2 focus:ring-ypfb-blue/20 transition-all ${error ? "border-red-300 focus:border-red-400" : "border-slate-200 focus:border-ypfb-blue"} ${hasIcon ? "pl-9" : ""}`;
}

function Campo({ label, error, icon, children }: { label: string; error?: string; icon?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="relative">
      <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1.5 flex items-center gap-1.5 font-sans">
        {label}
      </label>
      <div className="relative">
        {icon && <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 z-10 pointer-events-none">{icon}</span>}
        {children}
      </div>
      {error && <p className="mt-1 text-[10px] font-semibold text-red-500 font-sans">{error}</p>}
    </div>
  );
}