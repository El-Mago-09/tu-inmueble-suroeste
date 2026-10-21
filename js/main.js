/* ============================================================
   Tu Inmueble Suroeste - Interacción del front-end
   Requiere js/data.js. Cada página indica su tipo en
   <body data-page="..."> y su ruta base en data-base.
   ============================================================ */

const BASE = document.body.dataset.base || "";
const FAV_KEY = "tis-favoritos";

const svg = (d, extra = "") => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" ${extra}>${d}</svg>`;
const ICONS = {
    heart: svg('<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>'),
    pin: svg('<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>'),
    bed: svg('<path d="M2 4v16M2 8h18a2 2 0 0 1 2 2v10M2 17h20M6 8v9"/>'),
    bath: svg('<path d="M9 6 6.5 3.5a1.5 1.5 0 0 0-1-.5C4.68 3 4 3.68 4 4.5V17a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5M2 12h20M7 19v2M17 19v2"/>'),
    area: svg('<path d="M21.3 15.3a2.4 2.4 0 0 1 0 3.4l-2.6 2.6a2.4 2.4 0 0 1-3.4 0L2.7 8.7a2.41 2.41 0 0 1 0-3.4l2.6-2.6a2.41 2.41 0 0 1 3.4 0Z"/><path d="m14.5 12.5 2-2M11.5 9.5l2-2M8.5 6.5l2-2M17.5 15.5l2-2"/>'),
    arrow: svg('<path d="M5 12h14M12 5l7 7-7 7"/>'),
    check: svg('<path d="M20 6 9 17l-5-5"/>'),
    x: svg('<path d="M18 6 6 18M6 6l12 12"/>'),
    trash: svg('<path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>')
};

const OPERACION = { venta: "Venta", arriendo: "Arriendo" };
const TIPO = { casa: "Casa", apartamento: "Apartamento", terreno: "Terreno", local: "Local" };
const ESTADO_BADGE = {
    disponible: ["badge-success", "Disponible"],
    reservado: ["badge-warning", "Reservado"],
    arrendado: ["badge-info", "Arrendado"],
    vendido: ["badge-muted", "Vendido"]
};

/* ---------- Utilidades ---------- */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

const formatCOP = (valor) => "$" + valor.toLocaleString("es-CO") + " COP";
const precioTexto = (i) => formatCOP(i.precio) + (i.operacion === "arriendo" ? " / mes" : "");
const formatArea = (m2) => m2 >= 10000
    ? (m2 / 10000).toLocaleString("es-CO", { maximumFractionDigits: 1 }) + " ha"
    : m2.toLocaleString("es-CO") + " m²";
const banosTexto = (n) => n ? `${n} ${n === 1 ? "baño" : "baños"}` : "— baños";
const habTexto = (n) => n ? `${n} hab.` : "— hab.";

function getFavoritos() {
    try {
        const guardado = localStorage.getItem(FAV_KEY);
        if (guardado === null) {
            localStorage.setItem(FAV_KEY, JSON.stringify(FAVORITOS_INICIALES));
            return [...FAVORITOS_INICIALES];
        }
        return JSON.parse(guardado) || [];
    } catch (e) {
        return [];
    }
}

function setFavoritos(lista) {
    try {
        localStorage.setItem(FAV_KEY, JSON.stringify(lista));
    } catch (e) { /* almacenamiento no disponible */ }
    actualizarContadores();
}

const esFavorito = (id) => getFavoritos().includes(id);

function alternarFavorito(id) {
    const lista = getFavoritos();
    const existe = lista.includes(id);
    setFavoritos(existe ? lista.filter((x) => x !== id) : [...lista, id]);
    mostrarToast(existe ? "Inmueble eliminado de favoritos" : "Inmueble guardado en favoritos");
    return !existe;
}

function actualizarContadores() {
    const total = getFavoritos().length;
    $$("[data-fav-count]").forEach((el) => { el.textContent = total; });
}

function mostrarToast(mensaje) {
    let toast = $(".toast");
    if (!toast) {
        toast = document.createElement("div");
        toast.className = "toast";
        toast.setAttribute("role", "status");
        document.body.appendChild(toast);
    }
    toast.textContent = mensaje;
    toast.classList.add("show");
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => toast.classList.remove("show"), 2600);
}

