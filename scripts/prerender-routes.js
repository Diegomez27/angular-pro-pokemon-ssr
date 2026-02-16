
const TOTAL_POKEMON_COUNT = 151;
const TOTAL_PAGES = 5;

(async () => {

  const fs = require('fs');

  const pokemonIds = Array.from({length: TOTAL_POKEMON_COUNT}, (_, i) => i + 1);

  let fileContent = pokemonIds.map(
    id => `/pokemon/${id}`
  ).join('\n');

  for(let index = 1; index <= TOTAL_PAGES; index++){
    fileContent += `\npokemon/page/${index}`;
  }


  const pokemonNameList = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${TOTAL_POKEMON_COUNT}`)
    .then(res => res.json());

  fileContent += '\n';
  fileContent += pokemonNameList.results.map(
    pokemon => `/pokemon/${pokemon.name}`
  ).join('\n');

  fs.writeFileSync('routes.txt', fileContent);

  console.log(fileContent);
})();
