
package andynails;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;

import javax.crypto.SecretKey;
import java.time.Instant;
import java.util.Date;
import java.util.Map;

import org.springframework.stereotype.Service;

@Service
public class JwtService {

    private static final long DURACION_TOKEN_MS = 15 * 60 * 1000;

    private final SecretKey claveSecreta;

    public JwtService() {
        String clave = System.getenv("JWT_SECRET");

        if (clave == null || clave.isBlank()) {
            throw new IllegalStateException(
                    "No está configurada la variable de entorno JWT_SECRET.");
        }

        try {
            byte[] bytes = Decoders.BASE64.decode(clave);
            this.claveSecreta = Keys.hmacShaKeyFor(bytes);
        } catch (RuntimeException e) {
            throw new IllegalStateException(
                    "JWT_SECRET debe ser una clave Base64 válida de al menos 32 bytes.",
                    e);
        }
    }

    public String generarToken(Integer idUsuario, Integer rol) {

        Instant ahora = Instant.now();
        Instant expiracion = ahora.plusMillis(DURACION_TOKEN_MS);

        return Jwts.builder()
                .claims(Map.of(
                        "idUsuario", idUsuario,
                        "rol", rol))
                .issuedAt(Date.from(ahora))
                .expiration(Date.from(expiracion))
                .signWith(claveSecreta)
                .compact();
    }

    public Claims validarToken(String token) {

        return Jwts.parser()
                .verifyWith(claveSecreta)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    public boolean esTokenValido(String token) {
        try {
            validarToken(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }
}
