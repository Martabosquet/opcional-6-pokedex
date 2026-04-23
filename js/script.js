//traigo del DOM
const API_URL = "https://pokeapi.co/api/v2/pokemon/";
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const resetBtn = document.getElementById("resetBtn");
const searchBtn = document.getElementById("searchBtn");
const searchInput = document.getElementById("searchInput");
const contenedor = document.getElementById("app");
const spinner = document.getElementById("spinner");
const favoritesBtn = document.getElementById("favoritesBtn");
const backToPokedexBtn = document.getElementById("backToPokedexBtn");

//variables pokemon por pantalla
let offset = 1;
let limit = 9;

//FETCH CON THEN METHOD

// function fetchPokemon(id) {
//     fetch(`${API_URL}${id}`)
//         .then((res) => {
//             if (!res.ok) {
//                 throw new Error("Pokemon no encontrado");
//             }
//             return res.json();
//         })
//         .then(data => {
//             console.log(data)
//             enseñarPokemon(data);
//             spinner.classList.add("hidden");
//         })
// }

//FETCH CON ASYNC Y AWAIT

async function fetchPokemon(id) {
    try {
        const data = await fetchJSON(`${API_URL}${id}`); enseñarPokemon(data);
    } catch (error) {
        console.error("Error al obtener Pokemon:", error.message);
    } finally {
        spinner.classList.add("hidden");
    }
}

const fetchJSON = async (url) => {
    const res = await fetch(url);
    if (!res.ok) {
        throw new Error(`Error HTTP: ${res.status}`);
    }
    return await res.json();
};


// function traerPokemons(offset, limit) {
//     spinner.classList.remove("hidden");
//     for (let i = offset; i <= offset + limit; i++) {
//         fetchPokemon(i);
//     }
// }

// TRAER POKEMONS CON ASYNC Y AWAIT

async function traerPokemons(offset, limit) {
    spinner.classList.remove("hidden");
    for (let i = offset; i <= offset + limit; i++) {
        await fetchPokemon(i);
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
        <button class="favoriteBtn">Add to favorites</button>
    `
    // evento para hacer click en favorito
    const btnFavorito = pokemonCard.querySelector(".favoriteBtn");

    btnFavorito.addEventListener("click", () => {
        añadirAFavoritos(pokemon);
    });
    contenedor.appendChild(pokemonCard);
};

//función para añadir favoritos

function añadirAFavoritos(pokemon) {
    let favoritos = JSON.parse(localStorage.getItem("misFavoritos")) || [];

    const existe = favoritos.some(fav => fav.id === pokemon.id); // Evitar duplicados

    if (!existe) {
        favoritos.push(pokemon); // añadimos el pokemon
        localStorage.setItem("misFavoritos", JSON.stringify(favoritos)); // guardamos
        alert(`${pokemon.name} añadido a favoritos!`); // mensaje
    } else {
        alert("Este Pokémon ya está en tus favoritos");
    }
    //window.location.href = 'favoritos.html'; REDIRECCIÓN: Vamos a la pestaña de favoritos
}

// FUNCIÓN PARA RESETEAR LOS POKEMONS QUE YA NO SE TIENEN QUE VER EN PANTALLA
function removePokemons(pokemon) {
    while (contenedor.firstChild) {
        contenedor.removeChild(contenedor.firstChild);
    }
}

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

//eventos para navegar entre pestañas

favoritesBtn.addEventListener('click', () => {
    window.location.href = 'favoritos.html';
});

backToPokedexBtn.addEventListener('click', () => {
    window.location.href = 'index.html';
});



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

searchBtn.addEventListener("click", insertPokemon);

searchInput.addEventListener("keydown", (event) => { // Clicar en ENTER para que pueda entrar en el pokemon buscado
    if (event.key === "Enter") {
        insertPokemon();
    }
});

//INICIAMOS LA PÁGINA CON LOS PRIMEROS 10 POKEMONS

traerPokemons(offset, limit);