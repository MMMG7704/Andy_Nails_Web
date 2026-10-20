package andynails;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/mfa")
@CrossOrigin(origins = "*")
public class MfaController {

    @Autowired
    private MfaService mfaService;

    @GetMapping("/prueba")
    public String enviarPrueba(@RequestParam String correo) {

        mfaService.enviarCodigo(1, correo);

        return "Correo enviado correctamente";
    }

    @PostMapping("/enviar")
    public String enviarCodigo(
            @RequestParam int idUsuario,
            @RequestParam String correo) {

        mfaService.enviarCodigo(idUsuario, correo);

        return "Código enviado correctamente";
    }

    @PostMapping("/verificar")
    public String verificarCodigo(
            @RequestParam int idUsuario,
            @RequestParam String codigo) {

        boolean correcto = mfaService.verificarCodigo(idUsuario, codigo);

        if (correcto) {
            return "Código correcto";
        }

        return "Código incorrecto o expirado";
    }
}