/* ---------- Componente: Card de inmueble (Design System) ---------- */
function crearTarjeta(i) {
    const fav = esFavorito(i.id);
    return `
        <article class="card">
            <div class="card-media">
                <img src="${IMG(i.imagenes[0], 640)}" alt="${i.titulo} en ${i.municipio}" loading="lazy">
                <span class="badge badge-${i.operacion}">${OPERACION[i.operacion]}</span>
                <button type="button" class="btn-fav" data-fav="${i.id}" aria-pressed="${fav}"
                    aria-label="${fav ? "Quitar de favoritos" : "Guardar en favoritos"}: ${i.titulo}">${ICONS.heart}</button>
            </div>
            <div class="card-body">
                <p class="card-price">${precioTexto(i)}</p>
                <h3 class="card-title">${i.titulo}</h3>
                <p class="meta">${ICONS.pin}${i.municipio}, Antioquia · ${TIPO[i.tipo]}</p>
                <ul class="feats">
                    <li>${ICONS.bed}${habTexto(i.habitaciones)}</li>
                    <li>${ICONS.bath}${banosTexto(i.banos)}</li>
                    <li>${ICONS.area}${formatArea(i.area)}</li>
                </ul>
                <div class="divider"></div>
                <a class="link-gold" href="${BASE}detalle.html?id=${i.id}">Ver inmueble ${ICONS.arrow}</a>
            </div>
        </article>`;
}

const pintar = (contenedor, lista, fn = crearTarjeta) => { contenedor.innerHTML = lista.map(fn).join(""); };

// Botones de favorito (delegación: también sirve para tarjetas creadas después)
document.addEventListener("click", (evento) => {
    const boton = evento.target.closest("[data-fav]");
    if (!boton) return;
    const id = Number(boton.dataset.fav);
    const activo = alternarFavorito(id);
    $$(`[data-fav="${id}"]`).forEach((b) => {
        b.setAttribute("aria-pressed", activo);
        if (b.classList.contains("btn-fav")) {
            b.setAttribute("aria-label", activo ? "Quitar de favoritos" : "Guardar en favoritos");
        }
        const texto = b.querySelector("[data-fav-label]");
        if (texto) texto.textContent = activo ? texto.dataset.on : texto.dataset.off;
    });
    if (document.body.dataset.page === "favoritos") iniciarFavoritos();
});

/* ---------- Menú (Header/Mobile) ---------- */
$$(".menu-btn").forEach((boton) => {
    const menu = document.getElementById(boton.getAttribute("aria-controls"));
    boton.addEventListener("click", () => {
        const abierto = menu.classList.toggle("is-open");
        boton.setAttribute("aria-expanded", abierto);
        boton.setAttribute("aria-label", abierto ? "Cerrar menú" : "Abrir menú");
    });
    document.addEventListener("click", (e) => {
        if (menu.classList.contains("is-open") && !menu.contains(e.target) && !boton.contains(e.target)) {
            menu.classList.remove("is-open");
            boton.setAttribute("aria-expanded", "false");
        }
    });
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && menu.classList.contains("is-open")) {
            menu.classList.remove("is-open");
            boton.setAttribute("aria-expanded", "false");
            boton.focus();
        }
    });
    menu.addEventListener("click", (e) => {
        if (e.target.closest("a")) menu.classList.remove("is-open");
    });
});

/* ---------- Validación de formularios ---------- */
const MENSAJES = {
    valueMissing: (el) => el.type === "checkbox" ? "Debes marcar esta casilla." : "Este campo es obligatorio.",
    typeMismatch: () => "Revisa el formato (ejemplo: nombre@correo.com).",
    tooShort: (el) => `Debe tener al menos ${el.minLength} caracteres.`,
    rangeUnderflow: (el) => `El valor mínimo es ${el.min}.`,
    patternMismatch: (el) => el.dataset.patternMsg || "Formato no válido."
};

