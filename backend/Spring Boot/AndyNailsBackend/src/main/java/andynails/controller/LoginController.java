package andynails.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

//import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class LoginController {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    // BCrypt con salt 12
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder(12);

    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody LoginRequest datos) {

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
                    t.Nombre AS tipoUsuario
                FROM Usuarios u
                INNER JOIN Tipo_Usuario t
                    ON u.Tipo_Usuario_idTipo_Usuario = t.idTipo_Usuario
                WHERE u.Correo = ?
                """;

        try {

            Map<String, Object> usuario = jdbcTemplate.queryForMap(
                    sql,
                    datos.getCorreo());

            // Contraseña guardada en la base de datos
            String contraseñaGuardada = (String) usuario.get("Contraseña");

            // Comparamos la contraseña escrita con BCrypt
            if (passwordEncoder.matches(
                    datos.getContraseña(),
                    contraseñaGuardada)) {

                // No enviamos la contraseña al frontend
                usuario.remove("Contraseña");

                return Map.of(
                        "success", true,
                        "message", "Inicio de sesión exitoso",
                        "usuario", usuario);
            }

            return Map.of(
                    "success", false,
                    "message", "Correo o contraseña incorrectos");

        } catch (Exception e) {

            e.printStackTrace();

            return Map.of(
                    "success", false,
                    "message", "Correo o contraseña incorrectos");
        }
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
}