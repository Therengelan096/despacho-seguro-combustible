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
        service.registrarEscaneo(request.uid());
        return ResponseEntity.ok().build();
    }

    @GetMapping("/ultimo")
    public ResponseEntity<Map<String, String>> consultarUltimoEscaneo() {
        String uid = service.obtenerYLimpiarEscaneo();

        if (uid != null) {
            return ResponseEntity.ok(Map.of("uid", uid));
        }

        return ResponseEntity.noContent().build();
    }
}