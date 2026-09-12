package com.gasolinera.gasolinera.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record VehiculoPinDTO(
        @NotBlank(message = "El nuevo PIN es obligatorio")
        @Size(min = 4, max = 4, message = "El PIN debe ser exactamente de 4 dígitos")
        String nuevoPin
) {}