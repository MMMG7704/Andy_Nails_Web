
package andynails.controller;

import andynails.JwtService;
import andynails.MfaLoginService;
import andynails.MfaService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = {
        "http://localhost:5500",
        "http://127.0.0.1:5500"
})
public class LoginController {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Autowired
    private MfaService mfaService;

    @Autowired
    private MfaLoginService mfaLoginService;

    @Autowired
    private JwtService jwtService;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder(12);

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(
            @RequestBody LoginRequest datos) {

        try {
            if (datos.getCorreo() == null || datos.getContraseña() == null
                    || datos.getCorreo().isBlank()
                    || datos.getContraseña().isBlank()) {
                return respuesta(HttpStatus.BAD_REQUEST, false,
                        "Ingresa tu correo y contraseña.");
            }

            String sql = """
                    SELECT
                        u.idUsuarios,
                        u.Tipo_Usuario_idTipo_Usuario,
                        u.Nombre,
                        u.Materno,
                        u.Paterno,
                        u.Telefono,
                        u.Correo,
                        u.Contraseña,
                        u.Estado,
                        u.aviso_rol,
                        t.Nombre AS tipoUsuario
                    FROM Usuarios u
                    INNER JOIN Tipo_Usuario t
                        ON u.Tipo_Usuario_idTipo_Usuario = t.idTipo_Usuario
                    WHERE u.Correo = ?
                    """;

            Map<String, Object> usuario = jdbcTemplate.queryForMap(
                    sql, datos.getCorreo().trim());

            String estado = String.valueOf(usuario.get("Estado"));

            if (!"Activo".equalsIgnoreCase(estado)) {
                return respuesta(HttpStatus.FORBIDDEN, false,
                        "Tu usuario está inactivo. Contacta al administrador.");
            }

            String contraseñaGuardada = String.valueOf(usuario.get("Contraseña"));

            if (!passwordEncoder.matches(
                    datos.getContraseña(), contraseñaGuardada)) {
                return respuesta(HttpStatus.UNAUTHORIZED, false,
                        "Correo o contraseña incorrectos.");
            }

            int idUsuario = ((Number) usuario.get("idUsuarios")).intValue();

            int rol = ((Number) usuario.get(
                    "Tipo_Usuario_idTipo_Usuario")).intValue();

            // Administradora y recepcionista entran sin código MFA.
            if (rol != 2) {
                String token = jwtService.generarToken(idUsuario, rol);

                Object aviso = usuario.remove("aviso_rol");
                usuario.remove("Contraseña");
                usuario.remove("Estado");

                if (aviso != null && !String.valueOf(aviso).isBlank()) {
                    jdbcTemplate.update("""
                            UPDATE Usuarios
                            SET aviso_rol = NULL
                            WHERE idUsuarios = ?
                            """, idUsuario);
                }

                Map<String, Object> resultado = new HashMap<>();
                resultado.put("success", true);
                resultado.put("mfaRequired", false);
                resultado.put("usuario", usuario);
                resultado.put("token", token);
                resultado.put("avisoRol", aviso == null ? "" : aviso);

                return ResponseEntity.ok(resultado);
            }

            // Solo los clientes necesitan verificar el código.
            mfaService.enviarCodigo(
                    idUsuario,
                    String.valueOf(usuario.get("Correo")));

            String identificador = mfaLoginService.crearPendiente(idUsuario);

            Map<String, Object> resultado = new HashMap<>();
            resultado.put("success", true);
            resultado.put("mfaRequired", true);
            resultado.put("identificadorMfa", identificador);
            resultado.put("message",
                    "Te enviamos un código de verificación a tu correo.");

            return ResponseEntity.ok(resultado);

        } catch (org.springframework.dao.EmptyResultDataAccessException e) {
            return respuesta(HttpStatus.UNAUTHORIZED, false,
                    "Correo o contraseña incorrectos.");

        } catch (org.springframework.mail.MailException e) {
            System.err.println("ERROR AL ENVIAR CORREO MFA:");
            e.printStackTrace();

            return respuesta(HttpStatus.SERVICE_UNAVAILABLE, false,
                    "No se pudo enviar el código. Inténtalo más tarde.");

        } catch (Exception e) {
            return respuesta(HttpStatus.INTERNAL_SERVER_ERROR, false,
                    "Ocurrió un error al iniciar sesión.");
        }
    }

