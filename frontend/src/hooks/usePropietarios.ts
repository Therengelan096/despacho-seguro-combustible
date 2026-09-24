import { useState, useEffect } from "react";
import { apiFetch } from "@/lib/api";
import { Propietario } from "@/types/propietario";
import { showSuccess, showError, confirmAction } from "@/lib/alerts";

export function usePropietarios(itemsPerPage: number = 12) {
  const [propietarios, setPropietarios] = useState<Propietario[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const fetchPropietarios = async () => {
    try {
      setLoading(true);
      const data = await apiFetch("/propietarios");
      setPropietarios(data);
    } catch (err: any) {
      showError(err.message || "Error al cargar propietarios");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPropietarios(); }, []);

  const toggleEstado = async (ci: string, estadoActual: string) => {
    const accion = estadoActual === "ACTIVO" ? "desactivar" : "activar";
    const confirmado = await confirmAction(`¿${accion.toUpperCase()} CLIENTE?`, `El cliente pasará a estado ${estadoActual === "ACTIVO" ? "INACTIVO" : "ACTIVO"}.`);

    if (!confirmado) return;

    try {
      await apiFetch(`/propietarios/${ci}/baja`, { method: "PATCH" });
      showSuccess("Estado actualizado");
      fetchPropietarios();
    } catch (err: any) {
      showError(err.message || "Error al actualizar estado");
    }
  };

  const actualizarPropietario = async (ci: string, payload: any) => {
    try {
      await apiFetch(`/propietarios/${ci}`, {
        method: "PUT",
        body: JSON.stringify(payload)
      });
      showSuccess("Propietario actualizado", "Los datos se guardaron correctamente.");
      fetchPropietarios();
      return true;
    } catch (err: any) {
      showError(err.message || "Error al actualizar propietario");
      return false;
    }
  };

  const filtrados = propietarios.filter((p) => {
    const termino = searchTerm.toLowerCase();
    return p.nombreCompleto?.toLowerCase().includes(termino) || p.ci?.toLowerCase().includes(termino);
  });

  const totalPages = Math.ceil(filtrados.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = filtrados.slice(startIndex, startIndex + itemsPerPage);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  return { loading, searchTerm, handleSearch, currentData, currentPage, setCurrentPage, totalPages, totalFiltrados: filtrados.length, startIndex, itemsPerPage, toggleEstado, actualizarPropietario };
}