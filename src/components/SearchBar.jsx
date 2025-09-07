export default function SearchBar({ query, onChange, onSubmit }) {
    return (
      <form className="card search" onSubmit={onSubmit}>
        <input
          className="input"
          value={query}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Cari film (mis. Batman)"
        />
        <button className="button">Cari</button>
      </form>
    );
  }
  