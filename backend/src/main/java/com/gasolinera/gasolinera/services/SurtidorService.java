package com.gasolinera.gasolinera.services;

import com.gasolinera.gasolinera.dto.DespachoRequestDTO;
import com.gasolinera.gasolinera.dto.PosResponseDTO;
import com.gasolinera.gasolinera.dto.SurtidorRequestDTO;
import com.gasolinera.gasolinera.entities.HistorialDespacho;
import com.gasolinera.gasolinera.entities.Vehiculo;
import com.gasolinera.gasolinera.enums.Comunidad;
import com.gasolinera.gasolinera.enums.EstadoGeneral;
import com.gasolinera.gasolinera.exceptions.SurtidorNoAutorizadoException;
import com.gasolinera.gasolinera.repositories.HistorialDespachoRepository;
import com.gasolinera.gasolinera.repositories.VehiculoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.time.temporal.TemporalAdjusters;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class SurtidorService {

    private final VehiculoRepository vehiculoRepository;
    private final HistorialDespachoRepository historialRepository;
    private final PasswordEncoder passwordEncoder;
    private final TurnoSurtidorService turnoSurtidorService;

    @Transactional(readOnly = true)
    public Map<String, Object> autorizarDespacho(SurtidorRequestDTO request) {
        Vehiculo vehiculo = vehiculoRepository.findByIdNfc(request.uid())
                .orElseThrow(() -> new SurtidorNoAutorizadoException("Tag NFC no registrado o vehículo inactivo"));

        if (vehiculo.getEstado() != EstadoGeneral.ACTIVO) {
            throw new SurtidorNoAutorizadoException("Tag NFC inactivo");
        }

        Comunidad comunidadActiva = turnoSurtidorService.obtenerComunidadEnTurno();
        if (comunidadActiva != vehiculo.getPropietario().getComunidad()) {
            throw new SurtidorNoAutorizadoException("Fuera de turno. Hoy corresponde exclusivamente a: " + comunidadActiva.name());
        }

        if (!passwordEncoder.matches(request.pin(), vehiculo.getPinSeguridad())) {
            throw new SurtidorNoAutorizadoException("PIN incorrecto");
        }

        if (vehiculo.getPropietario().getEstado() != EstadoGeneral.ACTIVO) {
            throw new SurtidorNoAutorizadoException("El propietario del vehículo está suspendido");
        }

        double cupoMaximo = vehiculo.getTipo().name().equals("AUTOMOVIL") ? 40.0 : 20.0;

        LocalDateTime ahora = LocalDateTime.now();
        LocalDateTime inicioSemana = ahora.with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY)).truncatedTo(ChronoUnit.DAYS);
        LocalDateTime finSemana = inicioSemana.plusDays(7).minusNanos(1);

        Double litrosConsumidos = historialRepository.sumarLitrosPorVehiculoEnRango(vehiculo.getIdVehiculo(), inicioSemana, finSemana);
        double cupoRestante = cupoMaximo - litrosConsumidos;

        if (cupoRestante <= 0) {
            throw new SurtidorNoAutorizadoException("Cupo semanal agotado. Ya consumió sus " + cupoMaximo + "L.");
        }

        return Map.of(
                "status", "AUTORIZADO",
                "placa", vehiculo.getCodigoPlaca(),
                "cupoMaximo", cupoRestante
        );
    }

    @Transactional
    public Map<String, String> confirmarDespacho(DespachoRequestDTO request) {
        Vehiculo vehiculo = vehiculoRepository.findByIdNfc(request.uid())
                .orElseThrow(() -> new IllegalArgumentException("Error: Vehículo no encontrado para registrar despacho."));

        double cupoMaximo = vehiculo.getTipo().name().equals("AUTOMOVIL") ? 40.0 : 20.0;

        if(request.litros() > cupoMaximo) {
            throw new IllegalArgumentException("Anomalía detectada: Los litros reportados superan la capacidad física permitida del vehículo.");
        }

        HistorialDespacho historial = HistorialDespacho.builder()
                .vehiculo(vehiculo)
                .litrosDespachados(request.litros())
                .fechaHora(LocalDateTime.now())
                .build();

        historialRepository.save(historial);

        return Map.of("mensaje", "Despacho de " + request.litros() + "L registrado con éxito para " + vehiculo.getCodigoPlaca());
    }

    @Transactional(readOnly = true)
    public PosResponseDTO consultarDatosPos(String uid) {
        Vehiculo vehiculo = vehiculoRepository.findByIdNfc(uid)
                .orElseThrow(() -> new IllegalArgumentException("Tag NFC no registrado en el sistema."));

        double cupoMaximo = vehiculo.getTipo().name().equals("AUTOMOVIL") ? 40.0 : 20.0;

        LocalDateTime ahora = LocalDateTime.now();
        LocalDateTime inicioSemana = ahora.with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY)).truncatedTo(ChronoUnit.DAYS);
        LocalDateTime finSemana = inicioSemana.plusDays(7).minusNanos(1);

        Double consumido = historialRepository.sumarLitrosPorVehiculoEnRango(vehiculo.getIdVehiculo(), inicioSemana, finSemana);
        double cupoDisponible = Math.max(0.0, cupoMaximo - consumido);

        Comunidad comunidadActiva = turnoSurtidorService.obtenerComunidadEnTurno();
        String estadoTurno = "AUTORIZADO";

        if (vehiculo.getEstado() != EstadoGeneral.ACTIVO || vehiculo.getPropietario().getEstado() != EstadoGeneral.ACTIVO) {
            estadoTurno = "BLOQUEADO";
        } else if (comunidadActiva != vehiculo.getPropietario().getComunidad()) {
            estadoTurno = "FUERA_DE_TURNO";
        } else if (cupoDisponible <= 0) {
            estadoTurno = "CUPO_AGOTADO";
        }

        String propietarioNombre = vehiculo.getPropietario().getNombre() + " " + vehiculo.getPropietario().getApellidoPaterno();

        return new PosResponseDTO(
                uid, vehiculo.getCodigoPlaca(), vehiculo.getTipo().name(),
                propietarioNombre, vehiculo.getPropietario().getComunidad().name(),
                cupoMaximo, consumido, cupoDisponible, estadoTurno
        );
    }
}