function validarCampo(campo) {
    const contenedor = campo.closest(".field");
    if (!contenedor || campo.type === "hidden") return true;

    if (campo.dataset.match) {
        const otro = document.getElementById(campo.dataset.match);
        campo.setCustomValidity(otro && campo.value !== otro.value ? "⚠ Las contraseñas no coinciden." : "");
    } else if (campo.minLength > 0 && campo.value && campo.value.length < campo.minLength) {
        // minlength solo se evalúa tras escribir; se comprueba también aquí
        campo.setCustomValidity(MENSAJES.tooShort(campo));
    } else if (campo.validity.customError) {
        campo.setCustomValidity("");
    }

    let mensaje = "";
    if (!campo.validity.valid) {
        if (campo.validity.customError) {
            mensaje = campo.validationMessage;
        } else {
            const clave = Object.keys(MENSAJES).find((k) => campo.validity[k]);
            mensaje = clave ? MENSAJES[clave](campo) : "Valor no válido.";
        }
    }

    contenedor.classList.toggle("is-invalid", Boolean(mensaje));
    campo.setAttribute("aria-invalid", Boolean(mensaje));
    let error = contenedor.querySelector(".field-error");
    const hint = contenedor.querySelector(".hint");
    if (mensaje) {
        if (!error) {
            error = document.createElement("p");
            error.className = "field-error";
            error.id = (campo.id || campo.name) + "-error";
            contenedor.appendChild(error);
        }
        error.textContent = mensaje;
        campo.setAttribute("aria-describedby", error.id);
        if (hint) hint.hidden = true;
    } else {
        if (error) error.remove();
        if (hint) {
            hint.hidden = false;
            campo.setAttribute("aria-describedby", hint.id);
        } else {
            campo.removeAttribute("aria-describedby");
        }
    }
    return !mensaje;
}

$$("form[data-validate]").forEach((form) => {
    form.noValidate = true;
    const campos = () => $$("input, select, textarea", form).filter((c) => c.type !== "hidden" && !c.disabled);
    campos().forEach((c) => {
        c.addEventListener("blur", () => validarCampo(c));
        c.addEventListener("change", () => { if (c.closest(".is-invalid")) validarCampo(c); });
    });

    form.addEventListener("submit", (evento) => {
        evento.preventDefault();
        const resultados = campos().map(validarCampo);
        const valido = resultados.every(Boolean);
        const alertaError = $(".alert-error", form);
        const alertaOk = $(".alert-success", form);
        if (alertaError) alertaError.hidden = valido;
        if (alertaOk) alertaOk.hidden = true;

        if (!valido) {
            const primero = $("[aria-invalid='true']", form);
            if (primero) primero.focus();
            return;
        }
        if (form.dataset.redirect) {
            window.location.href = form.dataset.redirect;
            return;
        }
        if (alertaOk) {
            alertaOk.hidden = false;
            alertaOk.focus();
        } else if (form.dataset.success) {
            mostrarToast(form.dataset.success);
        }
        if (!form.hasAttribute("data-keep")) {
            form.reset();
            form.dispatchEvent(new Event("form-reset"));
        }
    });
});

/* ---------- Modal de confirmación ---------- */
const modal = document.getElementById("confirm-modal");
let accionPendiente = null;

document.addEventListener("click", (evento) => {
    const disparador = evento.target.closest("[data-confirm]");
    if (!disparador || !modal) return;
    evento.preventDefault();
    $("[data-modal-text]", modal).textContent = disparador.dataset.confirm;
    $("[data-modal-ok]", modal).textContent = disparador.dataset.okText || "Confirmar";
    accionPendiente = disparador;
    modal.showModal();
});

if (modal) {
    modal.addEventListener("close", () => {
        if (modal.returnValue !== "ok" || !accionPendiente) return;
        const el = accionPendiente;
        accionPendiente = null;
        if (el.href) {
            window.location.href = el.href;
            return;
        }
        const fila = el.closest("tr");
        const badge = fila && $(".badge", fila);
        if (badge && el.dataset.newState) {
            badge.className = "badge " + (el.dataset.newClass || "badge-muted");
            badge.textContent = el.dataset.newState;
        }
        if (el.dataset.replace) {
            el.outerHTML = el.dataset.replace;
        } else {
            el.disabled = true;
        }
        mostrarToast(el.dataset.done || "Cambio guardado");
    });
}

