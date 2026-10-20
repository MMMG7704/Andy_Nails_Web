package andynails.controller;

import andynails.MfaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin(origins = "*")
public class UsuarioController {

        @Autowired
        private JdbcTemplate jdbcTemplate;

        private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder(12);

        /* BUSCAR USUARIO POR ID */

        @GetMapping("/id/{idUsuario}")
        public Map<String, Object> obtenerUsuario(
                        @PathVariable Integer idUsuario) {

                String sql = """
                                SELECT
                                    u.idUsuarios,
                                    u.Tipo_Usuario_idTipo_Usuario,
                                    u.Nombre,
                                    u.Materno,
                                    u.Paterno,
                                    u.Telefono,
                                    u.Correo,
                                    u.fecha_registro,
                                    t.Nombre AS tipoUsuario
                                FROM Usuarios u
                                INNER JOIN Tipo_Usuario t
                                    ON u.Tipo_Usuario_idTipo_Usuario =
                                       t.idTipo_Usuario
                                WHERE u.idUsuarios = ?
                                """;

                return jdbcTemplate.queryForMap(
                                sql,
                                idUsuario);
        }

        @Autowired
        private MfaService mfaService;
        /* BUSCAR TODOS LOS USUARIOS */

        @GetMapping
        public List<Map<String, Object>> obtenerUsuarios() {

                String sql = """
                                SELECT
                                    u.idUsuarios,
                                    u.Tipo_Usuario_idTipo_Usuario,
                                    u.Nombre,
                                    u.Paterno,
                                    u.Materno,
                                    u.Telefono,
                                    u.Correo,
                                    u.Estado,
                                    u.fecha_registro,
                                    t.Nombre AS tipoUsuario
                                FROM Usuarios u
                                INNER JOIN Tipo_Usuario t
                                    ON u.Tipo_Usuario_idTipo_Usuario =
                                       t.idTipo_Usuario
                                ORDER BY u.idUsuarios ASC
                                """;

                return jdbcTemplate.queryForList(sql);
        }

        /* BUSCAR TODOS LOS CLIENTES */

        @GetMapping("/clientes")
        public List<Map<String, Object>> obtenerClientes() {

                String sql = """
                                SELECT
                                    u.idUsuarios,
                                    u.Nombre,
                                    u.Paterno,
                                    u.Materno,
                                    u.Telefono,
                                    u.Correo
                                FROM Usuarios u
                                INNER JOIN Tipo_Usuario t
                                    ON u.Tipo_Usuario_idTipo_Usuario =
                                       t.idTipo_Usuario
                                WHERE t.Nombre = 'Cliente'
                                ORDER BY u.Nombre ASC
                                """;

                return jdbcTemplate.queryForList(sql);
        }

        /* BUSCAR TODOS LOS ROLES */

        @GetMapping("/roles")
        public List<Map<String, Object>> obtenerRoles() {

                String sql = """
                                SELECT
                                    idTipo_Usuario,
                                    Nombre
                                FROM Tipo_Usuario
                                ORDER BY Nombre ASC
                                """;

                return jdbcTemplate.queryForList(sql);
        }

        /* CREAR NUEVO USUARIO */

        @PostMapping
        @ResponseStatus(HttpStatus.CREATED)
        public Map<String, Object> crearUsuario(
                        @RequestBody Map<String, Object> datos) {

                try {

                        String nombre = (String) datos.get("Nombre");

                        String paterno = (String) datos.get("Paterno");

                        String materno = (String) datos.get("Materno");

                        String telefono = (String) datos.get("Telefono");

                        String correo = (String) datos.get("Correo");

                        String contraseña = (String) datos.get("Contraseña");

                        Integer tipoUsuario = ((Number) datos.get(
                                        "Tipo_Usuario_idTipo_Usuario")).intValue();

                        if (nombre == null ||
                                        nombre.trim().isEmpty() ||

                                        correo == null ||
                                        correo.trim().isEmpty() ||

                                        contraseña == null ||
                                        contraseña.isEmpty() ||

                                        tipoUsuario == null) {

                                return Map.of(
                                                "mensaje",
                                                "Completa los campos obligatorios.");

                        }

                        /* VERIFICAR CORREO */

                        String sqlCorreo = """
                                        SELECT COUNT(*)
                                        FROM Usuarios
                                        WHERE Correo = ?
                                        """;

                        Integer existe = jdbcTemplate.queryForObject(
                                        sqlCorreo,
                                        Integer.class,
                                        correo);

                        if (existe != null &&
                                        existe > 0) {

                                return Map.of(
                                                "mensaje",
                                                "El correo ya está registrado.");

                        }

                        /* GENERAR HASH BCRYPT */

                        String contraseñaHash = passwordEncoder.encode(
                                        contraseña);

                        /* INSERTAR USUARIO */

                        String sql = """
                                        INSERT INTO Usuarios (
                                            Tipo_Usuario_idTipo_Usuario,
                                            Nombre,
                                            Paterno,
                                            Materno,
                                            Telefono,
                                            Correo,
                                            Contraseña,
                                            fecha_registro,
                                            Estado
                                        )
                                        VALUES (?, ?, ?, ?, ?, ?, ?, CURDATE(), 'Activo')
                                        """;

                        jdbcTemplate.update(
                                        sql,
                                        tipoUsuario,
                                        nombre,
                                        paterno,
                                        materno,
                                        telefono,
                                        correo,
                                        contraseñaHash);
                        registrarAccion(
                                        null,
                                        "Creación de usuario",
                                        "Se registró un usuario con el rol ID: " + tipoUsuario);

                        return Map.of(
                                        "mensaje",
                                        "Usuario registrado correctamente.");

                } catch (Exception error) {

                        error.printStackTrace();

                        return Map.of(
                                        "mensaje",
                                        "Ocurrió un error al registrar el usuario.");

                }

        }

