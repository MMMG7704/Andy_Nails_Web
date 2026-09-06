package andynails.controller;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

@Repository
public class CitaRepository {

    private final JdbcTemplate jdbcTemplate;

    public CitaRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public int guardar(Cita cita) {

        String sql = """
                INSERT INTO cita
                (idUsuarios, Fecha, Hora, Estado)
                VALUES (?, ?, ?, ?)
                """;

        return jdbcTemplate.update(
                sql,
                cita.getIdUsuarios(),
                cita.getFecha(),
                cita.getHora(),
                cita.getEstado());
    }

    public List<Map<String, Object>> obtenerCitasPorCliente(
            Integer idUsuario) {

        String sql = """
                SELECT
                    c.idCita,
                    c.idUsuarios,
                    c.Fecha,
                    c.Hora,
                    c.Estado,
                    c.Pago_idPago,

                    chs.idServicios,
                    chs.Monto_anticipo,

                    s.Nombre_servicio,
                    s.Descripcion,
                    s.Precio

                FROM cita c

                LEFT JOIN cita_has_servicios chs
                    ON c.idCita = chs.idCita

                LEFT JOIN servicios s
                    ON chs.idServicios = s.idServicios

                WHERE c.idUsuarios = ?

                ORDER BY c.Fecha ASC, c.Hora ASC
                """;

        return jdbcTemplate.queryForList(
                sql,
                idUsuario);
    }

    public List<Map<String, Object>> obtenerTodasLasCitas() {

        String sql = """
                SELECT
                    c.idCita,
                    c.idUsuarios,

                    u.Nombre,
                    u.Paterno,
                    u.Materno,

                    c.Fecha,
                    c.Hora,
                    c.Estado,
                    c.Pago_idPago,

                    chs.idServicios,
                    chs.Monto_anticipo,

                    s.Nombre_servicio,
                    s.Descripcion,
                    s.Precio

                FROM cita c

                INNER JOIN usuarios u
                    ON c.idUsuarios = u.idUsuarios

                LEFT JOIN cita_has_servicios chs
                    ON c.idCita = chs.idCita

                LEFT JOIN servicios s
                    ON chs.idServicios = s.idServicios

                ORDER BY c.Fecha ASC, c.Hora ASC
                """;

        return jdbcTemplate.queryForList(sql);
    }
}