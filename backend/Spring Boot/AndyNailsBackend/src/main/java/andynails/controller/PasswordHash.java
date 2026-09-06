package andynails.controller;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class PasswordHash {

    private static final BCryptPasswordEncoder bcrypt = new BCryptPasswordEncoder(12);

    /* GENERAR HASH DE LA CONTRASEÑA */

    public static String hashPassword(String password) {

        return bcrypt.encode(password);

    }

    /* VERIFICAR CONTRASEÑA */

    public static boolean verifyPassword(
            String password,
            String hash) {

        return bcrypt.matches(password, hash);

    }
}