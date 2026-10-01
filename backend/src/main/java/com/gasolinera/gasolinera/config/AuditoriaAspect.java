package com.gasolinera.gasolinera.config;

import com.gasolinera.gasolinera.dto.NfcScanDTO;
import com.gasolinera.gasolinera.services.AuditoriaService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

@Aspect
@Component
@RequiredArgsConstructor
public class AuditoriaAspect {

    private final AuditoriaService auditoriaService;
    private final SimpMessagingTemplate messagingTemplate;

    @AfterReturning(pointcut = "execution(* com.gasolinera.gasolinera.controllers.SurtidorController.autorizarDespacho(..))")
    public void auditarAutorizacionSurtidor(JoinPoint joinPoint) {
        registrarLog("INTENTO_AUTORIZACION", "SURTIDOR", "Solicitud de autorización enviada desde el surtidor NFC/ESP32");
    }

    @AfterReturning(pointcut = "execution(* com.gasolinera.gasolinera.controllers.SurtidorController.confirmarDespacho(..))")
    public void auditarConfirmacionSurtidor(JoinPoint joinPoint) {
        registrarLog("DESPACHO_CONFIRMADO", "SURTIDOR", "Carga de combustible confirmada e inscrita en el historial");
    }

    @AfterReturning(pointcut = "execution(* com.gasolinera.gasolinera.controllers.LectorNfcController.recibirEscaneoDelHardware(..))")
    public void auditarEscaneoHardware(JoinPoint joinPoint) {
        String uid = "DESCONOCIDO";
        String litros = "0";
        Object[] args = joinPoint.getArgs();
        for (Object arg : args) {
            if (arg instanceof NfcScanDTO dto) {
                uid = dto.uid();
                litros = dto.litros() != null ? dto.litros() : "0";
            }
        }
        registrarLog("LECTURA_NFC", "LECTOR_NFC", String.format("Escaneo de hardware detectado. Tag UID: %s, Litros: %s", uid, litros));
    }

    @AfterReturning(pointcut = "execution(* com.gasolinera.gasolinera.controllers.LectorNfcController.aprobarDespacho(..))")
    public void auditarAprobarDespacho(JoinPoint joinPoint) {
        registrarLog("APROBAR_DESPACHO", "SURTIDOR", "Despacho autorizado manualmente desde caseta");
    }

    @AfterReturning(pointcut = "execution(* com.gasolinera.gasolinera.controllers.LectorNfcController.rechazarDespacho(..))")
    public void auditarRechazarDespacho(JoinPoint joinPoint) {
        registrarLog("RECHAZAR_DESPACHO", "SURTIDOR", "Despacho cancelado o denegado desde caseta");
    }

    @AfterReturning(pointcut = "execution(* com.gasolinera.gasolinera.controllers.AuthController.login(..))")
    public void auditarLogin(JoinPoint joinPoint) {
        registrarLog("LOGIN_EXITOSO", "AUTENTICACION", "Inicio de sesión correcto en la plataforma web");
    }

    @AfterReturning(pointcut = "execution(* com.gasolinera.gasolinera.controllers.PropietarioController.registrar(..))")
    public void auditarRegistroPropietario(JoinPoint joinPoint) {
        registrarLog("CREAR_PROPIETARIO", "PROPIETARIOS", "Se registró un nuevo propietario en el sistema");
    }

    @AfterReturning(pointcut = "execution(* com.gasolinera.gasolinera.controllers.PropietarioController.actualizar(..))")
    public void auditarActualizarPropietario(JoinPoint joinPoint) {
        registrarLog("EDITAR_PROPIETARIO", "PROPIETARIOS", "Se actualizaron los datos personales de un propietario");
    }

    @AfterReturning(pointcut = "execution(* com.gasolinera.gasolinera.controllers.PropietarioController.darDeBaja(..))")
    public void auditarEstadoPropietario(JoinPoint joinPoint) {
        registrarLog("ESTADO_PROPIETARIO", "PROPIETARIOS", "Se modificó el estado (Activo/Inactivo) de un propietario");
    }

    @AfterReturning(pointcut = "execution(* com.gasolinera.gasolinera.controllers.VehiculoController.registrar(..))")
    public void auditarRegistroVehiculo(JoinPoint joinPoint) {
        registrarLog("CREAR_VEHICULO", "VEHICULOS", "Se registró un nuevo vehículo y se asignó un Tag NFC");
    }

    @AfterReturning(pointcut = "execution(* com.gasolinera.gasolinera.controllers.VehiculoController.actualizar(..))")
    public void auditarActualizarVehiculo(JoinPoint joinPoint) {
        registrarLog("EDITAR_VEHICULO", "VEHICULOS", "Se actualizaron los datos o asignación de un vehículo");
    }

    @AfterReturning(pointcut = "execution(* com.gasolinera.gasolinera.controllers.VehiculoController.darDeBaja(..))")
    public void auditarEstadoVehiculo(JoinPoint joinPoint) {
        registrarLog("ESTADO_VEHICULO", "VEHICULOS", "Se modificó el estado (Activo/Inactivo) de un vehículo");
    }

    @AfterReturning(pointcut = "execution(* com.gasolinera.gasolinera.controllers.VehiculoController.cambiarPin(..))")
    public void auditarCambiarPinVehiculo(JoinPoint joinPoint) {
        registrarLog("CAMBIO_PIN", "VEHICULOS", "Se reestableció el PIN de seguridad de un vehículo");
    }

    private void registrarLog(String evento, String modulo, String detalle) {
        String usuario = "SISTEMA_IOT";
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.isAuthenticated() && !"anonymousUser".equals(auth.getPrincipal())) {
            usuario = auth.getName();
        }

        String ip = "127.0.0.1";
        ServletRequestAttributes attrs = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        if (attrs != null) {
            ip = attrs.getRequest().getRemoteAddr();
        }

        if ("SISTEMA_IOT".equals(usuario) && modulo.equals("LECTOR_NFC")) {
            usuario = "HARDWARE_ESP32";
        }

        auditoriaService.registrar(usuario, evento, modulo, detalle, ip);

        messagingTemplate.convertAndSend("/topic/auditoria", "REFRESH");

        String canalEspecifico = "/topic/" + modulo.toLowerCase();
        messagingTemplate.convertAndSend(canalEspecifico, "REFRESH");
    }
}