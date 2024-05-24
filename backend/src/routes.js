const express = require("express");
const Task = require("./models");
const router = express.Router();

// Get all tasks
router.get("/tasks", async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new task
router.post("/tasks", async (req, res) => {
  const task = new Task({
    title: req.body.title,
  });
  try {
    const newTask = await task.save();
    res.status(201).json(newTask);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a task
router.delete("/tasks/:id", async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });
    await task.remove();
    res.json({ message: "Task deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Move task up or down
router.put("/tasks/move/:id", async (req, res) => {
  const { direction } = req.body;
  try {
    const tasks = await Task.find().sort({ _id: 1 });
    const index = tasks.findIndex(
      (task) => task._id.toString() === req.params.id
    );
    if (index === -1)
      return res.status(404).json({ message: "Task not found" });

    if (direction === "up" && index > 0) {
      [tasks[index], tasks[index - 1]] = [tasks[index - 1], tasks[index]];
    } else if (direction === "down" && index < tasks.length - 1) {
      [tasks[index], tasks[index + 1]] = [tasks[index + 1], tasks[index]];
    } else {
      return res.status(400).json({ message: "Invalid move" });
    }

    // Save the updated tasks order
    for (const task of tasks) {
      await task.save();
    }
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
