package com.gasolinera.gasolinera.dto;

public record PosResponseDTO(
        String uid,
        String placa,
        String tipoVehiculo,
        String nombrePropietario,
        String comunidad,
        Double cupoMaximo,
        Double litrosConsumidos,
        Double cupoDisponible,
        String estadoTurno
) {}