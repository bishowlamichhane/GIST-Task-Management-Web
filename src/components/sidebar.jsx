"use client";

import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import useStore from "../store/store";
import { useTheme } from "./theme-provider";
import {
  Calendar,
  CheckSquare,
  PlusCircle,
  Settings,
  LogOut,
  Moon,
  Sun,
  Home,
  ChevronDown,
  ChevronRight,
  Layers,
  BarChart2,
  Users,
  X,
} from "lucide-react";

const Sidebar = ({
  id,
  workspaces,
  activeWorkspace,
  setActiveWorkspace,
  setIsAddingWorkspace,
  isSidebarOpen,
  setIsSidebarOpen,
}) => {
  const location = useLocation();
  const { userData, setLoggedIn } = useStore();
  const { theme, toggleTheme } = useTheme();
  const [expandedSections, setExpandedSections] = useState({
    workspaces: true,
  });

  const toggleSection = (section) => {
    setExpandedSections({
      ...expandedSections,
      [section]: !expandedSections[section],
    });
  };

  const handleLogout = () => {
    setLoggedIn(false);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <>
      {/* Mobile sidebar backdrop */}
      {isSidebarOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-20"
          onClick={() => setIsSidebarOpen(false)}
          aria-hidden="true"
        ></div>
      )}

      {/* Sidebar */}
      <aside
        id={id}
        className={`fixed top-0 left-0 z-30 h-full w-[280px] sm:w-64 transform transition-transform duration-300 ease-in-out 
                 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} 
                 md:translate-x-0 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col`}
      >
        {/* Logo and mobile close button */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-md bg-blue-600 flex items-center justify-center">
              <Layers className="text-white" size={18} />
            </div>
            <span className="text-lg font-bold text-gray-900 dark:text-white">
              GIST
            </span>
          </Link>
          <button
            className="md:hidden text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            onClick={() => setIsSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>

        {/* User info */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white">
              {userData?.name ? userData.name.charAt(0).toUpperCase() : "U"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {userData?.name || "User"}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {userData?.email || "user@example.com"}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto py-4 px-3">
          <ul className="space-y-2">
            <li>
              <Link
                to="/"
                className={`flex items-center p-2 text-base font-normal rounded-lg ${
                  isActive("/")
                    ? "bg-blue-100 text-blue-700 dark:bg-blue-700 dark:text-white"
                    : "text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                }`}
                onClick={() => setIsSidebarOpen(false)}
              >
                <Home
                  size={20}
                  className="flex-shrink-0 w-5 h-5 transition duration-75"
                />
                <span className="ml-3">Dashboard</span>
              </Link>
            </li>
            <li>
              <Link
                to="/calendar"
                className={`flex items-center p-2 text-base font-normal rounded-lg ${
                  isActive("/calendar")
                    ? "bg-blue-100 text-blue-700 dark:bg-blue-700 dark:text-white"
                    : "text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                }`}
                onClick={() => setIsSidebarOpen(false)}
              >
                <Calendar
                  size={20}
                  className="flex-shrink-0 w-5 h-5 transition duration-75"
                />
                <span className="ml-3">Calendar</span>
              </Link>
            </li>
            <li>
              <Link
                to="/tasks"
                className={`flex items-center p-2 text-base font-normal rounded-lg ${
                  isActive("/tasks")
                    ? "bg-blue-100 text-blue-700 dark:bg-blue-700 dark:text-white"
                    : "text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                }`}
                onClick={() => setIsSidebarOpen(false)}
              >
                <CheckSquare
                  size={20}
                  className="flex-shrink-0 w-5 h-5 transition duration-75"
                />
                <span className="ml-3">Tasks</span>
              </Link>
            </li>
            <li>
              <Link
                to="/"
                className={`flex items-center p-2 text-base font-normal rounded-lg ${
                  isActive("/analytics")
                    ? "bg-blue-100 text-blue-700 dark:bg-blue-700 dark:text-white"
                    : "text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                }`}
                onClick={() => setIsSidebarOpen(false)}
              >
                <BarChart2
                  size={20}
                  className="flex-shrink-0 w-5 h-5 transition duration-75"
                />
                <span className="ml-3">Analytics</span>
              </Link>
            </li>
            <li>
              <Link
                to="/"
                className={`flex items-center p-2 text-base font-normal rounded-lg ${
                  isActive("/team")
                    ? "bg-blue-100 text-blue-700 dark:bg-blue-700 dark:text-white"
                    : "text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                }`}
                onClick={() => setIsSidebarOpen(false)}
              >
                <Users
                  size={20}
                  className="flex-shrink-0 w-5 h-5 transition duration-75"
                />
                <span className="ml-3">Team</span>
              </Link>
            </li>
          </ul>

          {/* Workspaces section */}
          <div className="mt-8">
            <button
              type="button"
              className="flex items-center w-full p-2 text-base font-normal text-gray-900 dark:text-white rounded-lg transition duration-75 group hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={() => toggleSection("workspaces")}
              aria-expanded={expandedSections.workspaces}
            >
              {expandedSections.workspaces ? (
                <ChevronDown
                  size={20}
                  className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white"
                />
              ) : (
                <ChevronRight
                  size={20}
                  className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white"
                />
              )}
              <span className="flex-1 ml-3 text-left whitespace-nowrap font-medium">
                Workspaces
              </span>
            </button>

            {expandedSections.workspaces && (
              <ul className="py-2 space-y-1 pl-11">
                {workspaces.map((workspace) => (
                  <li key={workspace.id}>
                    <button
                      onClick={() => {
                        setActiveWorkspace(workspace);
                        setIsSidebarOpen(false);
                      }}
                      className={`flex items-center w-full text-sm p-2 rounded-lg ${
                        activeWorkspace.id === workspace.id
                          ? "bg-blue-100 text-blue-700 dark:bg-blue-700 dark:text-white"
                          : "text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                      }`}
                    >
                      {workspace.name}
                    </button>
                  </li>
                ))}
                <li>
                  <button
                    onClick={() => {
                      setIsAddingWorkspace(true);
                      setIsSidebarOpen(false);
                    }}
                    className="flex items-center w-full text-sm p-2 text-blue-600 hover:bg-gray-100 dark:text-blue-400 dark:hover:bg-gray-700 rounded-lg"
                  >
                    <PlusCircle size={16} className="mr-2" />
                    Add Workspace
                  </button>
                </li>
              </ul>
            )}
          </div>
        </div>

        {/* Bottom section */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-800 space-y-2">
          <button
            onClick={toggleTheme}
            className="flex items-center w-full p-2 text-base font-normal text-gray-900 dark:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            aria-label={
              theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
            }
          >
            {theme === "dark" ? (
              <Sun
                size={20}
                className="flex-shrink-0 w-5 h-5 text-gray-500 dark:text-gray-400"
              />
            ) : (
              <Moon size={20} className="flex-shrink-0 w-5 h-5 text-gray-500" />
            )}
            <span className="ml-3">
              {theme === "dark" ? "Light Mode" : "Dark Mode"}
            </span>
          </button>

          <Link
            to="/"
            className="flex items-center w-full p-2 text-base font-normal text-gray-900 dark:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            onClick={() => setIsSidebarOpen(false)}
          >
            <Settings
              size={20}
              className="flex-shrink-0 w-5 h-5 text-gray-500 dark:text-gray-400"
            />
            <span className="ml-3">Settings</span>
          </Link>

          <button
            onClick={handleLogout}
            className="flex items-center w-full p-2 text-base font-normal text-gray-900 dark:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <LogOut
              size={20}
              className="flex-shrink-0 w-5 h-5 text-gray-500 dark:text-gray-400"
            />
            <span className="ml-3">Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
