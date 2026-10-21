/* ============================================================
   Tu Inmueble Suroeste - Datos de ejemplo del front-end
   Inmuebles, textos y fotografías de las pantallas de Figma EV03
   (D01, D02, D03, D06, M01-M04). Campos según la tabla
   "inmuebles" de la base de datos del proyecto.
   ============================================================ */

const IMG = (id, w = 900) => `https://images.unsplash.com/photo-${id}?w=${w}&q=70&auto=format&fit=crop`;

const INMUEBLES = [
    {
        id: 1, titulo: "Casa moderna con piscina", tipo: "casa", operacion: "venta", precio: 480000000,
        municipio: "Jardín", sector: "rural", direccion: "Vereda La Herrera", estado: "disponible", nuevo: true,
        habitaciones: 4, banos: 3, area: 220, parqueaderos: 2, destacado: true,
        descripcion: "Hermosa casa de dos niveles ubicada a 5 minutos del parque principal de Jardín. Cuenta con amplios espacios iluminados, cocina integral abierta, zona de BBQ, piscina y una vista privilegiada a las montañas del Suroeste Antioqueño. Ideal para vivienda familiar o descanso.",
        caracteristicas: ["Piscina", "Zona BBQ", "Cocina integral", "Vista a montaña", "Calentador de agua", "Patio y jardín", "Vía pavimentada", "Cerca al parque"],
        imagenes: ["1600596542815-ffad4c1539a9", "1600585154340-be6161a56a0c", "1600607687939-ce8a6c25118c", "1564013799919-ab600027ffc6", "1502672260266-1c1ef2d93688"]
    },
    {
        id: 2, titulo: "Apartamento céntrico", tipo: "apartamento", operacion: "arriendo", precio: 1800000,
        municipio: "Andes", sector: "urbano", direccion: "Calle 50 # 49-21, piso 3", estado: "reservado",
        habitaciones: 3, banos: 2, area: 85, parqueaderos: 1, destacado: true,
        descripcion: "Apartamento iluminado a dos cuadras del parque principal de Andes, con sala-comedor, balcón, cocina integral y zona de ropas independiente. Cerca de comercio, bancos y transporte.",
        caracteristicas: ["Balcón", "Cocina integral", "Zona de ropas", "Portería", "Cerca al parque", "Calentador de agua"],
        imagenes: ["1522708323590-d24dbb6b0267", "1502672260266-1c1ef2d93688", "1600585154340-be6161a56a0c", "1600607687939-ce8a6c25118c", "1564013799919-ab600027ffc6"]
    },
    {
        id: 3, titulo: "Lote campestre con vista", tipo: "terreno", operacion: "venta", precio: 320000000,
        municipio: "Jericó", sector: "rural", direccion: "Vereda Cauca, km 4", estado: "disponible",
        habitaciones: 0, banos: 0, area: 2500, parqueaderos: 0, destacado: true,
        descripcion: "Lote campestre de 2.500 m² con vista panorámica a las montañas de Jericó, ideal para construir casa de descanso. Cuenta con acceso vehicular y disponibilidad de servicios públicos.",
        caracteristicas: ["Vista a montaña", "Vía pavimentada", "Agua de nacimiento", "Escrituras al día"],
        imagenes: ["1500382017468-9049fed747ef", "1568605114967-8130f3a36994", "1600596542815-ffad4c1539a9", "1570129477492-45c003edd2be", "1512917774080-9991f1c4c750"]
    },
    {
        id: 4, titulo: "Casa familiar con jardín", tipo: "casa", operacion: "venta", precio: 390000000,
        municipio: "Ciudad Bolívar", sector: "urbano", direccion: "Barrio El Libertador", estado: "disponible",
        habitaciones: 3, banos: 2, area: 160, parqueaderos: 1, destacado: true,
        descripcion: "Casa de una planta en barrio residencial tranquilo de Ciudad Bolívar, con antejardín, patio interior, cocina integral y garaje cubierto. Lista para habitar.",
        caracteristicas: ["Patio y jardín", "Cocina integral", "Garaje cubierto", "Calentador de agua", "Cerca al parque"],
        imagenes: ["1568605114967-8130f3a36994", "1570129477492-45c003edd2be", "1564013799919-ab600027ffc6", "1600585154340-be6161a56a0c", "1502672260266-1c1ef2d93688"]
    },
    {
        id: 5, titulo: "Apartaestudio amoblado", tipo: "apartamento", operacion: "arriendo", precio: 1200000,
        municipio: "Fredonia", sector: "urbano", direccion: "Carrera 50 # 52-10", estado: "arrendado",
        habitaciones: 1, banos: 1, area: 45, parqueaderos: 0,
        descripcion: "Apartaestudio amoblado con internet incluido, ideal para profesionales o estudiantes. Ubicado cerca de la plaza principal de Fredonia.",
        caracteristicas: ["Amoblado", "Internet incluido", "Cocina integral", "Portería"],
        imagenes: ["1502672260266-1c1ef2d93688", "1522708323590-d24dbb6b0267", "1600607687939-ce8a6c25118c", "1600585154340-be6161a56a0c", "1564013799919-ab600027ffc6"]
    },
    {
        id: 6, titulo: "Finca cafetera tradicional", tipo: "casa", operacion: "venta", precio: 950000000,
        municipio: "Támesis", sector: "rural", direccion: "Vereda San Antonio", estado: "disponible",
        habitaciones: 5, banos: 4, area: 30000, parqueaderos: 3,
        descripcion: "Finca de 3 hectáreas con cultivo de café, casa principal de estilo tradicional antioqueño, beneficiadero y casa de mayordomo. Acceso por vía en buen estado.",
        caracteristicas: ["Cultivo de café", "Beneficiadero", "Casa de mayordomo", "Vista a montaña", "Agua de nacimiento"],
        imagenes: ["1512917774080-9991f1c4c750", "1500382017468-9049fed747ef", "1568605114967-8130f3a36994", "1600596542815-ffad4c1539a9", "1570129477492-45c003edd2be"]
    },
    {
        id: 7, titulo: "Casa en arriendo cerca al parque", tipo: "casa", operacion: "arriendo", precio: 2500000,
        municipio: "Hispania", sector: "urbano", direccion: "Calle 12 # 8-40", estado: "disponible",
        habitaciones: 3, banos: 2, area: 140, parqueaderos: 1,
        descripcion: "Casa de dos niveles a una cuadra del parque principal de Hispania, con patio, zona de ropas y garaje. Ideal para familia.",
        caracteristicas: ["Cerca al parque", "Patio y jardín", "Garaje cubierto", "Zona de ropas"],
        imagenes: ["1570129477492-45c003edd2be", "1564013799919-ab600027ffc6", "1568605114967-8130f3a36994", "1600585154340-be6161a56a0c", "1502672260266-1c1ef2d93688"]
    },
    {
        id: 8, titulo: "Casa colonial restaurada", tipo: "casa", operacion: "venta", precio: 410000000,
        municipio: "Jericó", sector: "urbano", direccion: "Carrera 4 # 6-35", estado: "disponible",
        habitaciones: 4, banos: 3, area: 190, parqueaderos: 0,
        descripcion: "Casa de arquitectura colonial restaurada en el centro histórico de Jericó, con patio central, balcones de madera y techos altos.",
        caracteristicas: ["Patio central", "Balcones de madera", "Techos altos", "Cerca al parque"],
        imagenes: ["1564013799919-ab600027ffc6", "1570129477492-45c003edd2be", "1600585154340-be6161a56a0c", "1568605114967-8130f3a36994", "1600607687939-ce8a6c25118c"]
    },
    {
        id: 9, titulo: "Local comercial esquinero", tipo: "local", operacion: "arriendo", precio: 2800000,
        municipio: "Andes", sector: "urbano", direccion: "Carrera 50 # 49-02", estado: "disponible", nuevo: true,
        habitaciones: 0, banos: 1, area: 70, parqueaderos: 0,
        descripcion: "Local esquinero sobre la vía principal de Andes, con alto flujo peatonal, vitrina amplia, baño y depósito.",
        caracteristicas: ["Esquinero", "Vitrina", "Depósito", "Alto flujo peatonal"],
        imagenes: ["1600607687939-ce8a6c25118c", "1522708323590-d24dbb6b0267", "1502672260266-1c1ef2d93688", "1600585154340-be6161a56a0c", "1564013799919-ab600027ffc6"]
    }
];

const MUNICIPIOS = ["Jardín", "Jericó", "Andes", "Ciudad Bolívar", "Hispania", "Fredonia", "Támesis"];

// Favoritos de ejemplo de D06 (se cargan solo la primera vez)
const FAVORITOS_INICIALES = [1, 2, 6, 7];
