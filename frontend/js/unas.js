const API_URL = "http://localhost:8080/api/catalogo/1";

let listaBallerina = [];
let listaFrancesa = [];
let listaCuadradas = [];

let indiceBallerina = 0;
let indiceFrancesa = 0;
let indiceCuadradas = 0;


// INICIAR CUANDO CARGUE LA PÁGINA

document.addEventListener("DOMContentLoaded", cargarUnas);


// CARGAR DATOS DESDE SPRING BOOT

async function cargarUnas() {

    try {

        const respuesta = await fetch(API_URL);

        if (!respuesta.ok) {
            throw new Error("No se pudo conectar con el servidor");
        }

        const servicios = await respuesta.json();

        console.log("Servicios de uñas:", servicios);


        // Limpiar listas
        listaBallerina = [];
        listaFrancesa = [];
        listaCuadradas = [];


        // Separar por categoría
        servicios.forEach(servicio => {

            const categoria = String(servicio.Nombre_categoria)
                .trim()
                .toLowerCase();

            if (categoria === "ballerina") {

                listaBallerina.push(servicio);

            } else if (categoria === "francesa") {

                listaFrancesa.push(servicio);

            } else if (categoria === "cuadradas") {

                listaCuadradas.push(servicio);
            }

        });


        console.log("Ballerina:", listaBallerina);
        console.log("Francesa:", listaFrancesa);
        console.log("Cuadradas:", listaCuadradas);


        // Mostrar primera imagen

        if (listaBallerina.length > 0) {
            mostrarBallerina(listaBallerina[0]);
        }

        if (listaFrancesa.length > 0) {
            mostrarFrancesa(listaFrancesa[0]);
        }

        if (listaCuadradas.length > 0) {
            mostrarCuadradas(listaCuadradas[0]);
        }


        // Iniciar carruseles
        iniciarCarruseles();


    } catch (error) {

        console.error("Error:", error);

        const catalogo = document.querySelector(".catalogo");

        if (catalogo) {

            catalogo.innerHTML = `
                <p class="error">
                    No se pudo cargar el catálogo de uñas.
                </p>
            `;
        }
    }
}


// MOSTRAR BALLERINA

function mostrarBallerina(servicio) {

    document.getElementById("imgBallerina").src =
        obtenerImagen(servicio.Imagen_Archivo);

    document.getElementById("nombreBallerina").textContent =
        servicio.Nombre_categoria;

    document.getElementById("descBallerina").textContent =
        servicio.Descripcion;

    document.getElementById("precioBallerina").textContent =
        "$" + Number(servicio.Precio).toFixed(2);


    document.getElementById("btnBallerina").onclick = function () {

        seleccionarServicio(servicio);

    };
}


// MOSTRAR FRANCESA

function mostrarFrancesa(servicio) {

    document.getElementById("imgFrancesa").src =
        obtenerImagen(servicio.Imagen_Archivo);

    document.getElementById("nombreFrancesa").textContent =
        servicio.Nombre_categoria;

    document.getElementById("descFrancesa").textContent =
        servicio.Descripcion;

    document.getElementById("precioFrancesa").textContent =
        "$" + Number(servicio.Precio).toFixed(2);


    document.getElementById("btnFrancesa").onclick = function () {

        seleccionarServicio(servicio);

    };
}


// MOSTRAR CUADRADAS

function mostrarCuadradas(servicio) {

    document.getElementById("imgCuadradas").src =
        obtenerImagen(servicio.Imagen_Archivo);

    document.getElementById("nombreCuadradas").textContent =
        servicio.Nombre_categoria;

    document.getElementById("descCuadradas").textContent =
        servicio.Descripcion;

    document.getElementById("precioCuadradas").textContent =
        "$" + Number(servicio.Precio).toFixed(2);


    document.getElementById("btnCuadradas").onclick = function () {

        seleccionarServicio(servicio);

    };
}


// CARRUSELES

function iniciarCarruseles() {

    // BALLERINA
    setInterval(() => {

        if (listaBallerina.length > 0) {

            indiceBallerina =
                (indiceBallerina + 1) %
                listaBallerina.length;

            mostrarBallerina(
                listaBallerina[indiceBallerina]
            );
        }

    }, 4000);


    // FRANCESA
    setInterval(() => {

        if (listaFrancesa.length > 0) {

            indiceFrancesa =
                (indiceFrancesa + 1) %
                listaFrancesa.length;

            mostrarFrancesa(
                listaFrancesa[indiceFrancesa]
            );
        }

    }, 4000);


    // CUADRADAS
    setInterval(() => {

        if (listaCuadradas.length > 0) {

            indiceCuadradas =
                (indiceCuadradas + 1) %
                listaCuadradas.length;

            mostrarCuadradas(
                listaCuadradas[indiceCuadradas]
            );
        }

    }, 4000);
}


// CONVERTIR RUTA DE WINDOWS

function obtenerImagen(ruta) {

    if (!ruta) {
        return "";
    }

    const nombreArchivo =
        ruta.split("\\").pop();


    const rutaMinuscula =
        ruta.toLowerCase();


    if (rutaMinuscula.includes("\\ballerina\\")) {

        return "img/unas/Ballerina/" +
            nombreArchivo;
    }


    if (rutaMinuscula.includes("\\francesa\\")) {

        return "img/unas/Francesa/" +
            nombreArchivo;
    }


    if (rutaMinuscula.includes("\\cuadradas\\")) {

        return "img/unas/Cuadradas/" +
            nombreArchivo;
    }


    console.error(
        "No se pudo determinar la carpeta de la imagen:",
        ruta
    );

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