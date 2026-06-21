-- backend/database/schema_modules.sql

-- Tabla de talentos
CREATE TABLE IF NOT EXISTS talentos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    estudiante_id INT,
    tipo VARCHAR(50),
    puntuacion DECIMAL(5,2),
    nivel VARCHAR(50),
    habilidades JSON,
    recomendaciones JSON,
    fecha_deteccion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (estudiante_id) REFERENCES estudiantes(id) ON DELETE CASCADE
);

-- Tabla de alertas de crisis
CREATE TABLE IF NOT EXISTS alertas_crisis (
    id INT PRIMARY KEY AUTO_INCREMENT,
    universidad_id INT,
    tipo VARCHAR(50),
    nivel VARCHAR(50),
    mensaje TEXT,
    estudiantes_afectados INT,
    accion_recomendada TEXT,
    estado VARCHAR(20) DEFAULT 'activa',
    fecha_deteccion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_resolucion TIMESTAMP NULL
);

-- Tabla de evaluaciones de bienestar
CREATE TABLE IF NOT EXISTS evaluaciones_bienestar (
    id INT PRIMARY KEY AUTO_INCREMENT,
    estudiante_id INT,
    ansiedad DECIMAL(5,2),
    depresion DECIMAL(5,2),
    motivacion DECIMAL(5,2),
    apoyo_social DECIMAL(5,2),
    salud_fisica DECIMAL(5,2),
    nivel_general VARCHAR(50),
    recomendaciones JSON,
    recursos_recomendados JSON,
    fecha_evaluacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (estudiante_id) REFERENCES estudiantes(id) ON DELETE CASCADE
);

-- Tabla de registros de bienestar (historial)
CREATE TABLE IF NOT EXISTS registro_bienestar (
    id INT PRIMARY KEY AUTO_INCREMENT,
    estudiante_id INT,
    estado_animo VARCHAR(50),
    nivel_estres INT,
    horas_sueno DECIMAL(3,1),
    actividad_fisica BOOLEAN,
    notas TEXT,
    fecha_registro DATE,
    FOREIGN KEY (estudiante_id) REFERENCES estudiantes(id) ON DELETE CASCADE
);