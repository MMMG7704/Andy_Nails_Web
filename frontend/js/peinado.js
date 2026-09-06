const API_URL = "http://localhost:8080/api/catalogo/3";

let listaBoda = [];
let listaSocial = [];
let listaXV = [];

let indiceBoda = 0;
let indiceSocial = 0;
let indiceXV = 0;


// INICIAR

document.addEventListener(
    "DOMContentLoaded",
    cargarPeinados
);


// CARGAR DATOS DESDE SPRING BOOT

async function cargarPeinados() {

    try {

        const respuesta = await fetch(API_URL);

        if (!respuesta.ok) {
            throw new Error(
                "No se pudo conectar con el backend"
            );
        }

        const servicios = await respuesta.json();

        console.log(
            "Peinados recibidos:",
            servicios
        );


        // Limpiar listas

        listaBoda = [];
        listaSocial = [];
        listaXV = [];


        // Separar por categoría

        servicios.forEach(servicio => {

            const categoria =
                String(servicio.Nombre_categoria)
                    .trim()
                    .toLowerCase();


            if (categoria === "boda") {

                listaBoda.push(servicio);

            } else if (categoria === "social") {

                listaSocial.push(servicio);

            } else if (categoria === "xv") {

                listaXV.push(servicio);
            }

        });


        console.log(
            "Boda:",
            listaBoda
        );

        console.log(
            "Social:",
            listaSocial
        );

        console.log(
            "XV:",
            listaXV
        );


        // Mostrar primera opción

        if (listaBoda.length > 0) {

            mostrarBoda(
                listaBoda[0]
            );
        }


        if (listaSocial.length > 0) {

            mostrarSocial(
                listaSocial[0]
            );
        }


        if (listaXV.length > 0) {

            mostrarXV(
                listaXV[0]
            );
        }


        // Iniciar carruseles

        iniciarCarruseles();


    } catch (error) {

        console.error(
            "Error:",
            error
        );

        const catalogo =
            document.querySelector(".catalogo");


        if (catalogo) {

            catalogo.innerHTML = `
                <p class="error">
                    No se pudo cargar el catálogo de peinados.
                </p>
            `;
        }
    }
}


// MOSTRAR BODA

function mostrarBoda(servicio) {

    document.getElementById(
        "imgBoda"
    ).src =
        obtenerImagen(
            servicio.Imagen_Archivo
        );


    document.getElementById(
        "nombreBoda"
    ).textContent =
        servicio.Nombre_categoria;


    document.getElementById(
        "descBoda"
    ).textContent =
        servicio.Descripcion;


    document.getElementById(
        "precioBoda"
    ).textContent =
        "$" +
        Number(
            servicio.Precio
        ).toFixed(2);


    document.getElementById(
        "btnBoda"
    ).onclick = function () {

        seleccionarServicio(
            servicio
        );
    };
}


// MOSTRAR SOCIAL

function mostrarSocial(servicio) {

    document.getElementById(
        "imgSocial"
    ).src =
        obtenerImagen(
            servicio.Imagen_Archivo
        );


    document.getElementById(
        "nombreSocial"
    ).textContent =
        servicio.Nombre_categoria;


    document.getElementById(
        "descSocial"
    ).textContent =
        servicio.Descripcion;


    document.getElementById(
        "precioSocial"
    ).textContent =
        "$" +
        Number(
            servicio.Precio
        ).toFixed(2);


    document.getElementById(
        "btnSocial"
    ).onclick = function () {

        seleccionarServicio(
            servicio
        );
    };
}


// MOSTRAR XV

function mostrarXV(servicio) {

    document.getElementById(
        "imgXV"
    ).src =
        obtenerImagen(
            servicio.Imagen_Archivo
        );


    document.getElementById(
        "nombreXV"
    ).textContent =
        servicio.Nombre_categoria;


    document.getElementById(
        "descXV"
    ).textContent =
        servicio.Descripcion;


    document.getElementById(
        "precioXV"
    ).textContent =
        "$" +
        Number(
            servicio.Precio
        ).toFixed(2);


    document.getElementById(
        "btnXV"
    ).onclick = function () {

        seleccionarServicio(
            servicio
        );
    };
}


// CARRUSELES

function iniciarCarruseles() {


    // BODA

    setInterval(() => {

        if (listaBoda.length > 0) {

            indiceBoda =
                (indiceBoda + 1) %
                listaBoda.length;


            mostrarBoda(
                listaBoda[indiceBoda]
            );
        }

    }, 4000);


    // SOCIAL

    setInterval(() => {

        if (listaSocial.length > 0) {

            indiceSocial =
                (indiceSocial + 1) %
                listaSocial.length;


            mostrarSocial(
                listaSocial[indiceSocial]
            );
        }

    }, 4000);


    // XV

    setInterval(() => {

        if (listaXV.length > 0) {

            indiceXV =
                (indiceXV + 1) %
                listaXV.length;


            mostrarXV(
                listaXV[indiceXV]
            );
        }

    }, 4000);
}


// CONVERTIR RUTA DE LA BD
function obtenerImagen(ruta) {

    if (!ruta) {
        return "";
    }

    const nombreArchivo = ruta.split("\\").pop();

    const rutaMinuscula = ruta.toLowerCase();

    if (rutaMinuscula.includes("\\boda\\")) {
        return "img/Peinados/Boda/" + nombreArchivo;
    }

    if (rutaMinuscula.includes("\\social\\")) {
        return "img/Peinados/Social/" + nombreArchivo;
    }

    if (rutaMinuscula.includes("\\xv\\")) {
        return "img/Peinados/XV/" + nombreArchivo;
    }

    console.error("Ruta de imagen no reconocida:", ruta);

    return "";
}


// SELECCIONAR SERVICIO

function seleccionarServicio(servicio) {

    localStorage.setItem(
        "servicioSeleccionado",
        JSON.stringify(servicio)
    );


    window.location.href =
        "agendar-cita.html";
}
