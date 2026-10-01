"use client";

import { useState, useRef, useEffect } from "react";
import { apiFetch } from "@/lib/api";
import { showSuccess, showError } from "@/lib/alerts";
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

export function useNfcScanner(setValue: any) {
  const [scanning, setScanning] = useState(false);
  const [errorNfc, setErrorNfc] = useState("");
  const stompClientRef = useRef<Client | null>(null);

  async function verificarDisponibilidadNfc(uid: string): Promise<boolean> {
    const data = await apiFetch(`/vehiculos/nfc/${encodeURIComponent(uid)}/disponible`);
    return Boolean(data.disponible);
  }

  useEffect(() => {
    return () => {
      if (stompClientRef.current) {
        stompClientRef.current.deactivate();
      }
    };
  }, []);

  function handleScan() {
    if (scanning) return;
    setScanning(true);
    setErrorNfc("");

    const socketUrl = `http://${window.location.hostname}:8080/ws-surtidor`;
    const client = new Client({
      webSocketFactory: () => new SockJS(socketUrl),
      onConnect: () => {
        client.subscribe('/topic/escaneos', async (message) => {
          const data = JSON.parse(message.body);
          const scannedUid = data.uid;

          if (scannedUid) {
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
            client.deactivate();
          }
        });
      },
      onStompError: () => {
        setErrorNfc("Error conectando con el escáner");
        setScanning(false);
      }
    });

    stompClientRef.current = client;
    client.activate();

    setTimeout(() => {
      if (client.active) {
        client.deactivate();
        setScanning(false);
        showError("Tiempo de espera agotado. Acerque la tarjeta de nuevo.");
      }
    }, 15000);
  }

  return { scanning, errorNfc, handleScan };
}