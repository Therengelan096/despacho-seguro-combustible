package com.gasolinera.gasolinera.dto;

import jakarta.validation.constraints.NotBlank;

public record SurtidorRequestDTO(
        @NotBlank(message = "El UID es obligatorio") String uid,
        @NotBlank(message = "El PIN es obligatorio") String pin
) {}