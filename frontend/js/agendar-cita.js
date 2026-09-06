const servicio = document.getElementById("servicio");
const fecha = document.getElementById("fecha");
const hora = document.getElementById("hora");

const resumenServicio =
    document.getElementById("resumenServicio");

const resumenFecha =
    document.getElementById("resumenFecha");

const resumenHora =
    document.getElementById("resumenHora");

const mensaje =
    document.getElementById("mensajeCita");

const btnConfirmar =
    document.getElementById("btnConfirmar");


//  FECHA MÍNIMA

const hoy = new Date()
    .toISOString()
    .split("T")[0];

fecha.min = hoy;


//  SERVICIOS 

async function cargarServicios() {

    /*
     * POR AHORA usamos estos servicios
     * para probar la interfaz.
     *
     * Estos corresponden a los servicios
     * que existen actualmente en MariaDB.
     *
     * Después los traeremos directamente
     * desde Spring Boot → MariaDB.
     */

    const servicios = [

        {
            id: 1,
            nombre: "Uñas"
        },

        {
            id: 2,
            nombre: "Maquillaje"
        },

        {
            id: 3,
            nombre: "Peinado"
        },

        {
            id: 13,
            nombre: "Otros"
        },

        {
            id: 15,
            nombre: "Tatuajes"
        },

        {
            id: 16,
            nombre: "Masajes"
        }

    ];


    // Limpiar opciones anteriores

    servicio.innerHTML =
        '<option value="">Selecciona un servicio</option>';


    // Agregar servicios

    servicios.forEach(function (item) {

        const opcion =
            document.createElement("option");

        opcion.value =
            item.id;

        opcion.textContent =
            item.nombre;

        servicio.appendChild(opcion);

    });


    // ================= RECUPERAR SERVICIO =================

    /*
     * Recuperamos el servicio seleccionado
     * desde el módulo Inicio.
     *
     * inicio.js guarda:
     *
     * localStorage.setItem(
     *     "servicioSeleccionado",
     *     servicio
     * );
     */

    const servicioGuardado =
        localStorage.getItem(
            "servicioSeleccionado"
        );


    if (servicioGuardado) {

        const opciones =
            Array.from(
                servicio.options
            );


        const encontrado =
            opciones.find(function (opcion) {

                return opcion.textContent
                    .toLowerCase() ===
                    servicioGuardado.toLowerCase();

            });


        if (encontrado) {

            servicio.value =
                encontrado.value;

        }

    }


    // Actualizar resumen

    actualizarResumen();

}


//  RESUMEN 

function actualizarResumen() {

    // SERVICIO 

    if (servicio.value !== "") {

        resumenServicio.textContent =
            servicio.options[
                servicio.selectedIndex
            ].text;

    } else {

        resumenServicio.textContent =
            "—";

    }


    // FECHA 

    if (fecha.value !== "") {

        resumenFecha.textContent =
            formatearFecha(
                fecha.value
            );

    } else {

        resumenFecha.textContent =
            "—";

    }


    //  HORA 

    if (hora.value !== "") {

        resumenHora.textContent =
            hora.options[
                hora.selectedIndex
            ].text;

    } else {

        resumenHora.textContent =
            "—";

    }

}


//  FORMATEAR FECHA 

function formatearFecha(fechaSeleccionada) {

    const partes =
        fechaSeleccionada.split("-");


    return `${partes[2]}/${partes[1]}/${partes[0]}`;

}


//  EVENTOS 

servicio.addEventListener(
    "change",
    actualizarResumen
);


fecha.addEventListener(
    "change",
    actualizarResumen
);


hora.addEventListener(
    "change",
    actualizarResumen
);


// CONFIRMAR CITA  

async function confirmarCita() {

    //  VALIDAR SERVICIO  

    if (servicio.value === "") {

        mostrarMensaje(
            "Selecciona un servicio."
        );

        return;

    }


    //  VALIDAR FECHA  

    if (fecha.value === "") {

        mostrarMensaje(
            "Selecciona una fecha."
        );

        return;

    }


    //  VALIDAR HORA  

    if (hora.value === "") {

        mostrarMensaje(
            "Selecciona una hora."
        );

        return;

    }


    //   VALIDAR FECHA PASADA  

    if (fecha.value < hoy) {

        mostrarMensaje(
            "No puedes seleccionar una fecha pasada."
        );

        return;

    }


    //   VALIDAR SESIÓN  

    const usuario =
        localStorage.getItem(
            "usuario"
        );


    if (!usuario) {

        mostrarMensaje(
            "Debes iniciar sesión para agendar."
        );


        setTimeout(function () {

            window.location.href =
                "login.html";

        }, 1000);


        return;

    }


    //   DESHABILITAR BOTÓN  

    btnConfirmar.disabled =
        true;


    mostrarMensaje(
        "Guardando cita..."
    );


    try {

        /*
         * Conexión con Spring Boot.
         *
         * Endpoint:
         *
         * POST
         * http://localhost:8080/api/citas
         *
         * Por ahora enviamos:
         *
         * idServicio
         * fecha
         * hora
         */

        const respuesta =
            await fetch(
                "http://localhost:8080/api/citas",
                {

                    method: "POST",

                    headers: {

                        "Content-Type":
                            "application/json"

                    },

                    body:
                        JSON.stringify({

                            idServicio:
                                parseInt(
                                    servicio.value
                                ),

                            fecha:
                                fecha.value,

                            hora:
                                hora.value

                        })

                }
            );


        //  RESPUESTA DEL SERVIDOR  

        const datos =
            await respuesta.json();


        //   CITA CORRECTA  

        if (respuesta.ok) {

            mostrarMensaje(
                "¡Cita agendada correctamente!"
            );


            // Limpiar servicio guardado

            localStorage.removeItem(
                "servicioSeleccionado"
            );


            // Ir a Mis Citas

            setTimeout(function () {

                window.location.href =
                    "mis-citas.html";

            }, 1200);

        }


        //   ERROR DEL SERVIDOR 

        else {

            mostrarMensaje(

                datos.mensaje ||
                "No se pudo agendar la cita."

            );


            btnConfirmar.disabled =
                false;

        }


    } catch (error) {

        console.error(
            "Error al agendar cita:",
            error
        );


        mostrarMensaje(
            "No se pudo conectar con el servidor."
        );


        btnConfirmar.disabled =
            false;

    }

}


//   MENSAJES 

function mostrarMensaje(texto) {

    mensaje.textContent =
        texto;

}


//  CERRAR SESIÓN  

function cerrarSesion() {

    localStorage.removeItem(
        "usuario"
    );


    localStorage.removeItem(
        "servicioSeleccionado"
    );


    window.location.href =
        "index.html";

}


//  INICIO  

cargarServicios();