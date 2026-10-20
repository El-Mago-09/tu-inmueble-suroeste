/* ============================================================
   Tu Inmueble Suroeste - Interacción del front-end
   Requiere js/data.js. Cada página indica su tipo en
   <body data-page="..."> y su ruta base en data-base.
   ============================================================ */

const BASE = document.body.dataset.base || "";
const FAV_KEY = "tis-favoritos";

const ICONS = {
    heart: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-7.5-4.6-9.6-9.2C.9 8.4 3 4.5 6.8 4.5c2.1 0 3.6 1.2 5.2 3 1.6-1.8 3.1-3 5.2-3 3.8 0 5.9 3.9 4.4 7.3C19.5 16.4 12 21 12 21z"/></svg>',
    pin: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/></svg>'
};

const OPERACION = { venta: "Venta", arriendo: "Arriendo" };
const TIPO = { casa: "Casa", apartamento: "Apartamento", finca: "Finca", lote: "Lote", local: "Local" };

/* ---------- Utilidades ---------- */
const formatCOP = (valor) => "$ " + valor.toLocaleString("es-CO") + " COP";

const formatArea = (m2) => m2 >= 10000
    ? (m2 / 10000).toLocaleString("es-CO", { maximumFractionDigits: 1 }) + " ha"
    : m2.toLocaleString("es-CO") + " m²";

function getFavoritos() {
    try {
        return JSON.parse(localStorage.getItem(FAV_KEY)) || [];
    } catch (e) {
        return [];
    }
}

function setFavoritos(lista) {
    try {
        localStorage.setItem(FAV_KEY, JSON.stringify(lista));
    } catch (e) { /* almacenamiento no disponible */ }
    actualizarContadorFavoritos();
}

function esFavorito(id) {
    return getFavoritos().includes(id);
}

function alternarFavorito(id) {
    const lista = getFavoritos();
    const existe = lista.includes(id);
    setFavoritos(existe ? lista.filter((x) => x !== id) : [...lista, id]);
    mostrarToast(existe ? "Inmueble quitado de favoritos" : "Inmueble guardado en favoritos");
    return !existe;
}

function actualizarContadorFavoritos() {
    const total = getFavoritos().length;
    document.querySelectorAll(".fav-count").forEach((el) => {
        el.textContent = total;
        el.hidden = total === 0;
    });
    document.querySelectorAll(".fav-count-text").forEach((el) => { el.textContent = total; });
}

function mostrarToast(mensaje) {
    let toast = document.querySelector(".toast");
    if (!toast) {
        toast = document.createElement("div");
        toast.className = "toast";
        toast.setAttribute("role", "status");
        document.body.appendChild(toast);
    }
    toast.textContent = mensaje;
    toast.classList.add("show");
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => toast.classList.remove("show"), 2500);
}

/* ---------- Componente: tarjeta de inmueble ---------- */
function crearTarjeta(inmueble) {
    const fav = esFavorito(inmueble.id);
    const detalles = [];
    if (inmueble.habitaciones) detalles.push(`<li>${inmueble.habitaciones} hab.</li>`);
    if (inmueble.banos) detalles.push(`<li>${inmueble.banos} baños</li>`);
    detalles.push(`<li>${formatArea(inmueble.area)}</li>`);
    const sufijo = inmueble.operacion === "arriendo" ? " <small>/ mes</small>" : "";

    return `
        <article class="card-inmueble">
            <div class="card-media">
                <img src="${IMG(inmueble.imagenes[0], 600)}" alt="${inmueble.titulo} en ${inmueble.municipio}" loading="lazy">
                <span class="badge badge-${inmueble.operacion}">${OPERACION[inmueble.operacion]}</span>
                <button type="button" class="btn-fav" data-fav="${inmueble.id}" aria-pressed="${fav}"
                    aria-label="${fav ? "Quitar de favoritos" : "Guardar en favoritos"}: ${inmueble.titulo}">${ICONS.heart}</button>
            </div>
            <div class="card-body">
                <p class="card-location">${ICONS.pin} ${inmueble.municipio}, Antioquia · ${TIPO[inmueble.tipo]}</p>
                <h3>${inmueble.titulo}</h3>
                <p class="price">${formatCOP(inmueble.precio)}${sufijo}</p>
                <ul class="features">${detalles.join("")}</ul>
                <a class="btn btn-outline btn-block" href="${BASE}detalle.html?id=${inmueble.id}">Ver inmueble</a>
            </div>
        </article>`;
}

