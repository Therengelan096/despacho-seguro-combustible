package com.gasolinera.gasolinera.dto;

public record PropietarioResponseDTO(
        Long idPropietario,
        String nombreCompleto,
        String ci,
        String celular,
        String comunidad
) {}
