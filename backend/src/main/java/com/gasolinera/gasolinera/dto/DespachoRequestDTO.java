package com.gasolinera.gasolinera.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record DespachoRequestDTO(
        @NotBlank(message = "El UID es obligatorio") String uid,
        @NotNull(message = "Los litros son obligatorios")
        @Positive(message = "Los litros deben ser mayores a 0") Double litros
) {}