        /* CAMBIAR ROL */
        @PutMapping("/{idUsuario}/rol")
        public Map<String, Object> cambiarRol(
                        @PathVariable Integer idUsuario,
                        @RequestBody Map<String, Object> datos) {

                try {

                        Integer nuevoRol = ((Number) datos.get("idTipoUsuario")).intValue();
                        Integer idAdministrador = datos.get("idAdministrador") instanceof Number
                                        ? ((Number) datos.get("idAdministrador")).intValue()
                                        : null;

                        /* BUSCAR ROL ACTUAL */
                        String sqlRolActual = """
                                        SELECT Tipo_Usuario_idTipo_Usuario
                                        FROM Usuarios
                                        WHERE idUsuarios = ?
                                        """;

                        Integer rolActual = jdbcTemplate.queryForObject(
                                        sqlRolActual,
                                        Integer.class,
                                        idUsuario);

                        if (rolActual == null) {
                                return Map.of("mensaje", "No se encontró el usuario.");
                        }

                        /* VERIFICAR SI EL ROL ES EL MISMO */
                        if (rolActual.equals(nuevoRol)) {
                                return Map.of("mensaje", "El usuario ya tiene ese rol.");
                        }

                        /* BUSCAR NOMBRE DEL NUEVO ROL */
                        String sqlRolNombre = """
                                        SELECT Nombre
                                        FROM Tipo_Usuario
                                        WHERE idTipo_Usuario = ?
                                        """;

                        String nombreRol = jdbcTemplate.queryForObject(
                                        sqlRolNombre,
                                        String.class,
                                        nuevoRol);

                        if (nombreRol == null) {
                                return Map.of("mensaje", "El rol seleccionado no existe.");
                        }

                        /* CREAR AVISO */
                        String aviso = "Tu rol ha sido actualizado a " + nombreRol + ".";

                        /* ACTUALIZAR ROL Y AVISO */
                        String sql = """
                                        UPDATE Usuarios
                                        SET Tipo_Usuario_idTipo_Usuario = ?,
                                            aviso_rol = ?
                                        WHERE idUsuarios = ?
                                        """;

                        int filas = jdbcTemplate.update(
                                        sql,
                                        nuevoRol,
                                        aviso,
                                        idUsuario);

                        if (filas == 0) {
                                return Map.of("mensaje", "No se encontró el usuario.");
                        }
                        String nombreUsuario = obtenerNombreUsuario(idUsuario);

                        registrarAccion(
                                        idAdministrador,
                                        "Cambio de rol",
                                        "Se cambió el rol de " + nombreUsuario
                                                        + " al rol: " + nombreRol);

                        return Map.of(
                                        "mensaje", "Rol actualizado correctamente.",
                                        "aviso", aviso);

                } catch (Exception error) {

                        error.printStackTrace();

                        return Map.of(
                                        "mensaje",
                                        "Ocurrió un error al actualizar el rol.");
                }

        }

        /* CAMBIAR ESTADO */

