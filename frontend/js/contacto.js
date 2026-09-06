document.addEventListener("DOMContentLoaded", () => {

    configurarRedes();

});


function configurarRedes() {

    const instagram =
        "https://www.instagram.com/andynails378?igsh=eW5haTJ4OWY3Mm14";

    const whatsapp =
        "https://wa.me/8442756590";

    const facebook =
        "https://www.facebook.com/share/17LcvkhEJT/";


    const instagramLink =
        document.getElementById("https://www.instagram.com/andynails378?igsh=eW5haTJ4OWY3Mm14");

    const whatsappLink =
        document.getElementById("https://wa.me/8442756590");

    const facebookLink =
        document.getElementById("https://www.facebook.com/share/17LcvkhEJT/");


    if (instagramLink) {

        instagramLink.href = instagram;

        instagramLink.target = "_blank";

    }


    if (whatsappLink) {

        whatsappLink.href = whatsapp;

        whatsappLink.target = "_blank";

    }


    if (facebookLink) {

        facebookLink.href = facebook;

        facebookLink.target = "_blank";

    }

}