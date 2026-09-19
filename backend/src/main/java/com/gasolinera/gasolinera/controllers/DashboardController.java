package com.gasolinera.gasolinera.controllers;

import com.gasolinera.gasolinera.dto.DashboardResponseDTO;
import com.gasolinera.gasolinera.enums.EstadoGeneral;
import com.gasolinera.gasolinera.repositories.HistorialDespachoRepository;
import com.gasolinera.gasolinera.repositories.PropietarioRepository;
import com.gasolinera.gasolinera.repositories.VehiculoRepository;
import com.gasolinera.gasolinera.services.TurnoSurtidorService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class DashboardController {

    private final PropietarioRepository propietarioRepo;
    private final VehiculoRepository vehiculoRepo;
    private final HistorialDespachoRepository historialRepo;
    private final TurnoSurtidorService turnoService;

    @GetMapping("/metricas")
    public ResponseEntity<DashboardResponseDTO> obtenerMetricas() {
        long propietarios = propietarioRepo.countByEstado(EstadoGeneral.ACTIVO);
        long vehiculos = vehiculoRepo.countByEstado(EstadoGeneral.ACTIVO);

        Double litrosTotales = historialRepo.sumarLitrosTotalesHistoricos();
        String turno = turnoService.obtenerComunidadEnTurno().name();

        return ResponseEntity.ok(new DashboardResponseDTO(propietarios, vehiculos, litrosTotales == null ? 0.0 : litrosTotales, turno));
    }
}