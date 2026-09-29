package com.gasolinera.gasolinera.dto;

public record VisorResponseDTO(
        String placa,
        String tipo,
        String nombrePropietario,
        String estadoVehiculo,
        Double cupoMaximo,
        Double litrosConsumidos,
        Double cupoDisponible
) {}