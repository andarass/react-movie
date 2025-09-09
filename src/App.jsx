import { useState, useEffect } from "react";
import { searchMovies, getMovieById } from "./services/omdb";
import { useLocalStorage } from "./hooks/useLocalStorage";
import SearchBar from "./components/SearchBar";
import MovieGrid from "./components/MovieGrid";
import Pagination from "./components/Pagination";
import FavoritesPanel from "./components/FavoritesPanel";
import Modal from "./components/Modal";
import { useReviews } from "./hooks/useReviews.js";
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
  const [showReviewModal, setShowReviewModal] = useState(false);

  const { reviews, addReview } = useReviews();
  const [reviewText, setReviewText] = useState("");
  const [favorites, setFavorites] = useLocalStorage("favorites", []);

  // ---------- DEFAULT HOMEPAGE (popular) ----------
  useEffect(() => {
    fetchDefaultMovies();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchDefaultMovies() {
    const popularQueries = [
      "Inception",
      "The Dark Knight",
      "Interstellar",
      "Avengers: Endgame",
      "Joker",
      "Parasite",
      "Titanic",
      "The Matrix",
      "Fight Club",
      "Forrest Gump",
    ];

    setLoading(true);
    setErr("");
    setItems([]);
    setPage(1);

    try {
      const promises = popularQueries.map((q) =>
        searchMovies(q, 1).catch(() => null)
      );
      const results = await Promise.all(promises);

      const movies = [];
      for (const res of results) {
        if (res && Array.isArray(res.items) && res.items.length > 0) {
          const first = res.items[0];
          if (!movies.some((m) => m.imdbID === first.imdbID)) {
            movies.push(first);
          }
        }
      }

      setItems(movies);
      setTotalPages(1);
    } catch (e) {
      console.error("fetchDefaultMovies error:", e);
      setErr("Gagal memuat beranda.");
    } finally {
      setLoading(false);
    }
  }

  // ---------- SEARCH ----------
  async function doSearch(e) {
    if (e) e.preventDefault();
    if (!query.trim()) {
      fetchDefaultMovies();
      return;
    }
    setLoading(true);
    setErr("");
    setItems([]);
    setPage(1);
    setDetail(null);

    try {
      const { items: found, total } = await searchMovies(query, 1);
      setItems(found || []);
      setTotalPages(Math.ceil((total || 0) / 10));
    } catch (e) {
      setErr(e.message || "Gagal mencari");
    } finally {
      setLoading(false);
    }
  }

  // ---------- PAGINATION ----------
  async function changePage(p) {
    setPage(p);
    setLoading(true);
    setErr("");
    setItems([]);
    try {
      const { items: found, total } = await searchMovies(query, p);
      setItems(found || []);
      setTotalPages(Math.ceil((total || 0) / 10));
    } catch (e) {
      setErr(e.message || "Gagal memuat");
    } finally {
      setLoading(false);
    }
  }

  // ---------- FAVORITES ----------
  function toggleFav(movie) {
    setFavorites((prev) => {
      const exists = prev.some((m) => m.imdbID === movie.imdbID);
      return exists ? prev.filter((m) => m.imdbID !== movie.imdbID) : [movie, ...prev];
    });
  }

  // ---------- DETAIL & MODAL ----------
  async function showDetail(id) {
    setDetail(null);
    setShowModal(true);
    try {
      const data = await getMovieById(id);
      setDetail(data);
    } catch (e) {
      setDetail({ error: e.message });
    }
  }

  const [reviewMovieId, setReviewMovieId] = useState(null);

  function showReview(id) {
    setReviewMovieId(id);
    setShowReviewModal(true);
  }

  return (
    <div className="page">
      <div className="container">
        <div className="header">
          <h1>🎬 iMovie</h1>

          <SearchBar query={query} onChange={setQuery} onSubmit={doSearch} />

          {err && <p className="empty">Error: {err}</p>}
          {loading && <p className="muted">Loading…</p>}
        </div>

        <div className="content">
          {!loading && !err && items.length > 0 && (
            <MovieGrid
              items={items}
              favorites={favorites}
              onToggleFav={toggleFav}
              onShowDetail={showDetail}
              onShowReview={showReview}
            />
          )}

          <FavoritesPanel
            items={favorites}
            onToggleFav={toggleFav}
            onPick={showDetail}
          />

          <Pagination page={page} total={totalPages} onChange={changePage} />
        </div>

        {/* 🔹 Modal Detail */}
        <Modal open={showModal} onClose={() => setShowModal(false)}>
          {detail && !detail.error ? (
            <div className="detail-content">
              <img src={detail.Poster} alt={detail.Title} />
              <div className="detail-text">
                <h2>
                  {detail.Title} ({detail.Year})
                </h2>
                <p className="director">Directed by {detail.Director}</p>
                <p>{detail.Plot}</p>
                <p className="muted">
                  {detail.Genre} • {detail.Runtime} • ⭐ {detail.imdbRating}
                </p>
              </div>
            </div>
          ) : detail && detail.error ? (
            <p className="empty">Detail error: {detail.error}</p>
          ) : (
            <p className="muted">Memuat detail...</p>
          )}
        </Modal>

        {/* 🔹 Modal Review */}
        <Modal open={showReviewModal} onClose={() => setShowReviewModal(false)}>
          {reviewMovieId ? (
            <div className="review-section">
              <h2>Review untuk {items.find(m => m.imdbID === reviewMovieId)?.Title}</h2>
              
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!reviewText.trim()) return;
                  addReview(reviewMovieId, reviewText);
                  setReviewText("");
                }}
              >
                <textarea
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Tulis review kamu..."
                  rows={3}
                />
                <button type="submit">Kirim</button>
              </form>

              {/* 🔹 Daftar review */}
              <div className="review-list">
                <h4>Review Pengguna:</h4>
                {reviews[reviewMovieId]?.length ? (
                  <ul>
                    {reviews[reviewMovieId].map((r, i) => (
                      <li key={i}>
                        <p>{r.text}</p>
                        <span className="muted">
                          {new Date(r.date).toLocaleString()}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="muted">Belum ada review.</p>
                )}
              </div>
            </div>
          ) : (
            <p className="muted">Memuat review...</p>
          )}
        </Modal>
      </div>
    </div>
  );
}