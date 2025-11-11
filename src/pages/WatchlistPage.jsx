import { useWatchlist } from "../hooks/useWatchlist";
import CurrencyList from "../components/watchlist/CurrencyList";

export default function WatchlistPage() {
  const { symbols, rates, remove } = useWatchlist();

  const saved = symbols
    .map((code) => [code, rates[code]])
    .filter(([, rate]) => rate != null);

  return (
    <div style={{ maxWidth: 640, margin: "2rem auto", padding: "0 8px" }}>
      <h1 style={{ marginBottom: 16 }}>Currency Watchlist</h1>

      <CurrencyList />
      <section>
        <h2 style={{ fontSize: 18, marginBottom: 8 }}>My Watchlist</h2>
        {saved.length === 0 ? (
          <p style={{ opacity: 0.7 }}>
            No currencies added yet — use the ⭐ above.
          </p>
        ) : (
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {saved.map(([code, rate]) => (
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
                <button onClick={() => remove(code)}>Remove</button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
