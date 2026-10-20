document.addEventListener("DOMContentLoaded", function () {



    /* PETICIONES AL BACKEND CON TOKEN JWT */

    async function fetchConToken(url, opciones = {}) {

        const token = localStorage.getItem("token");

        if (!token) {
            window.location.href = "login.html";
            throw new Error("No hay una sesión válida. Inicia sesión nuevamente.");
        }

        const headers = new Headers(opciones.headers || {});

        headers.set("Authorization", `Bearer ${token}`);

        if (opciones.body && !headers.has("Content-Type")) {
            headers.set("Content-Type", "application/json");
        }

        return fetch(url, {
            ...opciones,
            headers: headers
        });
    }

    const botonesMenu = document.querySelectorAll(".menu-item");
    const secciones = document.querySelectorAll(".seccion");
    const tituloSeccion = document.getElementById("tituloSeccion");
    const btnSalir = document.getElementById("btnSalir");



    /* OBTENER EL ID DEL USUARIO ACTUAL */

    function obtenerIdAdministrador() {

        const usuario = JSON.parse(
            localStorage.getItem("usuario") || "null"
        );

        if (!usuario) {
            return null;
        }

        return usuario.idUsuarios
            ?? usuario.idUsuario
            ?? usuario.id
            ?? null;
    }
    /* CAMBIAR SECCIÓN */

    botonesMenu.forEach(function (boton) {

        boton.addEventListener("click", function () {

            const seccionId = boton.getAttribute("data-seccion");

            if (boton.dataset.seccion === "bitacora") {
                cargarBitacora();
            }
            /* QUITAR ACTIVO DE BOTONES */

            botonesMenu.forEach(function (item) {
                item.classList.remove("activo");
            });


            /* ACTIVAR BOTÓN SELECCIONADO */

            boton.classList.add("activo");


            /* OCULTAR TODAS LAS SECCIONES */

            secciones.forEach(function (seccion) {
                seccion.classList.remove("activa");
            });


            /* MOSTRAR SECCIÓN SELECCIONADA */

            const seccionMostrar =
                document.getElementById(seccionId);

            if (seccionMostrar) {
                seccionMostrar.classList.add("activa");
            }


            /* CAMBIAR TÍTULO */

            const textoBoton = boton.textContent.trim();

            if (tituloSeccion) {
                tituloSeccion.textContent = textoBoton
                    .replace("🏠", "")
                    .replace("📅", "")
                    .replace("👥", "")
                    .replace("💅", "")
                    .replace("💰", "")
                    .replace("🕐", "")
                    .replace("📊", "")
                    .trim();
            }

        });

    });


    /* CARGAR CITAS */

    async function cargarCitas() {

        try {

            console.log("CARGANDO TODAS LAS CITAS");


            const respuesta = await fetchConToken(
                "http://localhost:8080/api/citas"
            );

            console.log(
                "STATUS CITAS:",
                respuesta.status
            );

            if (!respuesta.ok) {

                throw new Error(
                    "Error HTTP: " + respuesta.status
                );

            }

            const citas = await respuesta.json();

            console.log(
                "CITAS RECIBIDAS:",
                citas
            );

            const tablaCitas =
                document.getElementById("tablaCitas");

            const tablaProximasCitas =
                document.getElementById("tablaProximasCitas");

            if (!tablaCitas) {

                console.error(
                    "No existe el elemento #tablaCitas en el HTML"
                );

                return;
            }

            tablaCitas.innerHTML = "";

            if (tablaProximasCitas) {
                tablaProximasCitas.innerHTML = "";
            }


            /* ACTUALIZAR CONTADOR */

            const totalCitasHoy =
                document.getElementById("totalCitasHoy");

            const hoy =
                new Date().toISOString().split("T")[0];

            let cantidadCitasHoy = 0;


            /* CONTAR CITAS DE HOY */

            citas.forEach(function (cita) {

                if (cita.Fecha) {

                    const fechaCita =
                        String(cita.Fecha).substring(0, 10);

                    if (fechaCita === hoy) {
                        cantidadCitasHoy++;
                    }

                }

            });


            if (totalCitasHoy) {

                totalCitasHoy.textContent =
                    cantidadCitasHoy;

            }


            /* SI NO HAY CITAS */

            if (!citas || citas.length === 0) {

                tablaCitas.innerHTML = `
                    <tr>
                        <td colspan="5" class="sin-datos">
                            No hay citas registradas.
                        </td>
                    </tr>
                `;

                if (tablaProximasCitas) {

                    tablaProximasCitas.innerHTML = `
                        <tr>
                            <td colspan="5" class="sin-datos">
                                No hay próximas citas.
                            </td>
                        </tr>
                    `;

                }

                return;
            }


            /* MOSTRAR CITAS */

            citas.forEach(function (cita) {

                const fila =
                    document.createElement("tr");

                fila.innerHTML = `

                    <td>
                        ${cita.idUsuarios || ""}
                    </td>

                    <td>
                        ${cita.Fecha || ""}
                    </td>

                    <td>
                        ${cita.Hora || ""}
                    </td>

                    <td>
                        ${cita.Nombre_servicio || "Sin servicio"}
                    </td>

                    <td>
                        ${cita.Estado || ""}
                    </td>

                `;

                tablaCitas.appendChild(fila);

            });


            /* MOSTRAR PRÓXIMAS CITAS */

            if (tablaProximasCitas) {

                const citasProximas =
                    citas.slice(0, 5);

                citasProximas.forEach(function (cita) {

                    const fila =
                        document.createElement("tr");

                    fila.innerHTML = `

                        <td>
                            ${cita.idUsuarios || ""}
                        </td>

                        <td>
                            ${cita.Fecha || ""}
                        </td>

                        <td>
                            ${cita.Hora || ""}
                        </td>

                        <td>
                            ${cita.Nombre_servicio || "Sin servicio"}
                        </td>

                        <td>
                            ${cita.Estado || ""}
                        </td>

                    `;

                    tablaProximasCitas.appendChild(fila);

                });

            }

        } catch (error) {

            console.error(
                "ERROR AL CARGAR LAS CITAS:",
                error
            );

        }

    }


    /* CARGAR SERVICIOS */

    async function cargarServicios() {

        try {

            console.log("CARGANDO SERVICIOS");

            const respuesta = await fetchConToken(
                "http://localhost:8080/api/servicios"
            );

            console.log(
                "STATUS SERVICIOS:",
                respuesta.status
            );

            if (!respuesta.ok) {

                throw new Error(
                    "Error HTTP: " + respuesta.status
                );

            }

            const servicios =
                await respuesta.json();

            console.log(
                "SERVICIOS RECIBIDOS:",
                servicios
            );

            const totalServicios =
                document.getElementById("totalServicios");

            if (totalServicios) {

                totalServicios.textContent =
                    servicios.length;

            }

        } catch (error) {

            console.error(
                "ERROR AL CARGAR LOS SERVICIOS:",
                error
            );

        }

    }


    /* CARGAR CLIENTES */

    async function cargarClientes() {

        try {

            console.log("CARGANDO CLIENTES");

            const respuesta = await fetchConToken(
                "http://localhost:8080/api/usuarios/clientes"
            );

            console.log(
                "STATUS CLIENTES:",
                respuesta.status
            );

            if (!respuesta.ok) {

                throw new Error(
                    "Error HTTP: " + respuesta.status
                );

            }

            const clientes =
                await respuesta.json();

            console.log(
                "CLIENTES RECIBIDOS:",
                clientes
            );

            const totalClientes =
                document.getElementById("totalClientes");

            if (totalClientes) {

                totalClientes.textContent =
                    clientes.length;

            }

            const tablaClientes =
                document.getElementById("tablaClientes");

            if (!tablaClientes) {

                console.error(
                    "No existe el elemento #tablaClientes en el HTML"
                );

                return;
            }

            tablaClientes.innerHTML = "";


            /* SI NO HAY CLIENTES */

            if (!clientes || clientes.length === 0) {

                tablaClientes.innerHTML = `
                    <tr>
                        <td colspan="4" class="sin-datos">
                            No hay clientes registrados.
                        </td>
                    </tr>
                `;

                return;
            }


            /* MOSTRAR CLIENTES */

            clientes.forEach(function (cliente) {

                const fila =
                    document.createElement("tr");

                fila.innerHTML = `

                    <td>
                        ${cliente.idUsuarios || ""}
                    </td>

                    <td>
                        ${cliente.Nombre || ""}
                        ${cliente.Paterno || ""}
                        ${cliente.Materno || ""}
                    </td>

                    <td>
                        ${cliente.Telefono || ""}
                    </td>

                    <td>
                        ${cliente.Correo || ""}
                    </td>

                `;

                tablaClientes.appendChild(fila);

            });

        } catch (error) {

            console.error(
                "ERROR AL CARGAR LOS CLIENTES:",
                error
            );

        }

    }


    /* CARGAR USUARIOS */

    async function cargarUsuarios() {

        try {

            console.log("CARGANDO USUARIOS");

            const respuesta = await fetchConToken(
                "http://localhost:8080/api/usuarios"
            );

            console.log(
                "STATUS USUARIOS:",
                respuesta.status
            );

            if (!respuesta.ok) {

                throw new Error(
                    "Error HTTP: " + respuesta.status
                );

            }

            const usuarios =
                await respuesta.json();

            console.log(
                "USUARIOS RECIBIDOS:",
                usuarios
            );

            const tablaUsuarios =
                document.getElementById("tablaUsuarios");

            if (!tablaUsuarios) {

                console.error(
                    "No existe el elemento #tablaUsuarios en el HTML"
                );

                return;
            }

            tablaUsuarios.innerHTML = "";


            /* SI NO HAY USUARIOS */

            if (!usuarios || usuarios.length === 0) {

                tablaUsuarios.innerHTML = `
                    <tr>
                        <td colspan="7" class="sin-datos">
                            No hay usuarios registrados.
                        </td>
                    </tr>
                `;

                return;
            }


            /* MOSTRAR USUARIOS */

            usuarios.forEach(function (usuario) {

                const fila =
                    document.createElement("tr");

                fila.innerHTML = `

    <td>
        ${usuario.idUsuarios || ""}
    </td>

    <td>
        ${usuario.Nombre || ""}
        ${usuario.Paterno || ""}
        ${usuario.Materno || ""}
    </td>

    <td>
        ${usuario.Correo || ""}
    </td>

    <td>
        ${usuario.Telefono || ""}
    </td>

    <td>
       
<select
    class="select-rol"
    data-id="${usuario.idUsuarios}"
    data-rol-original="${usuario.Tipo_Usuario_idTipo_Usuario}">
</select>

    </td>

    <td>
      
<select
    class="select-estado"
    data-id="${usuario.idUsuarios}"
    data-estado-original="${usuario.Estado}">

    <option value="Activo"
        ${usuario.Estado === "Activo" ? "selected" : ""}>
        Activo
    </option>

    <option value="Inactivo"
        ${usuario.Estado === "Inactivo" ? "selected" : ""}>
        Inactivo
    </option>

</select>

    </td>

    <td>
        ${usuario.fecha_registro || ""}
    </td>

    <td>
        <button
            class="btn-guardar-usuario"
            data-id="${usuario.idUsuarios}">
            Guardar
        </button>
    </td>

`;

                tablaUsuarios.appendChild(fila);


                /* CARGAR SELECT DE ROLES */

                cargarRolesEnSelect(
                    fila.querySelector(".select-rol"),
                    usuario.Tipo_Usuario_idTipo_Usuario
                );

            });

        } catch (error) {

            console.error(
                "ERROR AL CARGAR LOS USUARIOS:",
                error
            );

        }

    }



    /* CARGAR BITÁCORA ADMINISTRATIVA */

    async function cargarBitacora() {

        const tabla = document.getElementById("tablaBitacora");

        if (!tabla) {
            return;
        }

        try {

            const respuesta = await fetchConToken(
                "http://localhost:8080/api/bitacora"
            );

            if (!respuesta.ok) {
                throw new Error("No se pudo cargar la bitácora.");
            }

            const registros = await respuesta.json();

            tabla.innerHTML = "";

            if (registros.length === 0) {
                tabla.innerHTML = `
                <tr>
                    <td colspan="4" class="sin-datos">
                        No hay registros para mostrar.
                    </td>
                </tr>
            `;
                return;
            }

            registros.forEach(function (registro) {

                const fila = document.createElement("tr");

                const administrador = [
                    registro.Nombre,
                    registro.Paterno,
                    registro.Materno
                ].filter(Boolean).join(" ");

                const fechaHora = registro.FechaHora
                    ? new Date(registro.FechaHora).toLocaleString("es-MX", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true
                    })
                    : "";

                [
                    fechaHora,
                    administrador || "Usuario no disponible",
                    registro.Accion || "",
                    registro.Descripcion || ""
                ].forEach(function (valor) {

                    const celda = document.createElement("td");
                    celda.textContent = valor;
                    fila.appendChild(celda);

                });

                tabla.appendChild(fila);

            });

        } catch (error) {

            console.error("ERROR AL CARGAR LA BITÁCORA:", error);

            tabla.innerHTML = `
            <tr>
                <td colspan="4" class="sin-datos">
                    No se pudo cargar la bitácora.
                </td>
            </tr>
        `;
        }
    }




    /* CARGAR ROLES */

    async function cargarRolesEnSelect(select, rolActual) {

        try {

            const respuesta = await fetchConToken(
                "http://localhost:8080/api/usuarios/roles"
            );

            if (!respuesta.ok) {

                throw new Error(
                    "Error HTTP: " + respuesta.status
                );

            }

            const roles =
                await respuesta.json();

            select.innerHTML = "";

            roles.forEach(function (rol) {

                const opcion =
                    document.createElement("option");

                opcion.value =
                    rol.idTipo_Usuario;

                opcion.textContent =
                    rol.Nombre;

                if (
                    Number(rol.idTipo_Usuario) ===
                    Number(rolActual)
                ) {

                    opcion.selected = true;

                }

                select.appendChild(opcion);

            });

        } catch (error) {

            console.error(
                "ERROR AL CARGAR LOS ROLES:",
                error
            );

        }

    }


    /* ABRIR FORMULARIO NUEVO USUARIO */

    const btnNuevoUsuario =
        document.getElementById("btnNuevoUsuario");

    const formularioUsuario =
        document.getElementById("formularioUsuario");

    const btnCancelarUsuario =
        document.getElementById("btnCancelarUsuario");

    const formNuevoUsuario =
        document.getElementById("formNuevoUsuario");


    if (btnNuevoUsuario) {

        btnNuevoUsuario.addEventListener(
            "click",
            function () {

                formularioUsuario.classList.remove(
                    "oculto"
                );

                formNuevoUsuario.reset();

                cargarRolesFormulario();

            }
        );

    }


    /* CERRAR FORMULARIO */

    if (btnCancelarUsuario) {

        btnCancelarUsuario.addEventListener(
            "click",
            function () {

                formularioUsuario.classList.add(
                    "oculto"
                );

                formNuevoUsuario.reset();

            }
        );

    }


    /* CARGAR ROLES DEL FORMULARIO */

    async function cargarRolesFormulario() {

        const selectRol =
            document.getElementById("rolUsuario");

        if (!selectRol) {
            return;
        }

        try {

            const respuesta = await fetchConToken(
                "http://localhost:8080/api/usuarios/roles"
            );

            if (!respuesta.ok) {

                throw new Error(
                    "Error HTTP: " + respuesta.status
                );

            }

            const roles =
                await respuesta.json();

            selectRol.innerHTML = `
                <option value="">
                    Seleccionar rol
                </option>
            `;

            roles.forEach(function (rol) {

                const opcion =
                    document.createElement("option");

                opcion.value =
                    rol.idTipo_Usuario;

                opcion.textContent =
                    rol.Nombre;

                selectRol.appendChild(opcion);

            });

        } catch (error) {

            console.error(
                "ERROR AL CARGAR LOS ROLES:",
                error
            );

        }

    }


    /* GUARDAR NUEVO USUARIO */

    if (formNuevoUsuario) {

        formNuevoUsuario.addEventListener(
            "submit",
            async function (evento) {

                evento.preventDefault();


                const nombre =
                    document.getElementById(
                        "nombreUsuario"
                    ).value.trim();

                const paterno =
                    document.getElementById(
                        "paternoUsuario"
                    ).value.trim();

                const materno =
                    document.getElementById(
                        "maternoUsuario"
                    ).value.trim();

                const telefono =
                    document.getElementById(
                        "telefonoUsuario"
                    ).value.trim();

                const correo =
                    document.getElementById(
                        "correoUsuario"
                    ).value.trim();

                const contraseña =
                    document.getElementById(
                        "contrasenaUsuario"
                    ).value;

                const tipoUsuario =
                    document.getElementById(
                        "rolUsuario"
                    ).value;


                /* VALIDAR CAMPOS */

                if (
                    !nombre ||
                    !correo ||
                    !contraseña ||
                    !tipoUsuario
                ) {

                    mostrarAlerta(
                        "Completa todos los campos obligatorios.",
                        "Campos incompletos"
                    );

                    return;
                }

                /* PREPARAR DATOS */

                const datos = {

                    Nombre: nombre,

                    Paterno: paterno,

                    Materno: materno,

                    Telefono: telefono,

                    Correo: correo,

                    Contraseña: contraseña,

                    Tipo_Usuario_idTipo_Usuario:
                        Number(tipoUsuario),
                    idAdministrador: obtenerIdAdministrador()

                };


                console.log(
                    "DATOS DEL NUEVO USUARIO:",
                    datos
                );


                try {

                    const respuesta = await fetchConToken(
                        "http://localhost:8080/api/usuarios",
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body: JSON.stringify(datos)
                        }
                    );


                    const resultado =
                        await respuesta.json();


                    console.log(
                        "RESPUESTA DEL SERVIDOR:",
                        resultado
                    );


                    if (!respuesta.ok) {

                        throw new Error(
                            resultado.mensaje ||
                            "No se pudo registrar el usuario."
                        );

                    }


                    /* MOSTRAR MENSAJE */

                    if (Number(tipoUsuario) === 1) {

                        mostrarAlerta(
                            "El usuario fue registrado correctamente con el rol de Administrador.",
                            "Usuario registrado"
                        );

                    } else {

                        mostrarAlerta(
                            resultado.mensaje,
                            "Usuario registrado"
                        );

                    }


                    /* CERRAR FORMULARIO */

                    formularioUsuario.classList.add(
                        "oculto"
                    );

                    formNuevoUsuario.reset();


                    /* ACTUALIZAR TABLA */

                    cargarUsuarios();


                } catch (error) {

                    console.error(
                        "ERROR AL REGISTRAR USUARIO:",
                        error
                    );

                    mostrarAlerta(
                        error.message ||
                        "Ocurrió un error al registrar el usuario.",
                        "Error"
                    );

                }

            }
        );

    }



    /* CAMBIAR ROL Y ESTADO */

    document.addEventListener("click", async function (evento) {

        if (!evento.target.classList.contains("btn-guardar-usuario")) {
            return;
        }

        const boton = evento.target;
        const idUsuario = boton.getAttribute("data-id");
        const fila = boton.closest("tr");

        const selectRol = fila.querySelector(".select-rol");
        const selectEstado = fila.querySelector(".select-estado");

        const nuevoRol = Number(selectRol.value);
        const nuevoEstado = selectEstado.value;

        const rolAnterior = Number(selectRol.dataset.rolOriginal);
        const estadoAnterior = selectEstado.dataset.estadoOriginal;

        const cambioRol = nuevoRol !== rolAnterior;
        const cambioEstado = nuevoEstado !== estadoAnterior;

        if (!nuevoRol || !nuevoEstado) {
            mostrarAlerta(
                "Selecciona un rol y un estado.",
                "Datos requeridos"
            );
            return;
        }

        if (!cambioRol && !cambioEstado) {
            mostrarAlerta(
                "No hiciste ningún cambio.",
                "Sin cambios"
            );
            return;
        }

        try {

            /* ACTUALIZAR ROL SOLO SI CAMBIÓ */

            if (cambioRol) {

                const respuestaRol = await fetchConToken(
                    `http://localhost:8080/api/usuarios/${idUsuario}/rol`,
                    {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            idTipoUsuario: nuevoRol,
                            idAdministrador: obtenerIdAdministrador()
                        })
                    }
                );

                const resultadoRol = await respuestaRol.json();

                if (!respuestaRol.ok) {
                    throw new Error(
                        resultadoRol.mensaje ||
                        "No se pudo actualizar el rol."
                    );
                }

                selectRol.dataset.rolOriginal = nuevoRol;
            }

            /* ACTUALIZAR ESTADO SOLO SI CAMBIÓ */

            if (cambioEstado) {

                const respuestaEstado = await fetchConToken(
                    `http://localhost:8080/api/usuarios/${idUsuario}/estado`,
                    {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            estado: nuevoEstado,
                            idAdministrador: obtenerIdAdministrador()
                        })
                    }
                );

                const resultadoEstado = await respuestaEstado.json();

                if (!respuestaEstado.ok) {
                    throw new Error(
                        resultadoEstado.mensaje ||
                        "No se pudo actualizar el estado."
                    );
                }

                selectEstado.dataset.estadoOriginal = nuevoEstado;
            }

            mostrarAlerta(
                "Los cambios se guardaron correctamente.",
                "Usuario actualizado"
            );

            await cargarUsuarios();
            await cargarBitacora();

        } catch (error) {

            console.error("ERROR AL ACTUALIZAR USUARIO:", error);

            mostrarAlerta(
                error.message ||
                "Ocurrió un error al actualizar el usuario.",
                "Error"
            );
        }
    });


    /* CERRAR SESIÓN */

    document.getElementById("btnSalir").addEventListener(
        "click",
        function () {

            const modal =
                document.getElementById("modalConfirmarSalida");

            modal.style.display = "flex";
        }
    );


    /* CANCELAR CERRAR SESIÓN */

    document.getElementById("btnCancelarSalida").addEventListener(
        "click",
        function () {

            const modal =
                document.getElementById("modalConfirmarSalida");

            modal.style.display = "none";
        }
    );


    /* CONFIRMAR CERRAR SESIÓN */

    document.getElementById("btnConfirmarSalida").addEventListener(
        "click",
        function () {

            localStorage.removeItem("usuario");
            localStorage.removeItem("token");
            sessionStorage.removeItem("identificadorMfa");

            window.location.href = "login.html";
        }
    );

    /* ALERTA PERSONALIZADA */

    function mostrarAlerta(mensaje, titulo = "Aviso") {

        const modal = document.getElementById("modalAlerta");
        const texto = document.getElementById("textoAlerta");
        const tituloElemento = document.getElementById("tituloAlerta");
        const boton = document.getElementById("btnAceptarAlerta");

        tituloElemento.textContent = titulo;
        texto.textContent = mensaje;

        modal.style.display = "flex";

        boton.onclick = function () {
            modal.style.display = "none";
        };
    }


    /* EJECUTAR CARGA DE CITAS */

    cargarCitas();


    /* EJECUTAR CARGA DE SERVICIOS */

    cargarServicios();


    /* EJECUTAR CARGA DE CLIENTES */

    cargarClientes();


    /* EJECUTAR CARGA DE USUARIOS */

    cargarUsuarios();

    /* EJECUTAR CARGA DE BITÁCORA */

    cargarBitacora();

});