        @PutMapping("/{idUsuario}/estado")
        public Map<String, Object> cambiarEstado(
                        @PathVariable Integer idUsuario,
                        @RequestBody Map<String, Object> datos) {

                try {

                        String nuevoEstado = (String) datos.get("estado");
                        Integer idAdministrador = datos.get("idAdministrador") instanceof Number
                                        ? ((Number) datos.get("idAdministrador")).intValue()
                                        : null;

                        if (nuevoEstado == null ||
                                        (!nuevoEstado.equals("Activo") &&
                                                        !nuevoEstado.equals("Inactivo"))) {

                                return Map.of(
                                                "mensaje",
                                                "El estado seleccionado no es válido.");
                        }

                        String sql = """
                                        UPDATE Usuarios
                                        SET Estado = ?
                                        WHERE idUsuarios = ?
                                        """;

                        int filas = jdbcTemplate.update(
                                        sql,
                                        nuevoEstado,
                                        idUsuario);

                        if (filas == 0) {

                                return Map.of(
                                                "mensaje",
                                                "No se encontró el usuario.");

                        }
                        String nombreUsuario = obtenerNombreUsuario(idUsuario);

                        registrarAccion(
                                        idAdministrador,
                                        "Cambio de estado",
                                        "Se actualizó el estado de " + nombreUsuario
                                                        + " a " + nuevoEstado);

                        return Map.of(
                                        "mensaje",
                                        "Estado actualizado correctamente.");

                } catch (Exception error) {

                        error.printStackTrace();

                        return Map.of(
                                        "mensaje",
                                        "Ocurrió un error al actualizar el estado.");
                }
        }

        /* ACTUALIZAR PERFIL DEL USUARIO */
        @PutMapping("/{idUsuario}/perfil")
        public Map<String, Object> actualizarPerfil(
                        @PathVariable Integer idUsuario,
                        @RequestBody Map<String, Object> datos) {

                try {

                        /* VERIFICAR MFA */
                        if (!mfaService.usuarioEstaVerificado(idUsuario)) {

                                return Map.of(
                                                "mensaje",
                                                "Debes verificar tu identidad con el código enviado a tu correo.");
                        }

                        String nombre = (String) datos.get("Nombre");
                        String paterno = (String) datos.get("Paterno");
                        String materno = (String) datos.get("Materno");
                        String telefono = (String) datos.get("Telefono");
                        String correo = (String) datos.get("Correo");

                        if (nombre == null || nombre.trim().isEmpty()) {
                                return Map.of(
                                                "mensaje",
                                                "El nombre es obligatorio.");
                        }

                        if (correo == null || correo.trim().isEmpty()) {
                                return Map.of(
                                                "mensaje",
                                                "El correo es obligatorio.");
                        }

                        /* VERIFICAR QUE EL CORREO NO LO TENGA OTRO USUARIO */
                        String sqlCorreo = """
                                        SELECT COUNT(*)
                                        FROM Usuarios
                                        WHERE Correo = ?
                                        AND idUsuarios <> ?
                                        """;

                        Integer existeCorreo = jdbcTemplate.queryForObject(
                                        sqlCorreo,
                                        Integer.class,
                                        correo,
                                        idUsuario);

                        if (existeCorreo != null && existeCorreo > 0) {
                                return Map.of(
                                                "mensaje",
                                                "El correo ya está registrado por otro usuario.");
                        }

                        /* ACTUALIZAR DATOS */
                        String sql = """
                                        UPDATE Usuarios
                                        SET Nombre = ?,
                                            Paterno = ?,
                                            Materno = ?,
                                            Telefono = ?,
                                            Correo = ?
                                        WHERE idUsuarios = ?
                                        """;

                        int filas = jdbcTemplate.update(
                                        sql,
                                        nombre,
                                        paterno,
                                        materno,
                                        telefono,
                                        correo,
                                        idUsuario);

                        if (filas == 0) {
                                return Map.of(
                                                "mensaje",
                                                "No se encontró el usuario.");
                        }

                        /* QUITAR LA VERIFICACIÓN DESPUÉS DE USARLA */
                        mfaService.quitarVerificacion(idUsuario);

                        return Map.of(
                                        "mensaje",
                                        "Perfil actualizado correctamente.");

                } catch (Exception error) {

                        error.printStackTrace();

                        return Map.of(
                                        "mensaje",
                                        "Ocurrió un error al actualizar el perfil.");
                }
        }

        /* REGISTRAR ACCIONES ADMINISTRATIVAS */

        private void registrarAccion(
                        Integer idAdministrador,
                        String accion,
                        String descripcion) {

                String sql = """
                                INSERT INTO Bitacora_Administrativa (
                                    idUsuarioAdministrador,
                                    Accion,
                                    Descripcion
                                )
                                VALUES (?, ?, ?)
                                """;

                jdbcTemplate.update(
                                sql,
                                idAdministrador,
                                accion,
                                descripcion);
        }

        private String obtenerNombreUsuario(Integer idUsuario) {
                return jdbcTemplate.query(
                                """
                                                SELECT CONCAT_WS(' ', Nombre, Paterno, Materno)
                                                FROM Usuarios
                                                WHERE idUsuarios = ?
                                                """,
                                rs -> rs.next() ? rs.getString(1) : "Usuario no encontrado",
                                idUsuario);
        }

}