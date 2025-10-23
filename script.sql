-- ============================================
-- SCRIPT DE BASE DE DATOS
-- Sistema de Solicitud de Crédito - Grupo Salinas
-- ============================================


DROP DATABASE IF EXISTS credito_salinas;
CREATE DATABASE credito_salinas CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE credito_salinas;

-- ============================================
-- TABLA: sucursales
-- ============================================
CREATE TABLE sucursales (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    codigo VARCHAR(20) NOT NULL UNIQUE,
    ciudad VARCHAR(100) NOT NULL,
    estado VARCHAR(50) NOT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_codigo (codigo),
    INDEX idx_ciudad (ciudad)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: clientes
-- ============================================
CREATE TABLE clientes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    telefono VARCHAR(10) NOT NULL,
    fecha_nacimiento DATE NOT NULL,
    ingreso_mensual DECIMAL(12, 2) NOT NULL,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_telefono (telefono)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: solicitudes
-- ============================================
CREATE TABLE solicitudes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cliente_id INT NOT NULL,
    sucursal_id INT NOT NULL,
    monto_solicitado DECIMAL(12, 2) NOT NULL,
    plazo_meses INT NOT NULL,
    estado ENUM('aprobado', 'rechazado') NOT NULL,
    motivo_rechazo VARCHAR(255) NULL,
    score INT NOT NULL,
    fecha_solicitud TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Llaves foráneas
    FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE CASCADE,
    FOREIGN KEY (sucursal_id) REFERENCES sucursales(id) ON DELETE RESTRICT,
    
    -- Índices
    INDEX idx_cliente (cliente_id),
    INDEX idx_sucursal (sucursal_id),
    INDEX idx_estado (estado),
    INDEX idx_fecha (fecha_solicitud),
    INDEX idx_score (score)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- DATOS INICIALES: sucursales
-- ============================================
INSERT INTO sucursales (nombre, codigo, ciudad, estado) VALUES
('Sucursal Centro', 'SUC001', 'Ciudad de México', 'CDMX'),
('Sucursal Norte', 'SUC002', 'Monterrey', 'Nuevo León'),
('Sucursal Occidente', 'SUC003', 'Guadalajara', 'Jalisco'),
('Sucursal Bajío', 'SUC004', 'León', 'Guanajuato'),
('Sucursal Sureste', 'SUC005', 'Mérida', 'Yucatán'),
('Sucursal Pacifico', 'SUC006', 'Culiacán', 'Sinaloa'),
('Sucursal Golfo', 'SUC007', 'Veracruz', 'Veracruz'),
('Sucursal Puebla', 'SUC008', 'Puebla', 'Puebla'),
('Sucursal Querétaro', 'SUC009', 'Querétaro', 'Querétaro'),
('Sucursal Tijuana', 'SUC010', 'Tijuana', 'Baja California');

-- ============================================
-- STORED PROCEDURE: Obtener estadísticas generales
-- ============================================
DELIMITER $$

CREATE PROCEDURE sp_estadisticas_generales()
BEGIN
    SELECT 
        COUNT(*) as total_solicitudes,
        SUM(CASE WHEN estado = 'aprobado' THEN 1 ELSE 0 END) as total_aprobados,
        SUM(CASE WHEN estado = 'rechazado' THEN 1 ELSE 0 END) as total_rechazados,
        ROUND(AVG(monto_solicitado), 2) as monto_promedio,
        ROUND(SUM(CASE WHEN estado = 'aprobado' THEN monto_solicitado ELSE 0 END), 2) as monto_total_aprobado,
        ROUND(AVG(score), 2) as score_promedio,
        ROUND(
            (SUM(CASE WHEN estado = 'aprobado' THEN 1 ELSE 0 END) / COUNT(*)) * 100, 
            2
        ) as porcentaje_aprobacion
    FROM solicitudes;
END$$

DELIMITER ;

-- ============================================
-- STORED PROCEDURE: Estadísticas por sucursal
-- ============================================
DELIMITER $$

CREATE PROCEDURE sp_estadisticas_por_sucursal()
BEGIN
    SELECT 
        su.id as sucursal_id,
        su.nombre as sucursal_nombre,
        su.codigo as sucursal_codigo,
        su.ciudad,
        su.estado,
        COUNT(s.id) as total_solicitudes,
        SUM(CASE WHEN s.estado = 'aprobado' THEN 1 ELSE 0 END) as total_aprobados,
        SUM(CASE WHEN s.estado = 'rechazado' THEN 1 ELSE 0 END) as total_rechazados,
        ROUND(AVG(s.monto_solicitado), 2) as monto_promedio,
        ROUND(SUM(CASE WHEN s.estado = 'aprobado' THEN s.monto_solicitado ELSE 0 END), 2) as monto_total_aprobado,
        ROUND(
            (SUM(CASE WHEN s.estado = 'aprobado' THEN 1 ELSE 0 END) / COUNT(s.id)) * 100, 
            2
        ) as porcentaje_aprobacion
    FROM sucursales su
    LEFT JOIN solicitudes s ON su.id = s.sucursal_id
    GROUP BY su.id, su.nombre, su.codigo, su.ciudad, su.estado
    ORDER BY total_solicitudes DESC;
END$$

DELIMITER ;

-- ============================================
-- STORED PROCEDURE: Historial de cliente
-- ============================================
DELIMITER $$

CREATE PROCEDURE sp_historial_cliente(IN p_cliente_id INT)
BEGIN
    SELECT 
        s.id as solicitud_id,
        s.monto_solicitado,
        s.plazo_meses,
        s.estado,
        s.motivo_rechazo,
        s.score,
        s.fecha_solicitud,
        su.nombre as sucursal_nombre,
        c.nombre,
        c.apellidos,
        c.email,
        c.telefono,
        c.ingreso_mensual
    FROM solicitudes s
    INNER JOIN clientes c ON s.cliente_id = c.id
    INNER JOIN sucursales su ON s.sucursal_id = su.id
    WHERE s.cliente_id = p_cliente_id
    ORDER BY s.fecha_solicitud DESC;
END$$

DELIMITER ;

-- ============================================
-- STORED PROCEDURE: Top clientes por monto aprobado
-- ============================================
DELIMITER $$

CREATE PROCEDURE sp_top_clientes(IN p_limite INT)
BEGIN
    SELECT 
        c.id,
        c.nombre,
        c.apellidos,
        c.email,
        COUNT(s.id) as total_solicitudes,
        SUM(CASE WHEN s.estado = 'aprobado' THEN 1 ELSE 0 END) as solicitudes_aprobadas,
        ROUND(SUM(CASE WHEN s.estado = 'aprobado' THEN s.monto_solicitado ELSE 0 END), 2) as monto_total_aprobado,
        ROUND(AVG(s.score), 2) as score_promedio
    FROM clientes c
    INNER JOIN solicitudes s ON c.id = s.cliente_id
    GROUP BY c.id, c.nombre, c.apellidos, c.email
    HAVING solicitudes_aprobadas > 0
    ORDER BY monto_total_aprobado DESC
    LIMIT p_limite;
END$$

DELIMITER ;

-- ============================================
-- STORED PROCEDURE: Solicitudes por fecha
-- ============================================
DELIMITER $$

CREATE PROCEDURE sp_solicitudes_por_fecha(
    IN p_fecha_inicio DATE,
    IN p_fecha_fin DATE
)
BEGIN
    SELECT 
        DATE(s.fecha_solicitud) as fecha,
        COUNT(*) as total,
        SUM(CASE WHEN s.estado = 'aprobado' THEN 1 ELSE 0 END) as aprobados,
        SUM(CASE WHEN s.estado = 'rechazado' THEN 1 ELSE 0 END) as rechazados,
        ROUND(AVG(s.monto_solicitado), 2) as monto_promedio
    FROM solicitudes s
    WHERE DATE(s.fecha_solicitud) BETWEEN p_fecha_inicio AND p_fecha_fin
    GROUP BY DATE(s.fecha_solicitud)
    ORDER BY fecha DESC;
END$$

DELIMITER ;

-- ============================================
-- STORED PROCEDURE: Reporte completo de solicitud
-- ============================================
DELIMITER $$

CREATE PROCEDURE sp_reporte_solicitud(IN p_solicitud_id INT)
BEGIN
    SELECT 
        s.id as solicitud_id,
        s.monto_solicitado,
        s.plazo_meses,
        s.estado,
        s.motivo_rechazo,
        s.score,
        s.fecha_solicitud,
        ROUND(s.monto_solicitado / s.plazo_meses, 2) as pago_mensual,
        c.id as cliente_id,
        c.nombre,
        c.apellidos,
        c.email,
        c.telefono,
        c.fecha_nacimiento,
        TIMESTAMPDIFF(YEAR, c.fecha_nacimiento, CURDATE()) as edad,
        c.ingreso_mensual,
        ROUND((c.ingreso_mensual / (s.monto_solicitado / s.plazo_meses)) * 100, 2) as capacidad_pago_porcentaje,
        su.id as sucursal_id,
        su.nombre as sucursal_nombre,
        su.codigo as sucursal_codigo,
        su.ciudad as sucursal_ciudad,
        su.estado as sucursal_estado
    FROM solicitudes s
    INNER JOIN clientes c ON s.cliente_id = c.id
    INNER JOIN sucursales su ON s.sucursal_id = su.id
    WHERE s.id = p_solicitud_id;
END$$

DELIMITER ;

-- ============================================
-- VISTA: Vista de solicitudes completas
-- ============================================
CREATE OR REPLACE VIEW vw_solicitudes_completas AS
SELECT 
    s.id,
    s.monto_solicitado,
    s.plazo_meses,
    s.estado,
    s.motivo_rechazo,
    s.score,
    s.fecha_solicitud,
    ROUND(s.monto_solicitado / s.plazo_meses, 2) as pago_mensual,
    c.id as cliente_id,
    CONCAT(c.nombre, ' ', c.apellidos) as cliente_nombre_completo,
    c.email as cliente_email,
    c.telefono as cliente_telefono,
    c.ingreso_mensual as cliente_ingreso,
    TIMESTAMPDIFF(YEAR, c.fecha_nacimiento, CURDATE()) as cliente_edad,
    su.id as sucursal_id,
    su.nombre as sucursal_nombre,
    su.codigo as sucursal_codigo,
    su.ciudad as sucursal_ciudad
FROM solicitudes s
INNER JOIN clientes c ON s.cliente_id = c.id
INNER JOIN sucursales su ON s.sucursal_id = su.id;

-- ============================================
-- VISTA: Dashboard de estadísticas
-- ============================================
CREATE OR REPLACE VIEW vw_dashboard_stats AS
SELECT 
    (SELECT COUNT(*) FROM solicitudes) as total_solicitudes,
    (SELECT COUNT(*) FROM solicitudes WHERE estado = 'aprobado') as total_aprobados,
    (SELECT COUNT(*) FROM solicitudes WHERE estado = 'rechazado') as total_rechazados,
    (SELECT COUNT(*) FROM clientes) as total_clientes,
    (SELECT COUNT(*) FROM sucursales) as total_sucursales,
    (SELECT ROUND(AVG(monto_solicitado), 2) FROM solicitudes) as monto_promedio,
    (SELECT ROUND(AVG(score), 2) FROM solicitudes) as score_promedio,
    (SELECT ROUND(SUM(CASE WHEN estado = 'aprobado' THEN monto_solicitado ELSE 0 END), 2) 
     FROM solicitudes) as monto_total_aprobado;

-- ============================================
-- FUNCIÓN: Calcular edad
-- ============================================
DELIMITER $$

CREATE FUNCTION fn_calcular_edad(p_fecha_nacimiento DATE)
RETURNS INT
DETERMINISTIC
BEGIN
    DECLARE edad INT;
    SET edad = TIMESTAMPDIFF(YEAR, p_fecha_nacimiento, CURDATE());
    RETURN edad;
END$$

DELIMITER ;

-- ============================================
-- FUNCIÓN: Calcular capacidad de pago
-- ============================================
DELIMITER $$

CREATE FUNCTION fn_capacidad_pago(
    p_ingreso_mensual DECIMAL(12,2),
    p_monto_solicitado DECIMAL(12,2),
    p_plazo_meses INT
)
RETURNS DECIMAL(5,2)
DETERMINISTIC
BEGIN
    DECLARE capacidad DECIMAL(5,2);
    DECLARE pago_mensual DECIMAL(12,2);
    
    SET pago_mensual = p_monto_solicitado / p_plazo_meses;
    SET capacidad = (p_ingreso_mensual / pago_mensual) * 100;
    
    RETURN ROUND(capacidad, 2);
END$$

DELIMITER ;

-- ============================================
-- TRIGGER: Validar datos de cliente antes de insertar
-- ============================================
DELIMITER $$

CREATE TRIGGER trg_validar_cliente_antes_insertar
BEFORE INSERT ON clientes
FOR EACH ROW
BEGIN
    -- Validar que el ingreso sea positivo
    IF NEW.ingreso_mensual <= 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El ingreso mensual debe ser mayor a 0';
    END IF;
    
    -- Validar que la edad sea mayor a 18
    IF TIMESTAMPDIFF(YEAR, NEW.fecha_nacimiento, CURDATE()) < 18 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El cliente debe ser mayor de 18 años';
    END IF;
    
    -- Validar formato de teléfono (10 dígitos)
    IF LENGTH(NEW.telefono) != 10 OR NEW.telefono NOT REGEXP '^[0-9]+$' THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El teléfono debe tener 10 dígitos numéricos';
    END IF;
END$$

DELIMITER ;

-- ============================================
-- TRIGGER: Validar datos de solicitud antes de insertar
-- ============================================
DELIMITER $$

CREATE TRIGGER trg_validar_solicitud_antes_insertar
BEFORE INSERT ON solicitudes
FOR EACH ROW
BEGIN
    -- Validar monto
    IF NEW.monto_solicitado < 5000 OR NEW.monto_solicitado > 500000 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El monto debe estar entre $5,000 y $500,000';
    END IF;
    
    -- Validar plazo
    IF NEW.plazo_meses < 6 OR NEW.plazo_meses > 60 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El plazo debe estar entre 6 y 60 meses';
    END IF;
    
    -- Validar score
    IF NEW.score < 0 OR NEW.score > 100 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El score debe estar entre 0 y 100';
    END IF;
END$$

DELIMITER ;

-- ============================================
-- DATOS DE PRUEBA: Clientes (opcional)
-- ============================================
INSERT INTO clientes (nombre, apellidos, email, telefono, fecha_nacimiento, ingreso_mensual) VALUES
('María', 'González López', 'maria.gonzalez@email.com', '5512345671', '1985-03-20', 25000.00),
('Carlos', 'Ramírez Sánchez', 'carlos.ramirez@email.com', '5512345672', '1990-07-15', 18000.00),
('Ana', 'Martínez Pérez', 'ana.martinez@email.com', '5512345673', '1988-11-30', 32000.00),
('Luis', 'Hernández García', 'luis.hernandez@email.com', '5512345674', '1995-01-10', 15000.00),
('Patricia', 'López Rodríguez', 'patricia.lopez@email.com', '5512345675', '1982-09-25', 45000.00);

-- ============================================
-- DATOS DE PRUEBA: Solicitudes (opcional)
-- ============================================
INSERT INTO solicitudes (cliente_id, sucursal_id, monto_solicitado, plazo_meses, estado, motivo_rechazo, score) VALUES
(1, 1, 50000, 24, 'aprobado', NULL, 78),
(2, 2, 100000, 36, 'rechazado', 'Ingreso insuficiente para el monto solicitado', 45),
(3, 3, 75000, 18, 'aprobado', NULL, 85),
(4, 1, 30000, 12, 'aprobado', NULL, 72),
(5, 4, 200000, 48, 'aprobado', NULL, 92);


SELECT 
    'Script ejecuado ' as mensaje,
    (SELECT COUNT(*) FROM sucursales) as total_sucursales,
    (SELECT COUNT(*) FROM clientes) as total_clientes,
    (SELECT COUNT(*) FROM solicitudes) as total_solicitudes,
    NOW() as fecha_ejecucion;