function pintarTarjetas(contenedor, lista) {
    contenedor.innerHTML = lista.map(crearTarjeta).join("");
}

// Botones de favorito (delegación para tarjetas creadas dinámicamente)
document.addEventListener("click", (evento) => {
    const boton = evento.target.closest("[data-fav]");
    if (!boton) return;
    const id = Number(boton.dataset.fav);
    const activo = alternarFavorito(id);
    document.querySelectorAll(`[data-fav="${id}"]`).forEach((b) => {
        b.setAttribute("aria-pressed", activo);
        if (b.classList.contains("btn-fav")) {
            b.setAttribute("aria-label", (activo ? "Quitar de favoritos" : "Guardar en favoritos"));
        } else {
            b.querySelector("span").textContent = activo ? "Guardado en favoritos" : "Guardar en favoritos";
        }
    });
    if (document.body.dataset.page === "favoritos") iniciarFavoritos();
});

/* ---------- Menú móvil ---------- */
const menuToggle = document.querySelector(".menu-toggle");
if (menuToggle) {
    menuToggle.addEventListener("click", () => {
        const nav = document.getElementById(menuToggle.getAttribute("aria-controls"));
        const abierto = nav.classList.toggle("is-open");
        menuToggle.setAttribute("aria-expanded", abierto);
    });
}

/* ---------- Validación de formularios ---------- */
const MENSAJES = {
    valueMissing: "Este campo es obligatorio.",
    typeMismatch: "Revisa el formato (ejemplo: nombre@correo.com).",
    tooShort: (el) => `Debe tener al menos ${el.minLength} caracteres.`,
    rangeUnderflow: (el) => `El valor mínimo es ${el.min}.`,
    patternMismatch: (el) => el.dataset.patternMsg || "Formato no válido."
};

function validarCampo(campo) {
    const contenedor = campo.closest(".form-field");
    if (!contenedor) return true;
    let error = contenedor.querySelector(".field-error");

    let mensaje = "";
    if (campo.dataset.match) {
        const otro = document.getElementById(campo.dataset.match);
        campo.setCustomValidity(otro && campo.value !== otro.value ? "Las contraseñas no coinciden." : "");
    }
    if (!campo.validity.valid) {
        const clave = Object.keys(MENSAJES).find((k) => campo.validity[k]);
        const m = MENSAJES[clave];
        mensaje = campo.validationMessage && campo.validity.customError
            ? campo.validationMessage
            : (typeof m === "function" ? m(campo) : m) || "Valor no válido.";
    }

    contenedor.classList.toggle("is-invalid", Boolean(mensaje));
    campo.setAttribute("aria-invalid", Boolean(mensaje));
    if (mensaje) {
        if (!error) {
            error = document.createElement("p");
            error.className = "field-error";
            error.id = (campo.id || campo.name) + "-error";
            contenedor.appendChild(error);
        }
        error.textContent = mensaje;
        campo.setAttribute("aria-describedby", error.id);
    } else if (error) {
        error.remove();
        campo.removeAttribute("aria-describedby");
    }
    return !mensaje;
}

document.querySelectorAll("form[data-validate]").forEach((form) => {
    form.noValidate = true;
    const campos = form.querySelectorAll("input, select, textarea");
    campos.forEach((c) => c.addEventListener("blur", () => validarCampo(c)));

    form.addEventListener("submit", (evento) => {
        evento.preventDefault();
        let valido = true;
        campos.forEach((c) => { if (!validarCampo(c)) valido = false; });

        const alertaError = form.querySelector(".alert-error");
        const alertaOk = form.querySelector(".alert-success");
        if (alertaError) alertaError.hidden = valido;
        if (alertaOk) alertaOk.hidden = true;

        if (!valido) {
            const primero = form.querySelector("[aria-invalid='true']");
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
        }
        form.reset();
    });
});

/* ---------- Modal de confirmación ---------- */
const modal = document.getElementById("confirm-modal");
let accionPendiente = null;

document.addEventListener("click", (evento) => {
    const disparador = evento.target.closest("[data-confirm]");
    if (!disparador || !modal) return;
    evento.preventDefault();
    modal.querySelector("[data-modal-text]").textContent = disparador.dataset.confirm;
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
        // Acción administrativa: cambiar el estado de la fila
        const fila = el.closest("tr");
        const badge = fila && fila.querySelector(".badge");
        if (badge) {
            badge.className = "badge " + (el.dataset.newClass || "badge-muted");
            badge.textContent = el.dataset.newState || "Inactivo";
        }
        el.disabled = true;
        mostrarToast(el.dataset.done || "Cambio guardado");
    });
}

