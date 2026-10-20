/* ============================================================
   Tu Inmueble Suroeste - Datos de ejemplo del front-end
   Los campos siguen la tabla "inmuebles" de la base de datos
   (titulo, descripcion, tipo, operacion, precio, direccion,
   municipio, estado). Mientras no exista backend, estos datos
   alimentan las tarjetas, el catálogo, el detalle y favoritos.
   ============================================================ */

const IMG = (id, w = 900) => `https://images.unsplash.com/${id}?w=${w}&q=70&auto=format&fit=crop`;

const INMUEBLES = [
    {
        id: 1, titulo: "Casa campestre con vista a la montaña", tipo: "casa", operacion: "venta",
        precio: 480000000, municipio: "Jardín", direccion: "Vereda La Salada, km 3",
        estado: "disponible", habitaciones: 4, banos: 3, area: 220, destacado: true,
        descripcion: "Casa campestre rodeada de cafetales, a diez minutos del parque principal de Jardín. Amplios corredores, chimenea, cocina abierta y zona verde con árboles frutales.",
        caracteristicas: ["Chimenea", "Parqueadero para 2 vehículos", "Zona verde", "Agua de nacimiento", "Cocina integral", "Vista panorámica"],
        imagenes: ["photo-1600596542815-ffad4c1539a9", "photo-1600585154340-be6161a56a0c", "photo-1484154218962-a197022b5858"]
    },
    {
        id: 2, titulo: "Apartamento moderno cerca al parque", tipo: "apartamento", operacion: "arriendo",
        precio: 1600000, municipio: "Andes", direccion: "Calle 50 # 49-21, piso 3",
        estado: "disponible", habitaciones: 3, banos: 2, area: 85, destacado: true,
        descripcion: "Apartamento iluminado a dos cuadras del parque principal de Andes. Sala-comedor, balcón, cocina integral y zona de ropas independiente.",
        caracteristicas: ["Balcón", "Cocina integral", "Zona de ropas", "Cerca a transporte", "Portería"],
        imagenes: ["photo-1502672260266-1c1ef2d93688", "photo-1522708323590-d24dbb6b0267", "photo-1484154218962-a197022b5858"]
    },
    {
        id: 3, titulo: "Finca cafetera productiva", tipo: "finca", operacion: "venta",
        precio: 1250000000, municipio: "Ciudad Bolívar", direccion: "Vereda San Gregorio",
        estado: "disponible", habitaciones: 5, banos: 4, area: 48000, destacado: true,
        descripcion: "Finca de 4,8 hectáreas con cultivo de café tecnificado, beneficiadero, casa principal y casa de mayordomo. Acceso por vía pavimentada.",
        caracteristicas: ["Cultivo de café", "Beneficiadero", "Casa de mayordomo", "Vía pavimentada", "Nacimiento de agua"],
        imagenes: ["photo-1500382017468-9049fed747ef", "photo-1416331108676-a22ccb276e35", "photo-1449844908441-8829872d2607"]
    },
    {
        id: 4, titulo: "Casa colonial en el centro histórico", tipo: "casa", operacion: "venta",
        precio: 620000000, municipio: "Jericó", direccion: "Carrera 4 # 6-35",
        estado: "reservado", habitaciones: 5, banos: 3, area: 260, destacado: true,
        descripcion: "Casa de arquitectura tradicional antioqueña, con patio central, balcones de madera y techos altos, a una cuadra de la catedral de Jericó.",
        caracteristicas: ["Patio central", "Balcones de madera", "Techos altos", "Ubicación central"],
        imagenes: ["photo-1568605114967-8130f3a36994", "photo-1570129477492-45c003edd2be", "photo-1600585154340-be6161a56a0c"]
    },
    {
        id: 5, titulo: "Casa familiar con antejardín", tipo: "casa", operacion: "arriendo",
        precio: 1900000, municipio: "Támesis", direccion: "Calle 12 # 8-40",
        estado: "disponible", habitaciones: 3, banos: 2, area: 140,
        descripcion: "Casa de dos niveles en barrio residencial tranquilo, con antejardín, patio de ropas y garaje cubierto.",
        caracteristicas: ["Garaje cubierto", "Antejardín", "Patio", "Barrio residencial"],
        imagenes: ["photo-1570129477492-45c003edd2be", "photo-1564013799919-ab600027ffc6", "photo-1484154218962-a197022b5858"]
    },
    {
        id: 6, titulo: "Lote urbanizable plano", tipo: "lote", operacion: "venta",
        precio: 180000000, municipio: "Hispania", direccion: "Salida a Betania",
        estado: "disponible", habitaciones: 0, banos: 0, area: 1200,
        descripcion: "Lote plano con servicios públicos disponibles, ideal para proyecto de vivienda o bodega. Escrituras al día.",
        caracteristicas: ["Servicios públicos", "Terreno plano", "Escrituras al día", "Fácil acceso"],
        imagenes: ["photo-1449844908441-8829872d2607", "photo-1500382017468-9049fed747ef", "photo-1416331108676-a22ccb276e35"]
    },
    {
        id: 7, titulo: "Apartaestudio amoblado", tipo: "apartamento", operacion: "arriendo",
        precio: 950000, municipio: "Jardín", direccion: "Calle 9 # 3-15",
        estado: "arrendado", habitaciones: 1, banos: 1, area: 42,
        descripcion: "Apartaestudio amoblado con internet incluido, ideal para estudiantes o turismo de larga estancia.",
        caracteristicas: ["Amoblado", "Internet incluido", "Servicios incluidos"],
        imagenes: ["photo-1522708323590-d24dbb6b0267", "photo-1502672260266-1c1ef2d93688", "photo-1484154218962-a197022b5858"]
    },
    {
        id: 8, titulo: "Casa moderna con piscina", tipo: "casa", operacion: "venta",
        precio: 890000000, municipio: "Betania", direccion: "Condominio El Mirador, casa 7",
        estado: "disponible", habitaciones: 4, banos: 4, area: 310,
        descripcion: "Casa contemporánea en condominio cerrado, con piscina, terraza BBQ y amplios ventanales hacia el valle.",
        caracteristicas: ["Piscina", "Terraza BBQ", "Condominio cerrado", "Vigilancia 24 horas", "Parqueadero doble"],
        imagenes: ["photo-1613490493576-7fde63acd811", "photo-1580587771525-78b9dba3b914", "photo-1600596542815-ffad4c1539a9"]
    },
    {
        id: 9, titulo: "Local comercial sobre vía principal", tipo: "local", operacion: "arriendo",
        precio: 2800000, municipio: "Andes", direccion: "Carrera 50 # 52-10",
        estado: "disponible", habitaciones: 0, banos: 1, area: 75,
        descripcion: "Local esquinero de alto flujo peatonal, con vitrina amplia, baño y depósito.",
        caracteristicas: ["Esquinero", "Vitrina", "Depósito", "Alto flujo peatonal"],
        imagenes: ["photo-1580587771525-78b9dba3b914", "photo-1564013799919-ab600027ffc6", "photo-1522708323590-d24dbb6b0267"]
    }
];

const MUNICIPIOS = ["Andes", "Betania", "Ciudad Bolívar", "Hispania", "Jardín", "Jericó", "Támesis"];
