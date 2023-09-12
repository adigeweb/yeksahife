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
        yarda: 1.0936133,
        fit: 3.2808399,
        inc: 39.3700787,
        angstrom: 10000000000
    },
    sicak: {
        santigrat: 1,
        fahrenayt: 33.8,
        kelvin: 274.15,
        reaumur: 1.25
    },
    agir: {
        kilogram: 1000,
        gram: 1,
        ton: 1000000,
        libre: 0.45359237
    },
    sure: {
        saniye: 1,
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
                    item.setHTML(`${hrs}:00`);
                });
                document.querySelectorAll("table#hava tr")[1].querySelectorAll("td").forEach((item, index) => {
                    let hrs = new Date().getHours() + (index - 2);
                    item.setHTML(`${data["hourly"]["temperature_2m"][hrs]}°C`);
                });
            });
    }
    const getWord = (word) => {
        document.querySelector(".sozluk .sonuclar").setHTML("");
        fetch(`https://sozluk.gov.tr/gts?ara=${word}`)
            .then(res => res.json())
            .then(data => {
                document.querySelector(".sozluk .error").style.display = "none";
                let anlamlar = data[0]["anlamlarListe"];
                anlamlar.forEach((item, index) => {
                    let elem = document.createElement("p");
                    elem.setHTML(`${index + 1}. ${item["anlam"].replaceAll("►", "")}`);
                    document.querySelector(".sozluk .sonuclar").appendChild(elem);
                });
            })
            .catch(error => {
                console.error(error);
                document.querySelector(".sozluk .error").style.display = "block";
                document.querySelector(".sozluk .error").setHTML(`"${word}" kelimesi bulunamadı :(`);
            });
    }
    const getSalahTimes = (pos) => {
        const date = `${new Date().getUTCFullYear()}-${(new Date().getUTCMonth() + 1).toString().padStart(2, "0")}-${(new Date().getUTCDate()).toString().padStart(2, "0")}`;
        fetch(`https://namaz-vakti.vercel.app/api/timesFromCoordinates?lat=${pos.coords.latitude}&lng=${pos.coords.longitude}&date=${date}&days=1&timezoneOffset=180&calculationMethod=Turkey`)
            .then(res => res.json())
            .then(data => {
                console.log(data["times"][date]);
                document.querySelector(".namaz-vakti #section-title").setHTML(`${data.place.city} için Bugünkü Namaz Vakitleri`);
                document.querySelectorAll("table#vakitler td").forEach((item, index) => {
                    item.setHTML(data["times"][date][index]);
                });
            });
    }
    document.querySelector("button#retry").addEventListener("click", () => {
        navigator.geolocation.getCurrentPosition(getTemparature);
    });
    document.querySelector("button#ara").addEventListener("click", () => {
        getWord(document.querySelector(".sozluk input").value);
    });
    document.querySelector("button#sifirla").addEventListener("click", () => {
        document.querySelector(".sozluk input").value = "";
        document.querySelector(".sozluk .sonuclar").setHTML("");
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
        document.querySelector("#hesap .cikti").setHTML(eval(fn()));
        if (document.querySelector("#hesap .cikti").innerText == "undefined") document.querySelector("#hesap .cikti").innerText = "";
    });
    document.querySelector("#hesap .butonlar button#clear").addEventListener("click", () => {
        document.querySelector("#hesap .cikti").setHTML("");
    });
    document.querySelector("#hesap .butonlar button#back").addEventListener("click", () => {
        document.querySelector("#hesap .cikti").setHTML(document.querySelector("#hesap .cikti").innerText.substring(0, document.querySelector("#hesap .cikti").innerText.length - 1));
    });
    document.querySelectorAll("#hesap .butonlar button:not([data-custom])").forEach(item => {
        if (document.querySelector("#hesap .cikti").innerText === "0") document.querySelector("#hesap .cikti").innerText = "";
        item.addEventListener("click", () => {
            document.querySelector("#hesap .cikti").setHTML(document.querySelector("#hesap .cikti").innerText + item.innerText);
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
    document.querySelector(".max-num-warning").setHTML(Number.MAX_VALUE);
});