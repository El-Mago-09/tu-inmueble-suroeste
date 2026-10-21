# Tu Inmueble Suroeste – Front-end

Plataforma inmobiliaria para consultar y gestionar inmuebles en venta y arriendo en el Suroeste Antioqueño (Andes, Jardín, Jericó, Ciudad Bolívar, Támesis, Hispania y Betania).

Proyecto formativo SENA · Análisis y Desarrollo de Software · Ficha 3336217
Aprendiz: Ometh Martinez Potes · Instructor: Edgar Camilo Figueroa Rivera

Implementación de los componentes definidos en el documento **GA6-220501096-AA4-EV02 – Establecer los componentes front-end de la aplicación web**, con la apariencia de las interfaces aprobadas en Figma EV03 (Desktop D01–D15 y Mobile M01–M05).

- **EV02** define la estructura técnica: qué componentes HTML y CSS se usan.
- **Figma EV03** es la fuente de verdad visual: textos, colores, medidas, distribución, fotografías e iconos se tomaron de cada pantalla de Figma.

**Sitio publicado:** https://el-mago-09.github.io/tu-inmueble-suroeste/

## Tecnologías

HTML5 semántico, CSS3 (variables, Flexbox, Grid, media queries) y JavaScript sin frameworks. No hay backend todavía: los inmuebles salen de `js/data.js`, con los mismos campos que la tabla `inmuebles` de la base de datos del proyecto, y los favoritos se guardan en el navegador (`localStorage`).

## Estructura

```
tu-inmueble-suroeste/
├── index.html            Home (D01 / M01)
├── catalogo.html         Catálogo con filtros (D02 / M02)
├── detalle.html          Detalle del inmueble (D03 / M03)
├── login.html            Ingresar (D04)
├── registro.html         Crear cuenta (D05)
├── favoritos.html        Favoritos (D06 / M04)
├── mi-cuenta.html        Mi cuenta (D07 / M05)
├── publicar.html         Publicar inmueble (D08)
├── recuperar.html        Recuperar contraseña (D09)
├── admin/
│   ├── dashboard.html    Panel y reportes (D10)
│   ├── usuarios.html     (D11)
│   ├── inmuebles.html    (D12)
│   ├── solicitudes.html  (D13)
│   ├── contratos.html    (D14)
│   └── pagos.html        (D15)
├── css/
│   ├── styles.css        Variables, componentes y layout
│   └── responsive.css    Tablet (≤1024 px) y Mobile (≤768 px)
├── js/
│   ├── data.js           Datos de ejemplo de inmuebles
│   └── main.js           Tarjetas, filtros, favoritos, validación, modal
└── assets/img/           Logotipo
```

Los iconos son SVG en línea dentro del HTML, por eso no hay carpeta `assets/icons`. Las fotografías son las mismas de Figma (Unsplash) y cada inmueble usa la foto que tiene en su pantalla de Figma.

En Mobile (≤ 768 px) se aplican las pantallas M01–M05: header de 64 px con menú, barra inferior Inicio / Buscar / Favoritos / Mi cuenta, categorías en Home, botón Filtros y chips en el catálogo, galería a pantalla completa y barra Guardar / Solicitar información en el detalle, tarjetas horizontales en Favoritos y banda de perfil con módulos en Mi cuenta. Como las pantallas Mobile de Figma no incluyen beneficios, CTA ni footer, esas secciones se ocultan en móvil.

## Componentes implementados (según EV02)

| Componente | Implementación |
|---|---|
| Header | `<header class="site-header">` (Navbar/Desktop de Figma): logotipo, menú Inicio · Inmuebles · Nosotros · Contacto, Favoritos, Ingresar y Publicar inmueble. Bajo 1100 px se pliega en un menú con botón. |
| Navigation | Menú principal con ítem activo (`aria-current`), menú plegable, barra inferior móvil (Inicio, Buscar, Favoritos, Mi cuenta), migas de pan y menú lateral de Mi cuenta y de administración. |
| Main / Sections | Un `<main>` por página; `<section>` para hero, búsqueda, destacados, municipios, filtros, descripción, características y contenido administrativo. |
| Cards | `<article class="card-inmueble">` reutilizable, generado por `crearTarjeta()`: imagen, badge Venta/Arriendo, municipio, tipo, título, precio en COP, habitaciones, baños, área, botón de favorito y enlace al detalle. |
| Forms | Búsqueda, filtros, solicitud de visita, login, registro, recuperar contraseña y publicar inmueble (con `<fieldset>` y pasos `<ol>`). Todos con `<label>` visible y validación (`data-validate`). |
| Tables | `<table>` con `<thead>`/`<tbody>`/`<th scope>` para usuarios, inmuebles, solicitudes, contratos y pagos (admin) y para solicitudes, contratos y pagos en Mi cuenta. Búsqueda y filtro por estado; scroll horizontal en móvil. |
| Sidebar | `<aside>` de filtros en el catálogo, de contacto en el detalle, y menú lateral en Mi cuenta y en administración. |
| Footer | `<footer class="site-footer">` reutilizable: navegación secundaria, municipios y contacto. |
| Mensajes / estados / modales | Alertas de éxito y error, error por campo, estados vacíos (catálogo sin resultados, favoritos vacíos), notificación flotante y `<dialog>` de confirmación para cerrar sesión y para acciones administrativas. |

Los estados de los badges siguen la base de datos: inmuebles *disponible / reservado / vendido / arrendado*; solicitudes *pendiente / aprobada / rechazada*; contratos *activo / finalizado / cancelado*; pagos *pendiente / pagado / rechazado*.

## Identidad visual

| Token | Valor | Uso |
|---|---|---|
| `--color-navy` | `#0F1F3D` | Títulos, navegación, estructura |
| `--color-primary` | `#C9972B` | Acciones principales (texto navy encima) |
| `--color-primary-dark` | `#8A6416` | Texto dorado sobre fondo claro |
| `--color-white` | `#FFFFFF` | Tarjetas y superficies |
| `--color-bg` | `#F6F7F9` | Fondo general |
| `--color-text-secondary` | `#667085` | Información secundaria |

Tipografía Inter. Botones Primary, Secondary y Outline con estados `:hover`, `:focus-visible`, `:active` y `disabled`.

## Accesibilidad

Un solo `<h1>` por página, enlace "Saltar al contenido", `alt` en todas las imágenes, `<label>` en todos los campos, foco visible, áreas táctiles de 44 px o más en navegación, botones principales y formularios, mensajes de error asociados con `aria-describedby` y estados que no dependen solo del color.

## Cómo ejecutarlo

1. Abrir la carpeta en Visual Studio Code.
2. Clic derecho sobre `index.html` → **Open with Live Server**.
3. Para el área administrativa: Ingresar → "Acceso administradores", o abrir `admin/dashboard.html`.
