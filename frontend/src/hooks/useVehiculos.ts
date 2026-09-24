"use client";

import { useState, useEffect } from "react";
import { apiFetch } from "@/lib/api";
import { Vehiculo } from "@/types/vehiculo";
import { Propietario } from "@/types/propietario";
import { showSuccess, showError, confirmAction, promptPin } from "@/lib/alerts";

export function useVehiculos(itemsPerPage: number = 8) {
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
  const [propietarios, setPropietarios] = useState<Propietario[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const fetchVehiculos = async () => {
    try {
      setLoading(true);
      const [dataVehiculos, dataPropietarios] = await Promise.all([
        apiFetch("/vehiculos"),
        apiFetch("/propietarios")
      ]);
      setVehiculos(dataVehiculos);
      setPropietarios(dataPropietarios.filter((p: Propietario) => p.estado !== "INACTIVO"));
    } catch (err: any) {
      showError(err.message || "No se pudieron cargar los datos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchVehiculos(); }, []);

  const toggleEstado = async (idVehiculo: number, estadoActual: string) => {
    const accion = estadoActual === "ACTIVO" ? "desactivar" : "activar";
    const confirmado = await confirmAction(`¿${accion.toUpperCase()} VEHÍCULO?`, `El vehículo pasará a estado ${estadoActual === "ACTIVO" ? "INACTIVO" : "ACTIVO"}.`);
    if (!confirmado) return;

    try {
      await apiFetch(`/vehiculos/${idVehiculo}/baja`, { method: "PATCH" });
      showSuccess("Estado actualizado");
      fetchVehiculos();
    } catch (err: any) {
      showError(err.message || "Error al actualizar estado");
    }
  };

  const cambiarPin = async (idVehiculo: number) => {
    // AQUÍ REEMPLAZAMOS EL WINDOW.PROMPT POR NUESTRO SWEETALERT2
    const nuevoPin = await promptPin();
    if (!nuevoPin) return;

    try {
      await apiFetch(`/vehiculos/${idVehiculo}/pin`, {
        method: "PATCH",
        body: JSON.stringify({ nuevoPin })
      });
      showSuccess("PIN actualizado", "El PIN fue cambiado exitosamente.");
    } catch (err: any) {
      showError(err.message || "Error al actualizar PIN");
    }
  };

  const actualizarVehiculo = async (idVehiculo: number, payload: any) => {
    try {
      await apiFetch(`/vehiculos/${idVehiculo}`, {
        method: "PUT",
        body: JSON.stringify(payload)
      });
      showSuccess("Vehículo actualizado", "Los datos se guardaron correctamente.");
      fetchVehiculos();
      return true;
    } catch (err: any) {
      showError(err.message || "Error al actualizar vehículo");
      return false;
    }
  };

  const filtrados = vehiculos.filter((v) => {
    const termino = searchTerm.toLowerCase();
    return v.codigoPlaca?.toLowerCase().includes(termino) || v.nombrePropietario?.toLowerCase().includes(termino);
  });

  const totalPages = Math.ceil(filtrados.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = filtrados.slice(startIndex, startIndex + itemsPerPage);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  return { loading, searchTerm, handleSearch, currentData, currentPage, setCurrentPage, totalPages, totalFiltrados: filtrados.length, startIndex, itemsPerPage, toggleEstado, cambiarPin, actualizarVehiculo, propietarios };
}