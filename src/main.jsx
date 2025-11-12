import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes/AppRoutes";
import AuthProvider from "./context/AuthContext";
import "./index.css";
import { WatchlistProvider } from "./context/WatchlistContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <WatchlistProvider>
        <RouterProvider router={router} />
      </WatchlistProvider>
    </AuthProvider>
  </React.StrictMode>
);
