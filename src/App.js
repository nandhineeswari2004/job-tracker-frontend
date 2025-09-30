// src/App.js
import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Signup from "./components/Signup";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import EditJob from "./components/EditJob";

function App() {
  const [user, setUser] = useState(null);
  const [showSignup, setShowSignup] = useState(false);

  return (
    <BrowserRouter>
      <Routes>
        {/* ✅ Default route */}
        <Route
          path="/"
          element={
            user ? (
              <Navigate to="/dashboard" />
            ) : showSignup ? (
              <Signup onSignup={() => setShowSignup(false)} />
            ) : (
              <Login onLogin={setUser} onSwitch={() => setShowSignup(true)} />
            )
          }
        />

        {/* ✅ Dashboard route */}
        <Route
          path="/dashboard"
          element={user ? <Dashboard /> : <Navigate to="/" />}
        />

        {/* ✅ Edit Job route - no props needed now */}
        <Route
          path="/edit-job/:id"
          element={user ? <EditJob /> : <Navigate to="/" />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
