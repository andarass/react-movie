import { useState } from "react";
import { searchMovies, getMovieById } from "./services/omdb";
import { useLocalStorage } from "./hooks/useLocalStorage";
import SearchBar from "./components/SearchBar";
import MovieGrid from "./components/MovieGrid";
import Pagination from "./components/Pagination";
import FavoritesPanel from "./components/FavoritesPanel";
import Modal from "./components/Modal";
import "./App.css";

export default function App() {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [items, setItems] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [detail, setDetail] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [favorites, setFavorites] = useLocalStorage("favorites", []);

  async function doSearch(e) {
    if (e) e.preventDefault();
    if (!query.trim()) return;
    setLoading(true); setErr(""); setItems([]); setPage(1); setDetail(null);

    try {
      const { items, total } = await searchMovies(query, 1);
      setItems(items);
      setTotalPages(Math.ceil(total / 10));
    } catch (e) {
      setErr(e.message || "Gagal mencari");
    } finally {
      setLoading(false);
    }
  }

  async function changePage(p) {
    setPage(p); setLoading(true); setErr(""); setItems([]);
    try {
      const { items, total } = await searchMovies(query, p);
      setItems(items);
      setTotalPages(Math.ceil(total / 10));
    } catch (e) {
      setErr(e.message || "Gagal memuat");
    } finally {
      setLoading(false);
    }
  }

  function toggleFav(movie) {
    setFavorites(prev => {
      const exists = prev.some(m => m.imdbID === movie.imdbID);
      return exists ? prev.filter(m => m.imdbID !== movie.imdbID) : [movie, ...prev];
    });
  }

  async function showDetail(id) {
    setDetail(null);
    try {
      const data = await getMovieById(id);
      setDetail(data);
    } catch (e) {
      setDetail({ error: e.message });
    }
  }

  async function showDetail(id) {
    setDetail(null);
    try {
      const data = await getMovieById(id);
      setDetail(data);
      setShowModal(true);
    } catch (e) {
      setDetail({ error: e.message });
      setShowModal(true);
    }
  }

  return (
    <div className="page">
      <div className="container">
        <div className="header">
          <h1>🎬 Movie Finder</h1>

          <SearchBar query={query} onChange={setQuery} onSubmit={doSearch} />

          {err && <p className="empty">Error: {err}</p>}
          {loading && <p className="muted">Loading…</p>}
        </div>
        
        {!loading && !err && items.length > 0 && (
          <>
            <MovieGrid
              items={items}
              favorites={favorites}
              onToggleFav={toggleFav}
              onShowDetail={showDetail}
            />
            <Pagination page={page} total={totalPages} onChange={changePage} />
          </>
        )}

        <FavoritesPanel items={favorites} onToggleFav={toggleFav} onPick={showDetail} />

        {/* 🔹 Modal Detail */}
        <Modal open={showModal} onClose={() => setShowModal(false)}>
          {detail && !detail.error ? (
            <div className="detail-content">
              <h2>{detail.Title} ({detail.Year})</h2>
              <p>{detail.Plot}</p>
              <p className="muted">
                {detail.Genre} • {detail.Runtime} • ⭐ {detail.imdbRating}
              </p>
            </div>
          ) : detail && detail.error ? (
            <p className="empty">Detail error: {detail.error}</p>
          ) : (
            <p className="muted">Memuat detail...</p>
          )}
        </Modal>
      </div>
    </div>
  );
}