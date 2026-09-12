package com.gasolinera.gasolinera.dto;

public record VehiculoResponseDTO(
        Long idVehiculo,
        String codigoPlaca,
        String tipo,
        Double cupoMaximo,
        String idNfc,
        String nombrePropietario
) {}