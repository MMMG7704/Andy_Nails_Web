document.getElementById("registroForm").addEventListener("submit", async function (event) {

    event.preventDefault();

    const nombre = document.getElementById("nombre").value.trim();
    const paterno = document.getElementById("paterno").value.trim();
    const materno = document.getElementById("materno").value.trim();
    const telefono = document.getElementById("telefono").value.trim();
    const correo = document.getElementById("correo").value.trim();
    const contraseña = document.getElementById("contrasena").value.trim();
    const confirmarContraseña =
        document.getElementById("confirmarContrasena").value.trim();

    const mensaje = document.getElementById("mensaje");

    // VALIDAR NOMBRES

    const regexNombre =
        /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;

    if (!regexNombre.test(nombre) ||
        !regexNombre.test(paterno) ||
        !regexNombre.test(materno)) {

        mensaje.textContent =
            "Los nombres y apellidos solo pueden contener letras.";

        return;
    }

    // VALIDAR TELÉFONO


    if (!/^\d+$/.test(telefono)) {

        mensaje.textContent =
            "El teléfono solo puede contener números.";

        return;
    }

    // CONFIRMAR CONTRASEÑA

    if (contraseña !== confirmarContraseña) {

        mensaje.textContent =
            "Las contraseñas no coinciden.";

        return;
    }

    try {

        const respuesta = await fetch(
            "http://localhost:8080/api/registro",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({

                    nombre: nombre,
                    paterno: paterno,
                    materno: materno,
                    telefono: telefono,
                    correo: correo,
                    contraseña: contraseña,
                    confirmarContraseña: confirmarContraseña

                })
            }
        );

        const datos = await respuesta.json();

        if (datos.success) {

            mensaje.textContent =
                "¡Registro exitoso!";

            // Limpiar formulario
            document.getElementById("registroForm").reset();

            // Después de registrarse,
            // regresar al login
            setTimeout(() => {

                window.location.href = "login.html";

            }, 1500);

        } else {

            mensaje.textContent =
                datos.message;
        }

    } catch (error) {

        console.error("Error:", error);

        mensaje.textContent =
            "No se pudo conectar con el servidor.";
    }

});