package com.gasolinera.gasolinera.controllers;

import com.gasolinera.gasolinera.dto.DespachoRequestDTO;
import com.gasolinera.gasolinera.dto.SurtidorRequestDTO;
import com.gasolinera.gasolinera.services.SurtidorService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/surtidor")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class SurtidorController {

    private final SurtidorService surtidorService;

    @PostMapping("/autorizar")
    public ResponseEntity<Map<String, Object>> autorizarDespacho(@Valid @RequestBody SurtidorRequestDTO request) {
        return ResponseEntity.ok(surtidorService.autorizarDespacho(request));
    }

    @PostMapping("/confirmar")
    public ResponseEntity<Map<String, String>> confirmarDespacho(@Valid @RequestBody DespachoRequestDTO request) {
        return ResponseEntity.ok(surtidorService.confirmarDespacho(request));
    }
}