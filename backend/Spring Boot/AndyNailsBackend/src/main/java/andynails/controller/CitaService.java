package andynails.controller;

import java.util.List;
import java.util.Map;
import org.springframework.stereotype.Service;

@Service
public class CitaService {

    private final CitaRepository citaRepository;

    public CitaService(CitaRepository citaRepository) {
        this.citaRepository = citaRepository;
    }

    public int guardarCita(Cita cita) {
        if (cita.getEstado() == null || cita.getEstado().isEmpty()) {
            cita.setEstado("Pendiente");
        }

        return citaRepository.guardar(cita);
    }

    public List<Map<String, Object>> obtenerCitasPorCliente(Integer idUsuario) {
        return citaRepository.obtenerCitasPorCliente(idUsuario);
    }

    public List<Map<String, Object>> obtenerTodasLasCitas() {
        return citaRepository.obtenerTodasLasCitas();
    }
}