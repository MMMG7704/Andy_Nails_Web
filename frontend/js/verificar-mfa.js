
document.getElementById("mfaForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    const codigo = document.getElementById("codigo").value.trim();
    const mensaje = document.getElementById("mensaje");
    const boton = event.submitter;

    const identificadorMfa = sessionStorage.getItem("identificadorMfa");

    if (!identificadorMfa) {
        mensaje.textContent = "La solicitud expiró. Inicia sesión nuevamente.";
        return;
    }

    if (!/^\d{6}$/.test(codigo)) {
        mensaje.textContent = "Ingresa un código válido de seis dígitos.";
        return;
    }

    try {
        if (boton) boton.disabled = true;

        const respuesta = await fetch("http://localhost:8080/api/login/verificar-mfa", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                identificadorMfa: identificadorMfa,
                codigo: codigo
            })
        });

        const datos = await respuesta.json();

        if (!respuesta.ok || !datos.success) {
            mensaje.textContent = datos.message || "No se pudo verificar el código.";
            return;
        }

        if (!datos.token || !datos.usuario) {
            mensaje.textContent = "El servidor no devolvió la sesión esperada.";
            return;
        }

        sessionStorage.removeItem("identificadorMfa");

        localStorage.setItem("usuario", JSON.stringify(datos.usuario));
        localStorage.setItem("token", datos.token);

        function redireccionarUsuario() {
            const rol = Number(datos.usuario.Tipo_Usuario_idTipo_Usuario);

            if (rol === 1) {
                window.location.href = "admin.html";
            } else if (rol === 2) {
                window.location.href = "cliente.html";
            } else {
                window.location.href = "recep.html";
            }
        }

        if (datos.avisoRol && datos.avisoRol.trim() !== "") {
            sessionStorage.setItem("avisoRolPendiente", datos.avisoRol);
        }

        mensaje.textContent = "Verificación correcta. Entrando...";
        redireccionarUsuario();

    } catch (error) {
        console.error("Error al verificar MFA:", error);
        mensaje.textContent = "No se pudo conectar con el servidor.";
    } finally {
        if (boton) boton.disabled = false;
    }
});
