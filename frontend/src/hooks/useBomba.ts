"use client";

import { useState, useRef } from "react";
import { apiFetch } from "@/lib/api";
import { showSuccess, showError, confirmAction } from "@/lib/alerts";

export interface PosData {
  uid: string;
  placa: string;
  tipoVehiculo: string;
  nombrePropietario: string;
  comunidad: string;
  cupoMaximo: number;
  litrosConsumidos: number;
  cupoDisponible: number;
  estadoTurno: string;
}

export function useBomba() {
  const [posData, setPosData] = useState<PosData | null>(null);
  const [scanning, setScanning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const consultarTarjeta = () => {
    if (scanning) return;
    setScanning(true);
    setPosData(null);
    let intentos = 0;

    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(async () => {
      intentos++;
      try {
        const dataLector = await apiFetch("/lector/ultimo");
        const uid = typeof dataLector === "string" ? dataLector : dataLector?.uid;

        if (uid) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          try {
            const dataPos = await apiFetch(`/surtidor/pos/${encodeURIComponent(uid)}`);
            setPosData(dataPos);
            showSuccess("Cliente Identificado", "Verifique los datos con el conductor.");
          } catch (err: any) {
            showError(err.message || "Tarjeta no registrada en el sistema.");
          }
          setScanning(false);
          return;
        }
      } catch (err) {}

      if (intentos >= 15) {
        setScanning(false);
        if (intervalRef.current) clearInterval(intervalRef.current);
        showError("Tiempo de espera agotado. Acerque la tarjeta al lector NFC.");
      }
    }, 1500);
  };

  const limpiarConsulta = () => setPosData(null);

  const aceptarPago = async () => {
    const confirmado = await confirmAction("¿Confirmar Pago?", "Asegúrese de haber recibido el efectivo correspondiente.");
    if (confirmado) {
      showSuccess("Pago Confirmado", "Puede proceder con el siguiente cliente.");
      limpiarConsulta();
    }
  };

  const rechazarAlarma = async () => {
    const confirmado = await confirmAction("¿Rechazar Cliente?", "Se cancelará la operación y se registrará la alerta.");
    if (confirmado) {
      showError("Operación Rechazada por el Operador");
      limpiarConsulta();
    }
  };

  return {
    posData,
    scanning,
    consultarTarjeta,
    limpiarConsulta,
    aceptarPago,
    rechazarAlarma
  };
}