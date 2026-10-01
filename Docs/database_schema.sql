-- =========================================================================
-- ESQUEMA DE BASE DE DATOS: EL NIDO OUTFIT (OPERACIÓN UNIPERSONAL)
-- =========================================================================

-- 1. PROVEEDORES
CREATE TABLE proveedores (
    id_proveedor SERIAL PRIMARY KEY,
    razon_social VARCHAR(150) NOT NULL,
    contacto VARCHAR(100),
    telefono VARCHAR(30),
    dias_gracia INTEGER DEFAULT 0,
    lead_time_dias INTEGER DEFAULT 0,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. PRODUCTOS Y VARIANTES (SKU Paramétrico)
-- Estructura SKU: [TIPO]-[ESTILO]-[TALLA]-[COLOR]-[CONSECUTIVO] (Ej: CAM-SLI-MD-AZU-0042)
CREATE TABLE productos (
    id_producto SERIAL PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    descripcion TEXT,
    id_proveedor INTEGER REFERENCES proveedores(id_proveedor),
    costo_adquisicion NUMERIC(10,2) NOT NULL,
    costos_logisticos NUMERIC(10,2) DEFAULT 0.00,
    precio_venta_base NUMERIC(10,2) NOT NULL,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TYPE estado_prenda AS ENUM ('DISPONIBLE', 'SEPARADA', 'EN_BAUL', 'DESPACHADA', 'CANCELADA');

CREATE TABLE variantes_sku (
    id_variante SERIAL PRIMARY KEY,
    sku VARCHAR(50) UNIQUE NOT NULL,
    id_producto INTEGER REFERENCES productos(id_producto) ON DELETE CASCADE,
    tipo VARCHAR(10) NOT NULL,       -- Ej: CAM
    estilo VARCHAR(10) NOT NULL,     -- Ej: SLI
    talla VARCHAR(10) NOT NULL,      -- Ej: MD
    color VARCHAR(10) NOT NULL,      -- Ej: AZU
    consecutivo VARCHAR(10) NOT NULL, -- Ej: 0042
    codigo_barras VARCHAR(100) UNIQUE, -- EAN-13 o Code128
    estado estado_prenda DEFAULT 'DISPONIBLE',
    stock_minimo INTEGER DEFAULT 2,
    imagenes_url TEXT[] -- Array para almacenar hasta 5 URLs de imágenes en CDN
);

-- 3. CLIENTES Y FIDELIZACIÓN
CREATE TYPE nivel_fidelidad AS ENUM ('BRONCE', 'PLATA', 'ORO_VIP');

CREATE TABLE clientes (
    id_cliente SERIAL PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    telefono VARCHAR(30) UNIQUE NOT NULL,
    email VARCHAR(100),
    nivel_fidelidad nivel_fidelidad DEFAULT 'BRONCE',
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. MÓDULO "BAÚL" (Custodia de prendas pagadas al 100%)
CREATE TYPE tipo_envio AS ENUM ('CONTRAENTREGA', 'PAGO_CONTADO');

CREATE TABLE envios (
    id_envio SERIAL PRIMARY KEY,
    tipo_envio tipo_envio NOT NULL,
    costo_envio NUMERIC(10,2) DEFAULT 0.00,
    direccion_entrega TEXT NOT NULL,
    numero_guia VARCHAR(100),
    estado_envio VARCHAR(50) DEFAULT 'PENDIENTE',
    fecha_despacho TIMESTAMP
);

CREATE TABLE baul_custodia (
    id_baul SERIAL PRIMARY KEY,
    id_cliente INTEGER REFERENCES clientes(id_cliente),
    id_variante INTEGER REFERENCES variantes_sku(id_variante),
    fecha_ingreso TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    observaciones TEXT,
    id_envio INTEGER REFERENCES envios(id_envio)
);

-- 5. SISTEMA DE APARTADOS PRIORIZADOS
CREATE TABLE apartados (
    id_apartado SERIAL PRIMARY KEY,
    id_cliente INTEGER REFERENCES clientes(id_cliente),
    fecha_inicio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_vencimiento TIMESTAMP NOT NULL,
    monto_total NUMERIC(10,2) NOT NULL,
    monto_abonado NUMERIC(10,2) NOT NULL,
    estado_apartado VARCHAR(30) DEFAULT 'ACTIVO' -- ACTIVO, LIQUIDADO, VENCIDO, CANCELADO
);

CREATE TABLE detalle_apartado (
    id_detalle_apartado SERIAL PRIMARY KEY,
    id_apartado INTEGER REFERENCES apartados(id_apartado) ON DELETE CASCADE,
    id_variante INTEGER REFERENCES variantes_sku(id_variante)
);

CREATE TABLE abonos (
    id_abono SERIAL PRIMARY KEY,
    id_apartado INTEGER REFERENCES apartados(id_apartado) ON DELETE CASCADE,
    monto NUMERIC(10,2) NOT NULL,
    metodo_pago VARCHAR(50) NOT NULL, -- Efectivo, Tarjeta, Transferencia, QR
    fecha_abono TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. VENTAS DIRECTAS Y CAJA
CREATE TABLE ventas (
    id_venta SERIAL PRIMARY KEY,
    id_cliente INTEGER REFERENCES clientes(id_cliente),
    total_venta NUMERIC(10,2) NOT NULL,
    comision_pasarela NUMERIC(10,2) DEFAULT 0.00,
    impuestos NUMERIC(10,2) DEFAULT 0.00,
    ganancia_neta NUMERIC(10,2) NOT NULL,
    metodo_pago VARCHAR(50) NOT NULL,
    fecha_venta TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE detalle_venta (
    id_detalle_venta SERIAL PRIMARY KEY,
    id_venta INTEGER REFERENCES ventas(id_venta) ON DELETE CASCADE,
    id_variante INTEGER REFERENCES variantes_sku(id_variante),
    precio_unitario NUMERIC(10,2) NOT NULL
);