"use client";

import { useState, useEffect } from "react";
import { apiFetch } from "@/lib/api";
import { Recarga } from "@/types/recarga";

export function useHistorial() {
  const [historial, setHistorial] = useState<Recarga[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchHistorial = async () => {
      try {
        setLoading(true);
        const data = await apiFetch("/historial");
        setHistorial(data);
        setError("");
      } catch (err: any) {
        setError(err.message || "Error al cargar el historial de recargas");
      } finally {
        setLoading(false);
      }
    };
    fetchHistorial();
  }, []);

  const filtrados = historial.filter((h) => {
    const termino = searchTerm.toLowerCase();
    return (
      h.placa?.toLowerCase().includes(termino) ||
      h.propietario?.toLowerCase().includes(termino)
    );
  });

  const totalLitros = filtrados.reduce((sum, h) => sum + h.litrosDespachados, 0);
  const totalMonto = totalLitros * 3.72;

  return {
    historial: filtrados,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    totalLitros,
    totalMonto
  };
}