package com.gasolinera.gasolinera.services;

import com.gasolinera.gasolinera.entities.TurnoSurtidor;
import com.gasolinera.gasolinera.enums.Comunidad;
import com.gasolinera.gasolinera.repositories.TurnoSurtidorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class TurnoSurtidorService {

    private final TurnoSurtidorRepository repository;

    private static final String CLAVE_COMUNIDAD = "COMUNIDAD_ACTIVA";

    @Transactional(readOnly = true)
    public Comunidad obtenerComunidadEnTurno() {
        return repository.findById(CLAVE_COMUNIDAD)
                .map(turno -> Comunidad.valueOf(turno.getValor()))
                .orElse(Comunidad.CAJUATA);
    }

    @Transactional
    public String cambiarTurno(Comunidad nuevaComunidad) {
        TurnoSurtidor turno = repository.findById(CLAVE_COMUNIDAD)
                .orElse(new TurnoSurtidor(CLAVE_COMUNIDAD, Comunidad.CAJUATA.name()));

        turno.setValor(nuevaComunidad.name());
        repository.save(turno);

        return "Turno actualizado exitosamente. La comunidad activa ahora es: " + nuevaComunidad.name();
    }
}