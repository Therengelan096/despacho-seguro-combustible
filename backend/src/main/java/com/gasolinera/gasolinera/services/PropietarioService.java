package com.gasolinera.gasolinera.services;

import com.gasolinera.gasolinera.dto.*;
import com.gasolinera.gasolinera.entities.Propietario;
import com.gasolinera.gasolinera.enums.Comunidad;
import com.gasolinera.gasolinera.enums.EstadoGeneral;
import com.gasolinera.gasolinera.repositories.PropietarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PropietarioService {

    private final PropietarioRepository repository;

    @Transactional
    public PropietarioResponseDTO registrar(PropietarioRequestDTO request) {
        if (repository.existsByCi(request.ci())) {
            throw new IllegalArgumentException("Error: Ya existe un propietario registrado con el CI " + request.ci());
        }

        Propietario nuevo = Propietario.builder()
                .nombre(request.nombre())
                .apellidoPaterno(request.apellidoPaterno())
                .apellidoMaterno(request.apellidoMaterno())
                .ci(request.ci())
                .celular(request.celular())
                .comunidad(Comunidad.valueOf(request.comunidad().toUpperCase()))
                .estado(EstadoGeneral.ACTIVO)
                .build();

        return mapear(repository.save(nuevo));
    }

    @Transactional(readOnly = true)
    public List<PropietarioResponseDTO> listarActivos() {
        return repository.findAll()
                .stream()
                .map(this::mapear)
                .toList();
    }

    @Transactional(readOnly = true)
    public PropietarioResponseDTO buscarPorCi(String ci) {
        return mapear(repository.findByCiAndEstado(ci, EstadoGeneral.ACTIVO)
                .orElseThrow(() -> new IllegalArgumentException("Error: No se encontró al propietario con el CI " + ci)));
    }

    @Transactional
    public PropietarioResponseDTO actualizar(String ci, PropietarioUpdateDTO request) {
        Propietario p = repository.findByCi(ci)
                .orElseThrow(() -> new IllegalArgumentException("Error: No se encontró el propietario para actualizar."));

        p.setNombre(request.nombre());
        p.setApellidoPaterno(request.apellidoPaterno());
        p.setApellidoMaterno(request.apellidoMaterno());
        p.setCelular(request.celular());

        return mapear(repository.save(p));
    }

    @Transactional
    public void darDeBaja(String ci) {
        Propietario p = repository.findByCi(ci)
                .orElseThrow(() -> new IllegalArgumentException("Error: El propietario no existe."));

        p.setEstado(p.getEstado() == EstadoGeneral.ACTIVO ? EstadoGeneral.INACTIVO : EstadoGeneral.ACTIVO);
        repository.save(p);
    }

    private PropietarioResponseDTO mapear(Propietario p) {
        String nombreComp = p.getNombre() + " " + p.getApellidoPaterno() + (p.getApellidoMaterno() != null && !p.getApellidoMaterno().isEmpty() ? " " + p.getApellidoMaterno() : "");
        return new PropietarioResponseDTO(
                p.getIdPropietario(),
                nombreComp.trim(),
                p.getNombre(),
                p.getApellidoPaterno(),
                p.getApellidoMaterno(),
                p.getCi(),
                p.getCelular(),
                p.getComunidad().name(),
                p.getEstado().name()
        );
    }
}