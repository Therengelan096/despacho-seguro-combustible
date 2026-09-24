"use client";

import { useRouter } from "next/navigation";
import { PropietariosForm } from "@/components/propietarios/propietario-form";
import { ChevronLeft } from "lucide-react";

export default function NuevoPropietarioPage() {
  const router = useRouter();

  const handleSuccess = () => router.push("/dashboard/propietarios");
  const handleCancel = () => router.push("/dashboard/propietarios");

  return (
    <div className="max-w-4xl mx-auto space-y-4 font-sans">
      <button
        onClick={handleCancel}
        className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider hover:text-ypfb-blue transition-colors"
      >
        <ChevronLeft size={16} /> Volver a propietarios
      </button>
      
      <PropietariosForm onSuccess={handleSuccess} onCancel={handleCancel} />
    </div>
  );
}