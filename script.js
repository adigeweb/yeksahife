const months = [
    "Ocak",
    "Şubat",
    "Mart",
    "Nisan",
    "Mayıs",
    "Haziran",
    "Temmuz",
    "Ağustos",
    "Eylül",
    "Ekim",
    "Kasım",
    "Aralık"
];

const days = [
    "Pazartesi",
    "Salı",
    "Çarşamba",
    "Perşembe",
    "Cuma",
    "Cumartesi",
    "Pazar"
];

const birimler = {
    uzun: {
        metre: 1,
        santimetre: 0.01,
        kilometre: 1000,
        yarda: .9144,
        fit: .3048,
        inc: .0254,
        angstrom: 10000000000
    },
    /* sicak: {
        santigrat: 1,
        fahrenayt: 9 / 5,
        kelvin: 274.15,
        reaumur: 1.25
    }, */
    agir: {
        kilogram: 1000,
        gram: 1,
        ton: 1000000,
        libre: 0.45359237
    },
    sure: {
        planck_zamani: 5.39 * 10 ^ -44,
        jiffy: 3 * 10 ^ -24,
        svedberg: 10 ^ -13,
        pikosaniye: 10 ^ -12,
        nanosaniye: 10 ^ -9,
        mikrosaniye: 10 ^ -6,
        milisaniye: 10 ^ -3,
        sentisaniye: 10 ^ -2,
        desisaniye: 10 ^ -1,
        saniye: 1,
        dekasaniye: 10,
        dakika: 60,
        hektosaniye: 100,
        saat: 3600,
        gun: 86400,
        hafta: 604800,
        ay: 2629743.83,
        yil: 31556926
    }
}


const capitalizeFLetter = (str) => {
    return str[0].toUpperCase() + str.slice(1);
}

var theme = {
    text: "white",
    bg: "rgb(50, 50, 50)"
}

