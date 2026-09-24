package com.gasolinera.gasolinera.dto;

public record PropietarioResponseDTO(
        Long idPropietario,
        String nombreCompleto,
        String nombre,
        String apellidoPaterno,
        String apellidoMaterno,
        String ci,
        String celular,
        String comunidad,
        String estado
) {}