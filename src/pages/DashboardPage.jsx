import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/", { replace: true });
  }

  return (
    <div>
      {user ? (
        <>
          <h1>
            Welcome back, {user.first_name} {user.last_name}! 👋
          </h1>
          <p>
            Current balance: <b>{user.balance} ILS</b>
          </p>
        </>
      ) : (
        <h1>Welcome!</h1>
      )}
      <div style={{ display: "flex", flexDirection: "column" }}>
        <Link to="/deposit">Deposite</Link>
        <Link to="/withdraw">Withdraw</Link>
        <Link to="/watchlist">WatchList</Link>
        <Link to="/history">History</Link>
        <Link to="/settings">Settings</Link>
      </div>

      <button
        onClick={handleLogout}
        className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-md text-white"
      >
        Logout
      </button>
    </div>
  );
}
