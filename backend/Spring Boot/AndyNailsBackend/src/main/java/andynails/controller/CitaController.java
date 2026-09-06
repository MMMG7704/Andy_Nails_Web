package andynails.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/citas")
@CrossOrigin(origins = "*")
public class CitaController {

    private final CitaService citaService;

    public CitaController(CitaService citaService) {
        this.citaService = citaService;
    }

    @PostMapping
    public ResponseEntity<?> crearCita(
            @RequestBody CitaRequest request) {

        try {

            System.out.println("ID Usuario: "
                    + request.getIdUsuario());

            System.out.println("ID Servicio: "
                    + request.getIdServicio());

            System.out.println("Fecha: "
                    + request.getFecha());

            System.out.println("Hora: "
                    + request.getHora());

            Cita cita = new Cita();

            cita.setIdUsuarios(request.getIdUsuario());
            cita.setFecha(request.getFecha());
            cita.setHora(request.getHora());
            cita.setEstado("Pendiente");

            citaService.guardarCita(cita);

            return ResponseEntity.ok(cita);

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity
                    .internalServerError()
                    .body(
                            Map.of(
                                    "success", false,
                                    "mensaje", e.getMessage()));
        }
    }

    @GetMapping
    public ResponseEntity<?> obtenerTodasLasCitas() {

        try {

            List<Map<String, Object>> citas = citaService.obtenerTodasLasCitas();

            return ResponseEntity.ok(citas);

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity.internalServerError()
                    .body(Map.of(
                            "success", false,
                            "mensaje", e.getMessage()));
        }
    }

    @GetMapping("/cliente/{idUsuario}")
    public ResponseEntity<?> obtenerCitasCliente(
            @PathVariable Integer idUsuario) {

        try {

            System.out.println(
                    "BUSCANDO CITAS DEL USUARIO: "
                            + idUsuario);

            List<Map<String, Object>> citas = citaService.obtenerCitasPorCliente(
                    idUsuario);

            System.out.println(
                    "CITAS ENCONTRADAS: "
                            + citas.size());

            return ResponseEntity.ok(citas);

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity
                    .internalServerError()
                    .body(
                            Map.of(
                                    "success", false,
                                    "mensaje", e.getMessage()));
        }
    }

    public static class CitaRequest {

        private Integer idUsuario;
        private Integer idServicio;
        private String fecha;
        private String hora;

        public Integer getIdUsuario() {
            return idUsuario;
        }

        public void setIdUsuario(Integer idUsuario) {
            this.idUsuario = idUsuario;
        }

        public Integer getIdServicio() {
            return idServicio;
        }

        public void setIdServicio(Integer idServicio) {
            this.idServicio = idServicio;
        }

        public String getFecha() {
            return fecha;
        }

        public void setFecha(String fecha) {
            this.fecha = fecha;
        }

        public String getHora() {
            return hora;
        }

        public void setHora(String hora) {
            this.hora = hora;
        }
    }
}