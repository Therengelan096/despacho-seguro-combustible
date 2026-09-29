import { useState, useRef } from "react";
import { apiFetch } from "@/lib/api";
import { showSuccess, showError } from "@/lib/alerts";

export function useNfcScanner(setValue: any) {
  const [scanning, setScanning] = useState(false);
  const [errorNfc, setErrorNfc] = useState("");
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  async function verificarDisponibilidadNfc(uid: string): Promise<boolean> {
    const data = await apiFetch(`/vehiculos/nfc/${encodeURIComponent(uid)}/disponible`);
    return Boolean(data.disponible);
  }

  function handleScan() {
    if (scanning) return;
    setScanning(true);
    setErrorNfc("");
    let intentos = 0;

    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(async () => {
      intentos++;
      try {
        const data = await apiFetch("/lector/ultimo");
        const scannedUid = typeof data === "string" ? data : data?.uid || data?.idNfc;

        if (!scannedUid) return;
        if (intervalRef.current) clearInterval(intervalRef.current);

        try {
          const disponible = await verificarDisponibilidadNfc(scannedUid);
          if (disponible) {
            setValue("idNfc", scannedUid, { shouldValidate: true });
            setErrorNfc("");
            showSuccess("Tarjeta vinculada", "La tarjeta NFC fue asignada correctamente.");
          } else {
            setValue("idNfc", "", { shouldValidate: true });
            setErrorNfc(`La tarjeta ${scannedUid} ya está asignada.`);
          }
        } catch (verifErr) {
          setErrorNfc("Error verificando disponibilidad.");
        }
        setScanning(false);
        return;
      } catch (err) {
        if (intentos >= 15) {
          setScanning(false);
          if (intervalRef.current) clearInterval(intervalRef.current);
          showError("Tiempo de espera agotado. Acerque la tarjeta de nuevo.");
        }
      }
    }, 1500);
  }

  return { scanning, errorNfc, handleScan };
}