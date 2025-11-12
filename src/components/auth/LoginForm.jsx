import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";

function LoginForm() {
  const [username, setUsername] = useState("");
  const [pin, setPin] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!username.trim() || !pin.trim()) {
      setError("Please enter both username and PIN.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      await login({ username, pin });
      navigate("/dashboard", { replace: true });
    } catch {
      setError("Invalid username or PIN. Please try again.");
    } finally {
      setLoading(true);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h1>Login</h1>
      <input
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
        autoComplete="username"
      />
      <input
        type="password"
        value={pin}
        onChange={(e) => setPin(e.target.value)}
        placeholder="PIN"
        autoComplete="current-password"
      />
      <button type="submit" disabled={!username || !pin || loading}>
        {loading ? "Logging in..." : "Login"}
      </button>
      {error && <p>{error}</p>}
    </form>
  );
}

export default LoginForm;
