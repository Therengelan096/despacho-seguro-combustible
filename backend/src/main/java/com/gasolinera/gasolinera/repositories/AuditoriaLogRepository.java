package com.gasolinera.gasolinera.repositories;

import com.gasolinera.gasolinera.entities.AuditoriaLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AuditoriaLogRepository extends JpaRepository<AuditoriaLog, Long> {
    Page<AuditoriaLog> findAllByOrderByFechaHoraDesc(Pageable pageable);
}