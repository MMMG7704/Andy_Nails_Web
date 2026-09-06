package andynails.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/catalogo")
@CrossOrigin(origins = "*")
public class CatalogoController {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @GetMapping("/{idServicio}")
    public List<Map<String, Object>> obtenerCatalogo(
            @PathVariable int idServicio) {

        String sql = """
                SELECT
                    idCategoria_Servicio,
                    idServicios,
                    Imagen_Archivo,
                    Nombre_categoria,
                    Descripcion,
                    Precio
                FROM categoria_servicio
                WHERE idServicios = ?
                ORDER BY idCategoria_Servicio
                """;

        return jdbcTemplate.queryForList(sql, idServicio);
    }
}