// Acciones informativas (sin backend todavía)
document.addEventListener("click", (e) => {
    const el = e.target.closest("[data-toast]");
    if (el) {
        e.preventDefault();
        mostrarToast(el.dataset.toast);
    }
});

/* ---------- Herramientas de tablas administrativas ---------- */
$$("form[data-table]").forEach((form) => {
    const tabla = document.getElementById(form.dataset.table);
    const aplicar = () => {
        const texto = ($("[data-filter-text]", form)?.value || "").trim().toLowerCase();
        const filtros = $$("[data-filter-col]", form).map((s) => [Number(s.dataset.filterCol), s.value.toLowerCase()]);
        let visibles = 0;
        $$("tbody tr", tabla).forEach((fila) => {
            const celdas = $$("td", fila);
            const ok = fila.textContent.toLowerCase().includes(texto) &&
                filtros.every(([col, valor]) => !valor || celdas[col].textContent.toLowerCase().includes(valor));
            fila.hidden = !ok;
            if (ok) visibles++;
        });
        const vacio = $(`[data-empty-for="${tabla.id}"]`);
        if (vacio) vacio.hidden = visibles > 0;
    };
    form.addEventListener("submit", (e) => { e.preventDefault(); aplicar(); });
    $("[data-filter-text]", form)?.addEventListener("input", aplicar);
    $$("[data-filter-col]", form).forEach((s) => s.addEventListener("change", aplicar));
});

// Exportar reportes del dashboard
$$("[data-export]").forEach((boton) => {
    boton.addEventListener("click", () => {
        if (boton.dataset.export === "pdf") {
            window.print();
            return;
        }
        const tabla = document.getElementById(boton.dataset.table);
        const filas = $$("tr", tabla).map((tr) => $$("th, td", tr).map((c) => `"${c.textContent.trim().replace(/"/g, '""')}"`).join(";"));
        const blob = new Blob(["﻿" + filas.join("\n")], { type: "text/csv;charset=utf-8" });
        const enlace = document.createElement("a");
        enlace.href = URL.createObjectURL(blob);
        enlace.download = "actividad-reciente.csv";
        enlace.click();
        URL.revokeObjectURL(enlace.href);
        mostrarToast("Reporte exportado en formato CSV para Excel");
    });
});

/* ---------- Páginas ---------- */
function iniciarHome() {
    pintar($("#destacados"), INMUEBLES.filter((i) => i.destacado));
}

const PRECIOS = {
    "0-300000000": [0, 300000000],
    "300000000-600000000": [300000000, 600000000],
    "600000000-": [600000000, Infinity],
    "arriendo-2000000": [0, 2000000],
    "arriendo-2000000-": [2000000, Infinity]
};

