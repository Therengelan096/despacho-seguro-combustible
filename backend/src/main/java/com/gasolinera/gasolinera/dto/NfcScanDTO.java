package com.gasolinera.gasolinera.dto;

import jakarta.validation.constraints.NotBlank;

public record NfcScanDTO(
        @NotBlank(message = "El UID no puede estar vacío") String uid
) {}