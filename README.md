<a id="readme-top"></a>

<br />
<div align="center">
  <h1 align="center">Sistema de Control Automatizado IoT con Validación NFC ⛽</h1>

  <p align="center">
    Plataforma integral orientada a la gestión y distribución automatizada de combustible en las localidades de Cajuata y Siquimirani.
    <br />
    <br />
    <a href="#arquitectura"><strong>Explorar Arquitectura »</strong></a>
    <br />
  </p>
</div>

<details open>
  <summary><b>Índice de Contenidos</b></summary>
  <ol>
    <li>
      <a href="#acerca-del-proyecto">Acerca del Proyecto</a>
      <ul>
        <li><a href="#descripción-del-problema">Descripción del Problema</a></li>
        <li><a href="#objetivos">Objetivos</a></li>
      </ul>
    </li>
    <li><a href="#construido-con">Tecnologías y Herramientas</a></li>
    <li><a href="#hardware-iot">Hardware IoT</a></li>
    <li><a href="#arquitectura">Arquitectura</a></li>
    <li><a href="#equipo-de-desarrollo">Equipo de Desarrollo</a></li>
  </ol>
</details>

---

## Acerca del Proyecto

### Descripción del Problema
En la actualidad, la región presenta deficiencias en el control de límites de distribución de combustible, lo cual propicia el acaparamiento. La ausencia de un mecanismo de validación física para los vehículos facilita la evasión de los controles, derivando en escasez de suministro. Adicionalmente, la alta dependencia de servicios de internet externo en áreas rurales ocasiona frecuentes interrupciones operativas en los sistemas de gestión tradicionales.

### Objetivos
* **Automatización del Despacho:** Implementar un control de entrega mediante la integración de un microcontrolador ESP32 con el relé de accionamiento de las bombas.
* **Validación Física mediante NFC:** Requerir la presencia del vehículo mediante la lectura de un tag NFC único y no clonable, como requisito previo a la liberación de combustible.
* **Gestión de Distribución:** Automatizar el cumplimiento de las cuotas semanales de suministro (40 litros para automóviles y 20 litros para motocicletas).
* **Autonomía Operativa:** Asegurar la disponibilidad continua del sistema operando sobre una infraestructura de red local aislada (Intranet), eliminando la dependencia de conectividad externa.

<div align="right"><a href="#readme-top"><kbd>⬆️ Volver al inicio</kbd></a></div>

---

## Construido Con

El stack tecnológico seleccionado garantiza un rendimiento robusto para la lógica del sistema, mientras que las herramientas de gestión aseguran un desarrollo organizado.

* [![Next][Next.js]][Next-url]
* [![Spring][Spring.io]][Spring-url]
* [![PostgreSQL][PostgreSQL.org]][PostgreSQL-url]
* [![Postman][Postman.com]][Postman-url]
* [![GitHub][GitHub.com]][GitHub-url]
* [![Trello][Trello.com]][Trello-url]

<div align="right"><a href="#readme-top"><kbd>⬆️ Volver al inicio</kbd></a></div>

---

## Hardware IoT

Para la construcción del nodo central de despacho y validación en la bomba, se emplearon los siguientes componentes físicos integrados en circuito:

| 🔌 Componente | ⚙️ Función en el Sistema |
| :--- | :--- |
| **Microcontrolador ESP32** | Cerebro del sistema, procesa la lógica local y se comunica con la Intranet. |
| **Lector RFID/NFC** | Valida el chip físico único asociado a cada vehículo en el padrón. |
| **Módulo Relé (Accionamiento)** | Actúa como interruptor digital para habilitar o cortar el flujo de combustible. |
| **Modulo OLED (128x64)** | Proporciona retroalimentación visual al usuario en el punto de despacho. |
| **Sensor Ultrasónico** | Monitorea la presencia física o niveles de proximidad en el surtidor. |
| **Teclado Matricial 4x4** | Permite el ingreso manual de datos o códigos por parte del operador. |
| **Mini Bomba de Agua (3-6v)** | Simula el despacho físico del fluido durante las pruebas del prototipo. |

<div align="right"><a href="#readme-top"><kbd>⬆️ Volver al inicio</kbd></a></div>

---

## Arquitectura

El sistema emplea una arquitectura cliente-servidor distribuida, implementada sobre una red local.
* **Intranet:** Direccionamiento IP estático para maximizar la disponibilidad de los servicios y comunicación directa entre el ESP32 y el servidor central.
* **API REST:** El backend procesa las solicitudes de validación del hardware en tiempo real.
* **Interfaces:** Panel administrativo para el registro del padrón y portal público de consulta de saldos.

<div align="right"><a href="#readme-top"><kbd>⬆️ Volver al inicio</kbd></a></div>

---

## Equipo de Desarrollo

Este proyecto fue diseñado, desarrollado y ensamblado por el siguiente equipo técnico:

* 👨‍💻 **Arduz Liendro Yuorvic** 
* 👨‍💻 **Choque Pacajes Rafael** 
* 👨‍💻 **Cutile Alvarez Anderson** 
* 👨‍💻 **Cores Torrez Rodrigo Edson** 
* 👨‍💻 **Alarcon Flores Jose Sebastian**
* 👨‍💻 **Gutierrez Catacora Erlan Adrian** 

<div align="right"><a href="#readme-top"><kbd>⬆️ Volver al inicio</kbd></a></div>

[Next.js]: https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white
[Next-url]: https://nextjs.org/
[Spring.io]: https://img.shields.io/badge/Spring_Boot-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white
[Spring-url]: https://spring.io/projects/spring-boot
[PostgreSQL.org]: https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white
[PostgreSQL-url]: https://www.postgresql.org/
[Postman.com]: https://img.shields.io/badge/Postman-FF6C37?style=for-the-badge&logo=postman&logoColor=white
[Postman-url]: https://www.postman.com/
[GitHub.com]: https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white
[GitHub-url]: https://github.com/
[Trello.com]: https://img.shields.io/badge/Trello-%23026AA7.svg?style=for-the-badge&logo=Trello&logoColor=white
[Trello-url]: https://trello.com/