    @PostMapping("/login/verificar-mfa")
    public ResponseEntity<Map<String, Object>> verificarMfa(
            @RequestBody VerificacionRequest datos) {

        if (datos.getIdentificadorMfa() == null
                || datos.getCodigo() == null) {
            return respuesta(HttpStatus.BAD_REQUEST, false,
                    "Faltan datos para verificar el código.");
        }

        Integer idUsuario = mfaLoginService.obtenerUsuario(datos.getIdentificadorMfa());

        if (idUsuario == null) {
            return respuesta(HttpStatus.UNAUTHORIZED, false,
                    "La solicitud expiró. Inicia sesión nuevamente.");
        }

        boolean codigoCorrecto = mfaService.verificarCodigo(idUsuario, datos.getCodigo());

        if (!codigoCorrecto) {
            return respuesta(HttpStatus.UNAUTHORIZED, false,
                    "El código es incorrecto o expiró.");
        }

        try {
            Map<String, Object> usuario = jdbcTemplate.queryForMap("""
                    SELECT
                        u.idUsuarios,
                        u.Tipo_Usuario_idTipo_Usuario,
                        u.Nombre,
                        u.Materno,
                        u.Paterno,
                        u.Telefono,
                        u.Correo,
                        u.Estado,
                        u.aviso_rol,
                        t.Nombre AS tipoUsuario
                    FROM Usuarios u
                    INNER JOIN Tipo_Usuario t
                        ON u.Tipo_Usuario_idTipo_Usuario = t.idTipo_Usuario
                    WHERE u.idUsuarios = ?
                    """, idUsuario);

            int rol = ((Number) usuario.get(
                    "Tipo_Usuario_idTipo_Usuario")).intValue();

            if (rol != 2) {
                mfaLoginService.consumir(datos.getIdentificadorMfa());
                return respuesta(HttpStatus.UNAUTHORIZED, false,
                        "Esta verificación no corresponde a un cliente.");
            }

            if (!"Activo".equalsIgnoreCase(
                    String.valueOf(usuario.get("Estado")))) {
                mfaLoginService.consumir(datos.getIdentificadorMfa());
                return respuesta(HttpStatus.FORBIDDEN, false,
                        "Tu usuario está inactivo.");
            }

            String token = jwtService.generarToken(idUsuario, rol);

            Object aviso = usuario.remove("aviso_rol");
            usuario.remove("Estado");

            mfaLoginService.consumir(datos.getIdentificadorMfa());

            Map<String, Object> resultado = new HashMap<>();
            resultado.put("success", true);
            resultado.put("message", "Inicio de sesión exitoso");
            resultado.put("usuario", usuario);
            resultado.put("token", token);
            resultado.put("avisoRol", aviso == null ? "" : aviso);

            if (aviso != null && !String.valueOf(aviso).isBlank()) {
                jdbcTemplate.update("""
                        UPDATE Usuarios
                        SET aviso_rol = NULL
                        WHERE idUsuarios = ?
                        """, idUsuario);
            }

            return ResponseEntity.ok(resultado);

        } catch (Exception e) {
            mfaLoginService.consumir(datos.getIdentificadorMfa());
            return respuesta(HttpStatus.INTERNAL_SERVER_ERROR, false,
                    "No se pudo completar el inicio de sesión.");
        }
    }

    private ResponseEntity<Map<String, Object>> respuesta(
            HttpStatus estado, boolean success, String mensaje) {

        Map<String, Object> resultado = new HashMap<>();
        resultado.put("success", success);
        resultado.put("message", mensaje);

        return ResponseEntity.status(estado).body(resultado);
    }

    public static class LoginRequest {
        private String correo;
        private String contraseña;

        public String getCorreo() {
            return correo;
        }

        public void setCorreo(String correo) {
            this.correo = correo;
        }

        public String getContraseña() {
            return contraseña;
        }

        public void setContraseña(String contraseña) {
            this.contraseña = contraseña;
        }
    }

    public static class VerificacionRequest {
        private String identificadorMfa;
        private String codigo;

        public String getIdentificadorMfa() {
            return identificadorMfa;
        }

        public void setIdentificadorMfa(String identificadorMfa) {
            this.identificadorMfa = identificadorMfa;
        }

        public String getCodigo() {
            return codigo;
        }

        public void setCodigo(String codigo) {
            this.codigo = codigo;
        }
    }
}
