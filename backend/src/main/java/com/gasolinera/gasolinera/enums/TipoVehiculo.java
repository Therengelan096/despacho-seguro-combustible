package com.gasolinera.gasolinera.enums;

public enum TipoVehiculo {
    AUTOMOVIL(40.0),
    MOTOCICLETA(20.0);

    private final double cupoMaximo;

    TipoVehiculo(double cupoMaximo) {
        this.cupoMaximo = cupoMaximo;
    }

    public double getCupoMaximo() {
        return cupoMaximo;
    }
}