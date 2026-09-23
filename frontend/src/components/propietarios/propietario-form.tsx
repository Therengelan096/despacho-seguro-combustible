"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { propietarioSchema, PropietarioFormValues } from "@/schemas/propietario-shema";
import { UserPlus, User, IdCard, Smartphone, MapPin } from "lucide-react";


const Comunidad = [
  { value: "CAJUATA", label: "CAJUATA" },
  { value: "SIQUIMIRANI", label: "SIQUIMIRANI" },
];

interface PropietariosFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function PropietariosForm({ onSuccess, onCancel }: PropietariosFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PropietarioFormValues>({
    resolver: zodResolver(propietarioSchema),
  });

  async function onSubmit(values: PropietarioFormValues) {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch("http://localhost:8080/api/propietarios", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error("Error al registrar el propietario");
      }

      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Hubo un problema con la petición:", error);
      alert("No se pudo guardar el registro");
    }
  }

  return (
    <section className="min-h-screen bg-gray-50 p-4 sm:p-8 font-sans antialiased">
      <form onSubmit={handleSubmit(onSubmit)} className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

          
          <div className="bg-[#004a8e] px-8 py-6 flex items-center gap-4">
            <div className="bg-[#f5d000] p-3 rounded-xl shadow-lg shrink-0">
              <UserPlus className="text-[#004a8e]" size={24} />
            </div>
            <div>
              <p className="text-[11px] font-bold text-blue-200 uppercase tracking-widest">Nuevo registro</p>
              <h1 className="text-xl font-black text-white uppercase tracking-tight">Propietario</h1>
            </div>
          </div>

          
          <div className="p-8">
            <h2 className="text-[#004a8e] font-bold border-b border-gray-100 pb-2 mb-5 flex items-center gap-2">
              <User size={16} /> Datos del propietario
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Campo label="Nombre" error={errors.nombre?.message}>
                <input
                  {...register("nombre")}
                  className={inputClass(errors.nombre)}
                />
              </Campo>

              <Campo label="Apellido paterno" error={errors.apellidoPaterno?.message}>
                <input
                  {...register("apellidoPaterno")}
                  className={inputClass(errors.apellidoPaterno)}
                />
              </Campo>

              <Campo label="Apellido materno" error={errors.apellidoMaterno?.message}>
                <input
                  {...register("apellidoMaterno")}
                  className={inputClass(errors.apellidoMaterno)}
                />
              </Campo>

              <Campo label="CI" error={errors.ci?.message} icon={<IdCard size={14} />}>
                <input
                  {...register("ci")}
                  className={`${inputClass(errors.ci)} font-mono`}
                />
              </Campo>

              <Campo label="Celular" error={errors.celular?.message} icon={<Smartphone size={14} />}>
                <input
                  inputMode="numeric"
                  {...register("celular")}
                  className={`${inputClass(errors.celular)} font-mono`}
                />
              </Campo>

              <Campo label="Comunidad" error={errors.comunidad?.message} icon={<MapPin size={14} />}>
                <select
                  {...register("comunidad")}
                  className={inputClass(errors.comunidad)}
                >
                  <option value="">Seleccionar comunidad</option>
                  {Comunidad.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </Campo>
            </div>
          </div>

          {/* botones de accion */}
          <div className="flex justify-end gap-3 border-t border-gray-100 bg-gray-50 px-8 py-5">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2.5 rounded-xl font-bold text-gray-500 bg-white border border-gray-200 hover:bg-gray-100 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-[#004a8e] text-white rounded-xl font-black uppercase tracking-widest hover:bg-[#003566] transition-colors shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Guardando..." : "Guardar"}
            </button>
          </div>
        </div>
      </form>
    </section>
  );
}

/* --- helpers de estilo, mismo lenguaje visual de la vista de propietarios --- */

function inputClass(error?: { message?: string }) {
  return `w-full bg-gray-50 border rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-[#f5d000]/20 transition-all ${
    error ? "border-red-300 focus:border-red-400" : "border-gray-200 focus:border-[#f5d000]"
  }`;
}

function Campo({
  label,
  error,
  icon,
  children,
}: {
  label: string;
  error?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="text-xs font-bold text-gray-500 flex items-center gap-1.5 mb-1">
        {icon}
        {label}
      </label>
      {children}
      {error && <p className="mt-1 text-[11px] font-semibold text-red-500">{error}</p>}
    </div>
  );
}