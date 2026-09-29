package com.gasolinera.gasolinera.services;

import org.springframework.stereotype.Service;
import java.util.Map;
import java.util.concurrent.atomic.AtomicReference;

@Service
public class LectorNfcService {

    private final AtomicReference<String> ultimoUidLeido = new AtomicReference<>(null);
    private final AtomicReference<String> litrosSolicitados = new AtomicReference<>(null);
    private final AtomicReference<Boolean> despachoAprobado = new AtomicReference<>(false);

    public void registrarEscaneo(String uid, String litros) {
        ultimoUidLeido.set(uid);
        litrosSolicitados.set(litros);
        despachoAprobado.set(false);
    }

    public Map<String, String> obtenerEscaneo() {
        String uid = ultimoUidLeido.get();
        if (uid != null) {
            return Map.of(
                    "uid", uid,
                    "litros", litrosSolicitados.get() != null ? litrosSolicitados.get() : "0"
            );
        }
        return null;
    }

    public void aprobarDespacho() {
        despachoAprobado.set(true);
        ultimoUidLeido.set(null);
        litrosSolicitados.set(null);
    }

    public void rechazarDespacho() {
        ultimoUidLeido.set(null);
        litrosSolicitados.set(null);
        despachoAprobado.set(false);
    }

    public boolean estaAprobado() {
        boolean aprobado = despachoAprobado.get();
        if (aprobado) {
            despachoAprobado.set(false);
        }
        return aprobado;
    }
}