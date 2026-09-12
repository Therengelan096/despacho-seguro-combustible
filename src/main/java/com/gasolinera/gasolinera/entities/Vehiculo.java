package com.gasolinera.gasolinera.entities;

import com.gasolinera.gasolinera.enums.EstadoGeneral;
import com.gasolinera.gasolinera.enums.TipoVehiculo;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "vehiculos")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Vehiculo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idVehiculo;

    @Column(name = "id_nfc", unique = true, nullable = false, length = 100)
    private String idNfc;

    @Column(name = "codigo_placa", unique = true, nullable = false, length = 30)
    private String codigoPlaca;

    @Column(name = "pin_seguridad", nullable = false)
    private String pinSeguridad;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private TipoVehiculo tipo;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private EstadoGeneral estado;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_propietario", nullable = false)
    private Propietario propietario;
}