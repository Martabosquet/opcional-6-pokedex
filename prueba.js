//función asíncrona para obtener los pokemons de 10 en 10
async function cargarPokemon() {
    try {
        const response = await fetch(`${API_URL}?limit=${limit}&offset=${offset}`); //solo ver los 10 primeros por pantalla
        if (!response.ok) {
            throw new Error('Error HTTP: ', response.status);
        }

        const data = await response.json();
        const listaPokemons = data.results;
        console.log(listaPokemons);
    } catch (error) {
        console.error("Error al obtener los Pokémon:", error);
    }
}

cargarPokemon();




//quiero recorrer toda la lista de pokemon:

for (let i = 1; i <= 151; i++) {
    fetch(API_URL + i)
        .then(response => response.json())
        .then(data => enseñarPokemon(data))

}


function enseñarPokemon(pokemon) {
    const div = document.createElement("div");
    div.classList.add("pokemon-card");
    div.innerHTML = `
        <img src="${pokemon.sprites.other['official-artwork'].front_default}" alt="${pokemon.name}">
        <h3>${pokemon.name}</h3>
    `
    contenedor.appendChild(div);
};





async function insertPokemon() {
    try {
        const res = await fetch(`${API_URL}${searchInput.value.toLowerCase()}`);
        const pokemonDataJSON = await res.json();

        const allItems = [];
        const result = []; //*Guardaremos la respuesta en el array

        for (let pokemonInfo in pokemonDataJSON) { //*Convertimos el objeto JSON a array
            result.push([pokemonInfo, pokemonDataJSON[pokemonInfo]]);
        }

        console.table(result);

    } catch (error) {
        alert("Pokemon no encontrado. Intenta con otro nombre 🙁 ");
    }
    searchInput.value = "";
}