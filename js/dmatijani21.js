document.addEventListener("DOMContentLoaded", pokretanje);

function pokretanje () { // Funkcija provjerava na kojoj se stranici nalazimo
    let naslov = document.title;

    if (naslov == "Početna stranica") cjenik(); // Pokreće ovo ukoliko se nalazimo na početnoj stranici
    else if (naslov == "Rezervacija") rezervacija(); // Pokreće se ukoliko se nalazimo na obrascu za rezervaciju
    else if (naslov == "Kontakt") kontakt(); // Pokreće se ukoliko se nalazimo na obrascu za kontakt
    else console.log("Nema identificirane stranice!");
}



/* TABLICA CJENIKA */

function cjenik () { // Funkcija koja ispisuje sadržaj cijelih redova ispod tablice cjenika
    var tablica = document.getElementById("tablicaCijena"); // Tablica
    var cjenik = document.getElementById("cjenik"); // Cjenik (u njemu je tablica i još par elemenata)
    
    var redovi = tablica.children[2].children; // Dohvaća redove

    var naslovi = tablica.children[1].children[1].children; // Dohvaća sve naslove stupaca iz tablice

    var noviTekst = document.createElement("div"); // Novi prazan element <div>, koji će sadržavati tekst
    noviTekst.textContent = "";
    cjenik.appendChild(noviTekst);

    // Prolazi kroz svaki red
    for (red of redovi) {
        red.addEventListener("mouseover", function () {
            var podaci = this.children; // Dohvaća sve stupce unutar tog reda

            let prijasnjiElement = this.previousElementSibling; // Dohvaća prijašnji element
            if (prijasnjiElement !== null) { // Ukoliko se radi o prvom <tr> unutar <tbody>, nema prijašnjeg elementa, stoga je ova provjera potrebna
                prijasnjiElement = this.previousElementSibling.children; // Djeca prijašnjeg elementa (radi rowspan)
            }

            tekstKojiSePrikazuje = "";

            // Čisti sve elemente unutar noviTekst div-a
            while (noviTekst.firstChild) {
                noviTekst.removeChild(noviTekst.firstChild);
            }
            noviTekst.innerHTML = "";
            
            var brojac = 0;
            for (podatak of podaci) { // Prolazi kroz svaku ćeliju za odabrani red
                if (prijasnjiElement !== null) { // Gleda postoji li prijašnji element (radi prvog retka u <thead>: on nema prijašnji element)
                    if (prijasnjiElement[brojac] !== undefined) { // Sprječava slučaj da <tr> ima manje <td> nego što ima stupaca
                        if (prijasnjiElement[brojac].attributes.rowspan !== undefined) { // Pazi da se ispravno ispisuju elementi sa rowspan 2
                            let dodaniRed = document.createElement("div");

                            let prijasnjaCelija = prijasnjiElement[brojac].innerText;

                            dodaniRed.textContent = naslovi[brojac].innerText + ": " + prijasnjaCelija;
                            noviTekst.append(dodaniRed);

                            brojac ++;
                        }
                    }
                }

                let naslovStupca = naslovi[brojac].innerText;
                var sadrzaj = podatak.innerHTML;

                if (sadrzaj !== "") { // Ne ispisuje "Ponude: " ako je ćelija prazna
                    let redTeksta = document.createElement("div");
                    redTeksta.innerHTML = naslovStupca + ": " + sadrzaj;
                    noviTekst.appendChild(redTeksta);
                }

                brojac ++;
            }
        });
    }

    // Čini da je tekst nevidljiv ukoliko je zaslon veći od 480 piksela
    function sakrijIliPokaziTekst () { // Funkcija koja skriva, odnosno pokazuje tekst, ovisno o prozoru
        if (window.innerWidth <= 480) {
            noviTekst.style.display = "block";
        } else {
            noviTekst.style.display = "none";
        }
    }
    
    sakrijIliPokaziTekst(); // Pozove funkciju na početku odmah
    window.addEventListener("resize", sakrijIliPokaziTekst); // Pozove funkciju ukoliko se mijenja širina prozora
}



/* OBRASCI */

var brojLosih;

