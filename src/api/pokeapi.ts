export const getPokemon = async (limit: number = 20, offset: number = 0) => {
  try {
    const res = await fetch(
      `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`
    );
    const data = await res.json();

    const promises = data.results.map((pokemon: any) =>
      getPokemonData(pokemon.name)
    );
    const pokemons = await Promise.all(promises);

    return { count: data.count, pokemons };
  } catch (error) {
    throw new Error("🧪 Check connection");
  }
};

export const getPokemonData = async (pokemon: string | undefined) => {
  try {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}`);
    return await res.json();
  } catch (error) {
    throw new Error("🧪 Check connection");
  }
};
