package andynails.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class ServicioController {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @GetMapping("/servicios")
    public List<Map<String, Object>> obtenerServicios() {

        String sql = """
                SELECT
                    idServicios,
                    Nombre_servicio,
                    Descripcion,
                    Precio
                FROM Servicios
                ORDER BY idServicios
                """;

        return jdbcTemplate.queryForList(sql);
    }
}