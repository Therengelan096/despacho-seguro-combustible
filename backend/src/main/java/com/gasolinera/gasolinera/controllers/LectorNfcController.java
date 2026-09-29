package com.gasolinera.gasolinera.controllers;

import com.gasolinera.gasolinera.dto.NfcScanDTO;
import com.gasolinera.gasolinera.services.LectorNfcService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/lector")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class LectorNfcController {

    private final LectorNfcService service;

    @PostMapping("/escanear")
    public ResponseEntity<Void> recibirEscaneoDelHardware(@Valid @RequestBody NfcScanDTO request) {
        service.registrarEscaneo(request.uid(), request.litros());
        return ResponseEntity.ok().build();
    }

    @GetMapping("/ultimo")
    public ResponseEntity<Map<String, String>> consultarUltimoEscaneo() {
        Map<String, String> datos = service.obtenerEscaneo();
        if (datos != null) {
            return ResponseEntity.ok(datos);
        }
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/aprobar")
    public ResponseEntity<Void> aprobarDespacho() {
        service.aprobarDespacho();
        return ResponseEntity.ok().build();
    }

    @PostMapping("/rechazar")
    public ResponseEntity<Void> rechazarDespacho() {
        service.rechazarDespacho();
        return ResponseEntity.ok().build();
    }

    @GetMapping("/estado")
    public ResponseEntity<Map<String, Boolean>> consultarEstadoAprobacion() {
        return ResponseEntity.ok(Map.of("aprobado", service.estaAprobado()));
    }
}