/* ---------- Filtro de tablas administrativas ---------- */
document.querySelectorAll("[data-table-filter]").forEach((input) => {
    const tabla = document.getElementById(input.dataset.tableFilter);
    input.addEventListener("input", () => {
        const texto = input.value.trim().toLowerCase();
        tabla.querySelectorAll("tbody tr").forEach((fila) => {
            fila.hidden = !fila.textContent.toLowerCase().includes(texto);
        });
    });
});

document.querySelectorAll("[data-table-state]").forEach((select) => {
    const tabla = document.getElementById(select.dataset.tableState);
    select.addEventListener("change", () => {
        tabla.querySelectorAll("tbody tr").forEach((fila) => {
            const estado = fila.querySelector(".badge").textContent.trim().toLowerCase();
            fila.hidden = select.value !== "" && estado !== select.value;
        });
    });
});

/* ---------- Páginas ---------- */
function iniciarHome() {
    const contenedor = document.getElementById("destacados");
    pintarTarjetas(contenedor, INMUEBLES.filter((i) => i.destacado));
}

function iniciarCatalogo() {
    const form = document.getElementById("form-filtros");
    const contenedor = document.getElementById("resultados");
    const vacio = document.getElementById("sin-resultados");
    const contador = document.getElementById("total-resultados");
    const orden = document.getElementById("orden");

    // Valores que llegan desde el buscador de Home
    const params = new URLSearchParams(window.location.search);
    ["municipio", "operacion", "tipo"].forEach((campo) => {
        if (params.get(campo)) form.elements[campo].value = params.get(campo);
    });

    function aplicar() {
        const f = form.elements;
        const precioMax = Number(f.precio_max.value) || Infinity;
        const habMin = Number(f.habitaciones.value) || 0;

        let lista = INMUEBLES.filter((i) =>
            (!f.municipio.value || i.municipio === f.municipio.value) &&
            (!f.operacion.value || i.operacion === f.operacion.value) &&
            (!f.tipo.value || i.tipo === f.tipo.value) &&
            i.precio <= precioMax &&
            i.habitaciones >= habMin
        );

        if (orden.value === "precio-asc") lista.sort((a, b) => a.precio - b.precio);
        if (orden.value === "precio-desc") lista.sort((a, b) => b.precio - a.precio);

        pintarTarjetas(contenedor, lista);
        contador.textContent = lista.length === 1 ? "1 inmueble encontrado" : `${lista.length} inmuebles encontrados`;
        vacio.hidden = lista.length > 0;
    }

    form.addEventListener("submit", (e) => { e.preventDefault(); aplicar(); });
    form.addEventListener("reset", () => setTimeout(aplicar));
    orden.addEventListener("change", aplicar);

    const panel = document.querySelector(".filters");
    const toggle = document.querySelector(".filters-toggle");
    toggle.addEventListener("click", () => {
        const plegado = panel.dataset.collapsed === "true";
        panel.dataset.collapsed = String(!plegado);
        toggle.setAttribute("aria-expanded", String(plegado));
    });

    aplicar();
}

