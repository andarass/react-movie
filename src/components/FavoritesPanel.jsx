export default function FavoritesPanel({ items, onToggleFav, onPick }) {
    if (!items.length) return null;
  
    return (
      <div className="favorites card">
        <div className="fav-head">
          <h2>Favorites</h2>
          <span className="badge-count">{items.length}</span>
        </div>
  
        <ul className="fav-list">
          {items.map(m => (
            <li key={m.imdbID} className="fav-item">
              <button className="link" onClick={() => onPick(m.imdbID)}>
                {m.Title} ({m.Year})
              </button>
              <button className="remove" onClick={() => onToggleFav(m)}>×</button>
            </li>
          ))}
        </ul>
      </div>
    );
  }
  