package com.gasolinera.gasolinera.services;

import com.gasolinera.gasolinera.entities.AuditoriaLog;
import com.gasolinera.gasolinera.repositories.AuditoriaLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AuditoriaService {

    private final AuditoriaLogRepository repository;

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void registrar(String usuario, String tipoEvento, String modulo, String detalle, String ip) {
        AuditoriaLog log = AuditoriaLog.builder()
                .fechaHora(LocalDateTime.now())
                .usuario(usuario != null ? usuario : "ANONIMO/ESP32")
                .tipoEvento(tipoEvento)
                .modulo(modulo)
                .detalle(detalle)
                .ipOrigen(ip)
                .build();
        repository.save(log);
    }

    public Page<AuditoriaLog> listarLogs(int pagina, int tamano) {
        return repository.findAllByOrderByFechaHoraDesc(PageRequest.of(pagina, tamano));
    }

    public void registrarLecturaNfcExitosa(String usuario, String uidNfc, String placa, String ip) {
        String detalle = String.format("Lectura NFC correcta. Tag UID: %s asignado al vehículo %s", uidNfc, placa);
        registrar(usuario, "LECTURA_NFC_OK", "LECTOR_NFC", detalle, ip);
    }

    public void registrarDespachoExitoso(String usuario, String placa, Double litros, String ip) {
        String detalle = String.format("Despacho completado para placa %s. Volumen: %.2f L", placa, litros);
        registrar(usuario, "DESPACHO_COMPLETADO", "SURTIDOR", detalle, ip);
    }

    public void registrarAnomaliaNfc(String uidNfc, String ip) {
        String detalle = String.format("ALERTA DE SEGURIDAD: Se intentó operar con un Tag NFC NO registrado en el sistema. UID: %s", uidNfc);
        registrar("SISTEMA_ALERT", "ALERTA_NFC_DESCONOCIDO", "SEGURIDAD_NFC", detalle, ip);
    }

    public void registrarAnomaliaSurtidor(String mensaje, String ip) {
        String detalle = String.format("ALERTA DE HARDWARE: Desconexión o flujo irregular detectado en el surtidor. Detalle: %s", mensaje);
        registrar("SISTEMA_ALERT", "ERROR_SURTIDOR", "SURTIDOR_HW", detalle, ip);
    }
}