function iniciarCatalogo() {
    const form = $("#form-filtros");
    const buscador = $("#buscar-catalogo");
    const contenedor = $("#resultados");
    const vacio = $("#sin-resultados");
    const contador = $("#total-resultados");
    const orden = $("#orden");
    const paginacion = $("#paginacion");
    const chipsActivos = $("#filtros-activos");
    const POR_PAGINA = 9;
    let pagina = 1;

    // Parámetros que llegan del buscador de Home
    const p = new URLSearchParams(window.location.search);
    if (p.get("q")) buscador.value = p.get("q");
    if (p.get("operacion")) $$(`[name="operacion"][value="${p.get("operacion")}"]`, form).forEach((c) => { c.checked = true; });
    if (p.get("tipo")) $$(`[name="tipo"][value="${p.get("tipo")}"]`, form).forEach((c) => { c.checked = true; });
    if (p.get("municipio")) form.elements.municipio.value = p.get("municipio");
    if (p.get("precio") && PRECIOS[p.get("precio")]) {
        const [min, max] = PRECIOS[p.get("precio")];
        if (min) form.elements.precio_min.value = min;
        if (max !== Infinity) form.elements.precio_max.value = max;
    }

    const marcados = (nombre) => $$(`[name="${nombre}"]:checked`, form).map((c) => c.value);

    function filtrar() {
        const f = form.elements;
        const ops = marcados("operacion");
        const tipos = marcados("tipo");
        const texto = buscador.value.trim().toLowerCase();
        const min = Number(f.precio_min.value) || 0;
        const max = Number(f.precio_max.value) || Infinity;
        const hab = Number(f.habitaciones.value) || 0;
        const banos = Number(f.banos.value) || 0;

        return INMUEBLES.filter((i) =>
            (!texto || `${i.titulo} ${i.municipio} ${i.direccion} ${TIPO[i.tipo]}`.toLowerCase().includes(texto)) &&
            (!ops.length || ops.includes(i.operacion)) &&
            (!tipos.length || tipos.includes(i.tipo)) &&
            (!f.municipio.value || i.municipio === f.municipio.value) &&
            (!f.sector.value || i.sector === f.sector.value) &&
            i.precio >= min && i.precio <= max &&
            i.habitaciones >= hab && i.banos >= banos &&
            (!f.parqueadero.checked || i.parqueaderos > 0)
        );
    }

    function pintarChips() {
        const f = form.elements;
        const chips = [];
        marcados("operacion").forEach((v) => chips.push([`operacion:${v}`, v === "venta" ? "Comprar" : "Arrendar"]));
        marcados("tipo").forEach((v) => chips.push([`tipo:${v}`, TIPO[v]]));
        if (f.municipio.value) chips.push(["municipio", f.municipio.value]);
        if (f.sector.value) chips.push(["sector", f.sector.selectedOptions[0].text]);
        if (f.habitaciones.value) chips.push(["habitaciones", f.habitaciones.selectedOptions[0].text + " hab."]);
        if (f.parqueadero.checked) chips.push(["parqueadero", "Con parqueadero"]);
        chipsActivos.innerHTML = chips.map(([k, t]) =>
            `<button type="button" data-quitar="${k}" aria-label="Quitar filtro ${t}">${t} ${ICONS.x}</button>`).join("");
        chipsActivos.hidden = chips.length === 0;
    }

    function aplicar(reiniciarPagina = true) {
        if (reiniciarPagina) pagina = 1;
        let lista = filtrar();
        if (orden.value === "menor") lista.sort((a, b) => a.precio - b.precio);
        if (orden.value === "mayor") lista.sort((a, b) => b.precio - a.precio);
        $$(".chip[data-orden]").forEach((c) => c.setAttribute("aria-pressed", c.dataset.orden === orden.value));

        const paginas = Math.max(1, Math.ceil(lista.length / POR_PAGINA));
        pagina = Math.min(pagina, paginas);
        pintar(contenedor, lista.slice((pagina - 1) * POR_PAGINA, pagina * POR_PAGINA));

        contador.textContent = `${lista.length} ${lista.length === 1 ? "inmueble encontrado" : "inmuebles encontrados"} en el Suroeste Antioqueño`;
        $("#total-movil").textContent = `${lista.length} ${lista.length === 1 ? "resultado" : "resultados"}`;
        vacio.hidden = lista.length > 0;
        paginacion.hidden = lista.length === 0;
        paginacion.innerHTML = Array.from({ length: paginas }, (_, n) =>
            `<button type="button" class="page-btn" data-pagina="${n + 1}"${n + 1 === pagina ? ' aria-current="page"' : ""}>${n + 1}</button>`).join("") +
            `<button type="button" class="page-btn" data-pagina="${pagina + 1}"${pagina >= paginas ? " disabled" : ""}>Siguiente →</button>`;
        pintarChips();
    }

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        aplicar();
        cerrarPanel();
        contenedor.scrollIntoView({ behavior: "smooth", block: "start" });
    });
    form.addEventListener("change", () => aplicar());
    $("#limpiar-filtros").addEventListener("click", () => {
        form.reset();
        buscador.value = "";
        aplicar();
    });
    $("#form-busqueda").addEventListener("submit", (e) => { e.preventDefault(); aplicar(); });
    buscador.addEventListener("input", () => aplicar());
    orden.addEventListener("change", () => aplicar());
    $$(".chip[data-orden]").forEach((c) => c.addEventListener("click", () => { orden.value = c.dataset.orden; aplicar(); }));
    paginacion.addEventListener("click", (e) => {
        const b = e.target.closest("[data-pagina]");
        if (!b || b.disabled) return;
        pagina = Number(b.dataset.pagina);
        aplicar(false);
        contenedor.scrollIntoView({ behavior: "smooth", block: "start" });
    });
    chipsActivos.addEventListener("click", (e) => {
        const b = e.target.closest("[data-quitar]");
        if (!b) return;
        const [campo, valor] = b.dataset.quitar.split(":");
        if (valor) $(`[name="${campo}"][value="${valor}"]`, form).checked = false;
        else if (campo === "parqueadero") form.elements.parqueadero.checked = false;
        else form.elements[campo].value = "";
        aplicar();
    });
    $$("[data-reset-filtros]").forEach((b) => b.addEventListener("click", () => $("#limpiar-filtros").click()));

    // Panel de filtros en móvil (botón "Filtros" de M02)
    const panel = $(".filters");
    const abrirPanel = () => { panel.classList.add("is-open"); $("#btn-filtros").setAttribute("aria-expanded", "true"); $(".filters-close").focus(); };
    function cerrarPanel() { panel.classList.remove("is-open"); $("#btn-filtros").setAttribute("aria-expanded", "false"); }
    $("#btn-filtros").addEventListener("click", abrirPanel);
    $(".filters-close").addEventListener("click", () => { cerrarPanel(); $("#btn-filtros").focus(); });

    aplicar();
}

