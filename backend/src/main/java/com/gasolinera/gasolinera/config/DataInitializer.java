package com.gasolinera.gasolinera.config;

import com.gasolinera.gasolinera.entities.Empleado;
import com.gasolinera.gasolinera.entities.Usuario;
import com.gasolinera.gasolinera.enums.EstadoGeneral;
import com.gasolinera.gasolinera.enums.RolUsuario;
import com.gasolinera.gasolinera.repositories.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.admin.username}") private String adminUsername;
    @Value("${app.admin.password}") private String adminPassword;
    @Value("${app.admin.nombre}")   private String adminNombre;
    @Value("${app.admin.apellido}") private String adminApellido;
    @Value("${app.admin.ci}")       private String adminCi;

    @Value("${app.worker.username}") private String workerUsername;
    @Value("${app.worker.password}") private String workerPassword;
    @Value("${app.worker.nombre}")   private String workerNombre;
    @Value("${app.worker.apellido}") private String workerApellido;
    @Value("${app.worker.ci}")       private String workerCi;

    @Override
    public void run(String... args) {
        if (usuarioRepository.count() == 0) {

            Empleado empAdmin = Empleado.builder()
                    .nombre(adminNombre)
                    .apellidos(adminApellido)
                    .ci(adminCi)
                    .estado(EstadoGeneral.ACTIVO)
                    .build();

            Usuario admin = Usuario.builder()
                    .username(adminUsername)
                    .password(passwordEncoder.encode(adminPassword))
                    .rol(RolUsuario.ADMINISTRADOR)
                    .estado(EstadoGeneral.ACTIVO)
                    .empleado(empAdmin)
                    .build();

            usuarioRepository.save(admin);

            Empleado empTrabajador = Empleado.builder()
                    .nombre(workerNombre)
                    .apellidos(workerApellido)
                    .ci(workerCi)
                    .estado(EstadoGeneral.ACTIVO)
                    .build();

            Usuario trabajador = Usuario.builder()
                    .username(workerUsername)
                    .password(passwordEncoder.encode(workerPassword))
                    .rol(RolUsuario.TRABAJADOR)
                    .estado(EstadoGeneral.ACTIVO)
                    .empleado(empTrabajador)
                    .build();

            usuarioRepository.save(trabajador);

            System.out.println("BASE DE DATOS INICIALIZADA XD");
        }
    }
}