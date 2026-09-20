"use client";

import { useRouter } from "next/navigation";
import { PropietariosForm } from "@/components/propietarios/propietario-form";

export default function NuevoPropietarioPage() {
  const router = useRouter();

  const handleSuccess = () => {
    // Redirige a la tabla principal después de guardar exitosamente
    router.push("/dashboard/propietarios");
  };

  const handleCancel = () => {
    // Regresa a la vista anterior si el usuario cancela
    router.push("/dashboard/propietarios");
  };

  return (
    <div className="p-8">
      <div className="mb-6">
        <button 
          onClick={handleCancel}
          className="flex items-center gap-2 text-sm text-gray-400 transition-colors hover:text-white"
        >
          ← Volver a propietarios
        </button>
      </div>
      
      <PropietariosForm onSuccess={handleSuccess} onCancel={handleCancel} />
    </div>
  );
}