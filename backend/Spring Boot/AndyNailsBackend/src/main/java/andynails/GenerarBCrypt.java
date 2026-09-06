package andynails;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class GenerarBCrypt {

    public static void main(String[] args) {

        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(12);

        String[][] usuarios = {
                { "admin@andynails.com", "admin123" },
                { "recep@andynails.com", "recep123" },
                { "mgmm04@gmail.com", "m" },
                { "u@gmail.com", "u" },
                { "p@gmail.com", "p" },
                { "f@gmail.com", "f" },
                { "r@gmail.com", "r" },
                { "v@gmail.com", "v" },
                { "mar@gmail.com", "mar" },
                { "o@gmail.com", "o" },
                { "marianauniversidad7704@gmail.com", "mm" },
                { "h@gmail.com", "h" },
                { "Z@gmail.com", "Z" },
                { "a@gmail.com", "a" },
                { "B@gmail.com", "B" },
                { "W@gmail.com", "W" },
                { "Q@gmail.com", "Q" },
                { "gabybet523@gmail.com", "r" },
                { "marlenmora96@hotmail.com", "m" },
                { "u@gmail.com", "u" },
                { "vale@gmail.com", "vale" },
                { "hito@gmail.com", "hito" },
                { "c@gmail.com", "c" },
                { "ñ@gmail.com", "ñ" }
        };

        for (String[] usuario : usuarios) {

            String correo = usuario[0];
            String contraseña = usuario[1];

            String hash = encoder.encode(contraseña);

            System.out.println(
                    correo + " | " + hash);
        }
    }
}