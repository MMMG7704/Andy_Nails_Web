// IMÁGENES DE UÑAS

const imagenesUnas = [
    "img/unas/Ballerina/B1.jpeg",
    "img/unas/Ballerina/B2.jpeg",
    "img/unas/Ballerina/B3.jpeg",
    "img/unas/Ballerina/B4.jpeg",
    "img/unas/Francesa/fr1.jpeg",
    "img/unas/Francesa/fr2.jpg",
    "img/unas/Francesa/fr3.jpg",
    "img/unas/Cuadradas/c1.jpeg",
    "img/unas/Cuadradas/c2.jpeg",
    "img/unas/Cuadradas/c3.jpeg",
    "img/unas/Cuadradas/c4.jpeg"
];


// IMÁGENES DE MAQUILLAJE

const imagenesMaquillaje = [
    "img/Maquillaje/Boda/B1.jpg",
    "img/Maquillaje/Boda/B2.jpeg",
    "img/Maquillaje/Boda/B3.jpeg",
    "img/Maquillaje/Boda/B4.jpeg",
    "img/Maquillaje/Boda/B5.jpeg",
    "img/Maquillaje/Social/S1.jpg",
    "img/Maquillaje/Social/S2.jpeg",
    "img/Maquillaje/Social/S3.jpeg",
    "img/Maquillaje/Social/S4.jpeg",
    "img/Maquillaje/xv/x1.jpeg",
    "img/Maquillaje/xv/x2.jpeg",
    "img/Maquillaje/xv/x3.jpeg",
    "img/Maquillaje/xv/x4.jpeg"
];


// IMÁGENES DE PEINADOS

const imagenesPeinados = [
    "img/Peinados/Boda/B1.jpeg",
    "img/Peinados/Boda/B2.jpeg",
    "img/Peinados/Boda/B3.jpeg",
    "img/Peinados/Boda/B4.jpeg",
    "img/Peinados/Social/S1.jpeg",
    "img/Peinados/Social/S2.jpeg",
    "img/Peinados/Social/S3.jpeg",
    "img/Peinados/XV/XV1.jpeg",
    "img/Peinados/XV/XV2.jpeg",
    "img/Peinados/XV/XV3.jpeg",
    "img/Peinados/XV/XV4.jpeg"
];


// ÍNDICES

let indiceUnas = 0;
let indiceMaquillaje = 0;
let indicePeinados = 0;


// CAMBIAR IMAGEN DE UÑAS

function cambiarUnas() {

    indiceUnas++;

    if (indiceUnas >= imagenesUnas.length) {
        indiceUnas = 0;
    }

    document.getElementById("imagenUnas").src =
        imagenesUnas[indiceUnas];
}


// CAMBIAR IMAGEN DE MAQUILLAJE

function cambiarMaquillaje() {

    indiceMaquillaje++;

    if (indiceMaquillaje >= imagenesMaquillaje.length) {
        indiceMaquillaje = 0;
    }

    document.getElementById("imagenMaquillaje").src =
        imagenesMaquillaje[indiceMaquillaje];
}


// CAMBIAR IMAGEN DE PEINADOS

function cambiarPeinados() {

    indicePeinados++;

    if (indicePeinados >= imagenesPeinados.length) {
        indicePeinados = 0;
    }

    document.getElementById("imagenPeinados").src =
        imagenesPeinados[indicePeinados];
}


// CAMBIO AUTOMÁTICO

// Uñas: cada 3 segundos
setInterval(cambiarUnas, 3000);

// Maquillaje: cada 3.5 segundos
setInterval(cambiarMaquillaje, 3500);

// Peinados: cada 4 segundos
setInterval(cambiarPeinados, 4000);