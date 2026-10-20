
package andynails;

import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.util.Base64;
import java.util.concurrent.ConcurrentHashMap;
import java.util.Map;

@Service
public class MfaLoginService {

    private static final long DURACION_MS = 5 * 60 * 1000;

    private static class Pendiente {
        private final int idUsuario;
        private final long expiracion;

        private Pendiente(int idUsuario, long expiracion) {
            this.idUsuario = idUsuario;
            this.expiracion = expiracion;
        }
    }

    private final Map<String, Pendiente> pendientes = new ConcurrentHashMap<>();

    private final SecureRandom random = new SecureRandom();

    public String crearPendiente(int idUsuario) {
        byte[] bytes = new byte[32];
        random.nextBytes(bytes);

        String identificador = Base64.getUrlEncoder()
                .withoutPadding()
                .encodeToString(bytes);

        pendientes.put(
                identificador,
                new Pendiente(
                        idUsuario,
                        System.currentTimeMillis() + DURACION_MS));

        return identificador;
    }

    public Integer obtenerUsuario(String identificador) {
        if (identificador == null || identificador.isBlank()) {
            return null;
        }

        Pendiente pendiente = pendientes.get(identificador);

        if (pendiente == null) {
            return null;
        }

        if (System.currentTimeMillis() > pendiente.expiracion) {
            pendientes.remove(identificador, pendiente);
            return null;
        }

        return pendiente.idUsuario;
    }

    public void consumir(String identificador) {
        if (identificador != null) {
            pendientes.remove(identificador);
        }
    }
}
