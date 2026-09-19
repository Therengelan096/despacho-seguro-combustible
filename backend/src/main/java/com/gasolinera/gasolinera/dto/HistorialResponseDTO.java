package com.gasolinera.gasolinera.dto;
import java.time.LocalDateTime;

public record HistorialResponseDTO(
        Long idHistorial, String placa, String propietario,
        Double litrosDespachados, LocalDateTime fechaHora
) {}