function iniciarDetalle() {
    const id = Number(new URLSearchParams(window.location.search).get("id")) || 1;
    const inmueble = INMUEBLES.find((i) => i.id === id) || INMUEBLES[0];
    const set = (sel, valor) => { document.querySelector(sel).textContent = valor; };

    document.title = `${inmueble.titulo} | Tu Inmueble Suroeste`;
    set("[data-titulo]", inmueble.titulo);
    set("[data-miga]", inmueble.titulo);
    set("[data-ubicacion]", `${inmueble.direccion} · ${inmueble.municipio}, Antioquia`);
    set("[data-precio]", formatCOP(inmueble.precio) + (inmueble.operacion === "arriendo" ? " / mes" : ""));
    set("[data-descripcion]", inmueble.descripcion);
    set("[data-hab]", inmueble.habitaciones || "—");
    set("[data-banos]", inmueble.banos || "—");
    set("[data-area]", formatArea(inmueble.area));
    set("[data-tipo]", TIPO[inmueble.tipo]);

    const badge = document.querySelector("[data-operacion]");
    badge.className = `badge badge-${inmueble.operacion}`;
    badge.textContent = OPERACION[inmueble.operacion];

    const estado = document.querySelector("[data-estado]");
    const clases = { disponible: "badge-ok", reservado: "badge-warn", vendido: "badge-muted", arrendado: "badge-muted" };
    estado.className = `badge ${clases[inmueble.estado]}`;
    estado.textContent = inmueble.estado;

    document.querySelector("[data-caracteristicas]").innerHTML =
        inmueble.caracteristicas.map((c) => `<li>${c}</li>`).join("");

    // Galería
    const principal = document.querySelector(".gallery-main img");
    const miniaturas = document.querySelector(".gallery-thumbs");
    principal.src = IMG(inmueble.imagenes[0], 1200);
    principal.alt = `${inmueble.titulo}, fotografía principal`;
    miniaturas.innerHTML = inmueble.imagenes.map((img, n) => `
        <button type="button" data-img="${img}" aria-current="${n === 0}" aria-label="Ver fotografía ${n + 1}">
            <img src="${IMG(img, 300)}" alt="">
        </button>`).join("");
    miniaturas.addEventListener("click", (e) => {
        const b = e.target.closest("button");
        if (!b) return;
        principal.src = IMG(b.dataset.img, 1200);
        miniaturas.querySelectorAll("button").forEach((x) => x.setAttribute("aria-current", x === b));
    });

    // Favorito
    const botonFav = document.querySelector("[data-fav-detalle]");
    botonFav.dataset.fav = inmueble.id;
    const fav = esFavorito(inmueble.id);
    botonFav.setAttribute("aria-pressed", fav);
    botonFav.querySelector("span").textContent = fav ? "Guardado en favoritos" : "Guardar en favoritos";

    document.querySelector("[name='id_inmueble']").value = inmueble.id;

    // Inmuebles similares
    const similares = INMUEBLES.filter((i) => i.id !== inmueble.id &&
        (i.municipio === inmueble.municipio || i.tipo === inmueble.tipo)).slice(0, 3);
    pintarTarjetas(document.getElementById("similares"), similares);
}

function iniciarFavoritos() {
    const ids = getFavoritos();
    const lista = INMUEBLES.filter((i) => ids.includes(i.id));
    pintarTarjetas(document.getElementById("lista-favoritos"), lista);
    document.getElementById("favoritos-vacio").hidden = lista.length > 0;
    document.getElementById("total-favoritos").textContent =
        lista.length === 1 ? "1 inmueble guardado" : `${lista.length} inmuebles guardados`;
}

function iniciarAdminInmuebles() {
    const clases = { disponible: "badge-ok", reservado: "badge-warn", vendido: "badge-muted", arrendado: "badge-muted" };
    document.querySelector("#tabla-inmuebles tbody").innerHTML = INMUEBLES.map((i) => `
        <tr>
            <td>
                <div class="cell-media">
                    <img src="${IMG(i.imagenes[0], 160)}" alt="">
                    <span><strong>${i.titulo}</strong><br><small class="text-secondary">INM-${String(i.id).padStart(3, "0")}</small></span>
                </div>
            </td>
            <td>${TIPO[i.tipo]}</td>
            <td><span class="badge badge-${i.operacion}">${OPERACION[i.operacion]}</span></td>
            <td>${i.municipio}</td>
            <td>${formatCOP(i.precio)}</td>
            <td><span class="badge ${clases[i.estado]}">${i.estado}</span></td>
            <td>
                <div class="row-actions">
                    <a class="btn btn-outline btn-sm" href="../detalle.html?id=${i.id}">Ver</a>
                    <button type="button" class="btn btn-outline btn-sm" data-confirm="¿Marcar «${i.titulo}» como vendido o arrendado? Dejará de mostrarse en el catálogo."
                        data-new-state="${i.operacion === "venta" ? "vendido" : "arrendado"}" data-done="Estado del inmueble actualizado">Cerrar</button>
                </div>
            </td>
        </tr>`).join("");
}

const INICIO = {
    home: iniciarHome,
    catalogo: iniciarCatalogo,
    detalle: iniciarDetalle,
    favoritos: iniciarFavoritos,
    "admin-inmuebles": iniciarAdminInmuebles
};

const pagina = document.body.dataset.page;
if (INICIO[pagina]) INICIO[pagina]();
actualizarContadorFavoritos();

document.querySelectorAll("[data-year]").forEach((el) => { el.textContent = new Date().getFullYear(); });
