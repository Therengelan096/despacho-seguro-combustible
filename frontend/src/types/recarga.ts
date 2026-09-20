export interface Recarga {
  id: string;
  fecha: string;
  placa: string;
  propietario: string;
  litros: number;
  monto: number;
  estado: "completada" | "pendiente" | "rechazada";
}