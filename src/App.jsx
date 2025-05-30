"use client";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useEffect, useState } from "react";
import Layout from "./components/layout";
import Dashboard from "./components/dashboard";
import Calendar from "./components/calendar";
import Tasks from "./components/tasks";
import Login from "./components/login";
import Register from "./components/register";
import useStore from "./store/store";
import { ThemeProvider } from "./components/theme-provider";
import { motion } from "framer-motion";
const App = () => {
  const { loggedIn, initialAuth } = useStore();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);
  useEffect(() => {
    initialAuth();
  }, [initialAuth]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: isVisible ? 1 : 0 }}
      transition={{ duration: 1.0 }}
    >
      <ThemeProvider>
        <Router>
          <Routes>
            {/* Protected routes using the Layout */}
            <Route element={<Layout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/tasks" element={<Tasks />} />
              {/* Add more routes as needed */}
            </Route>

            {/* Public routes */}
            {/* <Route
            path="/login"
            element={loggedIn ? <Navigate to="/" /> : <Login />}
          /> */}
            {/* <Route
            path="/register"
            element={loggedIn ? <Navigate to="/" /> : <Register />}
          />
           */}
          </Routes>
        </Router>
      </ThemeProvider>
    </motion.div>
  );
};

export default App;
