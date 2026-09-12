package com.gasolinera.gasolinera.dto;

import jakarta.validation.constraints.NotBlank;

public record VisorRequestDTO(
        @NotBlank(message = "El CI es obligatorio") String ci,
        @NotBlank(message = "La placa es obligatoria") String placa
) {}