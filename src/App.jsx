"use client";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useEffect } from "react";
import Layout from "./components/layout";
import Dashboard from "./components/dashboard";
import Calendar from "./components/calendar";
import Tasks from "./components/tasks";
import Login from "./components/login";
import Register from "./components/register";
import useStore from "./store/store";
import { ThemeProvider } from "./components/theme-provider";

const App = () => {
  const { loggedIn, initialAuth } = useStore();

  useEffect(() => {
    initialAuth();
  }, [initialAuth]);

  return (
    <ThemeProvider>
      <Router>
        <Routes>
          {/* Protected routes using the Layout */}
          <Route element={loggedIn ? <Layout /> : <Navigate to="/login" />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/tasks" element={<Tasks />} />
            {/* Add more routes as needed */}
          </Route>

          {/* Public routes */}
          <Route
            path="/login"
            element={loggedIn ? <Navigate to="/" /> : <Login />}
          />
          <Route
            path="/register"
            element={loggedIn ? <Navigate to="/" /> : <Register />}
          />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;