function posaljiFormu (elementi, poruka, obrazac) { // Funkcija koja provjerava obrazac
    poruka.innerHTML = "";

    brojLosih = 0; // Broj lose unesenih ili odabranih polja

    // Provjera svih elemenata obrasca
    let prazna = 0; // Broj praznih polja

    for (let i = 0; i < elementi.length; i ++) { // Prolazi kroz sve elemente obrasca i validira ih
        prazna += provjeriElement(i, elementi, poruka, true); // Ovdje "true" označava da se sada ovom funkcijom broje prazna polja
    }

    // Dopunjava poruku s greškom
    poruka.innerHTML = '<ul style="text-align: left">' + poruka.innerHTML + "</ul>";
    if (prazna == 0) {
        poruka.innerHTML = "Sva polja su popunjena, ali postoje greške:" + poruka.innerHTML;
    } else {
        if (prazna == 1) {
            poruka.innerHTML = "1 polje je prazno te postoje greške:" + poruka.innerHTML;
        } else {
            poruka.innerHTML = prazna + " praznih polja te postoje greške:" + poruka.innerHTML;
        }
    }
    poruka.innerHTML = '<span class="boldano">Greška!</span><br>' + poruka.innerHTML;

    // Provjerava je li sve uspješno uneseno
    if (prazna > 0) {
        poruka.style.display = "block"; // Prikazuje div sa porukom greške
        return;
    }

    if (brojLosih > 0) {
        poruka.style.display = "block"; // Prikazuje div sa porukom greške
        return;
    }

    // Napokon šalje ispunjenu formu
    obrazac.submit();
}

function obrazac (str) { // Funkcija koja generalno provjerava elemente obrazaca
    let divPoruke = document.getElementById(str + "Poruka"); // Dohvaća div element sa porukom

    divPoruke.addEventListener("click", function () { // Sakriva div ukoliko je pritisnut
        this.style.display = "none";
    });

    return divPoruke;
}

function rezervacija () { // Funkcija koja provjerava neke elemente obrasca za rezervaciju
    let rezPoruka = obrazac("rezervacija");
    let rezObrazac = document.getElementById("rezervacijaObrazac").children[0]; // Dohvaća obrazac za rezervaciju

    // Dohvaćanje svih elemenata obrasca
    let elementiObrasca = rezObrazac.querySelectorAll("input, select, textarea");

    for (let i = 0; i < elementiObrasca.length; i ++) { // Provjerava svaki element
        // Odmah onemogućuje element unosa vremena
        if (elementiObrasca[i].type == "time") {
            elementiObrasca[i].disabled = true;
        }

        // Dodaje osluškivače na sve elemente
        elementiObrasca[i].addEventListener("focusout", function () {
            provjeriElement(i, elementiObrasca, rezPoruka);
        });
    }

    rezObrazac.addEventListener("submit", function(event) { // Provjera se odvija kada se stisne gumb "Submit"
        event.preventDefault();
        posaljiFormu(elementiObrasca, rezPoruka, rezObrazac);
    });
}

function kontakt () { // Funkcija koja provjerava neke elemente obrasca za kontakt
    let kontPoruka = obrazac("kontakt");
    let kontObrazac = document.getElementById("kontaktObrazac").children[0]; // Dohvaća obrazac za kontakt

    // Dohvaćanje svih elemenata obrasca
    let elementiObrasca = kontObrazac.querySelectorAll("input, select, textarea");

    for (let i = 0; i < elementiObrasca.length; i ++) { // Provjerava svaki element
        // Odmah onemogućuje element unosa vremena
        if (elementiObrasca[i].type == "time") {
            elementiObrasca[i].disabled = true;
        }

        // Dodaje osluškivače na sve elemente
        elementiObrasca[i].addEventListener("focusout", function () {
            provjeriElement(i, elementiObrasca, kontPoruka);
        });
    }

    kontObrazac.addEventListener("submit", function(event) { // Provjera se odvija kada se stisne gumb "Submit"
        event.preventDefault();
        posaljiFormu(elementiObrasca, kontPoruka, kontObrazac);
    });
}

