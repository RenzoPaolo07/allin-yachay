-- backend/database/schema.sql
-- Base de datos: allin_yachay

CREATE DATABASE IF NOT EXISTS allin_yachay;
USE allin_yachay;

-- Tabla de estudiantes
CREATE TABLE IF NOT EXISTS estudiantes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    dni VARCHAR(8) UNIQUE NOT NULL,
    nombres VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    telefono VARCHAR(15),
    fecha_nacimiento DATE,
    direccion TEXT,
    universidad VARCHAR(100),
    carrera VARCHAR(100),
    semestre_actual INT DEFAULT 1,
    estado VARCHAR(20) DEFAULT 'activo',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabla de cursos
CREATE TABLE IF NOT EXISTS cursos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    codigo VARCHAR(20) UNIQUE,
    creditos INT,
    area VARCHAR(50),
    descripcion TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabla de calificaciones
CREATE TABLE IF NOT EXISTS calificaciones (
    id INT PRIMARY KEY AUTO_INCREMENT,
    estudiante_id INT,
    curso_id INT,
    nota DECIMAL(5,2),
    ciclo VARCHAR(10),
    fecha_registro DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (estudiante_id) REFERENCES estudiantes(id) ON DELETE CASCADE,
    FOREIGN KEY (curso_id) REFERENCES cursos(id) ON DELETE CASCADE
);

-- Tabla de asistencias
CREATE TABLE IF NOT EXISTS asistencias (
    id INT PRIMARY KEY AUTO_INCREMENT,
    estudiante_id INT,
    curso_id INT,
    fecha DATE,
    estado VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (estudiante_id) REFERENCES estudiantes(id) ON DELETE CASCADE,
    FOREIGN KEY (curso_id) REFERENCES cursos(id) ON DELETE CASCADE
);

-- Tabla de predicciones
CREATE TABLE IF NOT EXISTS predicciones (
    id INT PRIMARY KEY AUTO_INCREMENT,
    estudiante_id INT,
    fecha_prediccion DATE,
    nivel_riesgo VARCHAR(20),
    probabilidad_abandono DECIMAL(5,2),
    factores_riesgo JSON,
    recomendaciones JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (estudiante_id) REFERENCES estudiantes(id) ON DELETE CASCADE
);

-- Tabla de interacciones con tutor
CREATE TABLE IF NOT EXISTS interacciones_tutor (
    id INT PRIMARY KEY AUTO_INCREMENT,
    estudiante_id INT,
    pregunta TEXT,
    respuesta TEXT,
    curso_relacionado VARCHAR(100),
    fecha_hora TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (estudiante_id) REFERENCES estudiantes(id) ON DELETE CASCADE
);

-- Tabla de becas
CREATE TABLE IF NOT EXISTS becas (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100),
    entidad VARCHAR(100),
    monto VARCHAR(50),
    requisitos TEXT,
    fecha_inicio DATE,
    fecha_fin DATE,
    url VARCHAR(255),
    nivel VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de usuarios
CREATE TABLE IF NOT EXISTS usuarios (
    id INT PRIMARY KEY AUTO_INCREMENT,
    estudiante_id INT UNIQUE,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    rol VARCHAR(20) DEFAULT 'estudiante',
    ultimo_acceso TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (estudiante_id) REFERENCES estudiantes(id) ON DELETE CASCADE
);

-- Insertar datos de prueba
INSERT INTO estudiantes (dni, nombres, apellidos, email, universidad, carrera) VALUES
('12345678', 'Renzo', 'Quispe Mamani', 'renzo@allinyachay.pe', 'UNSAAC', 'Ingeniería de Sistemas'),
('87654321', 'María', 'Ccorahua Yucra', 'maria@allinyachay.pe', 'UNSAAC', 'Ingeniería Civil'),
('56781234', 'Carlos', 'Huamaní Quispe', 'carlos@allinyachay.pe', 'UNMSM', 'Medicina'),
('43218765', 'Ana', 'Huamán Sullca', 'ana@allinyachay.pe', 'PUCP', 'Administración'),
('98765432', 'Luis', 'Chávez Rojas', 'luis@allinyachay.pe', 'UNI', 'Ingeniería Industrial');

INSERT INTO cursos (nombre, codigo, creditos, area) VALUES
('Cálculo I', 'MAT101', 4, 'Matemáticas'),
('Cálculo II', 'MAT102', 4, 'Matemáticas'),
('Física I', 'FIS101', 4, 'Física'),
('Programación I', 'INF101', 4, 'Programación'),
('Base de Datos', 'INF201', 4, 'Programación');

INSERT INTO becas (nombre, entidad, monto, requisitos, fecha_inicio, fecha_fin, url, nivel) VALUES
('Beca 18', 'PRONABEC', 'S/ 20,000', 'Dedicación exclusiva, promedio mínimo 14', '2024-02-01', '2024-12-31', 'https://www.pronabec.gob.pe/beca-18', 'Nacional'),
('Beca Vocación Maestro', 'Minedu', 'S/ 15,000', 'Estudiar pedagogía, interés en educación', '2024-03-01', '2024-11-30', 'https://www.minedu.gob.pe/beca-vocacion-maestro', 'Nacional'),
('Beca Líderes del Mañana', 'Fundación BBVA', 'S/ 25,000', 'Excelencia académica, liderazgo', '2024-02-15', '2024-10-15', 'https://www.fundacionbbva.pe/becas', 'Privado');

INSERT INTO usuarios (estudiante_id, username, password_hash, rol) VALUES
(1, 'renzo', '$2a$10$wRkxMZn6KPhHy9Z.KDn8nO8YlLQ6wMZvqY2D3CXi4Wv6CbN5R8r7O', 'estudiante');