import { createContext, useContext } from "react";

export const WatchlistCtx = createContext(null);

export function useWatchlist() {
  const ctx = useContext(WatchlistCtx);
  if (!ctx)
    throw new Error("useWatchlist must be used inside WatchlistProvider");
  return ctx;
}
