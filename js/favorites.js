const favoritosContenedor = document.getElementById("favoritos");

function mostrarPokemonFavorito(pokemon) {
    const pokemonCard = document.createElement("div");
    pokemonCard.classList.add("pokemon-card");

    pokemonCard.innerHTML = `
        <img src="${pokemon.sprites.other['official-artwork'].front_default}" alt="${pokemon.name}">
        <div class="infoContainer">
            <p class="pokemon-info">Weight: ${pokemon.weight}kg</p>
            <p class="pokemon-info">Base stat: ${pokemon.stats[0].base_stat}</p>
        </div>
        <h3>${pokemon.name}</h3>
        <button class="removeBtn">Eliminar de favoritos</button>
    `;

    // Botón para eliminar favorito
    pokemonCard.querySelector(".removeBtn").addEventListener("click", () => {
        eliminarDeFavoritos(pokemon.id);
    });

    favoritosContenedor.appendChild(pokemonCard);
}

//LOCAL STORAGE
function cargarFavoritos() {
    favoritosContenedor.innerHTML = ""; //limpio contenedor
    const favoritos = JSON.parse(localStorage.getItem("misFavoritos")) || []; //texto en objeto

    if (favoritos.length === 0) {
        favoritosContenedor.innerHTML = "<p>No tienes Pokémon favoritos todavía 🙁.</p>";
    } else {
        favoritos.forEach(pokemon => {
            mostrarPokemonFavorito(pokemon);
        });
    }
}

// Función para eliminar de favoritos
function eliminarDeFavoritos(id) {
    let favoritos = JSON.parse(localStorage.getItem("misFavoritos")) || [];

    favoritos = favoritos.filter(p => p.id !== id); //filtramos por todos menos el que queremos borrar
    localStorage.setItem("misFavoritos", JSON.stringify(favoritos)); // Guardamos la nueva lista
    cargarFavoritos(); // Recargamos la vista
}

// INICIAMOS LOS FAVORITOS
cargarFavoritos();