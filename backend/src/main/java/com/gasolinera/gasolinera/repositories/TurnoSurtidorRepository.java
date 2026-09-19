package com.gasolinera.gasolinera.repositories;

import com.gasolinera.gasolinera.entities.TurnoSurtidor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TurnoSurtidorRepository extends JpaRepository<TurnoSurtidor, String> {
}