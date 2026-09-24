package com.gasolinera.gasolinera.entities;

import com.gasolinera.gasolinera.enums.EstadoGeneral;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "empleados")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Empleado {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idEmpleado;

    @Column(nullable = false, length = 50)
    private String nombre;

    @Column(nullable = false, length = 50)
    private String apellidos;

    @Column(unique = true, nullable = false, length = 15)
    private String ci;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 15)
    private EstadoGeneral estado;
}