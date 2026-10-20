
package andynails;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

import java.security.SecureRandom;
import java.util.concurrent.ConcurrentHashMap;
import java.util.Map;

@Service
public class MfaService {

    @Autowired
    private JavaMailSender mailSender;

    private static class CodigoMfa {
        private final String codigo;
        private final long expiracion;
        private int intentos;

        private CodigoMfa(String codigo, long expiracion) {
            this.codigo = codigo;
            this.expiracion = expiracion;
            this.intentos = 0;
        }
    }

    private final Map<Integer, CodigoMfa> codigos = new ConcurrentHashMap<>();
    private final Map<Integer, Long> usuariosVerificados = new ConcurrentHashMap<>();
    private final SecureRandom random = new SecureRandom();

    public void enviarCodigo(int idUsuario, String correo) {
        String codigo = String.format("%06d", random.nextInt(1_000_000));

        codigos.put(
                idUsuario,
                new CodigoMfa(
                        codigo,
                        System.currentTimeMillis() + (5 * 60 * 1000)));

        usuariosVerificados.remove(idUsuario);

        try {
            MimeMessage mensaje = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mensaje, true, "UTF-8");

            helper.setFrom("andynailss1@gmail.com");
            helper.setTo(correo);
            helper.setSubject("Tu código de acceso | Andy Nails");

            String contenido = "<div style='margin:0;padding:30px 12px;background:#fff8fa;"
                    + "font-family:Arial,sans-serif;color:#3d3035;'>"
                    + "<div style='max-width:480px;margin:auto;background:#ffffff;"
                    + "border-radius:14px;overflow:hidden;border:1px solid #f2dce4;'>"

                    + "<div style='background:#d88ba4;padding:25px 20px;"
                    + "text-align:center;color:white;'>"
                    + "<h1 style='margin:0;font-size:25px;letter-spacing:2px;'>"
                    + "ANDY NAILS</h1>"
                    + "<p style='margin:8px 0 0;font-size:13px;'>"
                    + "Verificación de seguridad</p>"
                    + "</div>"

                    + "<div style='padding:28px 24px;text-align:center;'>"
                    + "<h2 style='font-size:21px;margin:0 0 14px;'>"
                    + "¡Hola!</h2>"
                    + "<p style='font-size:15px;line-height:1.6;'>"
                    + "Para continuar con tu inicio de sesión, utiliza el "
                    + "siguiente código de verificación:</p>"

                    + "<div style='margin:25px 0;padding:18px 10px;"
                    + "background:#fff3f6;border:1px dashed #d88ba4;"
                    + "border-radius:10px;'>"
                    + "<span style='font-size:32px;font-weight:bold;"
                    + "letter-spacing:9px;color:#b65e7c;'>"
                    + codigo
                    + "</span></div>"

                    + "<p style='font-size:14px;line-height:1.6;'>"
                    + "Este código es válido durante <strong>5 minutos</strong>."
                    + "</p>"

                    + "<p style='font-size:13px;line-height:1.6;color:#76666d;'>"
                    + "Si no intentaste iniciar sesión, ignora este correo "
                    + "y no compartas tu código con nadie.</p>"
                    + "</div>"

                    + "<div style='padding:16px;text-align:center;"
                    + "background:#fff8fa;font-size:12px;color:#8a737d;'>"
                    + "Mensaje automático de seguridad<br>"
                    + "Andy Nails · Cuidado y belleza"
                    + "</div>"

                    + "</div></div>";

            helper.setText(contenido, true);
            mailSender.send(mensaje);

        } catch (MessagingException e) {
            throw new IllegalStateException(
                    "No se pudo preparar el correo de verificación MFA.", e);
        }
    }

    public boolean verificarCodigo(int idUsuario, String codigoIngresado) {
        if (codigoIngresado == null || !codigoIngresado.matches("\\d{6}")) {
            return false;
        }

        CodigoMfa registro = codigos.get(idUsuario);

        if (registro == null) {
            return false;
        }

        if (System.currentTimeMillis() > registro.expiracion) {
            codigos.remove(idUsuario, registro);
            return false;
        }

        synchronized (registro) {
            if (registro.intentos >= 5) {
                codigos.remove(idUsuario, registro);
                return false;
            }

            registro.intentos++;

            if (!registro.codigo.equals(codigoIngresado)) {
                if (registro.intentos >= 5) {
                    codigos.remove(idUsuario, registro);
                }
                return false;
            }

            codigos.remove(idUsuario, registro);

            usuariosVerificados.put(
                    idUsuario,
                    System.currentTimeMillis() + (2 * 60 * 1000));

            return true;
        }
    }

    public boolean usuarioEstaVerificado(int idUsuario) {
        Long expiracion = usuariosVerificados.get(idUsuario);

        if (expiracion == null) {
            return false;
        }

        if (System.currentTimeMillis() > expiracion) {
            usuariosVerificados.remove(idUsuario);
            return false;
        }

        return true;
    }

    public void quitarVerificacion(int idUsuario) {
        usuariosVerificados.remove(idUsuario);
    }
}
