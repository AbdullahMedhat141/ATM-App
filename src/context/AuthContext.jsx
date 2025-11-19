import { useMemo, useState, useEffect } from "react";
import { AuthCtx } from "../hooks/useAuth";
import { get } from "../services/api";

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
      if (user.id) {
        localStorage.setItem(`user_${user.id}`, JSON.stringify({
          balance: user.balance,
          transactions: user.transactions || [],
        }));
      }
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

    const storedDataKey = `user_${record.id}`;
    const storedData = localStorage.getItem(storedDataKey);
    
    if (storedData) {
      try {
        const parsedStored = JSON.parse(storedData);
        const mergedUser = {
          ...record,
          balance: parsedStored.balance !== undefined ? parsedStored.balance : record.balance,
          transactions: parsedStored.transactions && parsedStored.transactions.length > 0 
            ? parsedStored.transactions 
            : (record.transactions || []),
        };
        setUser(mergedUser);
        localStorage.setItem("userId", mergedUser.id);
        return mergedUser;
      } catch (e) {
        console.warn("Failed to merge stored user data:", e);
      }
    }

    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedStored = JSON.parse(storedUser);
        if (parsedStored.id === record.id || parsedStored.user_name === record.user_name) {
          const mergedUser = {
            ...record,
            balance: parsedStored.balance !== undefined ? parsedStored.balance : record.balance,
            transactions: parsedStored.transactions && parsedStored.transactions.length > 0 
              ? parsedStored.transactions 
              : (record.transactions || []),
          };
          setUser(mergedUser);
          localStorage.setItem("userId", mergedUser.id);
          return mergedUser;
        }
      } catch (e) {
        console.warn("Failed to merge stored user data:", e);
      }
    }

    setUser(record);
    localStorage.setItem("userId", record.id);
    return record;
  }

  async function refreshUser() {
    if (!user || !user.id) return;
    try {
      const updatedUser = await get(`/users/${user.id}`);
      setUser(updatedUser);
      return updatedUser;
    } catch (error) {
      console.error("Failed to refresh user:", error);
      return null;
    }
  }

  function updateUser(updates) {
    if (!user) return;
    setUser({ ...user, ...updates });
  }

  function logout() {
    if (user && user.id) {
      const dataToSave = {
        balance: user.balance,
        transactions: user.transactions || [],
      };
      localStorage.setItem(`user_${user.id}`, JSON.stringify(dataToSave));
    }
    setUser(null);
    localStorage.removeItem("user");
  }

  const value = useMemo(() => ({ user, login, logout, refreshUser, updateUser }), [user]);
  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}