window.addEventListener("load", () => {
    const getDate = () => {
        let date = new Date();
        let proper = `${date.getUTCDate()} ${months[date.getUTCMonth()]} ${date.getUTCFullYear()} ${days[date.getUTCDay()]}, ${date.getHours()}.${date.getUTCMinutes().toString().padStart(2, "0")}`;
        document.querySelector(".tarih").innerHTML = proper;
    }
    const getTemparature = (pos) => {
        document.querySelector(".hava-durumu").classList.add("okay");
        fetch(`https://api.open-meteo.com/v1/forecast?latitude=${pos.coords.latitude}&longitude=${pos.coords.longitude}&hourly=temperature_2m&timezone=auto`)
            .then(res => res.json())
            .then(data => {
                console.log(data);
                document.querySelectorAll("table#hava tr")[0].querySelectorAll("th").forEach((item, index) => {
                    let hrs = new Date().getHours() + (index - 2);
                    item.innerHTML = (`${hrs}:00`);
                });
                document.querySelectorAll("table#hava tr")[1].querySelectorAll("td").forEach((item, index) => {
                    let hrs = new Date().getHours() + (index - 2);
                    item.innerHTML = (`${data["hourly"]["temperature_2m"][hrs]}°C`);
                });
            });
    }
    const getWord = (word) => {
        document.querySelector(".sozluk .sonuclar").innerHTML = ("");
        fetch(`https://sozluk.gov.tr/gts?ara=${word}`)
            .then(res => res.json())
            .then(data => {
                document.querySelector(".sozluk .error").style.display = "none";
                let anlamlar = data[0]["anlamlarListe"];
                anlamlar.forEach((item, index) => {
                    let elem = document.createElement("p");
                    elem.innerHTML = (`${index + 1}. ${item["anlam"].replaceAll("►", "")}`);
                    document.querySelector(".sozluk .sonuclar").appendChild(elem);
                });
            })
            .catch(error => {
                console.error(error);
                document.querySelector(".sozluk .error").style.display = "block";
                document.querySelector(".sozluk .error").innerHTML = (`"${word}" kelimesi bulunamadı :(`);
            });
    }
    const getSalahTimes = (pos) => {
        const date = `${new Date().getUTCFullYear()}-${(new Date().getUTCMonth() + 1).toString().padStart(2, "0")}-${(new Date().getUTCDate()).toString().padStart(2, "0")}`;
        fetch(`https://namaz-vakti.vercel.app/api/timesFromCoordinates?lat=${pos.coords.latitude}&lng=${pos.coords.longitude}&date=${date}&days=1&timezoneOffset=180&calculationMethod=Turkey`)
            .then(res => res.json())
            .then(data => {
                console.log(data["times"][date]);
                document.querySelector(".namaz-vakti #section-title").innerHTML = (`${data.place.city} için Bugünkü Namaz Vakitleri`);
                document.querySelectorAll("table#vakitler td").forEach((item, index) => {
                    item.innerHTML = (data["times"][date][index]);
                });
            });
    }
    const getTranslation = (from, to, text) => {
        fetch(`https://api.mymemory.translated.net/get?q=${text}&langpair=${from}|${to}`)
            .then(res => res.json())
            .then(data => {
                document.querySelector(".cevir .cevrilmis").innerHTML = (data.responseData.translatedText);
            })
            .catch(err => console.error(err));
    }
    var stopwatchInterval = [null, null, null];
    const stopwatch = {
        start: () => {
            stopwatchInterval[0] = setInterval(() => {
                document.querySelectorAll("#k-sure span")[2].innerText < 99 ?
                document.querySelectorAll("#k-sure span")[2].innerText =
                (parseInt(document.querySelectorAll("#k-sure span")[2].innerText) + 1).toString().padStart(2, "0") :
                document.querySelectorAll("#k-sure span")[2].innerText = "00";
            }, 10);
            stopwatchInterval[1] = setInterval(() => {
                document.querySelectorAll("#k-sure span")[1].innerText < 59 ?
                document.querySelectorAll("#k-sure span")[1].innerText =
                (parseInt(document.querySelectorAll("#k-sure span")[1].innerText) + 1).toString().padStart(2, "0") :
                document.querySelectorAll("#k-sure span")[1].innerText = "00";
            }, 1000);
            stopwatchInterval[2] = setInterval(() => {
                document.querySelectorAll("#k-sure span")[0].innerText =
                (parseInt(document.querySelectorAll("#k-sure span")[0].innerText) + 1).toString().padStart(2, "0");
            }, 60000);
        },
        pause: () => {
            clearInterval(stopwatchInterval[0]);
            clearInterval(stopwatchInterval[1]);
            clearInterval(stopwatchInterval[2]);
        },
        tour: () => {
            let newTour = document.createElement("p");
            newTour.innerHTML =
            document.querySelectorAll("#k-sure span")[0].innerText + ":" +
            document.querySelectorAll("#k-sure span")[1].innerText + ":" +
            document.querySelectorAll("#k-sure span")[2].innerText;
            document.querySelector("#k-tur-liste").insertAdjacentElement("afterbegin", newTour);
        },
        reset: () => {
            clearInterval(stopwatchInterval[0]);
            clearInterval(stopwatchInterval[1]);
            clearInterval(stopwatchInterval[2]);
            document.querySelectorAll("#k-sure span")[0].innerText = "00";
            document.querySelectorAll("#k-sure span")[1].innerText = "00";
            document.querySelectorAll("#k-sure span")[2].innerText = "00";
            document.querySelector("#k-tur-liste").innerHTML = "";
        }
    }
    document.querySelector("button#baslat").addEventListener("click", () => { stopwatch.start() });
    document.querySelector("button#durdur").addEventListener("click", () => { stopwatch.pause() });
    document.querySelector("button#tur").addEventListener("click", () => { stopwatch.tour() });
    document.querySelector("button#k-sifirla").addEventListener("click", () => { stopwatch.reset() });
    document.querySelector("button#retry").addEventListener("click", () => {
        navigator.geolocation.getCurrentPosition(getTemparature);
    });
    document.querySelector("button#ara").addEventListener("click", () => {
        getWord(document.querySelector(".sozluk input").value);
    });
    document.querySelector("button#sifirla").addEventListener("click", () => {
        document.querySelector(".sozluk input").value = "";
        document.querySelector(".sozluk .sonuclar").innerHTML = ("");
    });
    document.querySelector(".topbar .item[data-open=hava-durumu]").addEventListener("click", () => {
        navigator.geolocation.getCurrentPosition(getTemparature);
    });
    document.querySelector(".topbar .item[data-open=namaz-vakti]").addEventListener("click", () => {
        navigator.geolocation.getCurrentPosition(getSalahTimes);
    });
    getDate();
    setInterval(getDate, 1000);
    window.addEventListener("scroll", () => {
        if (window.scrollY > 50) {
            document.querySelector(".topbar").style.opacity = .8;
        }
        else {
            document.querySelector(".topbar").style.opacity = 1;
        }
    });
    document.querySelector(".topbar").addEventListener("mouseenter", () => {
        document.querySelector(".topbar").style.opacity = 1;
    });
    document.querySelector(".topbar").addEventListener("mouseleave", () => {
        if (window.scrollY > 50) document.querySelector(".topbar").style.opacity = .8;
    });
    document.querySelectorAll(".topbar .item").forEach(item => {
        item.addEventListener("click", () => {
            document.querySelectorAll("[data-box][data-active]").forEach(item => item.removeAttribute("data-active"));
            document.querySelector(`[data-box].${item.getAttribute("data-open")}`).setAttribute("data-active", true);
            if (item.getAttribute("active")) document.querySelector(".topbar .mobile").click();
        });
    });
    document.querySelector("#hesap .butonlar button#exec").addEventListener("click", () => {
        const fn = () => { return document.querySelector("#hesap .cikti").innerText.replaceAll(" ", "").replaceAll("×", "*").replaceAll(",", ".").replaceAll("÷", "/").replaceAll(/[A-Za-z]/g, "") };
        document.querySelector("#hesap .cikti").innerHTML = (eval(fn()));
        if (document.querySelector("#hesap .cikti").innerText == "undefined") document.querySelector("#hesap .cikti").innerText = "";
    });
    document.querySelector("#hesap .butonlar button#clear").addEventListener("click", () => {
        document.querySelector("#hesap .cikti").innerHTML = ("");
    });
    document.querySelector("#hesap .butonlar button#back").addEventListener("click", () => {
        document.querySelector("#hesap .cikti").innerHTML = (document.querySelector("#hesap .cikti").innerText.substring(0, document.querySelector("#hesap .cikti").innerText.length - 1));
    });
    document.querySelectorAll("#hesap .butonlar button:not([data-custom])").forEach(item => {
        if (document.querySelector("#hesap .cikti").innerText === "0") document.querySelector("#hesap .cikti").innerText = "";
        item.addEventListener("click", () => {
            document.querySelector("#hesap .cikti").innerHTML = (document.querySelector("#hesap .cikti").innerText + item.innerText);
        });
    });
    document.querySelector(".topbar .mobile").addEventListener("click", () => {
        document.querySelectorAll(".topbar .item").forEach(item => {
            if (item.getAttribute("active")) {
                item.removeAttribute("active");
            }
            else item.setAttribute("active", true);
        });
    });
    document.querySelector("select#tur").addEventListener("change", () => {
        document.querySelectorAll(".esitlik select").forEach(item => item.style.display = "none");
        document.querySelectorAll(`.esitlik select.${document.querySelector("select#tur").value}`).forEach(item => item.style.display = "block");
    });
    document.querySelector("button#hesapla").addEventListener("click", () => {
        document.querySelector(".ceviri-sonuc").innerHTML = (`
        ${document.querySelector("input#ilkSayi").value.replaceAll(".", ",")} ${document.querySelectorAll('select.' + document.querySelector("select#tur").value)[0].options[document.querySelectorAll('select.' + document.querySelector("select#tur").value)[0].selectedIndex].innerText} = ${Number((document.querySelector("input#ilkSayi").value * (birimler[document.querySelector("select#tur").value][document.querySelectorAll('select.' + document.querySelector("select#tur").value)[0].value] / birimler[document.querySelector("select#tur").value][document.querySelectorAll('select.' + document.querySelector("select#tur").value)[1].value])).toFixed(3)).toString().replaceAll(".", ",")} ${document.querySelectorAll('select.' + document.querySelector("select#tur").value)[1].options[document.querySelectorAll('select.' + document.querySelector("select#tur").value)[1].selectedIndex].innerText}
        `);
    });
    document.querySelector(".cevir button#cevir").addEventListener("click", () => {
        if (document.querySelector("input#cevrilecek").value.length > 70) {
            document.querySelector(".cevir .cevrilmis").innerHTML = ("Maalesef 70 karakterden uzun metinler çevrilemez!");
            return;
        }
        getTranslation(
            document.querySelector("select#ilkDil").value,
            document.querySelector("select#sonDil").value,
            capitalizeFLetter(document.querySelector("input#cevrilecek").value)
        );
    });
    document.querySelector(".theme-switch").addEventListener("click", () => {
        document.querySelector(":root").style.setProperty("--text", theme["text"] == "white" ? "rgb(50, 50, 50)" : "white");
        if (theme["text"] == "white") theme["text"] = "rgb(50, 50, 50)"
        else theme["text"] = "white";
        document.querySelector(":root").style.setProperty("--bg", theme["bg"] == "white" ? "rgb(50, 50, 50)" : "white");
        if (theme["bg"] == "white") theme["bg"] = "rgb(50, 50, 50)"
        else theme["bg"] = "white";
        localStorage.setItem("theme", theme["bg"]);
    });
    document.querySelector(":root").style.setProperty("--text", localStorage.getItem("theme") == "white" ? "rgb(50, 50, 50)" : "white");
    document.querySelector(":root").style.setProperty("--bg", localStorage.getItem("theme"));
});
