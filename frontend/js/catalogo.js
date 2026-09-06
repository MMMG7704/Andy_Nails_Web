document.addEventListener("DOMContentLoaded", cargarServicios);


async function cargarServicios() {

    try {

        const respuesta =
            await fetch("http://localhost:8080/api/servicios");


        if (!respuesta.ok) {

            throw new Error(
                "Error al obtener los servicios"
            );

        }


        const servicios =
            await respuesta.json();


        console.log(
            "Servicios recibidos:",
            servicios
        );


        mostrarServicios(servicios);

    } catch (error) {

        console.error(
            "Error:",
            error
        );


        const contenedor =
            document.getElementById(
                "servicios-container"
            );


        if (contenedor) {

            contenedor.innerHTML =
                "<p>No se pudieron cargar los servicios.</p>";

        }

    }

}



function mostrarServicios(servicios) {

    const contenedor =
        document.getElementById(
            "servicios-container"
        );


    if (!contenedor) {

        console.error(
            "No existe el elemento servicios-container en catalogo.html"
        );

        return;

    }


    contenedor.innerHTML = "";


    servicios.forEach(servicio => {

        const tarjeta =
            document.createElement("div");


        tarjeta.classList.add(
            "servicio-card"
        );


        const precio = servicio.Precio !== null
            ? `$${Number(servicio.Precio).toFixed(2)}`
            : "";


        tarjeta.innerHTML = `

            <h2>
                ${servicio.Nombre_servicio}
            </h2>

            <p>
                ${servicio.Descripcion ??
            "Sin descripción disponible."}
            </p>

            <p class="precio">
                ${precio}
            </p>

            <button
                class="btn-ver-catalogo">
                Ver catálogo
            </button>

        `;


        const boton =
            tarjeta.querySelector(
                ".btn-ver-catalogo"
            );


        boton.addEventListener(
            "click",
            () => {

                abrirCatalogo(servicio);

            }
        );


        contenedor.appendChild(
            tarjeta
        );

    });

}



function abrirCatalogo(servicio) {

    const nombre =
        servicio.Nombre_servicio
            .trim()
            .toLowerCase();


    console.log(
        "Servicio seleccionado:",
        servicio
    );


    // UÑAS

    if (
        nombre === "uñas" ||
        nombre === "unas"
    ) {

        window.location.href =
            "unas.html";

        return;

    }


    // MAQUILLAJE

    if (
        nombre === "maquillaje"
    ) {

        window.location.href =
            "maquillaje.html";

        return;

    }


    // PEINADO


    if (
        nombre === "peinado" ||
        nombre === "peinados"
    ) {

        window.location.href =
            "peinado.html";

        return;

    }


    // OTROS

    alert(
        "El catálogo de " +
        servicio.Nombre_servicio +
        " todavía está en construcción."
    );

}