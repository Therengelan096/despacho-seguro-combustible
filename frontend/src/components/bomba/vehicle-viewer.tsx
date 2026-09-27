"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Center, OrbitControls, Stage, useGLTF } from "@react-three/drei";

function ModeloVehiculo({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  return <primitive object={scene} />;
}

interface VehicleViewerProps {
  tipoVehiculo: string;
}

export default function VehicleViewer({ tipoVehiculo }: VehicleViewerProps) {
  const esMoto = tipoVehiculo.toUpperCase().includes("MOTO");
  const modelUrl = esMoto ? "/models/Motorcycle.glb" : "/models/Vehicule.glb";

  return (
    <div
      className="relative h-64 w-full md:h-80"
      aria-label="Modelo 3D del vehículo"
    >
      <Canvas camera={{ position: [0, 2, 5], fov: 45 }}>
        <ambientLight intensity={0.8} />
        <directionalLight position={[10, 10, 5]} intensity={1.2} />
        <Suspense fallback={null}>
        {/* Quitamos adjustCamera={false} para que ajuste la cámara automáticamente al tamaño real del objeto */}
        <Stage environment="city" intensity={0.5}>
            <Center>
            <ModeloVehiculo url={modelUrl} />
            </Center>
        </Stage>
        </Suspense>
        <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={2} />
      </Canvas>
    </div>
  );
}

useGLTF.preload("/models/Motorcycle.glb");
useGLTF.preload("/models/Vehicule.glb");
