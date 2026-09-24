"use client";

import { useRouter } from "next/navigation";
import { VehiculoForm } from "@/components/vehiculos/vehiculo-form";
import { ChevronLeft } from "lucide-react";

export default function NuevoVehiculoPage() {
  const router = useRouter();

  const handleCancel = () => router.push("/dashboard/vehiculos");

  return (
    <div className="max-w-5xl mx-auto space-y-4 font-sans">
      <button
        onClick={handleCancel}
        className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider hover:text-ypfb-blue transition-colors"
      >
        <ChevronLeft size={16} /> Volver a vehículos
      </button>

      <VehiculoForm />
    </div>
  );
}