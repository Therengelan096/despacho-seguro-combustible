package com.gasolinera.gasolinera.controllers;

import com.gasolinera.gasolinera.dto.VehiculoRequestDTO;
import com.gasolinera.gasolinera.dto.VehiculoResponseDTO;
import com.gasolinera.gasolinera.services.VehiculoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
}