import { z } from "zod";

export const propietarioSchema = z.object({
nombre: z.string().min(2, "Ingresa el nombre"),
apellidoPaterno: z.string().min(2, "Ingresa el apellido paterno"),
apellidoMaterno: z.string().min(2, "Ingresa el apellido materno"),
ci: z.string().min(5, "CI inválido"),
celular: z
    .string()
    .min(7, "Número de celular inválido")
    .regex(/^\d+$/, "Solo números"),
comunidad: z.string().min(2, "Ingresa la comunidad"),
});

export type PropietarioFormValues = z.infer<typeof propietarioSchema>;
