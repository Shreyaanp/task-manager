import React, { useState } from "react";

const TaskList = ({ tasks, onUpdateTask, onDeleteTask }) => {
  const [editedTasks, setEditedTasks] = useState({});
  const [updating, setUpdating] = useState({}); // Tracks which tasks are being updated
  const handleEditChange = (id, field, value) => {
    if (field === "status") {
      const optimisticUpdatedTasks = tasks.map((task) => (task._id === id ? { ...task, [field]: value } : task));
      onUpdateTask(id, { [field]: value }, optimisticUpdatedTasks);
    } else {
      setEditedTasks((prev) => ({
        ...prev,
        [id]: { ...(prev[id] || {}), [field]: value },
      }));
    }
  };

  const handleSaveChange = async (id) => {
    const updates = editedTasks[id];
    if (updates) {
      setUpdating((prev) => ({ ...prev, [id]: true }));
      try {
        await onUpdateTask(id, updates);
        setEditedTasks((prev) => {
          const updated = { ...prev };
          delete updated[id];
          return updated;
        });
      } catch (error) {
        console.error("Failed to update task:", error);
      } finally {
        setUpdating((prev) => ({ ...prev, [id]: false })); // Reset updating state
      }
    }
  };

  return (
    <div className="my-4">
      {tasks.map((task) => (
        <div key={task._id} className="flex items-center justify-between p-4 mb-2 border rounded">
          <div>
            <input
              type="text"
              value={editedTasks[task._id]?.title !== undefined ? editedTasks[task._id].title : task.title}
              onChange={(e) => handleEditChange(task._id, "title", e.target.value)}
              onBlur={() => handleSaveChange(task._id)}
              className="text-lg font-bold border-2 border-transparent focus:border-blue-500 rounded px-2 py-1 mr-2"
              disabled={updating[task._id]} // Disable input while updating
            />
            <input
              type="text"
              value={
                editedTasks[task._id]?.description !== undefined ? editedTasks[task._id].description : task.description
              }
              onChange={(e) => handleEditChange(task._id, "description", e.target.value)}
              onBlur={() => handleSaveChange(task._id)}
              className="border-2 border-transparent focus:border-blue-500 rounded px-2 py-1"
              disabled={updating[task._id]} // Disable input while updating
            />
          </div>
          <div>
            Status:
            <select
              value={task.status}
              onChange={(e) => handleEditChange(task._id, "status", e.target.value)}
              onBlur={() => handleSaveChange(task._id)}
              className="ml-2 rounded border bg-white p-1"
              disabled={updating[task._id]} // Disable select while updating
            >
              <option value="To Do">To Do</option>
              <option value="In Progress">In Progress</option>
              <option value="Done">Done</option>
            </select>
            {updating[task._id] && <span> Updating...</span>}
          </div>
          <button
            onClick={() => onDeleteTask(task._id)}
            className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-700"
            disabled={updating[task._id]}
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
};

export default TaskList;
