"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "motion/react";
import { CreditCard, Wifi, CheckCircle2, RotateCcw, Car, Nfc, Users, Dices, ChevronDown, ShieldAlert } from "lucide-react";
import { vehiculoSchema, VehiculoFormValues } from "@/schemas/vehiculo.schema";
import { apiFetch } from "@/lib/api";
import { showSuccess, showError } from "@/lib/alerts";
import { Propietario } from "@/types/propietario";
import { useNfcScanner } from "@/hooks/useNfcScanner";
import { ModalBuscarPropietario } from "@/components/propietarios/modal-buscar-propietario";

const tipos = [
  { value: "AUTOMOVIL", label: "Automóvil" },
  { value: "MOTOCICLETA", label: "Motocicleta" },
];

export function VehiculoForm() {
  const router = useRouter();
  const [modalAbierto, setModalAbierto] = useState(false);
  const [propietarioSeleccionado, setPropietarioSeleccionado] = useState<Propietario | null>(null);
  const [errorPropietario, setErrorPropietario] = useState("");
  const [openTipoSelect, setOpenTipoSelect] = useState(false);

  const { register, handleSubmit, setValue, watch, formState: { errors, isSubmitting } } = useForm<VehiculoFormValues>({
    resolver: zodResolver(vehiculoSchema),
    mode: "onChange",
  });

  const { scanning, errorNfc, handleScan } = useNfcScanner(setValue);

  const idNfc = watch("idNfc");
  const tipoActual = watch("tipoAutomovil");

  function handleGenerarPin() {
    const pin = Math.floor(Math.random() * 10000).toString().padStart(4, "0");
    setValue("pinSeguridad", pin, { shouldValidate: true });
  }

  async function onSubmit(values: VehiculoFormValues) {
    if (!propietarioSeleccionado) {
      setErrorPropietario("Debes seleccionar un propietario.");
      return;
    }
    const payload = {
      idNfc: values.idNfc,
      codigoPlaca: values.codigoPlaca,
      pinSeguridad: values.pinSeguridad,
      tipo: values.tipoAutomovil,
      idPropietario: propietarioSeleccionado.idPropietario,
    };

    try {
      await apiFetch("/vehiculos", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      showSuccess("Registro Exitoso", "Vehículo guardado correctamente.");
      router.push("/dashboard/vehiculos");
    } catch (err: any) {
      showError(err.message || "Error al registrar el vehículo");
    }
  }

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-2xl shadow-card border border-slate-200 overflow-hidden">
        <div className="bg-green-800 px-6 py-5 flex items-center gap-4">
          <div className="bg-amber-500 p-2.5 rounded-xl shadow-lg shrink-0 text-green-950">
            <Car size={22} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-green-200 uppercase tracking-widest font-sans">Nuevo registro</p>
            <h1 className="text-lg font-black text-white uppercase tracking-tight font-display">Vehículo y Propietario</h1>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 p-6 items-stretch">
          <div className="flex-1 space-y-6 w-full flex flex-col justify-between">
            <div>
              <h2 className="text-green-800 font-bold border-b border-slate-100 pb-2 mb-3 flex items-center gap-2 font-display text-sm">
                <Users size={16} /> 1. Propietario
              </h2>
              {propietarioSeleccionado ? (
                <div className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 bg-slate-50 p-3">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-xl bg-green-700 flex items-center justify-center text-white font-black uppercase shrink-0 font-display text-sm">
                      {propietarioSeleccionado.nombreCompleto.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 leading-tight font-sans text-sm">{propietarioSeleccionado.nombreCompleto}</p>
                      <p className="text-[10px] font-mono text-slate-500 uppercase tracking-tight">CI: {propietarioSeleccionado.ci}</p>
                    </div>
                  </div>
                  <button type="button" onClick={() => setModalAbierto(true)} className="px-3 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-wider text-green-700 bg-white border border-green-700 hover:bg-green-50 transition-colors shrink-0 font-sans">
                    Cambiar
                  </button>
                </div>
              ) : (
                <button type="button" onClick={() => setModalAbierto(true)} className="w-full flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-300 p-3 text-sm font-bold text-slate-500 hover:border-green-700 hover:text-green-700 hover:bg-green-50/50 transition-all font-sans">
                  <Users size={16} /> Buscar propietario
                </button>
              )}
              {errorPropietario && <p className="mt-1.5 text-[10px] font-semibold text-red-500 font-sans">{errorPropietario}</p>}
            </div>

            <div className="flex-1">
              <h2 className="text-green-800 font-bold border-b border-slate-100 pb-2 mb-3 font-display text-sm">2. Datos del vehículo</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Campo label="Código de placa" error={errors.codigoPlaca?.message}>
                  <input placeholder="1234-ABC" {...register("codigoPlaca")} className={`${inputClass(errors.codigoPlaca)} font-mono tracking-widest uppercase font-semibold`} />
                </Campo>

                <Campo label="Tipo de vehículo" error={errors.tipoAutomovil?.message}>
                  <div className="relative font-sans">
                    <div onClick={() => setOpenTipoSelect(!openTipoSelect)} className={`w-full bg-slate-50 border rounded-xl p-2.5 text-sm outline-none cursor-pointer flex justify-between items-center transition-all ${errors.tipoAutomovil ? "border-red-300" : "border-slate-200 hover:border-green-700"}`}>
                      <span className={tipoActual ? "text-slate-800 font-semibold" : "text-slate-400"}>
                        {tipos.find(t => t.value === tipoActual)?.label || "Seleccionar tipo"}
                      </span>
                      <ChevronDown size={16} className={`text-slate-400 transition-transform duration-200 ${openTipoSelect ? "rotate-180" : ""}`} />
                    </div>
                    {openTipoSelect && (
                      <>
                        <div className="fixed inset-0 z-40" onClick={() => setOpenTipoSelect(false)}></div>
                        <div className="absolute z-50 w-full mt-1 bg-white border border-slate-100 rounded-xl shadow-xl overflow-hidden py-1">
                          {tipos.map((t) => (
                            <div key={t.value} onClick={() => { setValue("tipoAutomovil", t.value as any, { shouldValidate: true }); setOpenTipoSelect(false); }} className={`px-4 py-2 text-sm cursor-pointer transition-colors ${tipoActual === t.value ? "bg-green-50 text-green-800 font-bold" : "text-slate-600 hover:bg-slate-50 hover:text-green-800"}`}>
                              {t.label}
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </Campo>

                <div className="sm:col-span-2">
                  <Campo label="PIN de seguridad" error={errors.pinSeguridad?.message}>
                    <div className="flex gap-2">
                      <input placeholder="4 dígitos" inputMode="numeric" maxLength={4} {...register("pinSeguridad")} className={`${inputClass(errors.pinSeguridad)} font-mono tracking-[0.8em] text-center font-bold w-full text-base`} />
                      <button type="button" onClick={handleGenerarPin} className="shrink-0 flex items-center justify-center gap-1.5 px-4 rounded-xl border border-slate-200 bg-slate-50 text-slate-500 hover:bg-green-700 hover:text-white hover:border-green-700 transition-colors font-sans font-bold text-[11px]"><Dices size={16} /> Generar</button>
                    </div>
                  </Campo>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 lg:max-w-[320px] w-full flex flex-col">
            <h2 className="text-green-800 font-bold border-b border-slate-100 pb-2 mb-3 flex items-center gap-2 font-display text-sm">
              <Nfc size={16} /> 3. Vinculación NFC
            </h2>
            <div className={`flex-1 rounded-2xl border-2 border-dashed p-6 flex flex-col items-center justify-center text-center transition-colors ${errorNfc ? "border-red-300 bg-red-50" : "border-slate-300 bg-slate-50"}`}>
              <div className={`relative flex h-14 w-14 shrink-0 items-center justify-center rounded-full mb-3 ${errorNfc ? "bg-red-500" : "bg-green-700"}`}>
                <AnimatePresence mode="wait">
                  {errorNfc ? (
                    <motion.div key="error" initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}><ShieldAlert className="h-7 w-7 text-white" /></motion.div>
                  ) : idNfc ? (
                    <motion.div key="ok" initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}><CheckCircle2 className="h-7 w-7 text-white" /></motion.div>
                  ) : (
                    <motion.div key="wifi" animate={scanning ? { scale: [1, 1.15, 1] } : {}} transition={{ repeat: scanning ? Infinity : 0, duration: 1 }}><CreditCard className="h-7 w-7 text-white" /></motion.div>
                  )}
                </AnimatePresence>
                {scanning && <motion.span className="absolute inset-0 rounded-full border-4 border-amber-400" animate={{ scale: [1, 1.6], opacity: [0.6, 0] }} transition={{ repeat: Infinity, duration: 1.1 }} />}
              </div>
              <p className="font-bold text-slate-900 font-sans text-sm">{errorNfc ? "Tarjeta rechazada" : idNfc ? "Tarjeta vinculada" : scanning ? "Esperando escáner..." : "Acerca la tarjeta NFC"}</p>
              <p className="mt-1 mb-4 font-mono text-base tracking-widest text-green-700 font-black">{idNfc || "— — — — —"}</p>
              <button type="button" onClick={handleScan} disabled={scanning} className={`w-full flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold uppercase tracking-wider text-[11px] transition-all disabled:opacity-70 font-sans mt-auto ${idNfc && !errorNfc ? "bg-white text-green-700 border border-green-700 hover:bg-green-50" : "bg-amber-500 text-green-950 hover:bg-amber-600 shadow-md"}`}>
                {scanning ? "Buscando..." : idNfc && !errorNfc ? <><RotateCcw size={14} /> Volver a leer</> : <><Wifi size={14} /> Iniciar Lectura</>}
              </button>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 border-t border-slate-100 bg-slate-50/50 px-6 py-4">
          <button type="button" onClick={() => router.push("/dashboard/vehiculos")} className="px-5 py-2 rounded-xl font-bold text-slate-500 bg-white border border-slate-200 hover:bg-slate-50 transition-colors text-xs uppercase tracking-wider font-sans">Cancelar</button>
          <button type="submit" disabled={isSubmitting} className="px-5 py-2 bg-green-700 text-white rounded-xl font-bold uppercase tracking-wider text-xs hover:bg-green-800 transition-colors shadow-md disabled:opacity-60 font-sans">
            {isSubmitting ? "Guardando..." : "Guardar Vehículo"}
          </button>
        </div>
      </form>

      {/* Inyectamos el componente Modal separado */}
      <ModalBuscarPropietario
        isOpen={modalAbierto}
        onClose={() => setModalAbierto(false)}
        onSelect={(p) => { setPropietarioSeleccionado(p); setErrorPropietario(""); setModalAbierto(false); }}
        idSeleccionado={propietarioSeleccionado?.idPropietario}
      />
    </div>
  );
}

function inputClass(error?: { message?: string }, hasIcon: boolean = false) {
  return `w-full bg-slate-50 border rounded-xl p-2.5 text-sm font-sans outline-none focus:ring-2 focus:ring-green-700/20 transition-all ${error ? "border-red-300 focus:border-red-400" : "border-slate-200 focus:border-green-700"} ${hasIcon ? "pl-9" : ""}`;
}

function Campo({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1.5 block font-sans">{label}</label>
      {children}
      {error && <p className="mt-1 text-[10px] font-semibold text-red-500 font-sans">{error}</p>}
    </div>
  );
}