"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { toast } from "sonner";
import { RefreshCcw, ShieldCheck, ChevronLeft, ChevronRight, Download } from "lucide-react";

interface AuditoriaLog {
  idLog: number;
  fechaHora: string;
  usuario: string;
  tipoEvento: string;
  modulo: string;
  detalle: string;
  ipOrigen: string;
}

interface PageResponse {
  content: AuditoriaLog[];
  totalPages: number;
  totalElements: number;
  number: number;
}

export default function AuditoriaPage() {
  const [logs, setLogs] = useState<AuditoriaLog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [paginaActual, setPaginaActual] = useState<number>(0);
  const [totalPaginas, setTotalPaginas] = useState<number>(0);

  const cargarLogs = async (page: number) => {
    setLoading(true);
    try {
      const data: PageResponse = await apiFetch(`/auditoria?page=${page}&size=10`);
      setLogs(data.content || []);
      setTotalPaginas(data.totalPages || 1);
    } catch (error: any) {
      toast.error("Error al obtener los registros de auditoría");
      console.error("Error auditoria:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarLogs(paginaActual);
  }, [paginaActual]);

  const exportarExcel = async () => {
    try {
      toast.loading("Generando archivo Excel...", { id: "exportExcel" });

      // Obtenemos una muestra grande (ej. 1000 registros) para el Excel, no solo los 10 de la página actual
      const data: PageResponse = await apiFetch(`/auditoria?page=0&size=1000`);
      const logsParaExportar = data.content || [];

      if (logsParaExportar.length === 0) {
        toast.error("No hay datos para exportar", { id: "exportExcel" });
        return;
      }

      // Preparamos las cabeceras
      const cabeceras = ["ID", "Fecha / Hora", "Usuario", "Evento", "Módulo", "Detalle", "IP Origen"];

      // Formateamos las filas
      const filas = logsParaExportar.map(log => [
        log.idLog,
        new Date(log.fechaHora).toLocaleString(),
        log.usuario,
        log.tipoEvento,
        log.modulo,
        `"${log.detalle}"`, // Encapsulamos el detalle en comillas por si tiene comas
        log.ipOrigen
      ]);

      // Unimos todo en formato CSV
      const contenidoCSV = [
        cabeceras.join(","),
        ...filas.map(fila => fila.join(","))
      ].join("\n");

      // \uFEFF es el BOM (Byte Order Mark) para que Excel lea los acentos y ñ correctamente en UTF-8
      const blob = new Blob(["\uFEFF" + contenidoCSV], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `Auditoria_GAM_Inquisivi_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success("Archivo Excel descargado correctamente", { id: "exportExcel" });
    } catch (error) {
      toast.error("Error al generar el archivo", { id: "exportExcel" });
    }
  };

  const getBadgeStyle = (tipoEvento: string) => {
    const evento = (tipoEvento || "").toUpperCase();
    if (evento.includes("ALERTA") || evento.includes("ERROR") || evento.includes("RECHAZAR") || evento.includes("FAIL")) {
      return "bg-red-50 text-red-600 border-red-200";
    }
    if (evento.includes("APROBAR") || evento.includes("OK") || evento.includes("DESPACHO") || evento.includes("EXITOSO") || evento.includes("CREAR")) {
      return "bg-green-50 text-green-700 border-green-200";
    }
    return "bg-amber-50 text-amber-700 border-amber-200";
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-xs font-extrabold uppercase tracking-widest text-amber-600 font-sans">
            REGISTRO INMUTABLE
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display flex items-center gap-3">
            Auditoría del Sistema
          </h1>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={exportarExcel}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 hover:border-green-700 text-slate-700 px-5 py-3 rounded-xl font-bold transition-all shadow-sm active:scale-95 uppercase tracking-wider text-xs font-sans"
          >
            <Download size={18} className="text-green-700" /> Exportar
          </button>
          <button
            onClick={() => cargarLogs(paginaActual)}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-green-950 px-5 py-3 rounded-xl font-black transition-all shadow-md active:scale-95 uppercase tracking-wider text-xs"
          >
            <RefreshCcw size={18} /> Actualizar
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-card border border-slate-200 overflow-hidden flex flex-col">
        {loading ? (
          <div className="p-16 text-center text-slate-400 font-bold text-sm uppercase tracking-wider">
            Cargando registros...
          </div>
        ) : logs.length === 0 ? (
          <div className="p-16 text-center text-slate-400 font-bold text-sm uppercase tracking-wider">
            No hay eventos de auditoría registrados.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold text-green-950 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-4 text-xs font-bold text-green-950 uppercase tracking-wider">Fecha / Hora</th>
                  <th className="px-6 py-4 text-xs font-bold text-green-950 uppercase tracking-wider">Usuario</th>
                  <th className="px-6 py-4 text-xs font-bold text-green-950 uppercase tracking-wider">Evento</th>
                  <th className="px-6 py-4 text-xs font-bold text-green-950 uppercase tracking-wider">Módulo</th>
                  <th className="px-6 py-4 text-xs font-bold text-green-950 uppercase tracking-wider">Detalle</th>
                  <th className="px-6 py-4 text-xs font-bold text-green-950 uppercase tracking-wider text-right">IP Origen</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {logs.map((log) => (
                  <tr key={log.idLog} className="transition-colors hover:bg-green-50/50 group">
                    <td className="px-6 py-4 whitespace-nowrap align-middle">
                      <span className="font-mono text-sm font-bold text-slate-400">#{log.idLog}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap align-middle">
                      <span className="text-sm font-semibold text-slate-700">
                        {new Date(log.fechaHora).toLocaleString()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap align-middle">
                      <span className="text-sm font-bold text-slate-900 flex items-center gap-2">
                        <ShieldCheck size={14} className="text-green-700" /> {log.usuario}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap align-middle">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold uppercase border ${getBadgeStyle(log.tipoEvento)}`}>
                        {log.tipoEvento}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap align-middle">
                      <span className="text-sm font-semibold text-slate-600">{log.modulo}</span>
                    </td>
                    <td className="px-6 py-4 align-middle">
                      <p className="text-sm text-slate-600 max-w-xs truncate" title={log.detalle}>
                        {log.detalle}
                      </p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap align-middle text-right">
                      <span className="font-mono text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-1 rounded-md">
                        {log.ipOrigen}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {totalPaginas > 1 && (
          <div className="flex items-center justify-between border-t border-slate-100 bg-white px-6 py-4">
            <button
              onClick={() => setPaginaActual((prev) => Math.max(0, prev - 1))}
              disabled={paginaActual === 0}
              className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-600 transition-colors hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white uppercase tracking-wider font-sans"
            >
              <ChevronLeft size={16} /> Anterior
            </button>
            <span className="text-xs font-bold text-slate-500 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100 shadow-sm font-sans">
              Página <span className="text-green-800 font-black">{paginaActual + 1}</span> de <span className="text-slate-800">{totalPaginas}</span>
            </span>
            <button
              onClick={() => setPaginaActual((prev) => Math.min(totalPaginas - 1, prev + 1))}
              disabled={paginaActual + 1 >= totalPaginas}
              className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-600 transition-colors hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white uppercase tracking-wider font-sans"
            >
              Siguiente <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}