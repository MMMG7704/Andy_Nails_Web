package andynails.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.List;

@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin(origins = "*")
public class UsuarioController {

    @Autowired
    private JdbcTemplate jdbcTemplate;

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
                    t.Nombre AS tipoUsuario
                FROM Usuarios u
                INNER JOIN Tipo_Usuario t
                    ON u.Tipo_Usuario_idTipo_Usuario = t.idTipo_Usuario
                WHERE u.idUsuarios = ?
                """;

        return jdbcTemplate.queryForMap(sql, idUsuario);
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
                    ON u.Tipo_Usuario_idTipo_Usuario = t.idTipo_Usuario
                WHERE t.Nombre = 'Cliente'
                ORDER BY u.Nombre ASC
                """;

        return jdbcTemplate.queryForList(sql);
    }

}