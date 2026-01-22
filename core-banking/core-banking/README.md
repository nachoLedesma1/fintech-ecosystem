# 🏦 Core Banking API

API RESTful para un sistema bancario simulado, desarrollada con **Java 21** y **Spring Boot 3**.
Este proyecto simula las operaciones nucleares de un banco digital, incluyendo autenticación segura, manejo de cuentas, transferencias transaccionales y productos de inversión.

## 🚀 Características Principales

### 🔐 Seguridad & Usuarios
* **Registro y Login:** Autenticación vía **JWT (JSON Web Tokens)**.
* **Protección de Rutas:** Configuración de Spring Security para proteger endpoints sensibles.
* **Encriptación:** Contraseñas hasheadas con BCrypt.

### 💸 Transaccionalidad
* **Transferencias:** Envío de dinero entre cuentas con validación **ACID** (Atomicidad) para asegurar la integridad de los fondos.
* **Alias (CBU):** Sistema para asociar nombres amigables (ej: `nacho.dev`) a cuentas bancarias.
* **Historial:** Registro inmutable de todas las transacciones.

### 📈 Inversiones & Automatización
* **Plazos Fijos:** Módulo para crear inversiones con cálculo de intereses.
* **Motor Automático (Scheduler):** Proceso batch (`@Scheduled`) que corre diariamente para detectar inversiones vencidas y acreditar ganancias automáticamente.

### 📒 Extras
* **Agenda de Contactos:** Gestión de destinatarios frecuentes.
* **Documentación Viva:** Integración con **Swagger / OpenAPI** para probar endpoints visualmente.

---

## 🛠️ Tecnologías Utilizadas

* **Lenguaje:** Java 21
* **Framework:** Spring Boot 3.4.1
* **Base de Datos:** PostgreSQL
* **Seguridad:** Spring Security + JWT
* **Documentación:** SpringDoc OpenApi (Swagger)
* **Herramientas:** Maven, Lombok

---

## 📖 Documentación de la API (Swagger)

Una vez iniciada la aplicación, puedes explorar y probar todos los endpoints en:

👉 **[http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)**

---

## ⚙️ Instalación y Ejecución

1.  **Clonar el repositorio:**
    ```bash
    git clone [https://github.com/TU_USUARIO/core-banking.git](https://github.com/TU_USUARIO/core-banking.git)
    ```

2.  **Configurar Base de Datos:**
    Asegúrate de tener PostgreSQL corriendo y crea una base de datos llamada `core_banking`. Actualiza el archivo `src/main/resources/application.properties` con tus credenciales.

3.  **Ejecutar:**
    ```bash
    ./mvnw spring-boot:run
    ```

---

## 🚧 Próximos Pasos (Roadmap & Arquitectura Futura)

El proyecto está diseñado para evolucionar de un Monolito Modular a una arquitectura de **Microservicios**. Las próximas implementaciones planificadas son:

* [ ] **Notification Service:** Microservicio dedicado para envío de correos electrónicos (bienvenida, alertas de seguridad, comprobantes de transferencia) usando RabbitMQ/Kafka.
* [ ] **Audit Service:** Servicio independiente para registrar logs de seguridad y actividad de usuarios (Inicios de sesión, cambios de clave) en una base de datos NoSQL (MongoDB).
* [ ] **Despliegue Cloud:** Configuración de CI/CD para deploy automático en Railway/AWS.
* [ ] **Containerización:** Dockerización de los servicios para orquestación con Kubernetes.

---
**Autor:** [Ignacio Agustín Ledesma] - 2026