import { useOutletContext } from "react-router-dom";
import TodoCard from "./todo-card";
import DoingCard from "./doing-card";
import DoneCard from "./done-card";

const Tasks = () => {
  const { activeWorkspace } = useOutletContext();

  return (
    <div className="w-full">
      <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">All Tasks</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <TodoCard workspaceId={activeWorkspace.id} />
        <DoingCard workspaceId={activeWorkspace.id} />
        <DoneCard workspaceId={activeWorkspace.id} />
      </div>
    </div>
  );
};

export default Tasks;
