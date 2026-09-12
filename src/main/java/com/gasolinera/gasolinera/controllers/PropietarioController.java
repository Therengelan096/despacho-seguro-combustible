package com.gasolinera.gasolinera.controllers;

import com.gasolinera.gasolinera.dto.*;
import com.gasolinera.gasolinera.services.PropietarioService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/propietarios")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class PropietarioController {

    private final PropietarioService service;

    @PostMapping
    public ResponseEntity<PropietarioResponseDTO> registrar(@Valid @RequestBody PropietarioRequestDTO req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.registrar(req));
    }

    @GetMapping
    public ResponseEntity<List<PropietarioResponseDTO>> listar() {
        return ResponseEntity.ok(service.listarActivos());
    }

    @GetMapping("/{ci}")
    public ResponseEntity<PropietarioResponseDTO> buscar(@PathVariable String ci) {
        return ResponseEntity.ok(service.buscarPorCi(ci));
    }

    @PutMapping("/{ci}")
    public ResponseEntity<PropietarioResponseDTO> actualizar(@PathVariable String ci, @Valid @RequestBody PropietarioUpdateDTO req) {
        return ResponseEntity.ok(service.actualizar(ci, req));
    }

    @PatchMapping("/{ci}/baja")
    public ResponseEntity<Void> darDeBaja(@PathVariable String ci) {
        service.darDeBaja(ci);
        return ResponseEntity.noContent().build();
    }
}