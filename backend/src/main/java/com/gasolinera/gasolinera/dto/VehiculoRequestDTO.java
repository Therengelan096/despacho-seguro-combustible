package com.gasolinera.gasolinera.dto;

import com.gasolinera.gasolinera.enums.TipoVehiculo;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record VehiculoRequestDTO(
        @NotBlank(message = "La placa es obligatoria") String codigoPlaca,
        @NotNull(message = "El tipo de vehículo es obligatorio") TipoVehiculo tipo,
        @NotBlank(message = "El identificador NFC es obligatorio") String idNfc,
        @NotNull(message = "El ID del propietario es obligatorio") Long idPropietario,
        @NotBlank(message = "El PIN es obligatorio")
        @Size(min = 4, max = 4, message = "El PIN debe ser exactamente de 4 dígitos")
        String pinSeguridad
) {}