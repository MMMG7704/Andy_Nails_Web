document.getElementById("loginForm").addEventListener("submit", async function (event) {

    event.preventDefault();

    const correo = document.getElementById("correo").value.trim();
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

        if (respuesta.ok && datos.success) {

            // SOLO LOS CLIENTES NECESITAN MFA
            if (datos.mfaRequired && datos.identificadorMfa) {
                sessionStorage.setItem(
                    "identificadorMfa",
                    datos.identificadorMfa
                );

                window.location.href = "verificar-mfa.html";
                return;
            }

            // ACCESO DIRECTO PARA ADMINISTRADORA Y RECEPCIONISTA
            if (datos.usuario && datos.token) {

                localStorage.setItem(
                    "usuario",
                    JSON.stringify(datos.usuario)
                );

                localStorage.setItem("token", datos.token);

                const rol = Number(
                    datos.usuario.Tipo_Usuario_idTipo_Usuario
                );

                function redireccionarUsuario() {
                    if (rol === 1) {
                        window.location.href = "admin.html";
                    } else if (rol === 2) {
                        window.location.href = "cliente.html";
                    } else if (rol === 3) {
                        window.location.href = "recep.html";
                    } else {
                        mensaje.textContent = "El usuario no tiene un rol válido.";
                    }
                }

                // AVISO DE CAMBIO DE ROL
                if (datos.avisoRol && datos.avisoRol.trim() !== "") {

                    const modalAviso = document.getElementById("modalAvisoRol");
                    const textoAviso = document.getElementById("textoAvisoRol");
                    const btnAceptar = document.getElementById("btnAceptarAviso");

                    if (modalAviso && textoAviso && btnAceptar) {
                        textoAviso.textContent = datos.avisoRol;
                        modalAviso.style.display = "flex";

                        btnAceptar.onclick = function () {
                            modalAviso.style.display = "none";
                            redireccionarUsuario();
                        };
                    } else {
                        redireccionarUsuario();
                    }

                } else {
                    redireccionarUsuario();
                }

            } else {
                mensaje.textContent = "El servidor no devolvió los datos de la sesión.";
            }

        } else {
            mensaje.textContent = datos.message || "No se pudo iniciar sesión.";
        }

    } catch (error) {
        console.error("ERROR:", error);
        mensaje.textContent = "No se pudo conectar con el servidor.";
    }

});