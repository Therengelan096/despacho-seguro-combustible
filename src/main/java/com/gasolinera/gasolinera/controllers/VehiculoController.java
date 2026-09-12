package com.gasolinera.gasolinera.controllers;

import com.gasolinera.gasolinera.dto.VehiculoPinDTO;
import com.gasolinera.gasolinera.dto.VehiculoRequestDTO;
import com.gasolinera.gasolinera.dto.VehiculoResponseDTO;
import com.gasolinera.gasolinera.services.VehiculoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/vehiculos")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class VehiculoController {

    private final VehiculoService service;

    @PostMapping
    public ResponseEntity<VehiculoResponseDTO> registrar(@Valid @RequestBody VehiculoRequestDTO req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.registrar(req));
    }

    @GetMapping("/propietario/{idPropietario}")
    public ResponseEntity<List<VehiculoResponseDTO>> listarPorPropietario(@PathVariable Long idPropietario) {
        return ResponseEntity.ok(service.listarPorPropietario(idPropietario));
    }

    @PatchMapping("/{idVehiculo}/pin")
    public ResponseEntity<Void> cambiarPin(@PathVariable Long idVehiculo, @Valid @RequestBody VehiculoPinDTO req) {
        service.cambiarPin(idVehiculo, req.nuevoPin());
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{idVehiculo}/baja")
    public ResponseEntity<Void> darDeBaja(@PathVariable Long idVehiculo) {
        service.darDeBaja(idVehiculo);
        return ResponseEntity.noContent().build();
    }
}