import React, { useState, useEffect } from "react";
import axios from "axios";

const Todo = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/tasks")
      .then((response) => setTasks(response.data))
      .catch((error) => console.error(error));
  }, []);

  function handleInputChange(event) {
    setNewTask(event.target.value);
  }

  function addTask() {
    if (newTask.trim() !== "") {
      axios
        .post("http://localhost:5000/api/tasks", { title: newTask })
        .then((response) => setTasks([...tasks, response.data]))
        .catch((error) => console.error(error));
      setNewTask("");
    }
  }

  function removeTask(id) {
    axios
      .delete(`http://localhost:5000/api/tasks/${id}`)
      .then(() => setTasks(tasks.filter((task) => task._id !== id)))
      .catch((error) => console.error(error));
  }

  function moveTask(id, direction) {
    axios
      .put(`http://localhost:5000/api/tasks/move/${id}`, { direction })
      .then((response) => setTasks(response.data))
      .catch((error) => console.error(error));
  }

  return (
    <div className="to-do-list">
      <h1>To-Do List</h1>
      <div>
        <input
          type="text"
          placeholder="Enter a task..."
          value={newTask}
          onChange={handleInputChange}
        />
        <button className="add-button" onClick={addTask}>
          Add
        </button>
        <ol>
          {tasks.map((task, index) => (
            <li key={task._id}>
              <span className="text">{task.title}</span>
              <button
                className="delete-button"
                onClick={() => removeTask(task._id)}
              >
                Delete
              </button>
              <button
                className="move-button"
                onClick={() => moveTask(task._id, "up")}
              >
                👆
              </button>
              <button
                className="move-button"
                onClick={() => moveTask(task._id, "down")}
              >
                👇
              </button>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
};

export default Todo;
