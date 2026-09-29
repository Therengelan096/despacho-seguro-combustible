package com.gasolinera.gasolinera.services;

import com.gasolinera.gasolinera.dto.VisorRequestDTO;
import com.gasolinera.gasolinera.dto.VisorResponseDTO;
import com.gasolinera.gasolinera.entities.Vehiculo;
import com.gasolinera.gasolinera.repositories.HistorialDespachoRepository;
import com.gasolinera.gasolinera.repositories.VehiculoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.time.temporal.TemporalAdjusters;

@Service
@RequiredArgsConstructor
public class VisorService {

    private final VehiculoRepository vehiculoRepository;
    private final HistorialDespachoRepository historialRepository;

    @Transactional(readOnly = true)
    public VisorResponseDTO consultar(VisorRequestDTO request) {

        Vehiculo vehiculo = vehiculoRepository.findByCodigoPlaca(request.placa().toUpperCase())
                .orElseThrow(() -> new IllegalArgumentException("Error: La placa " + request.placa() + " no está registrada en el sistema."));

        if (!vehiculo.getPropietario().getCi().equals(request.ci())) {
            throw new IllegalArgumentException("Error: Credenciales incorrectas. El CI proporcionado no corresponde al dueño de este vehículo.");
        }

        double cupoMaximo = vehiculo.getTipo().getCupoMaximo();
        String nombreProp = vehiculo.getPropietario().getNombre() + " " + vehiculo.getPropietario().getApellidoPaterno();

        LocalDateTime ahora = LocalDateTime.now();
        LocalDateTime inicioSemana = ahora.with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY)).truncatedTo(ChronoUnit.DAYS);
        LocalDateTime finSemana = inicioSemana.plusDays(7).minusNanos(1);

        Double consumido = historialRepository.sumarLitrosPorVehiculoEnRango(vehiculo.getIdVehiculo(), inicioSemana, finSemana);
        if (consumido == null) consumido = 0.0;

        double cupoDisponible = Math.max(0.0, cupoMaximo - consumido);

        return new VisorResponseDTO(
                vehiculo.getCodigoPlaca(),
                vehiculo.getTipo().name(),
                nombreProp.trim(),
                vehiculo.getEstado().name(),
                cupoMaximo,
                consumido,
                cupoDisponible
        );
    }
}