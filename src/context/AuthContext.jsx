import { useMemo, useState, useEffect } from "react";
import { AuthCtx } from "../hooks/useAuth";

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    // Initialize from localStorage if available
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });

  // Persist user to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  async function login({ username, pin }) {
    const base = import.meta.env.VITE_API_URL + "/users";
    const u = username.trim();
    const p = pin.trim();

    const res = await fetch(
      `${base}?user_name=${encodeURIComponent(u)}&pin=${encodeURIComponent(p)}`
    );
    if (!res.ok) throw new Error("API unreachable");

    const list = await res.json();
    const record = list.find((x) => x.user_name === u && x.pin === p);

    if (!record) throw new Error("Invalid credentials");

    setUser(record);
    localStorage.setItem("userId", record.id);
    localStorage.setItem("user", JSON.stringify(record));
    return record;
  }

  function logout() {
    setUser(null);
  }

  const value = useMemo(() => ({ user, login, logout }), [user]);
  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}
