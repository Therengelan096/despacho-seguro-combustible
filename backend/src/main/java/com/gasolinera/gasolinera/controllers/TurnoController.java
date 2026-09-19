package com.gasolinera.gasolinera.controllers;

import com.gasolinera.gasolinera.enums.Comunidad;
import com.gasolinera.gasolinera.services.TurnoSurtidorService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/turnos")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class TurnoController {
    private final TurnoSurtidorService service;

    @GetMapping("/actual")
    public ResponseEntity<Map<String, String>> obtenerTurnoActual() {
        return ResponseEntity.ok(Map.of("comunidad", service.obtenerComunidadEnTurno().name()));
    }

    @PostMapping("/cambiar")
    public ResponseEntity<Map<String, String>> cambiarTurno(@RequestBody Map<String, String> request) {
        try {
            Comunidad nuevaComunidad = Comunidad.valueOf(request.get("comunidad").toUpperCase());
            return ResponseEntity.ok(Map.of("mensaje", service.cambiarTurno(nuevaComunidad)));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Comunidad no válida."));
        }
    }
}