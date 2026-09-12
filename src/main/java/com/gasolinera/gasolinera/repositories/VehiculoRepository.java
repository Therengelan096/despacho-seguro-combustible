package com.gasolinera.gasolinera.repositories;

import com.gasolinera.gasolinera.entities.Vehiculo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.List;

@Repository
public interface VehiculoRepository extends JpaRepository<Vehiculo, Long> {
    Optional<Vehiculo> findByIdNfc(String idNfc);
    Optional<Vehiculo> findByCodigoPlaca(String codigoPlaca);
    List<Vehiculo> findByPropietarioIdPropietario(Long idPropietario);
    boolean existsByIdNfc(String idNfc);
    boolean existsByCodigoPlaca(String codigoPlaca);
}
