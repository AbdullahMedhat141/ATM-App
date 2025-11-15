import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useBirthday } from "../hooks/useBirthday";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import BirthdayPopup from "../components/popups/BirthdayPopup";
import Navbar from "../components/common/Navbar";
import BalanceCard from "../components/dashboard/BalanceCard";
import SummaryBar from "../components/dashboard/SummaryBar";
import UserProfile from "../components/dashboard/UserProfile";
import QuickActions from "../components/dashboard/QuickActions";
import "./DashboardPage.css";

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { showBirthdayPopup, setShowBirthdayPopup } = useBirthday(user);
  const [summary, setSummary] = useState({ deposits: 0, withdrawals: 0, total: 0 });

  useEffect(() => {
    if (user && user.transactions) {
      let deposits = 0;
      let withdrawals = 0;

      user.transactions.forEach(tx => {
        if (tx.type === 'Deposit') deposits += tx.amount;
        if (tx.type === 'Withdraw') withdrawals += tx.amount;
      });

      setSummary({
        deposits,
        withdrawals,
        total: user.balance
      });
    }
  }, [user]);

  function handleLogout() {
    logout();
    navigate("/", { replace: true });
  }

  if (!user) {
    return (
      <div className="dashboard-error">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <Navbar onLogout={handleLogout} />
      
      <main className="dashboard-content">
        <div className="dashboard-grid">
          <div className="dashboard-top">
            <UserProfile user={user} />
          </div>

          <div className="dashboard-balance">
            <BalanceCard balance={user.balance} />
          </div>

          <div className="dashboard-summary">
            <SummaryBar summary={summary} />
          </div>

          <div className="dashboard-actions">
            <QuickActions />
          </div>

          <div className="dashboard-links">
            <Card className="links-card">
              <h3>Quick Links</h3>
              <div className="links-grid">
                <Link to="/deposit" className="link-button">
                  <span>💰</span>
                  <span>Deposit</span>
                </Link>
                <Link to="/withdraw" className="link-button">
                  <span>💸</span>
                  <span>Withdraw</span>
                </Link>
                <Link to="/history" className="link-button">
                  <span>📋</span>
                  <span>History</span>
                </Link>
                <Link to="/watchlist" className="link-button">
                  <span>⭐</span>
                  <span>Watchlist</span>
                </Link>
                <Link to="/settings" className="link-button">
                  <span>⚙️</span>
                  <span>Settings</span>
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </main>

      {showBirthdayPopup && (
        <BirthdayPopup 
          userName={user.first_name}
          onClose={() => setShowBirthdayPopup(false)}
        />
      )}
    </div>
  );
}