function provjeriElement (ind, elementi, poruka, pobroji = false) {
    let elem = elementi[ind]; // Dohvaća trenutni element

    // Ne provjerava ukoliko se radi o gumbu za slanje ili poništavanje
    if ((elem.type == "submit") || (elem.type == "reset")) {
        return 0;
    }

    // Ne provjerava ukolko se ime elementa ponavlja, odnosno prebacuje se na prvi (provjerava samo prvi element, tada ih provjerava sve)
    if (ind > 0) {
        if (pobroji) {
            if (elem.name == elementi[ind - 1].name) {
                return 0;
            }
        } else {
            while (elem.name == elementi[ind - 1].name) elem = elementi[--ind];
        }
    }

    // Provjerava elemente po određenim kriterijima
    switch (elem.type) {
        case "text":
        case "email": { // Ako se radi o tekstualnom unosu
            if (elem.value.length == 0) { // Ako je element prazan
                if (pobroji) {
                    if (elem.name == "ime_narucitelja") {
                        poruka.innerHTML += '<li>Polje <span class="ukoseno">Ime naručitelja</span> je prazno!</li>';
                    } else if (elem.name == "predmet") {
                        poruka.innerHTML += '<li>Polje <span class="ukoseno">Predmet poruke</span> je prazno!</li>';
                    } else if (elem.name == "email_narucitelja") {
                        poruka.innerHTML += '<li>Polje <span class="ukoseno">E-pošta naručitelja</span> je prazno!</li>';
                    }
                } else {
                    if (elem.type == "email") poruka.innerHTML = "Nepravilno unesena e-pošta! E-pošta ne može biti prazna.";
                    else poruka.innerHTML = "Nepravilno unesen tekst! Tekst ne može biti prazan.";
                    poruka.style.display = "block"; // Prikazuje div s porukom
                }
                elem.style.border = "2px solid red";

                brojLosih ++; // Povećava broj loše unesenih polja

                return 1; // Vraća 1 zbog pobrojenja praznih elemenata
            }

            let regexText = /^[^?!<>#]*$/; // Regularni izraz
            if (!regexText.test(elem.value)) { // Ako element sadrži zabranjene znakove
                if (pobroji) {
                    if (elem.name == "ime_narucitelja") {
                        poruka.innerHTML += '<li>Polje <span class="ukoseno">Ime naručitelja</span> sadrži specijalne znakove!</li>';
                    } else if (elem.name == "predmet") {
                        poruka.innerHTML += '<li>Polje <span class="ukoseno">Predmet poruke</span> sadrži specijalne znakove!</li>';
                    } else if (elem.name == "email_narucitelja") {
                        poruka.innerHTML += '<li>Polje <span class="ukoseno">E-pošta naručitelja</span> sadrži specijalne znakove!</li>';
                    }
                } else {
                    poruka.innerHTML = "Nepravilno unesen tekst! Tekst ne može sadržavati specijalne znakove: !, ?, #, <, >.";
                    poruka.style.display = "block"; // Prikazuje div s porukom
                }
                elem.style.border = "2px solid red";

                brojLosih ++; // Povećava broj loše unesenih polja

                return 0;
            }

            // Miče border element te uklanja div
            poruka.style.display = "none";
            elem.style.border = elem.defaultValue;

            return 0; // Vraća se
        };

        case "textarea": { // Ako se radi o višelinijskom tekstualnom unosu
            if (elem.value.length == 0) { // Ako je element prazan
                if (pobroji) {
                    if (elem.name == "poruka") {
                        poruka.innerHTML += '<li>Višelinijsko polje <span class="ukoseno">Tijelo poruke</span> je prazno!</li>';
                    }
                } else {
                    poruka.innerHTML = "Nepravilno unesen tekst! Višelinijski tekst mora biti između 10 i 1000 znakova.";
                    poruka.style.display = "block"; // Prikazuje div s porukom
                }
                elem.style.border = "2px solid red";

                brojLosih ++; // Povećava broj loše unesenih polja

                return 1; // Vraća 1 zbog pobrojenja praznih elemenata
            }

            let regexTextarea = /^(?!.*[?!<>#]).{10,1000}$/; // Regularni izraz
            if (!regexTextarea.test(elem.value)) {
                if (pobroji) {
                    if (elem.name == "poruka") {
                        poruka.innerHTML += '<li>Višelinijsko polje <span class="ukoseno">Tijelo poruke</span> sadrži specijalne znakove ili nije između 10 i 1000 znakova!</li>';
                    }
                } else {
                    poruka.innerHTML = "Nepravilno unesen tekst! Tekst ne može sadržavati specijalne znakove (!, ?, #, <, >) te mora biti između 10 i 1000 znakova.";
                    poruka.style.display = "block"; // Prikazuje div s porukom
                }
                elem.style.border = "2px solid red";

                brojLosih ++; // Povećava broj loše unesenih polja

                return 0;
            }

            // Miče border element te uklanja div
            poruka.style.display = "none";
            elem.style.border = elem.defaultValue;

            return 0; // Vraća se
        };

        case "date": { // Ako se radi o unosu datuma
            let odabranDatum = new Date(elem.value); // Dobiva odabran datum
            let danasnjiDatum = new Date(); // Dobiva današnji datum

            // Dohvaća element vremena
            let elemVremena = elementi[ind + 1];

            // Mijenja vremena zbog uspoređivanja
            odabranDatum.setHours(0);
            odabranDatum.setMinutes(0);
            odabranDatum.setSeconds(30);
            odabranDatum.setMilliseconds(0);

            danasnjiDatum.setHours(0);
            danasnjiDatum.setMinutes(0);
            danasnjiDatum.setSeconds(30);
            danasnjiDatum.setMilliseconds(0);

            // Provjerava datume
            if (elem.value != "") {
                if (odabranDatum < danasnjiDatum) { // Ako je odabran datum u prošlosti
                    if (pobroji) {
                        if (elem.name == "datum") {
                            poruka.innerHTML += '<li>Unesen datum je u prošlosti!</li>';
                        }
                    } else {
                        poruka.innerHTML = 'Nepravilno unesen datum! <span class="ukoseno">Datum dolaska</span> ne može biti u prošlosti.';
                        poruka.style.display = "block"; // Prikazuje div s porukom
                    }
                    elem.style.border = "2px solid red";

                    elemVremena.disabled = true; // Onemogućuje unos vremena

                    brojLosih ++; // Povećava broj loše unesenih polja

                    return 0; // Vraća se
                }
            } else {
                if (pobroji) {
                    if (elem.name == "datum") {
                        poruka.innerHTML += '<li>Datum nije unesen!</li>';
                    }
                } else {
                    poruka.innerHTML = "Datum ne može ostati prazan!";
                    poruka.style.display = "block"; // Prikazuje div s porukom
                }
                elem.style.border = "2px solid red";

                elemVremena.disabled = true; // Onemogućuje unos vremena

                brojLosih ++; // Povećava broj loše unesenih polja

                return 1; // Vraća 1 radi pobrojenja praznih elemenata
            }

            // Miče border element te uklanja div
            poruka.style.display = "none";
            elem.style.border = elem.defaultValue;

            // Ponovno omogućuje element vremena
            elemVremena.disabled = false;

            return 0; // Vraća se
        };

        case "time": { // Ako se radi o unosu vremena
            // Provjerava je li disabled
            if (elem.disabled) {
                return 1; // Vraća 1 zbog pobrojenja praznih elemenata
            }

            // Dobivanje elementa s datumom
            let elemDatuma = elementi[ind - 1];

            // Dohvaćanje današnjeg datuma, a time i vremena
            let odabranDatum = new Date(elemDatuma.value); // Dobiva odabran datum
            let danasnjiDatum = new Date(); // Dobiva današnji datum

            // Mijenja vremena zbog uspoređivanja
            odabranDatum.setHours(danasnjiDatum.getHours());
            odabranDatum.setMinutes(danasnjiDatum.getMinutes());
            odabranDatum.setSeconds(danasnjiDatum.getSeconds());
            odabranDatum.setMilliseconds(danasnjiDatum.getMilliseconds());

            // Provjera je li odabran isti dan
            if (odabranDatum.getTime() == danasnjiDatum.getTime()) {
                // Dohvaća sate i minute
                let vrijemePolje = elem.value.split(":");
                let odabraniSati = vrijemePolje[0];
                let odabraneMinute = vrijemePolje[1];

                let trenutniSati = danasnjiDatum.getHours();
                let trenutneMinute = danasnjiDatum.getMinutes();

                // Obavlja provjeru vremena
                if ((odabraniSati < trenutniSati) || ((odabraniSati == trenutniSati) && (odabraneMinute < trenutneMinute))) {
                    if (pobroji) {
                        if (elem.name == "vrijeme_dolaska") {
                            poruka.innerHTML += '<li><span class="ukoseno">Vrijeme dolaska</span> je manje nego trenutno vrijeme, a isti je datum!</li>';
                        }
                    } else {
                        poruka.innerHTML = "Nepravilno uneseno vrijeme! Ako je odabran datum jednak današnjem datumu, vrijeme ne može biti manje od trenutnog vremena.";
                        poruka.style.display = "block"; // Prikazuje div s porukom
                    }
                    elem.style.border = "2px solid red";

                    brojLosih ++; // Povećava broj loše unesenih polja

                    return 0; // Vraća se
                }
            }

            // Miče border element te uklanja div
            poruka.style.display = "none";
            elem.style.border = "1px solid black";

            return 0; // Vraća se
        };

        case "radio": { // Ako se radi o radio odabiru
            // Kreira polje sa svojim srodnim elementima
            let srodniElementi = [];
            while (elementi[ind].name == elem.name) {
                srodniElementi.push(elementi[ind++]);

                if (ind >= elementi.length) {
                    break;
                }
            }

            // Provjerava je li jedan od njih odabran
            let odabran = false;

            for (srodan of srodniElementi) {
                if (srodan.checked) {
                    odabran = true;
                    break;
                }
            }

            // Provjerava ima li odabranih elemenata
            if (!odabran) {
                if (pobroji) {
                    if (elem.name == "vrsta_sobe") {
                        poruka.innerHTML += '<li><span class="ukoseno">Vrsta sobe</span> nije odabrana!</li>';
                    } else if (elem.name == "vrsta_upita") {
                        poruka.innerHTML += '<li><span class="ukoseno">Vrsta upita</span> nije odabrana!</li>';
                    }
                } else {
                    poruka.innerHTML = "Nije odabrana ni jedna opcija!";
                    poruka.style.display = "block"; // Prikazuje div s porukom
                }

                brojLosih ++; // Povećava broj loše unesenih polja

                return 1; // Vraća 1 zbog pobrojenja praznih elemenata
            }

            // Miče border element te uklanja div
            poruka.style.display = "none";

            return 0; // Vraća se
        };

        case "number": { // Ako se radi o broju
            if (elem.value == "") { // Ako je prazan broj
                if (pobroji) {
                    if (elem.name == "broj_osoba") {
                        poruka.innerHTML += '<li><span class="ukoseno">Broj osoba</span> nije unesen!</li>';
                    }
                } else {
                    poruka.innerHTML = "Nepravilno unesen broj! Mora biti unesen bar neki broj.";
                    poruka.style.display = "block"; // Prikazuje div s porukom
                }
                elem.style.border = "2px solid red";

                brojLosih ++; // Povećava broj loše unesenih polja

                return 1; // Vraća 1 zbog pobrojenja praznih elemenata
            }

            if (elem.value < 1 || elem.value > 8) {
                if (pobroji) {
                    if (elem.name == "broj_osoba") {
                        poruka.innerHTML += '<li><span class="ukoseno">Broj osoba</span> nije između 1 i 8!</li>';
                    }
                } else {
                    poruka.innerHTML = "Nepravilno unesen broj! Mora biti između 1 i 8.";
                    poruka.style.display = "block"; // Prikazuje div s porukom
                }
                elem.style.border = "2px solid red";

                brojLosih ++; // Povećava broj loše unesenih polja

                return 1; // Vraća 1 zbog pobrojenja praznih elemenata
            }

            // Miče border element te uklanja div
            poruka.style.display = "none";
            elem.style.border = elem.defaultValue;

            return 0; // Vraća se
        };

        case "select-one": { // Ako se radi o select elementu
            if (elem.value == "") { // Ako nije odabrana opcija
                if (pobroji) {
                    if (elem.name == "nacin_placanja") {
                        poruka.innerHTML += '<li><span class="ukoseno">Način plaćanja</span> nije odabran!</li>';
                    }
                } else {
                    poruka.innerHTML = "Nije odabran način plaćanja! Mora biti odabran.";
                    poruka.style.display = "block"; // Prikazuje div s porukom
                }
                elem.style.border = "2px solid red";

                brojLosih ++; // Povećava broj loše unesenih polja

                return 1; // Vraća 1 zbog pobrojenja praznih elemenata
            }

            // Miče border element te uklanja div
            poruka.style.display = "none";
            elem.style.border = elem.defaultValue;

            return 0; // Vraća se
        };

        // Elementi kao što su "checkbox" se ne provjeravaju jer je svrha tog elementa da može biti ne odabran
    }

    return 0; // Vraća 0 na kraju
}