package com.gasolinera.gasolinera.services;

import com.gasolinera.gasolinera.dto.VehiculoRequestDTO;
import com.gasolinera.gasolinera.dto.VehiculoResponseDTO;
import com.gasolinera.gasolinera.entities.Propietario;
import com.gasolinera.gasolinera.entities.Vehiculo;
import com.gasolinera.gasolinera.enums.EstadoGeneral;
import com.gasolinera.gasolinera.enums.TipoVehiculo;
import com.gasolinera.gasolinera.repositories.PropietarioRepository;
import com.gasolinera.gasolinera.repositories.VehiculoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class VehiculoService {

    private final VehiculoRepository vehiculoRepository;
    private final PropietarioRepository propietarioRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public VehiculoResponseDTO registrar(VehiculoRequestDTO request) {
        if (vehiculoRepository.existsByCodigoPlaca(request.codigoPlaca())) {
            throw new IllegalArgumentException("Error: El vehículo con placa " + request.codigoPlaca() + " ya está registrado.");
        }
        if (vehiculoRepository.existsByIdNfc(request.idNfc())) {
            throw new IllegalArgumentException("Error: El tag NFC " + request.idNfc() + " ya está en uso.");
        }

        Propietario propietario = propietarioRepository.findById(request.idPropietario())
                .orElseThrow(() -> new IllegalArgumentException("Error: No se encontró al propietario con ID " + request.idPropietario()));

        if (propietario.getEstado() == EstadoGeneral.INACTIVO) {
            throw new IllegalArgumentException("Error: No se puede asignar un vehículo a un propietario inactivo.");
        }

        Vehiculo nuevo = Vehiculo.builder()
                .codigoPlaca(request.codigoPlaca().toUpperCase())
                .idNfc(request.idNfc())
                .pinSeguridad(passwordEncoder.encode(request.pinSeguridad()))
                .tipo(request.tipo())
                .estado(EstadoGeneral.ACTIVO)
                .propietario(propietario)
                .build();

        return mapear(vehiculoRepository.save(nuevo));
    }

    private VehiculoResponseDTO mapear(Vehiculo v) {
        String nombreProp = v.getPropietario().getNombre() + " " + v.getPropietario().getApellidoPaterno();
        double limiteCupo = (v.getTipo() == TipoVehiculo.AUTOMOVIL) ? 40.0 : 20.0;

        return new VehiculoResponseDTO(
                v.getIdVehiculo(),
                v.getCodigoPlaca(),
                v.getTipo().name(),
                limiteCupo,
                v.getIdNfc(),
                nombreProp.trim()
        );
    }
}