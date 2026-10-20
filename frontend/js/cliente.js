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


    /* DATOS DEL CLIENTE */

    const nombre = usuario.Nombre || "";
    const paterno = usuario.Paterno || "";
    const materno = usuario.Materno || "";
    const telefono = usuario.Telefono || "";
    const correo = usuario.Correo || "";


    document.getElementById("nombreCliente").textContent =
        nombre || "Cliente";


    const mensajeBienvenida =
        document.getElementById("mensajeBienvenida");

    if (mensajeBienvenida) {
        mensajeBienvenida.textContent =
            nombre
                ? "Bienvenida, " + nombre
                : "Bienvenida a Andy Nails";
    }


    const avatar =
        document.getElementById("avatarCliente");


    if (avatar) {

        if (nombre.length > 0) {
            avatar.textContent =
                nombre.charAt(0).toUpperCase();
        } else {
            avatar.textContent = "C";
        }
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


    /* ALERTA PERSONALIZADA */

    function mostrarAlerta(mensaje, titulo = "Aviso") {

        const modal =
            document.getElementById("modalAlerta");

        const texto =
            document.getElementById("textoAlerta");

        const tituloElemento =
            document.getElementById("tituloAlerta");

        const boton =
            document.getElementById("btnAceptarAlerta");


        tituloElemento.textContent = titulo;

        texto.textContent = mensaje;

        modal.style.display = "flex";


        boton.onclick = function () {

            modal.style.display = "none";

        };
    }


    /* DATOS PENDIENTES DEL PERFIL */

    let datosPerfilPendientes = null;


    /* MODAL MFA */

    const modalMfa =
        document.getElementById("modalMfa");

    const codigoMfa =
        document.getElementById("codigoMfa");

    const btnCancelarMfa =
        document.getElementById("btnCancelarMfa");

    const btnVerificarMfa =
        document.getElementById("btnVerificarMfa");


    /* CANCELAR MFA */

    if (btnCancelarMfa) {

        btnCancelarMfa.addEventListener(
            "click",
            function () {

                modalMfa.style.display = "none";

                codigoMfa.value = "";

                datosPerfilPendientes = null;

            }
        );
    }


    /* VERIFICAR MFA */

    if (btnVerificarMfa) {

        btnVerificarMfa.addEventListener(
            "click",
            async function () {

                const codigo =
                    codigoMfa.value.trim();


                if (codigo.length !== 6) {

                    mostrarAlerta(
                        "Escribe el código de 6 dígitos que recibiste en tu correo.",
                        "Código incorrecto"
                    );

                    return;
                }


                if (!datosPerfilPendientes) {

                    mostrarAlerta(
                        "No hay cambios pendientes por verificar.",
                        "Aviso"
                    );

                    return;
                }


                btnVerificarMfa.disabled = true;

                btnVerificarMfa.textContent =
                    "Verificando...";


                try {

                    /* VERIFICAR CÓDIGO */

                    const token = localStorage.getItem("token");

                    const respuestaMfa = await fetch(
                        `http://localhost:8080/api/mfa/verificar?idUsuario=${idUsuario}&codigo=${codigo}`,
                        {
                            method: "POST",
                            headers: {
                                "Authorization": `Bearer ${token}`
                            }
                        }
                    );


                    const resultadoMfa =
                        await respuestaMfa.text();


                    if (!resultadoMfa.includes("Código correcto")) {

                        mostrarAlerta(
                            "El código es incorrecto o ya expiró. Solicita un nuevo código.",
                            "Código incorrecto"
                        );

                        return;
                    }


                    /* CERRAR MODAL MFA */

                    modalMfa.style.display = "none";

                    codigoMfa.value = "";


                    /* ACTUALIZAR PERFIL */

                    const respuesta =
                        await fetch(
                            `http://localhost:8080/api/usuarios/${idUsuario}/perfil`,
                            {
                                method: "PUT",

                                headers: {
                                    "Content-Type": "application/json",
                                    "Authorization": `Bearer ${token}`

                                },

                                body:
                                    JSON.stringify(
                                        datosPerfilPendientes
                                    )
                            }
                        );


                    const resultado =
                        await respuesta.json();


                    if (!respuesta.ok) {

                        mostrarAlerta(
                            resultado.mensaje ||
                            "No se pudieron actualizar los datos.",
                            "Error"
                        );

                        return;
                    }


                    /* ACTUALIZAR DATOS GUARDADOS */

                    usuario.Nombre =
                        datosPerfilPendientes.Nombre;

                    usuario.Paterno =
                        datosPerfilPendientes.Paterno;

                    usuario.Materno =
                        datosPerfilPendientes.Materno;

                    usuario.Telefono =
                        datosPerfilPendientes.Telefono;

                    usuario.Correo =
                        datosPerfilPendientes.Correo;


                    localStorage.setItem(
                        "usuario",
                        JSON.stringify(usuario)
                    );


                    /* ACTUALIZAR NOMBRE MOSTRADO */

                    document.getElementById(
                        "nombreCliente"
                    ).textContent =
                        datosPerfilPendientes.Nombre ||
                        "Cliente";


                    if (mensajeBienvenida) {

                        mensajeBienvenida.textContent =
                            datosPerfilPendientes.Nombre
                                ? "Bienvenida, " +
                                datosPerfilPendientes.Nombre
                                : "Bienvenida a Andy Nails";
                    }


                    /* ACTUALIZAR AVATAR */

                    if (avatar) {

                        avatar.textContent =
                            datosPerfilPendientes.Nombre
                                ? datosPerfilPendientes.Nombre
                                    .charAt(0)
                                    .toUpperCase()
                                : "C";
                    }


                    datosPerfilPendientes = null;


                    /* MOSTRAR CONFIRMACIÓN */

                    mostrarAlerta(
                        "Tus datos se guardaron correctamente.",
                        "Perfil actualizado"
                    );


                } catch (error) {

                    console.error(
                        "ERROR AL VERIFICAR MFA:",
                        error
                    );


                    mostrarAlerta(
                        "No se pudo conectar con el servidor.",
                        "Error"
                    );

                } finally {

                    btnVerificarMfa.disabled = false;

                    btnVerificarMfa.textContent =
                        "Verificar";
                }

            }
        );
    }


    /* ACTUALIZAR PERFIL */

    const formularioPerfil =
        document.getElementById("formularioPerfil");


    if (formularioPerfil) {

        formularioPerfil.addEventListener(
            "submit",
            async function (event) {

                event.preventDefault();


                const datosPerfil = {

                    Nombre:
                        document
                            .getElementById("nombre")
                            .value
                            .trim(),

                    Paterno:
                        document
                            .getElementById("apellidoPaterno")
                            .value
                            .trim(),

                    Materno:
                        document
                            .getElementById("apellidoMaterno")
                            .value
                            .trim(),

                    Telefono:
                        document
                            .getElementById("telefono")
                            .value
                            .trim(),

                    Correo:
                        document
                            .getElementById("correo")
                            .value
                            .trim()
                };


                if (
                    !datosPerfil.Nombre ||
                    !datosPerfil.Correo
                ) {

                    mostrarAlerta(
                        "El nombre y el correo son obligatorios.",
                        "Datos incompletos"
                    );

                    return;
                }


                try {

                    /* GUARDAR CAMBIOS PENDIENTES */

                    datosPerfilPendientes =
                        datosPerfil;


                    /* ENVIAR CÓDIGO MFA */

                    const token = localStorage.getItem("token");

                    const respuestaMfa = await fetch(
                        `http://localhost:8080/api/mfa/enviar?idUsuario=${idUsuario}&correo=${encodeURIComponent(correo)}`,
                        {
                            method: "POST",
                            headers: {
                                "Authorization": `Bearer ${token}`
                            }
                        }
                    );


                    if (!respuestaMfa.ok) {

                        datosPerfilPendientes = null;

                        mostrarAlerta(
                            "No se pudo enviar el código de verificación.",
                            "Error"
                        );

                        return;
                    }


                    /* MOSTRAR MODAL MFA */

                    codigoMfa.value = "";

                    modalMfa.style.display = "flex";

                    setTimeout(function () {
                        codigoMfa.focus();
                    }, 100);


                } catch (error) {

                    console.error(
                        "ERROR AL ENVIAR MFA:",
                        error
                    );


                    datosPerfilPendientes = null;


                    mostrarAlerta(
                        "No se pudo conectar con el servidor.",
                        "Error"
                    );

                }

            }
        );
    }


    /* CARGAR CITAS DEL CLIENTE */

    async function cargarCitas() {

        try {

            console.log(
                "Consultando citas del usuario:",
                idUsuario
            );


            const token = localStorage.getItem("token");

            const respuesta = await fetch(
                `http://localhost:8080/api/citas/cliente/${idUsuario}`,
                {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                }
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


            /* TOTAL DE CITAS */

            document.getElementById("totalCitas")
                .textContent = citas.length;


            /* TABLA DE CITAS */

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


            /* SERVICIOS */

            const servicios =
                citas.filter(function (cita) {

                    return cita.idServicios != null;

                });


            document.getElementById("totalServicios")
                .textContent = servicios.length;


            /* PRÓXIMA CITA */

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
                "ERROR AL CARGAR CITAS:",
                error
            );

        }
    }


    /* EJECUTAR */

    cargarCitas();


    /* MENÚ */

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


    /* CERRAR SESIÓN */

    const btnSalir =
        document.getElementById("btnSalir");


    if (btnSalir) {

        btnSalir.addEventListener(
            "click",
            function () {

                localStorage.removeItem("usuario");

                window.location.href =
                    "login.html";

            }
        );
    }

});