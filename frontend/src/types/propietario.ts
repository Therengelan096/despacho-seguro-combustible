export interface Propietario {
  idPropietario: number;
  nombreCompleto: string;
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  ci: string;
  celular: string;
  comunidad: string;
  estado?: "ACTIVO" | "INACTIVO";
}