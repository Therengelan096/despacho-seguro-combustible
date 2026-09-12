package com.gasolinera.gasolinera.repositories;

import com.gasolinera.gasolinera.entities.Propietario;
import com.gasolinera.gasolinera.enums.EstadoGeneral;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PropietarioRepository extends JpaRepository<Propietario, Long> {
    boolean existsByCi(String ci);
    Optional<Propietario> findByCiAndEstado(String ci, EstadoGeneral estado);
    List<Propietario> findAllByEstado(EstadoGeneral estado);
}