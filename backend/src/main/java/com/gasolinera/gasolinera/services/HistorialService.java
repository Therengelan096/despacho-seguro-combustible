package com.gasolinera.gasolinera.services;

import com.gasolinera.gasolinera.dto.HistorialResponseDTO;
import com.gasolinera.gasolinera.entities.HistorialDespacho;
import com.gasolinera.gasolinera.repositories.HistorialDespachoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
public class HistorialService {

    private final HistorialDespachoRepository repository;

    @Transactional(readOnly = true)
    public List<HistorialResponseDTO> listarTodo() {
        return repository.findTop100ByOrderByFechaHoraDesc().stream().map(this::mapear).toList();    }

    private HistorialResponseDTO mapear(HistorialDespacho h) {
        String propietario = h.getVehiculo().getPropietario().getNombre() + " " + h.getVehiculo().getPropietario().getApellidoPaterno();
        return new HistorialResponseDTO(h.getIdHistorial(), h.getVehiculo().getCodigoPlaca(), propietario.trim(), h.getLitrosDespachados(), h.getFechaHora());
    }
}