function iniciarDetalle() {
    const id = Number(new URLSearchParams(window.location.search).get("id")) || 1;
    const i = INMUEBLES.find((x) => x.id === id) || INMUEBLES[0];
    const set = (sel, valor) => $$(sel).forEach((el) => { el.textContent = valor; });

    document.title = `${i.titulo} | Tu Inmueble Suroeste`;
    set("[data-titulo]", i.titulo);
    set("[data-migas]", `· Inicio / Inmuebles / ${i.municipio} / ${i.titulo}`);
    set("[data-ubicacion]", `${i.direccion}, ${i.municipio}, Antioquia`);
    set("[data-municipio]", `${i.municipio}, Antioquia`);
    set("[data-precio]", precioTexto(i));
    set("[data-precio-label]", i.operacion === "venta" ? "Precio de venta" : "Canon de arriendo mensual");
    set("[data-descripcion]", i.descripcion);
    set("[data-hab]", i.habitaciones || "—");
    set("[data-banos]", i.banos || "—");
    set("[data-area]", formatArea(i.area));
    set("[data-area-num]", i.area >= 10000 ? formatArea(i.area) : i.area.toLocaleString("es-CO"));
    set("[data-parq]", i.parqueaderos || "—");

    const [claseEstado, textoEstado] = ESTADO_BADGE[i.estado];
    $("#badges").innerHTML =
        `<span class="badge badge-${i.operacion}">${OPERACION[i.operacion]}</span>` +
        `<span class="badge ${claseEstado}">${textoEstado}</span>` +
        (i.nuevo ? '<span class="badge badge-info">Nuevo</span>' : "");

    $("#caracteristicas").innerHTML = i.caracteristicas.map((c) => `<li>${ICONS.check}${c}</li>`).join("");

    // Galería
    const principal = $(".gallery-main img");
    const contadorFotos = $(".gallery-count");
    const miniaturas = $(".gallery-thumbs");
    const mostrar = (n) => {
        principal.src = IMG(i.imagenes[n], 1400);
        principal.alt = `${i.titulo}, fotografía ${n + 1} de ${i.imagenes.length}`;
        contadorFotos.textContent = `${n + 1} / ${i.imagenes.length} fotos`;
        $$("button", miniaturas).forEach((b) => b.setAttribute("aria-current", Number(b.dataset.n) === n));
    };
    miniaturas.innerHTML = i.imagenes.slice(1).map((img, n) => `
        <button type="button" data-n="${n + 1}" aria-current="false" aria-label="Ver fotografía ${n + 2}">
            <img src="${IMG(img, 500)}" alt="">
        </button>`).join("");
    miniaturas.addEventListener("click", (e) => {
        const b = e.target.closest("button");
        if (!b) return;
        const n = Number(b.dataset.n);
        mostrar(principal.dataset.n === String(n) ? 0 : n);
        principal.dataset.n = principal.dataset.n === String(n) ? "0" : String(n);
    });
    mostrar(0);

    // Favoritos (panel lateral y barra móvil)
    const fav = esFavorito(i.id);
    $$("[data-fav-detalle]").forEach((b) => {
        b.dataset.fav = i.id;
        b.setAttribute("aria-pressed", fav);
        const t = $("[data-fav-label]", b);
        t.textContent = fav ? t.dataset.on : t.dataset.off;
    });

    // Solicitar información: lleva al formulario
    $$("[data-ir-formulario]").forEach((b) => b.addEventListener("click", () => {
        $("#solicitud").scrollIntoView({ behavior: "smooth", block: "start" });
        setTimeout(() => $("#s-nombre").focus({ preventScroll: true }), 400);
    }));

    $("[name='id_inmueble']").value = i.id;
}

