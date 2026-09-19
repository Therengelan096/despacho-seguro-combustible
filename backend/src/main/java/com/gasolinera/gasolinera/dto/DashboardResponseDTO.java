package com.gasolinera.gasolinera.dto;

public record DashboardResponseDTO(
        long totalPropietarios, long totalVehiculos,
        double litrosTotalesDespachados, String comunidadEnTurno
) {}