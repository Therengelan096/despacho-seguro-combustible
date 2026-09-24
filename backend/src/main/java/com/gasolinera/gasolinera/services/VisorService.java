package com.gasolinera.gasolinera.services;

import com.gasolinera.gasolinera.dto.VehiculoResponseDTO;
import com.gasolinera.gasolinera.dto.VisorRequestDTO;
import com.gasolinera.gasolinera.entities.Vehiculo;
import com.gasolinera.gasolinera.enums.TipoVehiculo;
import com.gasolinera.gasolinera.repositories.VehiculoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class VisorService {

    private final VehiculoRepository vehiculoRepository;

    @Transactional(readOnly = true)
    public VehiculoResponseDTO consultar(VisorRequestDTO request) {

        Vehiculo vehiculo = vehiculoRepository.findByCodigoPlaca(request.placa().toUpperCase())
                .orElseThrow(() -> new IllegalArgumentException("Error: La placa " + request.placa() + " no está registrada en el sistema."));

        if (!vehiculo.getPropietario().getCi().equals(request.ci())) {
            throw new IllegalArgumentException("Error: Credenciales incorrectas. El CI proporcionado no corresponde al dueño de este vehículo.");
        }

        double limiteCupo = (vehiculo.getTipo() == TipoVehiculo.AUTOMOVIL) ? 40.0 : 20.0;

        String nombreProp = vehiculo.getPropietario().getNombre() + " " + vehiculo.getPropietario().getApellidoPaterno();

        return new VehiculoResponseDTO(
                vehiculo.getIdVehiculo(),
                vehiculo.getCodigoPlaca(),
                vehiculo.getTipo().name(),
                limiteCupo,
                vehiculo.getIdNfc(),
                nombreProp.trim(),
                vehiculo.getEstado().name()
        );
    }
}