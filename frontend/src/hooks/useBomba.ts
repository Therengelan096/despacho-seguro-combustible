"use client";

import { useEffect, useState, useRef } from "react";
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

function mensajeDeError(error: unknown, mensajePredeterminado: string) {
  return error instanceof Error ? error.message : mensajePredeterminado;
}

export function useBomba() {
  const [posData, setPosData] = useState<PosData | null>(null);
  const [scanning, setScanning] = useState(false);
  const [procesando, setProcesando] = useState(false);
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
        const uid =
          typeof dataLector === "string" ? dataLector : dataLector?.uid;

        if (uid) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          try {
            const dataPos = await apiFetch(
              `/surtidor/pos/${encodeURIComponent(uid)}`,
            );
            setPosData(dataPos);
            showSuccess(
              "Cliente Identificado",
              "Verifique los datos con el conductor.",
            );
          } catch (err: unknown) {
            showError(
              mensajeDeError(err, "Tarjeta no registrada en el sistema."),
            );
          }
          setScanning(false);
          return;
        }
      } catch {}

      if (intentos >= 15) {
        setScanning(false);
        if (intervalRef.current) clearInterval(intervalRef.current);
        showError(
          "Tiempo de espera agotado. Acerque la tarjeta al lector NFC.",
        );
      }
    }, 1500);
  };

  const limpiarConsulta = () => setPosData(null);

  const confirmarDespacho = async (litros: number) => {
    if (!posData || procesando) return false;

    try {
      setProcesando(true);
      await apiFetch("/surtidor/confirmar", {
        method: "POST",
        body: JSON.stringify({ uid: posData.uid, litros }),
      });
      showSuccess(
        "Despacho registrado",
        `Se registraron ${litros} L para ${posData.placa}.`,
      );
      limpiarConsulta();
      return true;
    } catch (err: unknown) {
      showError(mensajeDeError(err, "No se pudo registrar el despacho."));
      return false;
    } finally {
      setProcesando(false);
    }
  };

  const rechazarAlarma = async () => {
    const confirmado = await confirmAction(
      "¿Rechazar Cliente?",
      "Se cancelará la operación y se registrará la alerta.",
    );
    if (confirmado) {
      showError("Operación Rechazada por el Operador");
      limpiarConsulta();
    }
  };

  useEffect(
    () => () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    },
    [],
  );

  return {
    posData,
    scanning,
    procesando,
    consultarTarjeta,
    limpiarConsulta,
    confirmarDespacho,
    rechazarAlarma,
  };
}
