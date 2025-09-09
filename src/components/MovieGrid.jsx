import MovieCard from "./MovieCard";

export default function MovieGrid({ items, favorites, onToggleFav, onShowDetail, onShowReview }) {
  const favSet = new Set(favorites.map(f => f.imdbID));
  return (
    <div className="grid">
      {items.map(m => (
        <MovieCard
          key={m.imdbID}
          movie={m}
          isFav={favSet.has(m.imdbID)}
          onToggleFav={onToggleFav}
          onShowDetail={onShowDetail}
          onShowReview={onShowReview}
        />
      ))}
    </div>
  );
}
