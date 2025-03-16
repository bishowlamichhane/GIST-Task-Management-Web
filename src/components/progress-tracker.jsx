"use client";

import { useState } from "react";
import { Calendar, Clock, CheckCircle2, BarChart2 } from "lucide-react";

const ProgressTracker = ({
  totalTasks,
  completedTasks,
  progressPercentage,
}) => {
  const [timeframe, setTimeframe] = useState("today");

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-3 sm:gap-0">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          Progress Tracker
        </h3>
        <div className="flex flex-wrap gap-2">
          <button
            className={`px-3 py-1 text-xs rounded-full ${
              timeframe === "today"
                ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
            }`}
            onClick={() => setTimeframe("today")}
          >
            Today
          </button>
          <button
            className={`px-3 py-1 text-xs rounded-full ${
              timeframe === "week"
                ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
            }`}
            onClick={() => setTimeframe("week")}
          >
            This Week
          </button>
          <button
            className={`px-3 py-1 text-xs rounded-full ${
              timeframe === "month"
                ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
            }`}
            onClick={() => setTimeframe("month")}
          >
            This Month
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 flex items-center">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mr-3 sm:mr-4">
            <BarChart2 size={18} className="text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              Total Tasks
            </p>
            <p className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white">
              {totalTasks}
            </p>
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 flex items-center">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mr-3 sm:mr-4">
            <CheckCircle2
              size={18}
              className="text-green-600 dark:text-green-400"
            />
          </div>
          <div>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              Completed
            </p>
            <p className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white">
              {completedTasks}
            </p>
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 flex items-center">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-amber-100 dark:bg-amber-900 flex items-center justify-center mr-3 sm:mr-4">
            <Clock size={18} className="text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              In Progress
            </p>
            <p className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white">
              {totalTasks - completedTasks}
            </p>
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 flex items-center">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center mr-3 sm:mr-4">
            <Calendar
              size={18}
              className="text-purple-600 dark:text-purple-400"
            />
          </div>
          <div>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              Scheduled
            </p>
            <p className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white">
              0
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <div className="flex justify-between items-center mb-2">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Progress
          </p>
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {progressPercentage}%
          </p>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2.5">
          <div
            className="bg-blue-600 dark:bg-blue-500 h-2.5 rounded-full"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default ProgressTracker;
