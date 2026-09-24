export interface Vehiculo {
  idVehiculo: number;
  codigoPlaca: string;
  tipo: string;
  cupoMaximo: number;
  idNfc: string;
  nombrePropietario: string;
  estado?: string;
}