"use client";

import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  X,
  Check,
  Trash2,
} from "lucide-react";

const Calendar = () => {
  const { activeWorkspace } = useOutletContext();
  const workspaceId = activeWorkspace.id;

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState(
    JSON.parse(localStorage.getItem("calendarEvents")) || []
  );
  const [showEventModal, setShowEventModal] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    startTime: "",
    endTime: "",
    date: "",
    workspaceId: workspaceId,
  });
  const [viewMode, setViewMode] = useState("month"); // month, week, day
  const [editingEvent, setEditingEvent] = useState(null);

  // Filter events by workspace
  const filteredEvents = workspaceId
    ? events.filter((event) => event.workspaceId === workspaceId)
    : events;

  useEffect(() => {
    localStorage.setItem("calendarEvents", JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    if (workspaceId) {
      setNewEvent((prev) => ({
        ...prev,
        workspaceId,
      }));
    }
  }, [workspaceId]);

  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
  };

  const formatDate = (date) => {
    return date.toISOString().split("T")[0];
  };

  const handlePrevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  };

  const handleNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
  };

  const handleDateClick = (day) => {
    const newDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    );
    setSelectedDate(newDate);

    if (viewMode === "month") {
      setViewMode("day");
    }
  };

  const handleAddEvent = () => {
    setNewEvent({
      title: "",
      description: "",
      startTime: "09:00",
      endTime: "10:00",
      date: formatDate(selectedDate),
      workspaceId: workspaceId,
    });
    setEditingEvent(null);
    setShowEventModal(true);
  };

  const handleEditEvent = (event) => {
    setNewEvent({
      ...event,
      date: event.date,
    });
    setEditingEvent(event);
    setShowEventModal(true);
  };

  const handleDeleteEvent = (eventId) => {
    const updatedEvents = events.filter((event) => event.id !== eventId);
    setEvents(updatedEvents);
  };

  const handleSaveEvent = () => {
    if (!newEvent.title) return;

    if (editingEvent) {
      // Update existing event
      const updatedEvents = events.map((event) =>
        event.id === editingEvent.id ? { ...newEvent, id: event.id } : event
      );
      setEvents(updatedEvents);
    } else {
      // Add new event
      const eventToAdd = {
        ...newEvent,
        id: Date.now().toString(),
      };
      setEvents([...events, eventToAdd]);
    }

    setShowEventModal(false);
  };

  const renderCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);

    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(
        <div
          key={`empty-${i}`}
          className="h-16 sm:h-20 md:h-24 border border-gray-200 dark:border-gray-700"
        ></div>
      );
    }

    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dateString = formatDate(date);
      const dayEvents = filteredEvents.filter(
        (event) => event.date === dateString
      );

      const isToday = new Date().toDateString() === date.toDateString();
      const isSelected = selectedDate.toDateString() === date.toDateString();

      days.push(
        <div
          key={day}
          className={`h-16 sm:h-20 md:h-24 border border-gray-200 dark:border-gray-700 p-1 overflow-hidden ${
            isToday ? "bg-blue-50 dark:bg-blue-900/20" : ""
          } ${isSelected ? "ring-2 ring-blue-500 dark:ring-blue-400" : ""}`}
          onClick={() => handleDateClick(day)}
        >
          <div className="flex justify-between items-center">
            <span
              className={`text-xs sm:text-sm font-medium ${
                isToday
                  ? "text-blue-600 dark:text-blue-400"
                  : "text-gray-700 dark:text-gray-300"
              }`}
            >
              {day}
            </span>
            {dayEvents.length > 0 && (
              <span className="text-xs bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 px-1.5 py-0.5 rounded-full">
                {dayEvents.length}
              </span>
            )}
          </div>
          <div className="mt-1 space-y-1 max-h-10 sm:max-h-12 md:max-h-16 overflow-hidden">
            {dayEvents.slice(0, 2).map((event) => (
              <div
                key={event.id}
                className="text-xs truncate bg-blue-500 dark:bg-blue-600 text-white px-1.5 py-0.5 rounded"
                onClick={(e) => {
                  e.stopPropagation();
                  handleEditEvent(event);
                }}
              >
                {event.startTime} - {event.title}
              </div>
            ))}
            {dayEvents.length > 2 && (
              <div className="text-xs text-gray-500 dark:text-gray-400">
                +{dayEvents.length - 2} more
              </div>
            )}
          </div>
        </div>
      );
    }

    return days;
  };

  const renderDayView = () => {
    const dateString = formatDate(selectedDate);
    const dayEvents = filteredEvents.filter(
      (event) => event.date === dateString
    );

    // Sort events by start time
    dayEvents.sort((a, b) => {
      return a.startTime.localeCompare(b.startTime);
    });

    const hours = [];
    for (let i = 0; i < 24; i++) {
      const hour = i.toString().padStart(2, "0") + ":00";
      const hourEvents = dayEvents.filter((event) =>
        event.startTime.startsWith(i.toString().padStart(2, "0"))
      );

      hours.push(
        <div
          key={hour}
          className="flex border-b border-gray-200 dark:border-gray-700 min-h-[60px]"
        >
          <div className="w-12 sm:w-16 py-2 text-xs text-gray-500 dark:text-gray-400 text-right pr-2 border-r border-gray-200 dark:border-gray-700">
            {hour}
          </div>
          <div className="flex-1 pl-2 relative">
            {hourEvents.map((event) => (
              <div
                key={event.id}
                className="absolute left-2 right-2 bg-blue-500 dark:bg-blue-600 text-white rounded p-1 text-sm"
                style={{
                  top:
                    Number.parseInt(event.startTime.split(":")[1]) * 1 + "px",
                  height: "50px",
                }}
                onClick={() => handleEditEvent(event)}
              >
                <div className="font-medium truncate">{event.title}</div>
                <div className="text-xs opacity-90">
                  {event.startTime} - {event.endTime}
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    return (
      <div className="mt-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2 sm:gap-0">
          <h3 className="text-base sm:text-lg font-medium text-gray-900 dark:text-white">
            {selectedDate.toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </h3>
          <div className="flex space-x-2">
            <button
              className="px-3 py-1 text-xs sm:text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700"
              onClick={() => setViewMode("month")}
            >
              Back to Month
            </button>
            <button
              className="px-3 py-1 text-xs sm:text-sm bg-blue-500 text-white rounded-md shadow-sm hover:bg-blue-600"
              onClick={handleAddEvent}
            >
              <Plus size={16} className="inline mr-1" />
              Add Event
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          {hours}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 p-3 sm:p-4">
      {/* Calendar Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2 sm:gap-0">
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
          {currentDate.toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
          })}
        </h2>
        <div className="flex space-x-2">
          <button
            className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
            onClick={handlePrevMonth}
            aria-label="Previous month"
          >
            <ChevronLeft
              size={20}
              className="text-gray-600 dark:text-gray-400"
            />
          </button>
          <button
            className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
            onClick={handleNextMonth}
            aria-label="Next month"
          >
            <ChevronRight
              size={20}
              className="text-gray-600 dark:text-gray-400"
            />
          </button>
          {viewMode === "month" && (
            <button
              className="ml-2 px-3 py-1 text-xs sm:text-sm bg-blue-500 text-white rounded-md shadow-sm hover:bg-blue-600"
              onClick={() => {
                setSelectedDate(new Date());
                handleAddEvent();
              }}
            >
              <Plus size={16} className="inline mr-1" />
              Add Event
            </button>
          )}
        </div>
      </div>

      {/* Calendar View */}
      {viewMode === "month" ? (
        <>
          {/* Weekday Headers */}
          <div className="grid grid-cols-7 gap-1 mb-1">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div
                key={day}
                className="text-center text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1">{renderCalendarDays()}</div>
        </>
      ) : (
        renderDayView()
      )}

      {/* Event Modal */}
      {showEventModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-md p-4 sm:p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                {editingEvent ? "Edit Event" : "Add New Event"}
              </h3>
              <button
                className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                onClick={() => setShowEventModal(false)}
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Event title"
                  value={newEvent.title}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, title: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  value={newEvent.date}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, date: e.target.value })
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Start Time
                  </label>
                  <input
                    type="time"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    value={newEvent.startTime}
                    onChange={(e) =>
                      setNewEvent({ ...newEvent, startTime: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    End Time
                  </label>
                  <input
                    type="time"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    value={newEvent.endTime}
                    onChange={(e) =>
                      setNewEvent({ ...newEvent, endTime: e.target.value })
                    }
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  rows="3"
                  placeholder="Event description"
                  value={newEvent.description}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, description: e.target.value })
                  }
                ></textarea>
              </div>

              <div className="flex justify-between pt-4">
                {editingEvent && (
                  <button
                    className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                    onClick={() => {
                      handleDeleteEvent(editingEvent.id);
                      setShowEventModal(false);
                    }}
                  >
                    <Trash2 size={16} className="inline mr-1" />
                    Delete
                  </button>
                )}
                <div className="ml-auto space-x-2">
                  <button
                    className="px-4 py-2 bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                    onClick={() => setShowEventModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    onClick={handleSaveEvent}
                  >
                    <Check size={16} className="inline mr-1" />
                    {editingEvent ? "Update" : "Save"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;
