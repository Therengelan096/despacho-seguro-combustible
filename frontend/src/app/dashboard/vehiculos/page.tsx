"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ShieldCheck, Plus, Car, Search, UserCheck, IdCard, Users } from "lucide-react";

// Debe coincidir con lo que devuelve VehiculoResponse en el backend.
// Si extiendes el DTO con la comunidad del propietario (nombreComunidad),
// esta interfaz y la columna de abajo ya están listas para mostrarla.
interface Vehiculo {
  idVehiculo: number;
  idNfc: string;
  codigoPlaca: string;
  tipo: string; // "AUTOMOVIL" | "MOTO"
  estado: string; // "ACTIVO" | "BLOQUEADO" | etc.
  idPropietario: number;
  nombrePropietario: string;
}

const tipoLabel: Record<string, string> = {
  AUTOMOVIL: "Automóvil",
  MOTO: "Moto",
};

export default function VehiculosPage() {
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    cargarVehiculos();
  }, []);

  const cargarVehiculos = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const response = await fetch("http://localhost:8080/api/vehiculos", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Error al obtener la lista de vehículos");
      }

      const data = await response.json();
      setVehiculos(data);
      setError("");
    } catch (err) {
      console.error("Hubo un problema con la petición GET:", err);
      setError("No se pudieron cargar los datos.");
    } finally {
      setLoading(false);
    }
  };

  const filtrados = vehiculos.filter((v) => {
    const termino = searchTerm.toLowerCase();
    return (
      v.codigoPlaca?.toLowerCase().includes(termino) ||
      v.nombrePropietario?.toLowerCase().includes(termino) 
    );
  });

  return (
    <section className="min-h-screen bg-gray-50 p-4 sm:p-8 font-sans antialiased">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* cabecera principal con titulo y boton */}
        <header className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="bg-[#004a8e] p-3 rounded-xl shadow-lg">
              <ShieldCheck className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-[#004a8e] uppercase tracking-tight">Vehículos Registrados</h1>
              <p className="text-gray-500 text-sm font-medium">Vehículos y propietarios vinculados</p>
            </div>
          </div>

          <Link
            href="/dashboard/vehiculos/nuevo"
            className="flex items-center gap-2 bg-[#f5d000] hover:bg-[#e6c200] text-[#004a8e] px-6 py-3 rounded-xl font-black transition-all shadow-md active:scale-95 uppercase tracking-wider text-sm"
          >
            <Plus size={20} /> Nuevo Vehículo
          </Link>
        </header>

        {/* buscador */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Buscar por placa, propietario o comunidad..."
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#f5d000] outline-none transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* tabla principal de vehiculos */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold text-[#004a8e] uppercase tracking-wider">Placa</th>
                  <th className="px-6 py-4 text-xs font-bold text-[#004a8e] uppercase tracking-wider">Tipo</th>
                  <th className="px-6 py-4 text-xs font-bold text-[#004a8e] uppercase tracking-wider">Propietario</th>
                  <th className="px-6 py-4 text-xs font-bold text-[#004a8e] uppercase tracking-wider text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="text-center py-10 font-bold text-gray-400">Sincronizando...</td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan={5} className="text-center py-10 font-bold text-red-500">{error}</td>
                  </tr>
                ) : filtrados.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-16">
                      <div className="flex flex-col items-center gap-2 opacity-40">
                        <Car size={48} className="text-[#004a8e]" />
                        <p className="font-black uppercase tracking-widest text-sm text-[#004a8e]">
                          Todavía no hay vehículos registrados
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filtrados.map((v) => (
                    <tr key={v.idVehiculo} className="hover:bg-blue-50/30 transition-colors group">
                      <td className="px-6 py-4 whitespace-nowrap align-middle">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-xl bg-gray-100 flex items-center justify-center text-[#004a8e] group-hover:bg-[#004a8e] group-hover:text-white transition-all shadow-sm shrink-0">
                            <IdCard size={18} />
                          </div>
                          <p className="font-mono font-bold text-gray-900">{v.codigoPlaca}</p>
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap align-middle">
                        <span className="inline-flex items-center gap-1.5 bg-blue-50 text-[#004a8e] px-3 py-1 rounded text-[10px] font-black uppercase border border-blue-100">
                          <Car size={12} /> {tipoLabel[v.tipo] ?? v.tipo}
                        </span>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap align-middle">
                        <span className="flex items-center gap-1.5 text-xs font-medium text-gray-700">
                          <Users size={12} className="text-[#004a8e]" /> {v.nombrePropietario}
                        </span>
                      </td>

              

                      <td className="px-6 py-4 whitespace-nowrap text-center align-middle">
                        {v.estado === "ACTIVO" ? (
                          <span className="inline-flex items-center gap-1.5 text-green-600 text-[10px] font-black uppercase bg-green-50 px-3 py-1 rounded border border-green-100">
                            <UserCheck size={12} /> Activo
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 bg-gray-100 text-gray-500 px-3 py-1 rounded text-[10px] font-black uppercase border border-gray-200">
                            {v.estado}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}