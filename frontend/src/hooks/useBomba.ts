"use client";

import { useEffect, useState, useRef } from "react";
import { apiFetch } from "@/lib/api";
import { showSuccess, showError, confirmAction } from "@/lib/alerts";
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

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

  const procesandoRef = useRef(procesando);
  const posDataRef = useRef(posData);

  useEffect(() => {
    procesandoRef.current = procesando;
    posDataRef.current = posData;
  }, [procesando, posData]);

  useEffect(() => {
    const socketUrl = 'http://127.0.0.1:8080/ws-surtidor';

    const client = new Client({
      webSocketFactory: () => new SockJS(socketUrl),
      reconnectDelay: 5000,
      onConnect: () => {
        console.log("🟢 WebSocket Conectado al Surtidor");

        client.subscribe('/topic/escaneos', async (message) => {
          const dataLector = JSON.parse(message.body);

          if (dataLector && dataLector.uid && !procesandoRef.current && !posDataRef.current) {
            try {
              const dataPos = await apiFetch(`/surtidor/pos/${encodeURIComponent(dataLector.uid)}`);
              setPosData({ ...dataPos, litrosSolicitados: dataLector.litros });
              showSuccess("Autorización Solicitada", `El surtidor pide despachar ${dataLector.litros} Litros.`);
            } catch (e) {
              console.error("Error al consultar pos", e);
            }
          }
        });
      }
    });

    client.activate();

    return () => {
      client.deactivate();
    };
  }, []);

  const limpiarConsulta = () => setPosData(null);

  const confirmarDespacho = async (litros: number) => {
    if (!posData || procesando) return false;
    try {
      setProcesando(true);
      await apiFetch("/lector/aprobar", { method: "POST" });
      showSuccess("Despacho Aprobado", `Se autorizó la bomba física para despachar ${litros} L.`);
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
    const confirmado = await confirmAction("¿Rechazar Cliente?", "Se cancelará la operación y se registrará la alerta.");
    if (confirmado) {
      await apiFetch("/lector/rechazar", { method: "POST" });
      showError("Operación Rechazada por el Operador");
      limpiarConsulta();
    }
  };

  return { posData, procesando, limpiarConsulta, confirmarDespacho, rechazarAlarma };
}