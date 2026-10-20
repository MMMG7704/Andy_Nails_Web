
package andynails.security;

import andynails.JwtService;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.util.List;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;

    public JwtAuthenticationFilter(JwtService jwtService) {
        this.jwtService = jwtService;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain)
            throws ServletException, IOException {

        String autorizacion = request.getHeader("Authorization");

        if (autorizacion != null && autorizacion.startsWith("Bearer ")) {
            String token = autorizacion.substring(7);

            try {
                Claims claims = jwtService.validarToken(token);

                Object idObjeto = claims.get("idUsuario");
                Object rolObjeto = claims.get("rol");

                if (!(idObjeto instanceof Number)
                        || !(rolObjeto instanceof Number)) {
                    response.sendError(
                            HttpServletResponse.SC_UNAUTHORIZED,
                            "Token inválido.");
                    return;
                }

                int idUsuario = ((Number) idObjeto).intValue();
                int rol = ((Number) rolObjeto).intValue();

                var autenticacion = new UsernamePasswordAuthenticationToken(
                        String.valueOf(idUsuario),
                        null,
                        List.of(new SimpleGrantedAuthority("ROLE_" + rol)));

                SecurityContextHolder.getContext()
                        .setAuthentication(autenticacion);

                // errores del JWT y responde con un 401 Unauthorized
            } catch (JwtException | IllegalArgumentException e) {
                SecurityContextHolder.clearContext();
                response.sendError(
                        HttpServletResponse.SC_UNAUTHORIZED,
                        "Token inválido o expirado.");
                return;
            }
        }

        filterChain.doFilter(request, response);
    }
}
