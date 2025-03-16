"use client";

import { useOutletContext } from "react-router-dom";
import useStore from "../store/store";
import TodoCard from "./todo-card";
import DoingCard from "./doing-card";
import DoneCard from "./done-card";
import ProgressTracker from "./progress-tracker";

const Dashboard = () => {
  const { activeWorkspace } = useOutletContext();
  const { taskArray, doingArray, doneArray } = useStore();

  const totalTasks = taskArray.length + doingArray.length + doneArray.length;
  const completedTasks = doneArray.length;
  const progressPercentage =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="w-full">
      {/* Progress Tracker */}
      <ProgressTracker
        totalTasks={totalTasks}
        completedTasks={completedTasks}
        progressPercentage={progressPercentage}
      />

      {/* Task Cards */}
      <div className="mt-6 sm:mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <TodoCard workspaceId={activeWorkspace.id} />
        <DoingCard workspaceId={activeWorkspace.id} />
        <DoneCard workspaceId={activeWorkspace.id} />
      </div>
    </div>
  );
};

export default Dashboard;
