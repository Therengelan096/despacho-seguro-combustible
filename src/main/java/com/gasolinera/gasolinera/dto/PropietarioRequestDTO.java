package com.gasolinera.gasolinera.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record PropietarioRequestDTO(

        @NotBlank(message = "El nombre no puede estar vacío")
        @Size(max = 50, message = "Nombre demasiado largo")
        String nombre,

        @NotBlank(message = "El apellido paterno no puede estar vacío")
        @Size(max = 50, message = "Apellido paterno demasiado largo")
        String apellidoPaterno,

        @Size(max = 50, message = "El apellido materno no debe exceder 50 caracteres")
        String apellidoMaterno,

        @NotBlank(message = "El CI es obligatorio")
        @Size(max = 15, message = "CI demasiado largo")
        String ci,

        @Size(max = 15, message = "El celular no debe exceder 15 caracteres")
        String celular,

        @NotBlank(message = "La comunidad es obligatoria")
        @Size(max = 50, message = "Nombre de comunidad demasiado largo")
        String comunidad
) {}
