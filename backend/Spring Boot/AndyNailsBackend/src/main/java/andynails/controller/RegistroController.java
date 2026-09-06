package andynails.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

//import java.nio.charset.StandardCharsets;
//import java.security.NoSuchAlgorithmException;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class RegistroController {

    @Autowired
    private JdbcTemplate jdbcTemplate;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder(12);

    @PostMapping("/registro")
    public Map<String, Object> registrar(@RequestBody RegistroRequest datos) {

        try {

            // VALIDAR CAMPOS VACÍOS

            if (datos.getNombre() == null ||
                    datos.getPaterno() == null ||
                    datos.getMaterno() == null ||
                    datos.getTelefono() == null ||
                    datos.getCorreo() == null ||
                    datos.getContraseña() == null ||
                    datos.getConfirmarContraseña() == null) {

                return Map.of(
                        "success", false,
                        "message", "Todos los campos son obligatorios.");
            }

            // LIMPIAR DATOS

            String nombre = datos.getNombre().trim();
            String paterno = datos.getPaterno().trim();
            String materno = datos.getMaterno().trim();
            String telefono = datos.getTelefono().trim();
            String correo = datos.getCorreo().trim();
            String contraseña = datos.getContraseña().trim();
            String confirmarContraseña = datos.getConfirmarContraseña().trim();

            // VALIDAR NOMBRE Y APELLIDOS

            String regexNombre = "^[a-zA-ZáéíóúÁÉÍÓÚñÑ\\s]+$";

            if (!nombre.matches(regexNombre) ||
                    !paterno.matches(regexNombre) ||
                    !materno.matches(regexNombre)) {

                return Map.of(
                        "success", false,
                        "message",
                        "Los nombres y apellidos solo pueden contener letras.");
            }

            // VALIDAR TELÉFONO

            if (!telefono.matches("\\d+")) {

                return Map.of(
                        "success", false,
                        "message",
                        "El teléfono solo puede contener números.");
            }

            // VALIDAR LONGITUDES

            if (nombre.length() > 10 ||
                    paterno.length() > 10 ||
                    materno.length() > 10) {

                return Map.of(
                        "success", false,
                        "message",
                        "Los nombres y apellidos no pueden superar 10 caracteres.");
            }

            if (telefono.length() > 10) {

                return Map.of(
                        "success", false,
                        "message",
                        "El teléfono no puede superar 10 dígitos.");
            }

            if (correo.length() > 35) {

                return Map.of(
                        "success", false,
                        "message",
                        "El correo no puede superar 35 caracteres.");
            }

            if (contraseña.length() > 15) {

                return Map.of(
                        "success", false,
                        "message",
                        "La contraseña no puede superar 15 caracteres.");
            }

            // CONFIRMAR CONTRASEÑA

            if (!contraseña.equals(confirmarContraseña)) {

                return Map.of(
                        "success", false,
                        "message",
                        "Las contraseñas no coinciden.");
            }

            // COMPROBAR CORREO

            String sqlCorreo = "SELECT COUNT(*) FROM Usuarios WHERE Correo = ?";

            Integer cantidad = jdbcTemplate.queryForObject(
                    sqlCorreo,
                    Integer.class,
                    correo);

            if (cantidad != null && cantidad > 0) {

                return Map.of(
                        "success", false,
                        "message",
                        "El correo electrónico ya está registrado.");
            }

            // CIFRAR CONTRASEÑA

            String contraseñaCifrada = passwordEncoder.encode(contraseña);

            // TIPO DE USUARIO

            int tipoUsuario = 2;

            // INSERTAR USUARIO

            String sql = """
                    INSERT INTO Usuarios
                    (
                        Tipo_Usuario_idTipo_Usuario,
                        Nombre,
                        Paterno,
                        Materno,
                        Telefono,
                        Correo,
                        Contraseña
                    )
                    VALUES (?, ?, ?, ?, ?, ?, ?)
                    """;

            jdbcTemplate.update(
                    sql,
                    tipoUsuario,
                    nombre,
                    paterno,
                    materno,
                    telefono,
                    correo,
                    contraseñaCifrada);

            // REGISTRO EXITOSO

            return Map.of(
                    "success", true,
                    "message", "Usuario registrado correctamente.");

        } catch (Exception e) {

            e.printStackTrace();

            return Map.of(
                    "success", false,
                    "message",
                    "Ocurrió un error al registrar el usuario.");
        }
    }

    // OBJETO PARA RECIBIR DATOS

    public static class RegistroRequest {

        private String nombre;
        private String paterno;
        private String materno;
        private String telefono;
        private String correo;
        private String contraseña;
        private String confirmarContraseña;

        public String getNombre() {
            return nombre;
        }

        public void setNombre(String nombre) {
            this.nombre = nombre;
        }

        public String getPaterno() {
            return paterno;
        }

        public void setPaterno(String paterno) {
            this.paterno = paterno;
        }

        public String getMaterno() {
            return materno;
        }

        public void setMaterno(String materno) {
            this.materno = materno;
        }

        public String getTelefono() {
            return telefono;
        }

        public void setTelefono(String telefono) {
            this.telefono = telefono;
        }

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

        public String getConfirmarContraseña() {
            return confirmarContraseña;
        }

        public void setConfirmarContraseña(
                String confirmarContraseña) {

            this.confirmarContraseña = confirmarContraseña;
        }
    }
}