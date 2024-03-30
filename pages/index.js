import React, { useState, useEffect, useCallback } from "react";
import TaskForm from "../components/TaskForm";
import TaskList from "../components/TaskList";
import debounce from "lodash.debounce";
import Alert from "../components/Alert";
import Head from "next/head";

const HomePage = () => {
  const [tasks, setTasks] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("success");

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const res = await fetch("/api/tasks");
    const data = await res.json();
    setTasks(data);
  };

  const addTask = async (task) => {
    const res = await fetch("/api/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(task),
    });

    if (res.ok) {
      setAlertMessage("Task added successfully!");
      setAlertType("success");
      setShowAlert(true);
      fetchTasks();
    } else {
      setAlertMessage("Failed to add task");
      setAlertType("delete"); // Assuming you want to use the 'delete' style for errors
      setShowAlert(true);
    }
  };

  // Debounced server update to reduce frequent calls
  const debouncedUpdate = useCallback(
    debounce(async (id, updates) => {
      const res = await fetch(`/api/tasks`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ _id: id, ...updates }),
      });
      if(res.ok){
        setAlertMessage("Task updated successfully!");
        setAlertType("success");
        setShowAlert(true);
      }
      else{
        setAlertMessage("Failed to update task");
        setAlertType("delete");
        setShowAlert(true);
      }
    }, 500),
    []
  );

  const updateTask = async (id, updates, optimisticUpdatedTasks = null) => {
    if (optimisticUpdatedTasks) {
      setTasks(optimisticUpdatedTasks);
    } else {
      setTasks((current) => current.map((task) => (task._id === id ? { ...task, ...updates } : task)));
    }

    debouncedUpdate(id, updates);
  };

  const deleteTask = async (id) => {
    const res = await fetch(`/api/tasks`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ _id: id }),
    });

    if (res.ok) {
      setAlertMessage("Task deleted successfully!");
      setAlertType("success");
      setShowAlert(true);
      fetchTasks();
    } else {
      setAlertMessage("Failed to delete task");
      setAlertType("delete");
      setShowAlert(true);
    }
  };

  return (
    <div className="container mx-auto px-4">
      <Head>
        <title>Task Manager</title>
      </Head>
      <TaskForm onAddTask={addTask} />
      {tasks ? <TaskList tasks={tasks} onUpdateTask={updateTask} onDeleteTask={deleteTask} /> : <p>Loading...</p>}
      <Alert message={alertMessage} type={alertType} show={showAlert} setShow={setShowAlert} />
    </div>
  );
};

export default HomePage;
