package com.gasolinera.gasolinera.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record PropietarioUpdateDTO(
        @NotBlank(message = "Nombre obligatorio") String nombre,
        @NotBlank(message = "Apellido paterno obligatorio") String apellidoPaterno,
        String apellidoMaterno,
        @Size(max = 15) String celular
) {}