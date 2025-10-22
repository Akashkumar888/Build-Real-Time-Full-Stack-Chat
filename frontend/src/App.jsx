import React, { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";
import AppContext from "./context/AppContext";

const App = () => {
  const { authUser } = useContext(AppContext);

  return (
    <div className="bg-[url('/bgImage.svg')] bg-contain">
      <ToastContainer />
      <Routes>
        <Route
          path="/"
          element={authUser ? <HomePage /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/login"
          element={!authUser ? <LoginPage /> : <Navigate to="/" replace />}
        />
        <Route
          path="/profile"
          element={authUser ? <ProfilePage /> : <Navigate to="/login" replace />}
        />
      </Routes>
    </div>
  );
};

export default App;


// Navigate is a component that redirects declaratively — ideal for JSX routes.
// The replace prop ensures the redirect doesn’t add a new entry to the browser history (cleaner navigation).
// This approach is used industry-wide with react-router-dom v6.