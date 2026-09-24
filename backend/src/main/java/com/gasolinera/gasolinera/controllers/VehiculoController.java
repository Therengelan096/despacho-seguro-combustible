package com.gasolinera.gasolinera.controllers;

import com.gasolinera.gasolinera.dto.VehiculoPinDTO;
import com.gasolinera.gasolinera.dto.VehiculoRequestDTO;
import com.gasolinera.gasolinera.dto.VehiculoResponseDTO;
import com.gasolinera.gasolinera.dto.VehiculoUpdateDTO;
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

    @PutMapping("/{idVehiculo}")
    public ResponseEntity<VehiculoResponseDTO> actualizar(@PathVariable Long idVehiculo, @Valid @RequestBody VehiculoUpdateDTO req) {
        return ResponseEntity.ok(service.actualizar(idVehiculo, req));
    }

    @GetMapping("/propietario/{idPropietario}")
    public ResponseEntity<List<VehiculoResponseDTO>> listarPorPropietario(@PathVariable Long idPropietario) {
        return ResponseEntity.ok(service.listarPorPropietario(idPropietario));
    }

    @GetMapping()
    public ResponseEntity<List<VehiculoResponseDTO>> listar() {
    return ResponseEntity.ok(service.listarTodos());
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

    @GetMapping("/nfc/{idNfc}/disponible")
    public ResponseEntity<java.util.Map<String, Boolean>> verificarNfc(@PathVariable String idNfc) {
        return ResponseEntity.ok(java.util.Map.of("disponible", service.verificarNfcDisponible(idNfc)));
    }
}