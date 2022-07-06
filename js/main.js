const container = document.querySelector(".container");
const template = document.getElementById("template_pokemon").content;
const fragmento = document.createDocumentFragment();
const btn_antes = document.getElementById("btn_antes");
let url_siguiente, url_antes;
let res, json;

document.addEventListener("DOMContentLoaded", async (e) => {
    try {
        res = await fetch("https://pokeapi.co/api/v2/pokemon");
        json = await res.json();
        validarErrorFetch(res);
        desactivarBotonAntes();
        let pokemones = obtenerPokemones(json);
        asignarUrls(json);
        renderizarPokemones(pokemones);
    } catch (err) {
        manejarErrorCatch(err);
    }
});


document.addEventListener("click", async (e) => {
    if (e.target.matches(".btn_siguiente")) {
        agregarPreloader();
        setTimeout(async (e) => {
            try {
                container.innerHTML = "";
                let res = await fetch(url_siguiente);
                let json = await res.json();
                validarErrorFetch(res);
                activarBotonAntes();
                let pokemones = obtenerPokemones(json);
                asignarUrls(json);
                renderizarPokemones(pokemones);
            } catch (err) {
                manejarErrorCatch(err);
            }
        }, 1000);
    }
    if (e.target.matches(".btn_antes")) {
        agregarPreloader();

        setTimeout(async (e) => {
            try {
                container.innerHTML = "";
                let res = await fetch(url_antes);
                let json = await res.json();
                validarErrorFetch(res);
                asignarUrls(json);
                if (url_antes === null) {
                    btn_antes.disabled = true;
                }
                let pokemones = obtenerPokemones(json);
                renderizarPokemones(pokemones);
            } catch (err) {
                manejarErrorCatch(err);
            }
        }, 1000);
    }
});


function validarErrorFetch(res) {
    if (!res.ok) {
        throw { statusText: res.statusText, status: res.status };
    }
}

function desactivarBotonAntes() {
    btn_antes.disabled = true;
}

function activarBotonAntes() {
    btn_antes.disabled = false;
}

function asignarUrls(json) {
    url_siguiente = json.next;
    url_antes = json.previous;
}

function obtenerPokemones(json) {
    return json.results;
}

function renderizarPokemones(pokemones) {
    pokemones.forEach(async (el) => {
        let resImage = await fetch(el.url);
        let jsonImage = await resImage.json();
        template.querySelector(".imagen_pokemon").src = jsonImage.sprites.front_default;
        template.querySelector(".imagen_pokemon").alt = el.name;
        template.querySelector("figcaption").textContent = el.name;

        let clone = document.importNode(template, true);
        container.appendChild(clone);
    });
}

function manejarErrorCatch(err) {
    let message = err.statusText || "Ocurrió un error";
    container.innerHTML = `<p>Error ${err.status}: ${message}</p>`;
}

function agregarPreloader() {
    container.innerHTML = `
        <div class="container_preloader" style="width: 100%;height: 250px">
            <img src="./assets/Preloader.gif" style="width: 300px;height: 250px;">
        </div>`;
}