function crearFavorito(i) {
    const acciones = `
        <a class="btn btn-secondary" href="${BASE}detalle.html?id=${i.id}">Ver inmueble</a>
        <button type="button" class="btn btn-danger-outline" data-fav="${i.id}" aria-label="Eliminar ${i.titulo} de favoritos">${ICONS.trash}Eliminar</button>`;
    return `
        <article class="fav-card">
            <img src="${IMG(i.imagenes[0], 500)}" alt="${i.titulo} en ${i.municipio}">
            <div class="fav-info">
                <span class="badge badge-${i.operacion}">${OPERACION[i.operacion]}</span>
                <h3>${i.titulo}</h3>
                <p class="meta">${ICONS.pin}${i.municipio}, Antioquia<span class="type">&nbsp;· ${TIPO[i.tipo]}</span></p>
                <p class="fav-price">${precioTexto(i)}</p>
                <ul class="feats">
                    <li>${ICONS.bed}${habTexto(i.habitaciones)}</li>
                    <li>${ICONS.bath}${banosTexto(i.banos)}</li>
                    <li>${ICONS.area}${formatArea(i.area)}</li>
                </ul>
                <div class="fav-actions">${acciones}</div>
            </div>
            <div class="fav-actions only-mobile">${acciones}</div>
        </article>`;
}

function iniciarFavoritos() {
    const ids = getFavoritos();
    const lista = INMUEBLES.filter((i) => ids.includes(i.id));
    pintar($("#lista-favoritos"), lista, crearFavorito);
    $("#favoritos-vacio").hidden = lista.length > 0;
    $("#total-favoritos").textContent = lista.length === 1 ? "1 inmueble guardado" : `${lista.length} inmuebles guardados`;
}

function iniciarCuenta() {
    // Editar información (Sección Mi perfil)
    const perfil = $("#perfil");
    const campos = $$(".control", perfil);
    const boton = $("#editar-perfil");
    boton.addEventListener("click", () => {
        const editando = perfil.classList.toggle("is-editing");
        campos.forEach((c) => { c.readOnly = !editando; });
        boton.querySelector("span").textContent = editando ? "Guardar cambios" : "Editar información";
        if (editando) campos[0].focus();
        else {
            $$("[data-nombre]").forEach((el) => { el.textContent = campos[0].value; });
            mostrarToast("Información actualizada");
        }
    });
    $("#editar-perfil-movil").addEventListener("click", () => {
        if (!perfil.classList.contains("is-editing")) boton.click();
        perfil.scrollIntoView({ behavior: "smooth" });
    });

    // Menú lateral y módulos: marcar la sección activa
    $$("[data-seccion]").forEach((a) => a.addEventListener("click", () => {
        $$(`[data-seccion]`).forEach((x) => x.setAttribute("aria-current", x.dataset.seccion === a.dataset.seccion));
    }));
}

