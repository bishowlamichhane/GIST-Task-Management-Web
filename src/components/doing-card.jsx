"use client";

import { useEffect, useRef, useState } from "react";
import useStore from "../store/store";
import {
  MoreHorizontal,
  PlusCircle,
  CheckCircle,
  Circle,
  Trash2,
  Edit,
  X,
  Check,
} from "lucide-react";

const DoingCard = ({ workspaceId }) => {
  const lastTaskRef = useRef(null);
  const doneArray = useStore((state) => state.doneArray);
  const setDoneArray = useStore((state) => state.setDoneArray);
  const [newTask, setNewTask] = useState("");
  const taskRef = useRef(null);
  const doingArray = useStore((state) => state.doingArray) || [];
  const setDoingArray = useStore((state) => state.setDoingArray);
  const [isMenuOpen, setIsMenuOpen] = useState(null);
  const [editingTaskIndex, setEditingTaskIndex] = useState(null);
  const [editingTaskText, setEditingTaskText] = useState("");

  // Filter tasks by workspace if workspaceId is provided
  const filteredTasks = workspaceId
    ? doingArray.filter(
        (task) => task.workspaceId === workspaceId || !task.workspaceId
      )
    : doingArray;

  const deleteTask = (index) => {
    const taskIndex = doingArray.findIndex(
      (_, i) => filteredTasks[index] === doingArray[i]
    );

    if (taskIndex !== -1) {
      const updatedTasks = [...doingArray];
      updatedTasks.splice(taskIndex, 1);
      setDoingArray(updatedTasks);
    }

    setIsMenuOpen(null);
  };

  const startEditTask = (index) => {
    const taskIndex = doingArray.findIndex(
      (_, i) => filteredTasks[index] === doingArray[i]
    );

    if (taskIndex !== -1) {
      setEditingTaskIndex(index);
      setEditingTaskText(filteredTasks[index].task);
    }

    setIsMenuOpen(null);
  };

  const saveEditedTask = (index) => {
    const taskIndex = doingArray.findIndex(
      (_, i) => filteredTasks[index] === doingArray[i]
    );

    if (taskIndex !== -1 && editingTaskText.trim() !== "") {
      const updatedTasks = [...doingArray];
      updatedTasks[taskIndex] = {
        ...updatedTasks[taskIndex],
        task: editingTaskText,
      };
      setDoingArray(updatedTasks);
    }

    setEditingTaskIndex(null);
    setEditingTaskText("");
  };

  const cancelEditTask = () => {
    setEditingTaskIndex(null);
    setEditingTaskText("");
  };

  useEffect(() => {
    if (lastTaskRef.current) {
      lastTaskRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [filteredTasks]);

  const markDone = (index) => {
    const taskIndex = doingArray.findIndex(
      (_, i) => filteredTasks[index] === doingArray[i]
    );

    if (taskIndex !== -1) {
      const updatedTasks = [...doingArray];
      const taskToMove = updatedTasks.splice(taskIndex, 1)[0]; // Remove task from doingArray

      // Mark it as done before adding it to doneArray
      taskToMove.isDone = true;

      // Update doingArray and doneArray
      setDoingArray(updatedTasks);
      setDoneArray([...doneArray, taskToMove]);
    }
  };

  const enterButton = (e) => {
    if (e.key === "Enter") addTask();
  };

  const addTask = () => {
    if (newTask.trim() !== "") {
      setDoingArray([
        ...doingArray,
        {
          task: newTask,
          isDone: false,
          workspaceId: workspaceId,
          createdAt: new Date().toISOString(),
        },
      ]);
      setNewTask("");
      if (taskRef.current) taskRef.current.value = "";
    }
  };

  const clearAllTasks = () => {
    const updatedTasks = doingArray.filter(
      (task) => task.workspaceId !== workspaceId
    );
    setDoingArray(updatedTasks);
    setIsMenuOpen(null);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col h-[500px]">
      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <h3 className="font-medium text-gray-900 dark:text-white">Doing</h3>
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
              <button
                className="flex-shrink-0 mr-2 text-gray-400 hover:text-blue-600 dark:text-gray-500 dark:hover:text-blue-400 transition-colors"
                onClick={() => markDone(index)}
              >
                {task.isDone ? (
                  <CheckCircle
                    size={18}
                    className="text-green-500 dark:text-green-400"
                  />
                ) : (
                  <Circle size={18} />
                )}
              </button>

              {editingTaskIndex === index ? (
                <div className="flex-1 flex items-center">
                  <input
                    type="text"
                    className="flex-1 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm dark:bg-gray-700 dark:text-white"
                    value={editingTaskText}
                    onChange={(e) => setEditingTaskText(e.target.value)}
                    onKeyDown={(e) =>
                      e.key === "Enter" && saveEditedTask(index)
                    }
                    autoFocus
                  />
                  <button
                    className="ml-2 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-green-500 dark:text-green-400"
                    onClick={() => saveEditedTask(index)}
                  >
                    <Check size={16} />
                  </button>
                  <button
                    className="ml-1 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-red-500 dark:text-red-400"
                    onClick={cancelEditTask}
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <>
                  <span
                    className={`flex-1 text-sm ${
                      task.isDone
                        ? "line-through text-gray-400 dark:text-gray-500"
                        : "text-gray-700 dark:text-gray-300"
                    }`}
                  >
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
                            onClick={() => startEditTask(index)}
                          >
                            <Edit size={14} className="inline mr-1" />
                            Edit
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
                </>
              )}
            </div>
          ))
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-400 dark:text-gray-500 text-sm">
              No tasks yet
            </p>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center bg-gray-50 dark:bg-gray-700 rounded-md px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-opacity-50">
          <PlusCircle
            size={16}
            className="text-gray-400 dark:text-gray-500 mr-2"
          />
          <input
            type="text"
            ref={taskRef}
            className="flex-1 bg-transparent border-none focus:outline-none text-sm placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-gray-100"
            placeholder="Add new task"
            onChange={(e) => setNewTask(e.target.value)}
            onKeyDown={enterButton}
          />
          <button
            className="ml-2 text-xs font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
            onClick={addTask}
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default DoingCard;
