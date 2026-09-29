package com.gasolinera.gasolinera.repositories;

import com.gasolinera.gasolinera.entities.Vehiculo;
import com.gasolinera.gasolinera.enums.EstadoGeneral;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.List;

@Repository
public interface VehiculoRepository extends JpaRepository<Vehiculo, Long> {

    Optional<Vehiculo> findByIdNfc(String idNfc);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT v FROM Vehiculo v WHERE v.idNfc = :idNfc")
    Optional<Vehiculo> findByIdNfcWithLock(@Param("idNfc") String idNfc);

    Optional<Vehiculo> findByCodigoPlaca(String codigoPlaca);
    List<Vehiculo> findByPropietarioIdPropietario(Long idPropietario);
    boolean existsByIdNfc(String idNfc);
    boolean existsByCodigoPlaca(String codigoPlaca);
    long countByEstado(EstadoGeneral estado);
}