function iniciarPublicar() {
    // Pasos: resaltar la sección visible
    const pasos = $$(".steps a");
    const secciones = pasos.map((a) => document.getElementById(a.hash.slice(1)));
    const activar = (id) => pasos.forEach((a) => {
        if (a.hash === "#" + id) a.setAttribute("aria-current", "step");
        else a.removeAttribute("aria-current");
    });
    const observador = new IntersectionObserver((entradas) => {
        entradas.filter((e) => e.isIntersecting).forEach((e) => activar(e.target.id));
    }, { rootMargin: "-40% 0px -55% 0px" });
    secciones.forEach((s) => observador.observe(s));
    pasos.forEach((a) => a.addEventListener("click", () => activar(a.hash.slice(1))));

    // Tipo de inmueble: select y botones sincronizados
    const select = $("#p-tipo");
    select.addEventListener("change", () => {
        $$("[name='tipo_chip']").forEach((r) => { r.checked = r.value === select.value; });
    });
    $$("[name='tipo_chip']").forEach((r) => r.addEventListener("change", () => {
        select.value = r.value;
        validarCampo(select);
    }));

    // Fotos: selección y arrastre
    const input = $("#p-fotos");
    const zona = $(".dropzone");
    const vistas = $("#previews");
    const mostrarFotos = (archivos) => {
        vistas.innerHTML = "";
        [...archivos].slice(0, 10).forEach((archivo) => {
            if (!archivo.type.startsWith("image/")) return;
            const img = document.createElement("img");
            img.src = URL.createObjectURL(archivo);
            img.alt = archivo.name;
            vistas.appendChild(img);
        });
    };
    input.addEventListener("change", () => { mostrarFotos(input.files); validarCampo(input); });
    ["dragenter", "dragover"].forEach((ev) => zona.addEventListener(ev, (e) => { e.preventDefault(); zona.classList.add("is-over"); }));
    ["dragleave", "drop"].forEach((ev) => zona.addEventListener(ev, (e) => { e.preventDefault(); zona.classList.remove("is-over"); }));
    zona.addEventListener("drop", (e) => {
        input.files = e.dataTransfer.files;
        input.dispatchEvent(new Event("change"));
    });

    const form = $("#form-publicar");
    form.addEventListener("form-reset", () => { vistas.innerHTML = ""; });

    // Guardar borrador en el navegador
    $("#guardar-borrador").addEventListener("click", () => {
        const datos = Object.fromEntries([...new FormData(form)].filter(([, v]) => typeof v === "string"));
        try { localStorage.setItem("tis-borrador", JSON.stringify(datos)); } catch (e) { /* sin almacenamiento */ }
        mostrarToast("Borrador guardado en este navegador");
    });
    try {
        const borrador = JSON.parse(localStorage.getItem("tis-borrador"));
        if (borrador) Object.entries(borrador).forEach(([k, v]) => {
            const campo = form.elements[k];
            if (!campo) return;
            if (campo instanceof RadioNodeList) campo.value = v;
            else campo.value = v;
        });
        select.dispatchEvent(new Event("change"));
    } catch (e) { /* sin borrador */ }
}

// Pestañas Comprar / Arrendar del buscador de Home: ajustan los rangos de precio
function iniciarBuscadorHome() {
    const precio = $("#buscar-precio");
    if (!precio) return;
    const opciones = {
        venta: [["", "Cualquier precio"], ["0-300000000", "Hasta $300.000.000"], ["300000000-600000000", "$300 – $600 millones"], ["600000000-", "Más de $600.000.000"]],
        arriendo: [["", "Cualquier precio"], ["arriendo-2000000", "Hasta $2.000.000 / mes"], ["arriendo-2000000-", "Más de $2.000.000 / mes"]]
    };
    const actualizar = (op) => {
        precio.innerHTML = opciones[op].map(([v, t]) => `<option value="${v}">${t}</option>`).join("");
    };
    $$("[name='operacion']", $("#form-hero")).forEach((r) => r.addEventListener("change", () => actualizar(r.value)));
}

const INICIO = {
    home: () => { iniciarHome(); iniciarBuscadorHome(); },
    catalogo: iniciarCatalogo,
    detalle: iniciarDetalle,
    favoritos: iniciarFavoritos,
    cuenta: iniciarCuenta,
    publicar: iniciarPublicar
};

// Textos de ayuda más cortos en las pantallas Mobile (M01, M02)
const movil = window.matchMedia("(max-width: 768px)");
const ajustarPlaceholders = () => $$("[data-ph-mobile]").forEach((el) => {
    if (!el.dataset.phDesktop) el.dataset.phDesktop = el.placeholder;
    el.placeholder = movil.matches ? el.dataset.phMobile : el.dataset.phDesktop;
});
ajustarPlaceholders();
movil.addEventListener("change", ajustarPlaceholders);

const pagina = document.body.dataset.page;
if (INICIO[pagina]) INICIO[pagina]();
actualizarContadores();
