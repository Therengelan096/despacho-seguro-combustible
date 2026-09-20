import { z } from "zod";

export const vehiculoSchema = z.object({
  codigoPlaca: z
    .string()
    .min(4, "La placa debe tener al menos 4 caracteres")
    .max(10, "Placa demasiado larga")
    .transform((v) => v.toUpperCase()),
  tipoAutomovil: z.enum(["AUTOMOVIL","MOTOCICLETA"], {
    message: "Selecciona un tipo de automovil",
  }),
  idNfc: z.string().min(4, "Acerca la tarjeta NFC al lector"),
  pinSeguridad: z
    .string()
    .length(4, "El PIN debe tener 4 dígitos")
    .regex(/^\d+$/, "El PIN solo admite números"),
});

export type VehiculoFormValues = z.infer<typeof vehiculoSchema>;
