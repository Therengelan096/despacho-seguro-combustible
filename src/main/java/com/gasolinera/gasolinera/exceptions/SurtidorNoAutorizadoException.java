package com.gasolinera.gasolinera.exceptions;

public class SurtidorNoAutorizadoException extends RuntimeException {
    public SurtidorNoAutorizadoException(String mensaje) {
        super(mensaje);
    }
}