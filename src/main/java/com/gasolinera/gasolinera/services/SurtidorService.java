package com.gasolinera.gasolinera.services;

import com.gasolinera.gasolinera.dto.SurtidorRequestDTO;
import com.gasolinera.gasolinera.entities.Vehiculo;
import com.gasolinera.gasolinera.enums.Comunidad;
import com.gasolinera.gasolinera.enums.EstadoGeneral;
import com.gasolinera.gasolinera.exceptions.SurtidorNoAutorizadoException;
import com.gasolinera.gasolinera.repositories.VehiculoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class SurtidorService {

    private final VehiculoRepository vehiculoRepository;
    private final PasswordEncoder passwordEncoder;
    private final TurnoSurtidorService turnoSurtidorService;

    @Transactional(readOnly = true)
    public Map<String, Object> autorizarDespacho(SurtidorRequestDTO request) {

        Vehiculo vehiculo = vehiculoRepository.findByIdNfc(request.uid())
                .orElseThrow(() -> new SurtidorNoAutorizadoException("Tag NFC no registrado o vehículo inactivo"));

        if (vehiculo.getEstado() != EstadoGeneral.ACTIVO) {
            throw new SurtidorNoAutorizadoException("Tag NFC no registrado o vehículo inactivo");
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

        double cupo = vehiculo.getTipo().name().equals("AUTOMOVIL") ? 40.0 : 20.0;

        return Map.of(
                "status", "AUTORIZADO",
                "placa", vehiculo.getCodigoPlaca(),
                "cupoMaximo", cupo
        );
    }
}