import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import Card from "../common/Card";
import Input from "../common/Input";
import Button from "../common/Button";
import Toast from "../common/Toast";
import { useToast } from "../../context/ToastContext";
import "../auth/LoginForm.css";

function LoginForm() {
  const [username, setUsername] = useState("");
  const [pin, setPin] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

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
      showToast("Login successful!", 'success', 2000);
      setTimeout(() => {
        navigate("/dashboard", { replace: true });
      }, 500);
    } catch (err) {
      const errorMsg = err.message || "Invalid username or PIN. Please try again.";
      setError(errorMsg);
      showToast(errorMsg, 'error', 4000);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="login-page">
        <div className="login-container">
          <Card className="login-card">
            <div className="login-header">
              <h1>🏦 Smart ATM</h1>
              <p>Sign in to your account</p>
            </div>
            <form onSubmit={handleSubmit}>
              <Input
                type="text"
                label="Username"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setError("");
                }}
                error={error && !username ? error : ""}
                required
              />
              <Input
                type="password"
                label="PIN"
                placeholder="Enter your PIN"
                value={pin}
                onChange={(e) => {
                  setPin(e.target.value);
                  setError("");
                }}
                error={error && !pin ? error : ""}
                required
              />
              {error && <div className="login-error">{error}</div>}
              <Button 
                type="submit" 
                disabled={!username || !pin || loading}
                className="login-button"
              >
                {loading ? "Logging in..." : "Login"}
              </Button>
            </form>
          </Card>
        </div>
      </div>
      
    </>
  );
}

export default LoginForm;
