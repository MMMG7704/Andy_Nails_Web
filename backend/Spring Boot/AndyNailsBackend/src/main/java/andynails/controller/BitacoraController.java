
package andynails.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/bitacora")
@CrossOrigin(origins = "*")
public class BitacoraController {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    /* CONSULTAR REGISTROS DE LA BITÁCORA */

    @GetMapping
    public List<Map<String, Object>> obtenerRegistros() {

        String sql = """
                SELECT
                    b.idBitacora,
                    b.FechaHora,
                    b.idUsuarioAdministrador,
                    u.Nombre,
                    u.Paterno,
                    u.Materno,
                    b.Accion,
                    b.Descripcion
                FROM Bitacora_Administrativa b
                LEFT JOIN Usuarios u
                    ON b.idUsuarioAdministrador = u.idUsuarios
                ORDER BY b.FechaHora DESC, b.idBitacora DESC
                """;

        return jdbcTemplate.queryForList(sql);
    }

    /* GUARDAR UNA ACCIÓN EN LA BITÁCORA */

    public void registrarAccion(
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
}