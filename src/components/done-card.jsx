"use client";

import { useEffect, useRef, useState } from "react";
import useStore from "../store/store";
import { MoreHorizontal, CheckCircle, Trash2, ArrowLeft } from "lucide-react";

const DoneCard = ({ workspaceId }) => {
  const lastTaskRef = useRef(null);
  const doneArray = useStore((state) => state.doneArray) || [];
  const setDoneArray = useStore((state) => state.setDoneArray);
  const taskArray = useStore((state) => state.taskArray);
  const setTaskArray = useStore((state) => state.setTaskArray);
  const [isMenuOpen, setIsMenuOpen] = useState(null);

  // Filter tasks by workspace if workspaceId is provided
  const filteredTasks = workspaceId
    ? doneArray.filter(
        (task) => task.workspaceId === workspaceId || !task.workspaceId
      )
    : doneArray;

  const deleteTask = (index) => {
    const taskIndex = doneArray.findIndex(
      (_, i) => filteredTasks[index] === doneArray[i]
    );

    if (taskIndex !== -1) {
      const updatedTasks = [...doneArray];
      updatedTasks.splice(taskIndex, 1);
      setDoneArray(updatedTasks);
    }

    setIsMenuOpen(null);
  };

  const moveBackToTodo = (index) => {
    const taskIndex = doneArray.findIndex(
      (_, i) => filteredTasks[index] === doneArray[i]
    );

    if (taskIndex !== -1) {
      const updatedDoneTasks = [...doneArray];
      const taskToMove = updatedDoneTasks.splice(taskIndex, 1)[0]; // Remove task from doneArray

      // Mark it as not done before adding it to taskArray
      taskToMove.isDone = false;

      // Update doneArray and taskArray
      setDoneArray(updatedDoneTasks);
      setTaskArray([...taskArray, taskToMove]);
    }

    setIsMenuOpen(null);
  };

  useEffect(() => {
    if (lastTaskRef.current) {
      lastTaskRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [filteredTasks]);

  const clearAllTasks = () => {
    const updatedTasks = doneArray.filter(
      (task) => task.workspaceId !== workspaceId
    );
    setDoneArray(updatedTasks);
    setIsMenuOpen(null);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col h-[500px]">
      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <h3 className="font-medium text-gray-900 dark:text-white">Done</h3>
        <div className="relative">
          <button
            className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            onClick={() =>
              setIsMenuOpen(isMenuOpen === "header" ? null : "header")
            }
          >
            <MoreHorizontal
              size={18}
              className="text-gray-500 dark:text-gray-400"
            />
          </button>

          {isMenuOpen === "header" && (
            <div className="absolute right-0 mt-1 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-10 border border-gray-200 dark:border-gray-700">
              <button
                className="block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-50 dark:hover:bg-gray-700"
                onClick={clearAllTasks}
              >
                Clear All Tasks
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {filteredTasks.length > 0 ? (
          filteredTasks.map((task, index) => (
            <div
              key={index}
              ref={index === filteredTasks.length - 1 ? lastTaskRef : null}
              className="flex items-center group rounded-md p-2 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <div className="flex-shrink-0 mr-2 text-green-500 dark:text-green-400">
                <CheckCircle size={18} />
              </div>

              <span className="flex-1 text-sm line-through text-gray-400 dark:text-gray-500">
                {task.task}
              </span>

              <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="relative">
                  <button
                    className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
                    onClick={() =>
                      setIsMenuOpen(isMenuOpen === index ? null : index)
                    }
                  >
                    <MoreHorizontal size={16} />
                  </button>

                  {isMenuOpen === index && (
                    <div className="absolute right-0 mt-1 w-36 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-10 border border-gray-200 dark:border-gray-700">
                      <button
                        className="block w-full text-left px-3 py-1 text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                        onClick={() => moveBackToTodo(index)}
                      >
                        <ArrowLeft size={14} className="inline mr-1" />
                        Move to Todo
                      </button>
                      <button
                        className="block w-full text-left px-3 py-1 text-xs text-red-600 dark:text-red-400 hover:bg-gray-50 dark:hover:bg-gray-700"
                        onClick={() => deleteTask(index)}
                      >
                        <Trash2 size={14} className="inline mr-1" />
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-400 dark:text-gray-500 text-sm">
              No completed tasks yet
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoneCard;
