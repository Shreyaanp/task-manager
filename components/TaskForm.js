import { useState } from "react";

const TaskForm = ({ onAddTask }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("To Do");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title) return alert("Title can't be empty");

    const task = { title, description, status };
    onAddTask(task);

    setTitle("");
    setDescription("");
    setStatus("To Do");
  };

  return (
    <div className="my-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <div>
          <label className="block">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 border rounded"
          ></textarea>
        </div>
        <div>
          <label className="block">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full px-3 py-2 border rounded"
          >
            <option>To Do</option>
            <option>In Progress</option>
            <option>Done</option>
          </select>
        </div>
        <button type="submit" className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-700">
          Add Task
        </button>
      </form>
    </div>
  );
};

export default TaskForm;
