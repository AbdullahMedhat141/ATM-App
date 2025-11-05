import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import DashboardPage from "../pages/DashboardPage";
import LoginPage from "../pages/LoginPage";
import DepositPage from "../pages/DepositPage";
import WithdrawPage from "../pages/WithdrawPage";
import HistoryPage from "../pages/HistoryPage";
import WatchlistPage from "../pages/WatchlistPage";
import SettingsPage from "../pages/SettingsPage";
import NotFoundPage from "../pages/NotFoundPage";

export const router = createBrowserRouter([
  { path: "/", element: <LoginPage /> },
  {
    path: "/",
    element: <App />,
    children: [
      { path: "dashboard", element: <DashboardPage /> },
      { path: "deposit", element: <DepositPage /> },
      { path: "withdraw", element: <WithdrawPage /> },
      { path: "history", element: <HistoryPage /> },
      { path: "watchlist", element: <WatchlistPage /> },
      { path: "settings", element: <SettingsPage /> },
    ],
  },
  { path: "*", element: <NotFoundPage /> },
]);
