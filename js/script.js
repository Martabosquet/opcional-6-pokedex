//traigo del DOM
const API_URL = "https://pokeapi.co/api/v2/pokemon/";
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const resetBtn = document.getElementById("resetBtn");
const searchBtn = document.getElementById("searchBtn");
const searchInput = document.getElementById("searchInput");
const contenedor = document.getElementById("app");
const spinner = document.getElementById("spinner");


//variables globales
let offset = 1;
let limit = 10;

//FETCH POKEMON

function fetchPokemon(id) {
    fetch(`${API_URL}${id}`)
        .then(res => res.json())
        .then(data => {
            console.log(data)
            enseñarPokemon(data);
            spinner.classList.add("hidden");
        })
}

function traerPokemons(offset, limit) {
    spinner.classList.remove("hidden");
    for (let i = offset; i <= offset + limit; i++) {
        fetchPokemon(i);
    }
}



function enseñarPokemon(pokemon) {
    const pokemonCard = document.createElement("div");
    pokemonCard.classList.add("pokemon-card");
    pokemonCard.innerHTML = `
        <img src="${pokemon.sprites.other['official-artwork'].front_default}" alt="${pokemon.name}">
        <div class="infoContainer">
            <p class="pokemon-info">Weight: ${pokemon.weight}kg</p>
            <p class="pokemon-info">Base stat: ${pokemon.stats[0].base_stat}</p>
        </div>
        <h3>${pokemon.name}</h3>
        <!-- <button class="favoriteBtn">Add to favorites</button> -->
    `
    contenedor.appendChild(pokemonCard);
};

//AÑADO LOS EVENTOS PARA LOS BOTONES

prevBtn.addEventListener("click", () => {
    if (offset != 1) { //solo si no es la primera página
        offset -= 10;
        removePokemons(contenedor);
        traerPokemons(offset, limit);
    }
});

nextBtn.addEventListener("click", () => {
    offset += 10;
    removePokemons(contenedor);
    traerPokemons(offset, limit);
});

resetBtn.addEventListener("click", () => {
    offset = 1;
    removePokemons(contenedor);
    traerPokemons(offset, limit);
});

searchBtn.addEventListener("click", insertPokemon);

// FUNCIÓN PARA RESETEAR LOS POKEMONS QUE YA NO SE TIENEN QUE VER EN PANTALLA
function removePokemons(pokemon) {
    while (contenedor.firstChild) {
        contenedor.removeChild(contenedor.firstChild);
    }
}

//FUNCION PARA INSERTAR Y BUSCAR LOS POKEMONS

async function insertPokemon() {
    try {
        const res = await fetch(`${API_URL}${searchInput.value.toLowerCase()}`);
        if (!res.ok) {
            throw new Error("Pokemon no encontrado");
        }

        const pokemonDataJSON = await res.json();

        removePokemons(contenedor);
        enseñarPokemon(pokemonDataJSON);

    } catch (error) {
        alert("Pokemon no encontrado. Intenta con otro nombre 🙁 ");
        console.error("Error en la búsqueda:", error.message);
    } finally {
        searchInput.value = "";
    }
}

//INICIAMOS LA PÁGINA CON LOS PRIMEROS 10 POKEMONS

traerPokemons(offset, limit);