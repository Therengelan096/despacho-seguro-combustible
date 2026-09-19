package com.gasolinera.gasolinera.controllers;

import com.gasolinera.gasolinera.dto.HistorialResponseDTO;
import com.gasolinera.gasolinera.services.HistorialService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/historial")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class HistorialController {
    private final HistorialService service;

    @GetMapping
    public ResponseEntity<List<HistorialResponseDTO>> listarReportes() {
        return ResponseEntity.ok(service.listarTodo());
    }
}