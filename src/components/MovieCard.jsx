export default function MovieCard({ movie, isFav, onToggleFav, onShowDetail, onShowReview }) {
    const posterNA = !movie.Poster || movie.Poster === "N/A";
  
    return (
      <div className="movie-card">
        <div className="poster-wrap">
          {posterNA ? (
            <div className="poster-placeholder">No Image</div>
          ) : (
            <img src={movie.Poster} alt={movie.Title} />
          )}
          <button
            className={`fav ${isFav ? "active" : ""}`}
            title={isFav ? "Hapus dari Favorite" : "Tambahkan ke Favorite"}
            onClick={() => onToggleFav(movie)}
          >
            {isFav ? "★" : "☆"}
          </button>
        </div>
        <div className="info">
          <h3>{movie.Title}</h3>
          <p className="meta">{movie.Year} • {movie.Type}</p>
          <button onClick={() => onShowDetail(movie.imdbID)}>Detail</button>
          <button onClick={() => onShowReview(movie.imdbID)}>Review</button>
        </div>
      </div>
    );
  }
  