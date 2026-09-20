"use client";
//VISTA DE PROPIETARIOS PARA LA APLICACIÓN DE CONTROL DE GASOLINERAS
import { useEffect, useState } from "react";
import Link from "next/link";
import { ShieldCheck, UserPlus, Search, Smartphone, MapPin, UserCheck } from "lucide-react";

interface Propietario {
  ci: string;
  nombreCompleto: string;
  celular: string;
  comunidad: string;
}

export default function PropietariosPage() {
  const [propietarios, setPropietarios] = useState<Propietario[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchPropietarios = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch("http://localhost:8080/api/propietarios", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error("Error al obtener la lista de propietarios");
        }

        const data = await response.json();
        setPropietarios(data);
      } catch (err) {
        console.error("Hubo un problema con la petición GET:", err);
        setError("No se pudieron cargar los datos.");
      } finally {
        setLoading(false);
      }
    };

    fetchPropietarios();
  }, []);

  const filtrados = propietarios.filter((p) => {
    const termino = searchTerm.toLowerCase();
    return (
      p.nombreCompleto?.toLowerCase().includes(termino) ||
      p.ci?.includes(searchTerm) ||
      p.comunidad?.toLowerCase().includes(termino)
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
              <h1 className="text-2xl font-black text-[#004a8e] uppercase tracking-tight">Propietarios</h1>
              <p className="text-gray-500 text-sm font-medium">Gestiona los registros de propietarios</p>
            </div>
          </div>

          <Link
            href="/dashboard/propietarios/nuevo"
            className="flex items-center gap-2 bg-[#f5d000] hover:bg-[#e6c200] text-[#004a8e] px-6 py-3 rounded-xl font-black transition-all shadow-md active:scale-95 uppercase tracking-wider text-sm"
          >
            <UserPlus size={20} /> Nuevo Propietario
          </Link>
        </header>

        {/* buscador */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Buscar por nombre, CI o comunidad..."
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#f5d000] outline-none transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* tabla principal de propietarios */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold text-[#004a8e] uppercase tracking-wider">Propietario</th>
                  <th className="px-6 py-4 text-xs font-bold text-[#004a8e] uppercase tracking-wider">CI</th>
                  <th className="px-6 py-4 text-xs font-bold text-[#004a8e] uppercase tracking-wider">Celular</th>
                  <th className="px-6 py-4 text-xs font-bold text-[#004a8e] uppercase tracking-wider">Comunidad</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {loading ? (
                  <tr>
                    <td colSpan={4} className="text-center py-10 font-bold text-gray-400">Cargando propietarios...</td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan={4} className="text-center py-10 font-bold text-red-500">{error}</td>
                  </tr>
                ) : filtrados.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center py-16">
                      <div className="flex flex-col items-center gap-2 opacity-40">
                        <UserCheck size={48} className="text-[#004a8e]" />
                        <p className="font-black uppercase tracking-widest text-sm text-[#004a8e]">No hay propietarios registrados</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filtrados.map((prop) => (
                    <tr key={prop.ci} className="hover:bg-blue-50/30 transition-colors group">
                      <td className="px-6 py-4 whitespace-nowrap align-middle">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-xl bg-gray-100 flex items-center justify-center text-[#004a8e] font-black group-hover:bg-[#004a8e] group-hover:text-white transition-all shadow-sm uppercase">
                            {prop.nombreCompleto ? prop.nombreCompleto.charAt(0) : "U"}
                          </div>
                          <p className="font-bold text-gray-900 leading-tight">{prop.nombreCompleto}</p>
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap align-middle">
                        <span className="text-xs font-mono font-semibold text-gray-700">{prop.ci}</span>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap align-middle">
                        <span className="flex items-center gap-1.5 text-xs font-medium text-gray-600">
                          <Smartphone size={12} className="text-[#004a8e]" /> {prop.celular}
                        </span>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap align-middle">
                        <span className="inline-flex items-center gap-1.5 bg-blue-50 text-[#004a8e] px-3 py-1 rounded text-[10px] font-black uppercase border border-blue-100">
                          <MapPin size={12} /> {prop.comunidad}
                        </span>
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