document.getElementById("loginForm").addEventListener("submit", async function (event) {

    event.preventDefault();

    const correo = document.getElementById("correo").value;
    const contraseña = document.getElementById("contrasena").value;
    const mensaje = document.getElementById("mensaje");

    try {

        const respuesta = await fetch("http://localhost:8080/api/login", {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                correo: correo,
                contraseña: contraseña
            })
        });

        const datos = await respuesta.json();

        console.log("RESPUESTA DEL SERVIDOR:", datos);
        console.log("USUARIO:", datos.usuario);
        console.log(
            "TIPO:",
            datos.usuario?.Tipo_Usuario_idTipo_Usuario
        );


        if (datos.success) {

            mensaje.textContent = "Inicio de sesión exitoso";


            // Guardar usuario
            localStorage.setItem(
                "usuario",
                JSON.stringify(datos.usuario)
            );


            // REDIRECCIÓN SEGÚN EL USUARIO

            if (Number(datos.usuario.Tipo_Usuario_idTipo_Usuario) === 1) {

                // ADMIN
                console.log("ADMIN DETECTADO");

                window.location.href = "admin.html";


            } else if (Number(datos.usuario.Tipo_Usuario_idTipo_Usuario) === 2) {

                // CLIENTE
                console.log("CLIENTE DETECTADO");

                window.location.href = "cliente.html";


            } else {

                // RECEPCIONISTA
                console.log("RECEPCIONISTA DETECTADO");

                window.location.href = "index.html";
            }


        } else {

            mensaje.textContent = datos.message;
        }


    } catch (error) {

        console.error("ERROR:", error);

        mensaje.textContent =
            "No se pudo conectar con el servidor.";
    }

});