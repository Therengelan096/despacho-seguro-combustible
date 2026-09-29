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
  litrosSolicitados?: string;
}

function mensajeDeError(error: unknown, mensajePredeterminado: string) {
  return error instanceof Error ? error.message : mensajePredeterminado;
}

export function useBomba() {
  const [posData, setPosData] = useState<PosData | null>(null);
  const [procesando, setProcesando] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const interval = setInterval(async () => {
      if (posData || procesando) return;
      try {
        const dataLector = await apiFetch("/lector/ultimo");
        const uid = typeof dataLector === "string" ? dataLector : dataLector?.uid;
        if (uid) {
          const dataPos = await apiFetch(`/surtidor/pos/${encodeURIComponent(uid)}`);
          setPosData({ ...dataPos, litrosSolicitados: dataLector.litros });
          showSuccess("Autorización Solicitada", `El surtidor pide despachar ${dataLector.litros} Litros.`);
        }
      } catch (e) {}
    }, 1500);
    return () => clearInterval(interval);
  }, [posData, procesando]);

  const limpiarConsulta = () => setPosData(null);

  const confirmarDespacho = async (litros: number) => {
    if (!posData || procesando) return false;
    try {
      setProcesando(true);
      await apiFetch("/lector/aprobar", { method: "POST" });
      showSuccess(
        "Despacho Aprobado",
        `Se autorizó la bomba física para despachar ${litros} L.`
      );
      limpiarConsulta();
      return true;
    } catch (err: unknown) {
      showError(mensajeDeError(err, "No se pudo autorizar el despacho."));
      return false;
    } finally {
      setProcesando(false);
    }
  };

  const rechazarAlarma = async () => {
    const confirmado = await confirmAction(
      "¿Rechazar Cliente?",
      "Se cancelará la operación y se registrará la alerta."
    );
    if (confirmado) {
      await apiFetch("/lector/rechazar", { method: "POST" });
      showError("Operación Rechazada por el Operador");
      limpiarConsulta();
    }
  };

  useEffect(
    () => () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    },
    []
  );

  return {
    posData,
    procesando,
    limpiarConsulta,
    confirmarDespacho,
    rechazarAlarma,
  };
}