package com.gasolinera.gasolinera.entities;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "turno_surtidor")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TurnoSurtidor {

    @Id
    @Column(name = "clave", length = 50)
    private String clave;

    @Column(name = "valor", nullable = false)
    private String valor;
}