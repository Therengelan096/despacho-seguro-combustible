package com.gasolinera.gasolinera.services;

import org.springframework.stereotype.Service;
import java.util.concurrent.atomic.AtomicReference;

@Service
public class LectorNfcService {

    private final AtomicReference<String> ultimoUidLeido = new AtomicReference<>(null);

    public void registrarEscaneo(String uid) {
        ultimoUidLeido.set(uid);
    }

    public String obtenerYLimpiarEscaneo() {
        return ultimoUidLeido.getAndSet(null);
    }
}