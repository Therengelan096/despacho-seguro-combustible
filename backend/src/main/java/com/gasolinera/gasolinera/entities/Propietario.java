package com.gasolinera.gasolinera.entities;

import com.gasolinera.gasolinera.enums.Comunidad;
import com.gasolinera.gasolinera.enums.EstadoGeneral;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "propietarios")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Propietario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idPropietario;

    @Column(nullable = false, length = 50)
    private String nombre;

    @Column(name = "apellido_paterno", nullable = false, length = 50)
    private String apellidoPaterno;

    @Column(name = "apellido_materno", nullable = false, length = 50)
    private String apellidoMaterno;

    @Column(unique = true, nullable = false, length = 15)
    private String ci;

    @Column(length = 15)
    private String celular;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 15)
    private Comunidad comunidad;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 15)
    private EstadoGeneral estado;
}