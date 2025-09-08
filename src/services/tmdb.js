// src/services/tmdb.js
const API_KEY = import.meta.env.VITE_TMDB_KEY;
const BASE = "https://api.themoviedb.org/3";
const IMG_BASE = "https://image.tmdb.org/t/p/"; // + size + path, contoh size 'w500'

async function request(path, params = {}) {
  const url = new URL(`${BASE}${path}`);
  url.searchParams.set("api_key", API_KEY);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export async function fetchPopular(page = 1) {
  return request("/movie/popular", { page });
}

export async function fetchTopRated(page = 1) {
  return request("/movie/top_rated", { page });
}

export async function fetchTrending(type = "movie", timeWindow = "day") {
  return request(`/trending/${type}/${timeWindow}`);
}

export async function searchMovies(query, page = 1) {
  return request("/search/movie", { query, page, include_adult: false });
}

export async function getMovieDetails(id) {
  // append credits or videos jika mau: append_to_response=credits,videos
  return request(`/movie/${id}`, { append_to_response: "credits,videos" });
}

export function getImageUrl(path, size = "w500") {
  if (!path) return null;
  return `${IMG_BASE}${size}${path}`;
}
