"use client";

import { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import useStore from "../store/store";
import Sidebar from "./sidebar";
import { Menu, Bell, Search, Plus } from "lucide-react";

const Layout = () => {
  const location = useLocation();
  const { userData } = useStore();

  const [workspaces, setWorkspaces] = useState(
    JSON.parse(localStorage.getItem("workspaces")) || [
      { id: 1, name: "Personal" },
      { id: 2, name: "Work" },
    ]
  );

  const [activeWorkspace, setActiveWorkspace] = useState(
    JSON.parse(localStorage.getItem("activeWorkspace")) || workspaces[0]
  );

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAddingWorkspace, setIsAddingWorkspace] = useState(false);
  const [newWorkspaceName, setNewWorkspaceName] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    localStorage.setItem("workspaces", JSON.stringify(workspaces));
  }, [workspaces]);

  useEffect(() => {
    localStorage.setItem("activeWorkspace", JSON.stringify(activeWorkspace));
  }, [activeWorkspace]);

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isSidebarOpen && window.innerWidth < 768) {
        const sidebar = document.getElementById("sidebar");
        if (sidebar && !sidebar.contains(event.target)) {
          setIsSidebarOpen(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSidebarOpen]);

  const addWorkspace = () => {
    if (newWorkspaceName.trim() !== "") {
      const newWorkspace = {
        id: Date.now(),
        name: newWorkspaceName,
      };
      setWorkspaces([...workspaces, newWorkspace]);
      setActiveWorkspace(newWorkspace);
      setNewWorkspaceName("");
      setIsAddingWorkspace(false);
    }
  };

  const deleteWorkspace = (id) => {
    if (workspaces.length <= 1) return;

    const updatedWorkspaces = workspaces.filter(
      (workspace) => workspace.id !== id
    );
    setWorkspaces(updatedWorkspaces);

    if (activeWorkspace.id === id) {
      setActiveWorkspace(updatedWorkspaces[0]);
    }
  };

  // Get page title based on current route
  const getPageTitle = () => {
    switch (location.pathname) {
      case "/":
        return activeWorkspace.name;
      case "/calendar":
        return "Calendar";
      case "/tasks":
        return "Tasks";
      case "/analytics":
        return "Analytics";
      case "/team":
        return "Team";
      default:
        return activeWorkspace.name;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Sidebar */}
      <Sidebar
        id="sidebar"
        workspaces={workspaces}
        activeWorkspace={activeWorkspace}
        setActiveWorkspace={setActiveWorkspace}
        setIsAddingWorkspace={setIsAddingWorkspace}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />

      {/* Main Content */}
      <div className="md:ml-64 transition-all duration-300">
        {/* Top Navigation */}
        <header className="sticky top-0 z-10 bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              <div className="flex items-center">
                <button
                  className="md:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:text-gray-300 dark:hover:bg-gray-700 focus:outline-none"
                  onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                  aria-label="Toggle sidebar"
                >
                  <Menu size={24} />
                </button>
                <div className="ml-4 md:ml-0">
                  <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white truncate max-w-[200px] sm:max-w-xs">
                    {getPageTitle()}
                  </h1>
                </div>
              </div>

              {/* Search */}
              <div className="flex-1 max-w-md mx-4 hidden md:block">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search size={18} className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Search tasks..."
                  />
                </div>
              </div>

              {/* Right side icons */}
              <div className="flex items-center">
                <div className="relative">
                  <button
                    className="p-2 rounded-full text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:text-gray-300 dark:hover:bg-gray-700 focus:outline-none"
                    onClick={() => setShowNotifications(!showNotifications)}
                    aria-label="Notifications"
                  >
                    <Bell size={20} />
                    {notifications.length > 0 && (
                      <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500"></span>
                    )}
                  </button>

                  {showNotifications && (
                    <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-10 border border-gray-200 dark:border-gray-700">
                      <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                        <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                          Notifications
                        </h3>
                      </div>
                      {notifications.length > 0 ? (
                        notifications.map((notification, index) => (
                          <div
                            key={index}
                            className="px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700"
                          >
                            <p className="text-sm text-gray-700 dark:text-gray-300">
                              {notification.message}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {notification.time}
                            </p>
                          </div>
                        ))
                      ) : (
                        <div className="px-4 py-6 text-center">
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            No new notifications
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Add Workspace Button (Mobile) */}
                <div className="ml-2 md:hidden">
                  <button
                    className="p-2 rounded-full text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:text-gray-300 dark:hover:bg-gray-700 focus:outline-none"
                    onClick={() => setIsAddingWorkspace(true)}
                    aria-label="Add workspace"
                  >
                    <Plus size={20} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Add Workspace Modal */}
        {isAddingWorkspace && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-md p-4 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Add New Workspace
              </h3>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="Workspace name"
                value={newWorkspaceName}
                onChange={(e) => setNewWorkspaceName(e.target.value)}
                autoFocus
              />
              <div className="mt-4 flex justify-end space-x-2">
                <button
                  className="px-4 py-2 bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600"
                  onClick={() => {
                    setIsAddingWorkspace(false);
                    setNewWorkspaceName("");
                  }}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                  onClick={addWorkspace}
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main Content - Outlet renders the current route's component */}
        <main className="w-full p-3 sm:p-4 md:p-6">
          <Outlet context={{ activeWorkspace, workspaces }} />
        </main>
      </div>
    </div>
  );
};

export default Layout;
