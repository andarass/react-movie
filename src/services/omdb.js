const API_BASE = 'https://www.omdbapi.com/';
const API_KEY = import.meta.env.VITE_OMDB_KEY;

export async function searchMovies(query, page = 1) {
  const url = `${API_BASE}?apikey=${API_KEY}&s=${encodeURIComponent(query)}&page=${page}`;
  const res = await fetch(url);
  const json = await res.json();
  if (json.Response === "False") throw new Error(json.Error || "No results");
  return { items: json.Search, total: Number(json.totalResults) || 0 };
}

export async function getMovieById(id) {
  const url = `${API_BASE}?apikey=${API_KEY}&i=${id}&plot=short`;
  const res = await fetch(url);
  const json = await res.json();
  if (json.Response === "False") throw new Error(json.Error || "Not found");
  return json;
}
