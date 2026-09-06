document.addEventListener("DOMContentLoaded", function () {

    const usuarioGuardado = localStorage.getItem("usuario");

    if (!usuarioGuardado) {
        window.location.href = "login.html";
        return;
    }


    const usuario = JSON.parse(usuarioGuardado);

    const idUsuario = usuario.idUsuarios;


    console.log("================================");
    console.log("USUARIO LOGUEADO:");
    console.log(usuario);
    console.log("ID DEL USUARIO:", idUsuario);
    console.log("================================");


    // DATOS DEL CLIENTE

    const nombre = usuario.Nombre || "";
    const paterno = usuario.Paterno || "";
    const materno = usuario.Materno || "";
    const telefono = usuario.Telefono || "";
    const correo = usuario.Correo || "";


    document.getElementById("nombreCliente").textContent =
        nombre || "Cliente";


    document.getElementById("mensajeBienvenida").textContent =
        nombre
            ? "Bienvenida, " + nombre
            : "Bienvenida a Andy Nails";


    const avatar =
        document.getElementById("avatarCliente");


    if (nombre.length > 0) {

        avatar.textContent =
            nombre.charAt(0).toUpperCase();

    } else {

        avatar.textContent = "C";
    }


    document.getElementById("nombre").value =
        nombre;

    document.getElementById("apellidoPaterno").value =
        paterno;

    document.getElementById("apellidoMaterno").value =
        materno;

    document.getElementById("telefono").value =
        telefono;

    document.getElementById("correo").value =
        correo;



    // CARGAR CITAS DEL CLIENTE

    async function cargarCitas() {

        try {

            console.log(
                "Consultando citas del usuario:",
                idUsuario
            );


            const respuesta = await fetch(
                `http://localhost:8080/api/citas/cliente/${idUsuario}`
            );


            console.log(
                "STATUS:",
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


            // TOTAL DE CITAS

            document.getElementById("totalCitas")
                .textContent = citas.length;



            // TABLA DE CITAS

            const tablaCitas =
                document.getElementById("tablaCitas");


            tablaCitas.innerHTML = "";


            if (citas.length === 0) {

                tablaCitas.innerHTML = `
                    <tr>
                        <td colspan="5" class="sin-datos">
                            No tienes citas registradas.
                        </td>
                    </tr>
                `;

            } else {

                citas.forEach(function (cita) {

                    const fila =
                        document.createElement("tr");


                    fila.innerHTML = `
                        <td>${cita.Fecha || ""}</td>

                        <td>${cita.Hora || ""}</td>

                        <td>
                            ${cita.Nombre_servicio || "Sin servicio"}
                        </td>

                        <td>
                            $${cita.Precio || "0.00"}
                        </td>

                        <td>
                            ${cita.Estado || ""}
                        </td>
                    `;


                    tablaCitas.appendChild(fila);

                });
            }



            // SERVICIOS

            const servicios =
                citas.filter(function (cita) {

                    return cita.idServicios != null;

                });


            document.getElementById("totalServicios")
                .textContent = servicios.length;



            // PRÓXIMA CITA

            const tablaProximaCita =
                document.getElementById(
                    "tablaProximaCita"
                );


            tablaProximaCita.innerHTML = "";


            if (citas.length > 0) {

                const proxima = citas[0];


                tablaProximaCita.innerHTML = `
                    <tr>

                        <td>
                            ${proxima.Fecha || ""}
                        </td>

                        <td>
                            ${proxima.Hora || ""}
                        </td>

                        <td>
                            ${proxima.Nombre_servicio || "Sin servicio"}
                        </td>

                        <td>
                            ${proxima.Estado || ""}
                        </td>

                    </tr>
                `;

            } else {

                tablaProximaCita.innerHTML = `
                    <tr>

                        <td colspan="4" class="sin-datos">
                            No tienes citas próximas.
                        </td>

                    </tr>
                `;
            }



        } catch (error) {

            console.error(
                "ERROR AL CARGAR LAS CITAS:",
                error
            );

        }

    }


    // Ejecutar
    cargarCitas();



    // MENÚ

    const botones =
        document.querySelectorAll(".menu-item");


    const secciones =
        document.querySelectorAll(".seccion");


    const titulo =
        document.getElementById("tituloSeccion");


    botones.forEach(function (boton) {

        boton.addEventListener(
            "click",
            function () {

                const seccionSeleccionada =
                    boton.getAttribute("data-seccion");


                botones.forEach(function (item) {

                    item.classList.remove("activo");

                });


                boton.classList.add("activo");


                secciones.forEach(function (seccion) {

                    seccion.classList.remove("activa");

                });


                const seccion =
                    document.getElementById(
                        seccionSeleccionada
                    );


                if (seccion) {

                    seccion.classList.add("activa");

                }


                titulo.textContent =
                    boton.textContent.trim();

            }
        );

    });



    // CERRAR SESIÓN

    document
        .getElementById("btnSalir")
        .addEventListener(
            "click",
            function () {

                localStorage.removeItem("usuario");

                window.location.href =
                    "login.html";

            }
        );

});