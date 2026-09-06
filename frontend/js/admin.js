document.addEventListener("DOMContentLoaded", function () {

    const botonesMenu = document.querySelectorAll(".menu-item");
    const secciones = document.querySelectorAll(".seccion");
    const tituloSeccion = document.getElementById("tituloSeccion");
    const btnSalir = document.getElementById("btnSalir");


    /* CAMBIAR SECCIÓN */

    botonesMenu.forEach(function (boton) {

        boton.addEventListener("click", function () {

            const seccionId = boton.getAttribute("data-seccion");


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

            tituloSeccion.textContent = textoBoton
                .replace("🏠", "")
                .replace("📅", "")
                .replace("👥", "")
                .replace("💅", "")
                .replace("💰", "")
                .replace("🕐", "")
                .replace("📊", "")
                .trim();

        });

    });


    /* CARGAR CITAS PARA ADMINISTRADORA */

    async function cargarCitas() {

        try {

            console.log("================================");
            console.log("CARGANDO TODAS LAS CITAS");
            console.log("================================");


            const respuesta = await fetch(
                "http://localhost:8080/api/citas"
            );


            /* COMPROBAR RESPUESTA */

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


            /* MOSTRAR DATOS RECIBIDOS */

            console.log(
                "CITAS RECIBIDAS:",
                citas
            );


            /* BUSCAR TABLA DE CITAS */

            const tablaCitas =
                document.getElementById("tablaCitas");


            /* BUSCAR TABLA DE PRÓXIMAS CITAS */

            const tablaProximasCitas =
                document.getElementById("tablaProximasCitas");


            /* SI NO EXISTE LA TABLA */

            if (!tablaCitas) {

                console.error(
                    "No existe el elemento #tablaCitas en el HTML"
                );

                return;
            }


            /* LIMPIAR TABLA */

            tablaCitas.innerHTML = "";


            /* LIMPIAR TABLA DE PRÓXIMAS CITAS */

            if (tablaProximasCitas) {
                tablaProximasCitas.innerHTML = "";
            }


            /* ACTUALIZAR CONTADOR DE CITAS */

            const totalCitasHoy =
                document.getElementById("totalCitasHoy");


            /* OBTENER FECHA DE HOY */

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


            /* MOSTRAR CANTIDAD DE CITAS DE HOY */

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

            console.log("================================");
            console.log("CARGANDO SERVICIOS");
            console.log("================================");


            const respuesta = await fetch(
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


            /* BUSCAR CONTADOR DE SERVICIOS */

            const totalServicios =
                document.getElementById("totalServicios");


            /* MOSTRAR TOTAL DE SERVICIOS */

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

            console.log("================================");
            console.log("CARGANDO CLIENTES");
            console.log("================================");


            const respuesta = await fetch(
                "http://localhost:8080/api/usuarios/clientes"
            );


            /* COMPROBAR RESPUESTA */

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


            /* MOSTRAR DATOS RECIBIDOS */

            console.log(
                "CLIENTES RECIBIDOS:",
                clientes
            );


            /* BUSCAR CONTADOR DE CLIENTES */

            const totalClientes =
                document.getElementById("totalClientes");


            /* MOSTRAR TOTAL DE CLIENTES */

            if (totalClientes) {

                totalClientes.textContent =
                    clientes.length;

            }


            /* BUSCAR TABLA DE CLIENTES */

            const tablaClientes =
                document.getElementById("tablaClientes");


            /* SI NO EXISTE LA TABLA */

            if (!tablaClientes) {

                console.error(
                    "No existe el elemento #tablaClientes en el HTML"
                );

                return;
            }


            /* LIMPIAR TABLA */

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


    /* CERRAR SESIÓN */

    btnSalir.addEventListener("click", function () {

        const confirmar = confirm(
            "¿Seguro que quieres cerrar sesión?"
        );


        if (confirmar) {

            localStorage.removeItem("usuario");

            window.location.href =
                "login.html";

        }

    });


    /* EJECUTAR CARGA DE CITAS */

    cargarCitas();


    /* EJECUTAR CARGA DE SERVICIOS */

    cargarServicios();


    /* EJECUTAR CARGA DE CLIENTES */

    cargarClientes();

});