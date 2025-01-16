import React, { useState, useEffect } from 'react';
import './App.css'; // Import the CSS file

function App() {
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      return JSON.parse(savedTasks);
    }
    // Adding two predefined tasks as the initial ones
    return [
      { id: 1, text: 'Learn React', completed: false, priority: 'Medium' },
      { id: 2, text: 'Build a To-Do App', completed: false, priority: 'Medium' },
    ];
  });

  const [editingTask, setEditingTask] = useState(null);
  const [taskText, setTaskText] = useState('');
  const [filter, setFilter] = useState('all'); // 'all', 'completed', 'pending'

  // Add a new task
  const addTask = () => {
    if (taskText.trim()) {
      setTasks([
        ...tasks,
        { id: Date.now(), text: taskText, completed: false, priority: 'Medium' },
      ]);
      setTaskText('');
    }
  };

  // Delete a task with confirmation
  const deleteTask = (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this task?');
    if (confirmDelete) {
      setTasks(tasks.filter((task) => task.id !== id));
    }
  };

  // Enable editing a task
  const startEditing = (task) => {
    setEditingTask(task.id);
    setTaskText(task.text);
  };

  // Save the edited task
  const saveTask = () => {
    setTasks(
      tasks.map((task) =>
        task.id === editingTask
          ? { ...task, text: taskText }
          : task
      )
    );
    setEditingTask(null);
    setTaskText('');
  };

  // Toggle task completion
  const toggleCompletion = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  // Handle priority change
  const changePriority = (id, priority) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, priority } : task
      )
    );
  };

  // Filter tasks based on completion status
  const filteredTasks =
    filter === 'all'
      ? tasks
      : tasks.filter((task) =>
          filter === 'completed' ? task.completed : !task.completed
        );

  // Save tasks to localStorage
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  return (
    <div className="App">
      <h1>To-Do List</h1>

      {/* Input for adding or editing tasks */}
      <div>
        <input
          type="text"
          value={taskText}
          onChange={(e) => setTaskText(e.target.value)}
          placeholder="Enter a task"
        />
        {editingTask ? (
          <button onClick={saveTask}>Save</button>
        ) : (
          <button onClick={addTask}>Add</button>
        )}
      </div>

      {/* Filter tasks */}
      <div>
        <button onClick={() => setFilter('all')}>All</button>
        <button onClick={() => setFilter('completed')}>Completed</button>
        <button onClick={() => setFilter('pending')}>Pending</button>
      </div>

      {/* List of tasks */}
      <ul>
        {filteredTasks.map((task) => (
          <li key={task.id}>
            <span
              style={{
                textDecoration: task.completed ? 'line-through' : 'none',
                color: task.completed ? 'gray' : 'black',
              }}
            >
              {task.text} ({task.priority})
            </span>
            <select
              value={task.priority}
              onChange={(e) => changePriority(task.id, e.target.value)}
            >
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
            <button onClick={() => toggleCompletion(task.id)}>
              {task.completed ? 'Undo' : 'Complete'}
            </button>
            <button onClick={() => startEditing(task)}>Edit</button>
            <button onClick={() => deleteTask(task.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
