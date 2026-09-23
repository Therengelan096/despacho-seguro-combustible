"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "motion/react";
import {
  CreditCard,
  Wifi,
  CheckCircle2,
  RotateCcw,
  Car,
  Nfc,
  Users,
  Search,
  Check,
  X,
  ShieldAlert,
  Dices,
} from "lucide-react";
import { vehiculoSchema, VehiculoFormValues } from "@/schemas/vehiculo.schema";

const tipos = [
  { value: "AUTOMOVIL", label: "Automovil" },
  { value: "MOTOCICLETA", label: "Motocicleta" },
];

interface Propietario {
  idPropietario: number;
  nombreCompleto: string;
  ci: string;
  celular?: string;
  comunidad?: string;
}

export function VehiculoForm() {
  const router = useRouter();
  const [scanning, setScanning] = useState(false);
  const [errorNfc, setErrorNfc] = useState("");
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // --- selector de propietario ---
  const [propietarios, setPropietarios] = useState<Propietario[]>([]);
  const [cargandoPropietarios, setCargandoPropietarios] = useState(false);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const [propietarioSeleccionado, setPropietarioSeleccionado] = useState<Propietario | null>(null);
  const [errorPropietario, setErrorPropietario] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<VehiculoFormValues>({
    resolver: zodResolver(vehiculoSchema),
    mode: "onChange",
  });

  const idNfc = watch("idNfc");

  async function abrirModalPropietarios() {
    setModalAbierto(true);
    if (propietarios.length > 0) return;

    try {
      setCargandoPropietarios(true);
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:8080/api/propietarios", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error("No se pudo cargar la lista de propietarios");
      const data = await response.json();
      setPropietarios(data);
    } catch (err) {
      console.error(err);
      alert("No se pudo cargar la lista de propietarios");
    } finally {
      setCargandoPropietarios(false);
    }
  }

  function seleccionarPropietario(p: Propietario) {
    setPropietarioSeleccionado(p);
    setErrorPropietario("");
    setModalAbierto(false);
    setBusqueda("");
  }

  const propietariosFiltrados = propietarios.filter((p) => {
    const termino = busqueda.toLowerCase();
    return (
      p.nombreCompleto?.toLowerCase().includes(termino) || p.ci?.includes(busqueda)
    );
  });

  // Consulta el endpoint que ya tienes en el backend
  // (GET /api/vehiculos/nfc/{idNfc}/disponible) para saber si esa
  // tarjeta ya está vinculada a otro vehículo antes de aceptarla.
  async function verificarDisponibilidadNfc(uid: string): Promise<boolean> {
    const token = localStorage.getItem("token");
    const response = await fetch(
      `http://localhost:8080/api/vehiculos/nfc/${encodeURIComponent(uid)}/disponible`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (!response.ok) {
      throw new Error("No se pudo verificar la disponibilidad de la tarjeta.");
    }
    const data = await response.json(); // { disponible: boolean }
    return Boolean(data.disponible);
  }

  function handleScan() {
    if (scanning) return;

    setScanning(true);
    setErrorNfc("");
    let intentos = 0;
    const maxIntentos = 15; // 15 intentos * 1.5s = 22.5 segundos de espera

    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(async () => {
      intentos++;
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:8080/api/lector/ultimo", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        console.log(`[NFC Polling Intento ${intentos}] Status HTTP:`, response.status);

        if (response.status === 200) {
          const data = await response.json();
          console.log("[NFC Polling] Datos recibidos de la API:", data);

          // Extrae la clave soportando diferentes nombres de propiedad (uid, idNfc, codigo, etc.)
          const scannedUid =
            typeof data === "string"
              ? data
              : data?.uid || data?.idNfc || data?.codigo || data?.id;

          if (!scannedUid) {
            console.warn(
              "[NFC Polling] Se recibió 200 OK pero el campo UID vino vacío o con un nombre no reconocido en:",
              data
            );
            return; // Continúa esperando el siguiente intento
          }

          // Si obtuvimos un UID válido, detenemos la consulta continua
          if (intervalRef.current) clearInterval(intervalRef.current);

          // --- Verificación y asignación ---
          try {
            const disponible = await verificarDisponibilidadNfc(scannedUid);
            if (disponible) {
              setValue("idNfc", scannedUid, { shouldValidate: true });
              setErrorNfc("");
            } else {
              setValue("idNfc", "", { shouldValidate: true });
              setErrorNfc(
                `La tarjeta ${scannedUid} ya está asignada a otro vehículo. Usa otra tarjeta.`
              );
            }
          } catch (verifErr) {
            console.error("Error verificando disponibilidad del NFC:", verifErr);
            setErrorNfc("No se pudo verificar la tarjeta. Intenta de nuevo.");
          }

          setScanning(false);
          return;
        }

        // Si se agota el número de intentos
        if (intentos >= maxIntentos) {
          setScanning(false);
          if (intervalRef.current) clearInterval(intervalRef.current);
          alert("Tiempo de espera agotado. Por favor, acerque la tarjeta al lector y vuelva a presionar el botón.");
        }
      } catch (err) {
        console.error("Error consultando el lector NFC:", err);
        setScanning(false);
        if (intervalRef.current) clearInterval(intervalRef.current);
        alert("Error de conexión con el servidor. Verifique que la API esté en ejecución.");
      }
    }, 1500);
  }

  // Genera un PIN aleatorio de 4 dígitos (0000-9999, con ceros a la izquierda)
  // y lo carga directamente en el campo, validándolo al instante.
  function handleGenerarPin() {
    const pin = Math.floor(Math.random() * 10000).toString().padStart(4, "0");
    setValue("pinSeguridad", pin, { shouldValidate: true });
  }

  async function onSubmit(values: VehiculoFormValues) {
    if (!propietarioSeleccionado) {
      setErrorPropietario("Debes seleccionar un propietario para este vehículo.");
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
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:8080/api/vehiculos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const texto = await response.text().catch(() => "");
        throw new Error(texto || "Error al registrar el vehículo");
      }

      alert("Vehículo registrado correctamente");
      router.push("/dashboard/vehiculos");
    } catch (err) {
      console.error("Hubo un problema con la petición:", err);
      alert(err instanceof Error ? err.message : "No se pudo guardar el vehículo");
    }
  }

  return (
    <section className="min-h-screen bg-gray-50 p-4 sm:p-8 font-sans antialiased">
      <form onSubmit={handleSubmit(onSubmit)} className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

          {/* cabecera del formulario */}
          <div className="bg-[#004a8e] px-8 py-6 flex items-center gap-4">
            <div className="bg-[#f5d000] p-3 rounded-xl shadow-lg shrink-0">
              <Car className="text-[#004a8e]" size={24} />
            </div>
            <div>
              <p className="text-[11px] font-bold text-blue-200 uppercase tracking-widest">Nuevo registro</p>
              <h1 className="text-xl font-black text-white uppercase tracking-tight">Vehículo y propietario</h1>
            </div>
          </div>

          <div className="flex flex-col gap-8 p-8">
            {/* propietario vinculado */}
            <div>
              <h2 className="text-[#004a8e] font-bold border-b border-gray-100 pb-2 mb-3 flex items-center gap-2">
                <Users size={16} /> Propietario
              </h2>

              {propietarioSeleccionado ? (
                <div className="flex items-center justify-between gap-4 rounded-xl border border-gray-200 bg-gray-50 p-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-[#004a8e] flex items-center justify-center text-white font-black uppercase shrink-0">
                      {propietarioSeleccionado.nombreCompleto.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 leading-tight">{propietarioSeleccionado.nombreCompleto}</p>
                      <p className="text-[11px] font-mono text-gray-500 uppercase">CI: {propietarioSeleccionado.ci}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={abrirModalPropietarios}
                    className="px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider text-[#004a8e] bg-white border-2 border-[#004a8e] hover:bg-blue-50 transition-colors shrink-0"
                  >
                    Cambiar
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={abrirModalPropietarios}
                  className="w-full flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-300 p-5 text-sm font-bold text-gray-500 hover:border-[#004a8e] hover:text-[#004a8e] hover:bg-blue-50/40 transition-all"
                >
                  <Users size={18} /> Seleccionar propietario existente
                </button>
              )}
              {errorPropietario && (
                <p className="mt-2 text-[11px] font-semibold text-red-500">{errorPropietario}</p>
              )}
            </div>

            <div>
              <h2 className="text-[#004a8e] font-bold border-b border-gray-100 pb-2 mb-3 flex items-center gap-2">
                <Nfc size={16} /> Tarjeta NFC
              </h2>

              <div
                className={`overflow-hidden rounded-2xl border-2 border-dashed p-6 transition-colors ${
                  errorNfc ? "border-red-300 bg-red-50/40" : "border-[#004a8e]/25 bg-blue-50/40"
                }`}
              >
                <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
                  <div
                    className={`relative flex h-16 w-16 shrink-0 items-center justify-center rounded-full ${
                      errorNfc ? "bg-red-500" : "bg-[#004a8e]"
                    }`}
                  >
                    <AnimatePresence mode="wait">
                      {errorNfc ? (
                        <motion.div key="error" initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                          <ShieldAlert className="h-7 w-7 text-white" />
                        </motion.div>
                      ) : idNfc ? (
                        <motion.div
                          key="ok"
                          initial={{ scale: 0.6, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                        >
                          <CheckCircle2 className="h-7 w-7 text-white" />
                        </motion.div>
                      ) : (
                        <motion.div
                          key="wifi"
                          animate={scanning ? { scale: [1, 1.15, 1] } : {}}
                          transition={{ repeat: scanning ? Infinity : 0, duration: 1 }}
                        >
                          <CreditCard className="h-7 w-7 text-white" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                    {scanning && (
                      <motion.span
                        className="absolute inset-0 rounded-full border-2 border-[#f5d000]"
                        animate={{ scale: [1, 1.6], opacity: [0.6, 0] }}
                        transition={{ repeat: Infinity, duration: 1.1 }}
                      />
                    )}
                  </div>

                  <div className="flex-1">
                    <p className="font-bold text-gray-900">
                      {errorNfc
                        ? "Tarjeta rechazada"
                        : idNfc
                        ? "Tarjeta leída correctamente"
                        : scanning
                        ? "Esperando lectura, acerque la tarjeta..."
                        : "Acerca la tarjeta NFC al lector"}
                    </p>
                    <p className="mt-0.5 font-mono text-lg tracking-widest text-[#004a8e]">
                      {idNfc || "— — — — — — — —"}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleScan}
                    disabled={scanning}
                    className={`w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-black uppercase tracking-wider text-xs transition-all active:scale-95 disabled:cursor-not-allowed disabled:opacity-70 ${
                      idNfc && !errorNfc
                        ? "bg-white text-[#004a8e] border-2 border-[#004a8e] hover:bg-blue-50"
                        : "bg-[#f5d000] text-[#004a8e] hover:bg-[#e6c200] shadow-md"
                    }`}
                  >
                    {scanning ? (
                      "Buscando..."
                    ) : idNfc && !errorNfc ? (
                      <>
                        <RotateCcw size={16} /> Volver a leer
                      </>
                    ) : (
                      <>
                        <Wifi size={16} /> Leer tarjeta
                      </>
                    )}
                  </button>
                </div>
                {errorNfc && (
                  <p className="mt-3 text-xs font-semibold text-red-500 flex items-center gap-1.5">
                    <ShieldAlert size={14} /> {errorNfc}
                  </p>
                )}
                {errors.idNfc && !errorNfc && (
                  <p className="mt-3 text-xs font-semibold text-red-500">{errors.idNfc.message}</p>
                )}
              </div>
            </div>

            {/* datos del vehiculo */}
            <div>
              <h2 className="text-[#004a8e] font-bold border-b border-gray-100 pb-2 mb-3">
                Datos del vehículo
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Campo label="Código de placa" error={errors.codigoPlaca?.message}>
                  <input
                    placeholder="1234-ABC"
                    {...register("codigoPlaca")}
                    className={`${inputClass(errors.codigoPlaca)} font-mono`}
                  />
                </Campo>

                <Campo label="Tipo de automovil" error={errors.tipoAutomovil?.message}>
                  <select
                    defaultValue=""
                    {...register("tipoAutomovil")}
                    className={inputClass(errors.tipoAutomovil)}
                  >
                    <option value="" disabled>
                      Selecciona un tipo
                    </option>
                    {tipos.map((t) => (
                      <option key={t.value} value={t.value}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                </Campo>

                <Campo label="PIN de seguridad" error={errors.pinSeguridad?.message}>
                  <div className="flex gap-2">
                    <input
                      placeholder="4 dígitos"
                      inputMode="numeric"
                      maxLength={4}
                      {...register("pinSeguridad")}
                      className={`${inputClass(errors.pinSeguridad)} font-mono tracking-[0.5em] text-center`}
                    />
                    <button
                      type="button"
                      onClick={handleGenerarPin}
                      title="Generar PIN aleatorio"
                      className="shrink-0 flex items-center justify-center gap-1.5 px-3 rounded-lg border border-gray-200 bg-gray-50 text-gray-500 hover:bg-[#004a8e] hover:text-white hover:border-[#004a8e] transition-colors"
                    >
                      <Dices size={18} />
                    </button>
                  </div>
                </Campo>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 border-t border-gray-100 bg-gray-50 px-8 py-5">
            <button
              type="button"
              onClick={() => router.push("/dashboard/vehiculos")}
              className="px-6 py-2.5 rounded-xl font-bold text-gray-500 bg-white border border-gray-200 hover:bg-gray-100 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-[#004a8e] text-white rounded-xl font-black uppercase tracking-widest hover:bg-[#003566] transition-colors shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Guardando..." : "Guardar vehiculo"}
            </button>
          </div>
        </div>
      </form>

      {/* modal para elegir propietario existente */}
      {modalAbierto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1B263B]/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
            <div className="bg-[#004a8e] p-5 text-white flex justify-between items-center shrink-0">
              <h2 className="text-lg font-black uppercase flex items-center gap-2">
                <Users size={20} className="text-[#f5d000]" /> Elegir propietario
              </h2>
              <button
                type="button"
                onClick={() => setModalAbierto(false)}
                className="hover:bg-blue-800 p-1.5 rounded-lg transition-colors"
              >
                <X size={22} />
              </button>
            </div>

            <div className="p-4 border-b border-gray-100 shrink-0">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="text"
                  autoFocus
                  placeholder="Buscar por nombre o CI..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#f5d000] outline-none transition-all text-sm"
                />
              </div>
            </div>

            <div className="overflow-y-auto p-2">
              {cargandoPropietarios ? (
                <p className="text-center py-10 font-bold text-gray-400 text-sm">Cargando propietarios...</p>
              ) : propietariosFiltrados.length === 0 ? (
                <p className="text-center py-10 font-bold text-gray-400 text-sm">No se encontraron propietarios</p>
              ) : (
                propietariosFiltrados.map((p) => {
                  const activo = propietarioSeleccionado?.idPropietario === p.idPropietario;
                  return (
                    <button
                      type="button"
                      key={p.idPropietario}
                      onClick={() => seleccionarPropietario(p)}
                      className={`w-full flex items-center justify-between gap-3 p-3 rounded-xl transition-colors text-left ${
                        activo ? "bg-blue-50" : "hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-lg bg-gray-100 flex items-center justify-center text-[#004a8e] font-black uppercase shrink-0">
                          {p.nombreCompleto.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 text-sm leading-tight">{p.nombreCompleto}</p>
                          <p className="text-[11px] font-mono text-gray-500 uppercase">CI: {p.ci}</p>
                        </div>
                      </div>
                      {activo && <Check size={18} className="text-[#004a8e] shrink-0" />}
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

/* --- helpers de estilo --- */

function inputClass(error?: { message?: string }) {
  return `w-full bg-gray-50 border rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-[#f5d000]/20 transition-all ${
    error ? "border-red-300 focus:border-red-400" : "border-gray-200 focus:border-[#f5d000]"
  }`;
}

function Campo({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="text-xs font-bold text-gray-500 mb-1 block">{label}</label>
      {children}
      {error && <p className="mt-1 text-[11px] font-semibold text-red-500">{error}</p>}
    </div>
  );
}
