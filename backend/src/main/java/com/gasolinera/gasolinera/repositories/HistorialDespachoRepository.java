package com.gasolinera.gasolinera.repositories;

import com.gasolinera.gasolinera.entities.HistorialDespacho;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface HistorialDespachoRepository extends JpaRepository<HistorialDespacho, Long> {

    @Query("SELECT COALESCE(SUM(h.litrosDespachados), 0.0) FROM HistorialDespacho h WHERE h.vehiculo.idVehiculo = :idVehiculo AND h.fechaHora BETWEEN :inicio AND :fin")
    Double sumarLitrosPorVehiculoEnRango(@Param("idVehiculo") Long idVehiculo, @Param("inicio") LocalDateTime inicio, @Param("fin") LocalDateTime fin);

    @Query("SELECT COALESCE(SUM(h.litrosDespachados), 0.0) FROM HistorialDespacho h")
    Double sumarLitrosTotalesHistoricos();

    List<HistorialDespacho> findTop100ByOrderByFechaHoraDesc();
}