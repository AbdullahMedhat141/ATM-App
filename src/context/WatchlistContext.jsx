import { useMemo, useState } from "react";
import { WatchlistCtx } from "../hooks/useWatchlist";

const RATES = { USD: 3.7, EUR: 4.1, JOD: 5.2 };

export function WatchlistProvider({ children }) {
  const [symbols, setSymbols] = useState([]);

  const toggle = (s) =>
    setSymbols((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
    );

  const remove = (s) => setSymbols((prev) => prev.filter((x) => x !== s));

  const value = useMemo(() => {
    const isSaved = (s) => symbols.includes(s);
    return { symbols, toggle, remove, isSaved, rates: RATES };
  }, [symbols]);

  return (
    <WatchlistCtx.Provider value={value}>{children}</WatchlistCtx.Provider>
  );
}
