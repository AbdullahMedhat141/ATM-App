import { useWatchlist } from "../../hooks/useWatchlist";

export default function CurrencyList() {
  const { rates, toggle, isSaved } = useWatchlist();

  const entries = Object.entries(rates);

  return (
    <section style={{ marginBottom: 24 }}>
      <h2 style={{ fontSize: 18, marginBottom: 8 }}>All Currencies</h2>
      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {entries.map(([code, rate]) => {
          const saved = isSaved(code);
          return (
            <li
              key={code}
              style={{
                display: "grid",
                gridTemplateColumns: "1fr auto",
                gap: 12,
                alignItems: "center",
                padding: "10px 8px",
                borderBottom: "1px solid #eee",
              }}
            >
              <div>
                <strong>{code}</strong>
                <div style={{ fontSize: 12, opacity: 0.8 }}>Rate: {rate}</div>
              </div>

              <button
                type="button"
                onClick={() => toggle(code)}
                title={saved ? "Remove from watchlist" : "Add to watchlist"}
              >
                {saved ? "⭐" : "☆"}
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
