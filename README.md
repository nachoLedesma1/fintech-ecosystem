# 🏦 Fintech Ecosystem - Full Stack Banking System

Sistema bancario digital completo, seguro y escalable. Desarrollado con una arquitectura de **Microservicios** containerizada, combinando la robustez de **Java Spring Boot** con una experiencia de usuario moderna en **React**.

![Java](https://img.shields.io/badge/Java-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

## 🚀 Características Principales

### 🔐 Seguridad & UX
* **Autenticación JWT:** Registro y Login seguro con persistencia de sesión.
* **Privacy Mode:** Enmascaramiento de datos sensibles (saldos y números de tarjeta) en el Frontend para evitar *visual hacking*.
* **Protección de Rutas:** Navegación segura que restringe el acceso a usuarios no autenticados.

### 💳 Gestión de Productos
* **Cuentas Multi-moneda:** Cajas de ahorro en **Pesos (ARS)** y **Dólares (USD)**.
* **Tarjetas Interactivas 3D:**
    * Emisión de tarjetas de Débito y Crédito.
    * Animación "Flip" (Giro 180°) para ver el dorso y CVV.
    * Generación algorítmica de PAN, Vencimiento y CVV.

### 💸 Transaccionalidad
* **Transferencias:** Movimiento de fondos en tiempo real entre cuentas (CBU/Alias) con validación ACID.
* **Depósitos:** Simulación de ingreso de dinero (Cash-in) integrado.
* **Historial Inteligente:** Visualización clara de ingresos (Verde) y egresos (Rojo).

### 📈 Inversiones & Automatización
* **Plazos Fijos:** Simulador de rendimiento con Tasa Nominal Anual (TNA) configurable.
* **Investment Robot (Scheduler):** Proceso batch (`@Scheduled`) en el backend que detecta inversiones vencidas y acredita capital + intereses automáticamente sin intervención humana.

---

## 🛠️ Arquitectura de Microservicios

El sistema ya no es un monolito. Se ha evolucionado a una arquitectura distribuida orquestada con **Docker Compose**:

1.  **API Gateway:** Puerta de entrada única que enruta el tráfico y gestiona la seguridad perimetral.
2.  **Core Banking Service:** Lógica de negocio principal (Cuentas, Transacciones, Inversiones).
3.  **Audit Service:** Microservicio asíncrono que registra eventos de seguridad.
4.  **Notification Service:** Servicio encargado de la comunicación con el usuario.
5.  **Frontend SPA:** Aplicación React (Vite) consumiendo la API a través del Gateway.

---

## ⚙️ Instalación y Despliegue (Docker)

La forma más sencilla de probar el ecosistema completo es utilizando Docker.

1.  **Clonar el repositorio:**
    ```bash
    git clone [https://github.com/nachoLedesma1/fintech-ecosystem.git](https://github.com/nachoLedesma1/fintech-ecosystem.git)
    cd fintech-ecosystem
    ```

2.  **Levantar el entorno:**
    ```bash
    docker-compose up -d --build
    ```
    *Esto levantará la Base de Datos, los 4 Microservicios Java y el Frontend React.*

3.  **Acceder:**
    * 💻 **Frontend:** [http://localhost:5173](http://localhost:5173)
    * 📄 **Swagger API:** [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html) (Vía Gateway)

---

## 📖 Tecnologías Detalladas

* **Backend:** Java 21, Spring Boot 3.4, Spring Security, Spring Cloud Gateway, JPA/Hibernate.
* **Frontend:** React 18, Vite, Tailwind CSS, Axios, React Router DOM.
* **Datos:** PostgreSQL 15.
* **DevOps:** Docker, Docker Compose, Git.

---

## 🚧 Roadmap (Próximos Pasos)

* [ ] Implementación de Tests Unitarios (JUnit 5 + Mockito).
* [ ] Despliegue en Cloud (AWS/Render).
* [ ] Integración de 2FA (Doble Factor).

---
**Autor:** [Ignacio Agustín Ledesma] - 2026