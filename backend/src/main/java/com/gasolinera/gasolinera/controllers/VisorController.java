package com.gasolinera.gasolinera.controllers;

import com.gasolinera.gasolinera.dto.VehiculoResponseDTO;
import com.gasolinera.gasolinera.dto.VisorRequestDTO;
import com.gasolinera.gasolinera.services.VisorService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/visor")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class VisorController {

    private final VisorService service;

    @PostMapping("/consulta")
    public ResponseEntity<VehiculoResponseDTO> consultarEstado(@Valid @RequestBody VisorRequestDTO request) {
        return ResponseEntity.ok(service.consultar(request));
    }
}