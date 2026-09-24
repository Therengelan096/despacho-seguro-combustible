package com.gasolinera.gasolinera.dto;

import com.gasolinera.gasolinera.enums.TipoVehiculo;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record VehiculoUpdateDTO(
        @NotBlank(message = "La placa es obligatoria") String codigoPlaca,
        @NotNull(message = "El tipo de vehículo es obligatorio") TipoVehiculo tipo,
        @NotNull(message = "El ID del propietario es obligatorio") Long idPropietario
) {}