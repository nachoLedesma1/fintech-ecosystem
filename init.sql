-- init.sql
-- Crear la base de datos de auditoría
CREATE DATABASE audit_db;

-- Dar permisos al usuario admin (por si acaso)
GRANT ALL PRIVILEGES ON DATABASE audit_db TO admin;