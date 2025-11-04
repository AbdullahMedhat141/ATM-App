import { useAuth } from "../../hooks/useAuth";
import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";

function LoginForm() {
  const [username, setUsername] = useState("");
  const [pin, setPin] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await login({ username, pin });
      const dest = location.state?.from?.pathname ?? "/dashboard";
      navigate(dest, { replace: true });
    } catch {
      alert("Invalid login");
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
      <button type="submit">Login</button>
    </form>
  );
}

export default LoginForm;
