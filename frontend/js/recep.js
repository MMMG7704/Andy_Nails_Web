const API = "http://localhost:8080/api";

/* INICIO */

document.addEventListener("DOMContentLoaded", () => {

    iniciarNavegacion();

    cargarTodo();

    const btnCerrarSesion = document.getElementById("btnCerrarSesion");

    if (btnCerrarSesion) {
        btnCerrarSesion.addEventListener("click", cerrarSesion);
    }

    const btnVerCitas = document.getElementById("btnVerCitas");

    if (btnVerCitas) {
        btnVerCitas.addEventListener("click", () => {
            mostrarSeccion("citas");
        });
    }

    const btnNuevaCita = document.getElementById("btnNuevaCita");

    if (btnNuevaCita) {
        btnNuevaCita.addEventListener("click", () => {
            mostrarSeccion("citas");
        });
    }
});


/* NAVEGACIÓN */

function iniciarNavegacion() {

    const botones = document.querySelectorAll("[data-section]");

    botones.forEach(boton => {

        boton.addEventListener("click", function (event) {

            event.preventDefault();

            const seccion = this.getAttribute("data-section");

            if (seccion) {
                mostrarSeccion(seccion);
            }

        });

    });
}


/* MOSTRAR SECCIÓN */

function mostrarSeccion(nombreSeccion) {

    const secciones = document.querySelectorAll(".content-section");

    secciones.forEach(seccion => {
        seccion.style.display = "none";
    });

    const seccionActiva = document.getElementById(nombreSeccion);

    if (seccionActiva) {
        seccionActiva.style.display = "block";
    }

    const botones = document.querySelectorAll("[data-section]");

    botones.forEach(boton => {
        boton.classList.remove("active");

        if (boton.getAttribute("data-section") === nombreSeccion) {
            boton.classList.add("active");
        }
    });

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


/* CARGAR TODO */

async function cargarTodo() {

    await cargarUsuario();

    await cargarCitas();

    await cargarClientes();

    await cargarServicios();

    await cargarPagos();

}


/* USUARIO */

async function cargarUsuario() {

    const usuarioGuardado = localStorage.getItem("usuario");

    if (!usuarioGuardado) {
        return;
    }

    try {

        const usuario = JSON.parse(usuarioGuardado);

        const idUsuario =
            usuario.idUsuarios ||
            usuario.idUsuario ||
            usuario.id;

        if (!idUsuario) {
            return;
        }

        const respuesta = await fetch(
            `${API} /usuarios/id / ${idUsuario} `
        );

        if (!respuesta.ok) {
            throw new Error("No se pudo obtener el usuario");
        }

        const datos = await respuesta.json();

        const nombreCompleto =
            `${datos.Nombre || ""} ${datos.Paterno || ""} `.trim();

        const nombreUsuario =
            document.getElementById("nombreUsuario");

        const usuarioInicial =
            document.getElementById("usuarioInicial");

        if (nombreUsuario) {
            nombreUsuario.textContent =
                nombreCompleto || datos.Correo || "Recepcionista";
        }

        if (usuarioInicial) {

            const nombre =
                datos.Nombre ||
                datos.Correo ||
                "R";

            usuarioInicial.textContent =
                nombre.charAt(0).toUpperCase();
        }

    } catch (error) {

        console.error("Error al cargar usuario:", error);

    }
}


/* CITAS */

async function cargarCitas() {

    try {

        const respuesta =
            await fetch(`${API}/citas`);

        if (!respuesta.ok) {
            throw new Error("Error al obtener citas");
        }

        const citas =
            await respuesta.json();

        mostrarCitas(citas);

        actualizarEstadisticas(citas);

    } catch (error) {

        console.error("Error al cargar citas:", error);

    }
}


/* MOSTRAR CITAS */

function mostrarCitas(citas) {

    const tabla =
        document.getElementById("tablaCitas");

    const tablaProximas =
        document.getElementById("tablaProximasCitas");

    if (tabla) {

        tabla.innerHTML = "";

        if (!citas || citas.length === 0) {

            tabla.innerHTML = `
                <tr>
                    <td colspan="6">
                        No hay citas registradas.
                    </td>
                </tr>
            `;

        } else {

            citas.forEach(cita => {

                const cliente =
                    `${cita.Nombre || ""} ${cita.Paterno || ""} ${cita.Materno || ""}`.trim()
                    || "Sin nombre";

                const servicio =
                    cita.Nombre_servicio ||
                    "Sin servicio";

                tabla.innerHTML += `
                    <tr>
                        <td>${cita.idCita ?? ""}</td>
                        <td>${cliente}</td>
                        <td>${servicio}</td>
                        <td>${formatearFecha(cita.Fecha)}</td>
                        <td>${formatearHora(cita.Hora)}</td>
                        <td>${cita.Estado || ""}</td>
                    </tr>
                `;
            });
        }
    }


    if (tablaProximas) {

        tablaProximas.innerHTML = "";

        const proximas =
            citas.slice(0, 5);

        if (proximas.length === 0) {

            tablaProximas.innerHTML = `
                <tr>
                    <td colspan="5">
                        No hay citas registradas.
                    </td>
                </tr>
            `;

        } else {

            proximas.forEach(cita => {

                const cliente =
                    `${cita.Nombre || ""} ${cita.Paterno || ""}`.trim()
                    || "Sin nombre";

                const servicio =
                    cita.Nombre_servicio ||
                    "Sin servicio";

                tablaProximas.innerHTML += `
                    <tr>
                        <td>${cliente}</td>
                        <td>${formatearFecha(cita.Fecha)}</td>
                        <td>${formatearHora(cita.Hora)}</td>
                        <td>${servicio}</td>
                        <td>${cita.Estado || ""}</td>
                    </tr>
                `;
            });
        }
    }
}


/* ESTADÍSTICAS */

function actualizarEstadisticas(citas) {

    const hoy =
        new Date().toISOString().split("T")[0];

    const citasHoy =
        citas.filter(cita => {

            if (!cita.Fecha) {
                return false;
            }

            return String(cita.Fecha).substring(0, 10) === hoy;

        });

    const pendientes =
        citas.filter(cita =>
            String(cita.Estado || "")
                .toLowerCase() === "pendiente"
        );


    const totalCitasHoy =
        document.getElementById("totalCitasHoy");

    const totalPendientes =
        document.getElementById("totalPendientes");


    if (totalCitasHoy) {
        totalCitasHoy.textContent =
            citasHoy.length;
    }

    if (totalPendientes) {
        totalPendientes.textContent =
            pendientes.length;
    }
}


/* CLIENTES */

async function cargarClientes() {

    try {

        const respuesta =
            await fetch(`${API}/usuarios/clientes`);

        if (!respuesta.ok) {
            throw new Error("Error al obtener clientes");
        }

        const clientes =
            await respuesta.json();

        mostrarClientes(clientes);

        const totalClientes =
            document.getElementById("totalClientes");

        if (totalClientes) {
            totalClientes.textContent =
                clientes.length;
        }

    } catch (error) {

        console.error("Error al cargar clientes:", error);

    }
}


/* MOSTRAR CLIENTES */

function mostrarClientes(clientes) {

    const tabla =
        document.getElementById("tablaClientes");

    if (!tabla) {
        return;
    }

    tabla.innerHTML = "";

    if (!clientes || clientes.length === 0) {

        tabla.innerHTML = `
            <tr>
                <td colspan="5">
                    No hay clientes registrados.
                </td>
            </tr>
        `;

        return;
    }

    clientes.forEach(cliente => {

        const nombre =
            `${cliente.Nombre || ""} ${cliente.Paterno || ""} ${cliente.Materno || ""}`.trim();

        tabla.innerHTML += `
            <tr>
                <td>${cliente.idUsuarios ?? ""}</td>
                <td>${nombre || "Sin nombre"}</td>
                <td>${cliente.Correo || ""}</td>
                <td>${cliente.Telefono || ""}</td>
                <td>Activo</td>
            </tr>
        `;

    });
}


/* SERVICIOS */

async function cargarServicios() {

    try {

        const respuesta =
            await fetch(`${API}/servicios`);

        if (!respuesta.ok) {
            throw new Error("Error al obtener servicios");
        }

        const servicios =
            await respuesta.json();

        mostrarServicios(servicios);

    } catch (error) {

        console.error("Error al cargar servicios:", error);

    }
}


/* MOSTRAR SERVICIOS */

function mostrarServicios(servicios) {

    const contenedor =
        document.getElementById("serviciosGrid");

    if (!contenedor) {
        return;
    }

    contenedor.innerHTML = "";

    if (!servicios || servicios.length === 0) {

        contenedor.innerHTML = `
            <p>No hay servicios registrados.</p>
        `;

        return;
    }

    servicios.forEach(servicio => {

        const precio =
            Number(servicio.Precio || 0)
                .toFixed(2);

        contenedor.innerHTML += `
            <div class="servicio-card">

                <h3>
                    ${servicio.Nombre_servicio || "Servicio"}
                </h3>

                <p>
                    ${servicio.Descripcion || "Sin descripción"}
                </p>

                <strong>
                    $${precio}
                </strong>

            </div>
        `;

    });
}


/* PAGOS */

async function cargarPagos() {

    try {

        const respuesta =
            await fetch(`${API}/pagos`);

        if (!respuesta.ok) {
            throw new Error("No existe todavía el endpoint de pagos");
        }

        const pagos =
            await respuesta.json();

        mostrarPagos(pagos);

    } catch (error) {

        console.warn(
            "Pagos todavía no está conectado:",
            error.message
        );

        const tabla =
            document.getElementById("tablaPagos");

        if (tabla) {

            tabla.innerHTML = `
                <tr>
                    <td colspan="6">
                        Pagos todavía no disponibles.
                    </td>
                </tr>
            `;

        }
    }
}


/* MOSTRAR PAGOS */

function mostrarPagos(pagos) {

    const tabla =
        document.getElementById("tablaPagos");

    if (!tabla) {
        return;
    }

    tabla.innerHTML = "";

    if (!pagos || pagos.length === 0) {

        tabla.innerHTML = `
            <tr>
                <td colspan="6">
                    No hay pagos registrados.
                </td>
            </tr>
        `;

        return;
    }

    pagos.forEach(pago => {

        tabla.innerHTML += `
            <tr>
                <td>${pago.idPago ?? ""}</td>
                <td>${pago.nombreCliente || ""}</td>
                <td>${pago.servicio || ""}</td>
                <td>$${Number(pago.monto || 0).toFixed(2)}</td>
                <td>${pago.metodo || ""}</td>
                <td>${pago.estado || ""}</td>
            </tr>
        `;

    });
}


/* FORMATO FECHA */

function formatearFecha(fecha) {

    if (!fecha) {
        return "";
    }

    const texto =
        String(fecha).substring(0, 10);

    const partes =
        texto.split("-");

    if (partes.length !== 3) {
        return texto;
    }

    return `${partes[2]}/${partes[1]}/${partes[0]}`;
}


/* FORMATO HORA */

function formatearHora(hora) {

    if (!hora) {
        return "";
    }

    return String(hora).substring(0, 5);
}


/* CERRAR SESIÓN */

function cerrarSesion() {

    localStorage.removeItem("usuario");

    window.location.href = "login.html";
}
