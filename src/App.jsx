import { useEffect, useState } from "react";

import "./App.css";

function App() {
  const [inputTask, setInputTask] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const [filter, setFilter] = useState("all"); // "all" | "active" | "completed"

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("isDarkMode") === "true";
  });

  useEffect(() => {
    localStorage.setItem("isDarkMode", darkMode);
  }, [darkMode]);

  const [taskList, setTaskList] = useState(() => {
    const saved = localStorage.getItem("tasks");
    try {
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(taskList));
  }, [taskList]);

  const totalTask = taskList.length;
  const completedTask = taskList.filter((task) => task.completed).length;
  const remainingTask = taskList.filter((task) => !task.completed).length;

  const filteredTasks = taskList.filter((task) => {
    if (filter === "completed") return task.completed;
    if (filter === "active") return !task.completed;
    return true; // "all"
  });

  function AddTask() {
    if (!inputTask.trim()) return;
    setTaskList([
      ...taskList,
      { id: Date.now(), text: inputTask, completed: false },
    ]);
    setInputTask("");
  }

  function ToggleTask(taskToToggle) {
    setTaskList(
      taskList.map((task) => {
        if (task.id === taskToToggle.id) {
          return {
            ...task,
            completed: !task.completed,
          };
        }
        return task;
      }),
    );
  }

  function EditTask(task) {
    setEditingId(task.id);
    setEditText(task.text);
  }

  function SaveTask(taskId) {
    setTaskList(
      taskList.map((task) => {
        if (task.id === taskId) {
          return {
            ...task,
            text: editText,
          };
        }
        return task;
      }),
    );
    setEditingId(null);
    setEditText("");
  }

  function DeleteTask() {
    setTaskList(
      taskList.filter((task) => {
        return !task.completed;
      }),
    );
  }

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="min-h-screen bg-gray-700 dark:bg-gray-900">
        <div className="container border min-h-screen flex flex-col justify-center items-center gap-4">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 px-3 py-2 rounded"
          >
            {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
          </button>

          <h1 className="header dark:text-white">MY TASK MANAGER</h1>

          <div className="flex justify-between items-center gap-10 dark:text-gray-200">
            <p>Total Tasks: {totalTask}</p>
            <p>Completed: {completedTask}</p>
            <p>Remaining Task: {remainingTask}</p>
          </div>

          <div className="relative w-md">
            <input
              type="text"
              placeholder="Enter Task"
              className="w-full border p-3 pr-40 rounded-lg dark:bg-gray-800 dark:text-white dark:border-gray-600"
              value={inputTask}
              onChange={(e) => setInputTask(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  AddTask();
                }
              }}
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setFilter("all")}
              className={`px-3 py-1 rounded ${
                filter === "all"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-300 text-gray-700 dark:bg-gray-700 dark:text-gray-200"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter("active")}
              className={`px-3 py-1 rounded ${
                filter === "active"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-300 text-gray-700 dark:bg-gray-700 dark:text-gray-200"
              }`}
            >
              Active
            </button>
            <button
              onClick={() => setFilter("completed")}
              className={`px-3 py-1 rounded ${
                filter === "completed"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-300 text-gray-700 dark:bg-gray-700 dark:text-gray-200"
              }`}
            >
              Completed
            </button>
          </div>

          <div className="taskList w-md">
            <ul className="w-full">
              {filteredTasks.map((task) => (
                <li
                  key={task.id}
                  className="flex items-center justify-between w-full dark:text-gray-200"
                >
                  {editingId === task.id ? (
                    <input
                      type="text"
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      className="border p-2 rounded dark:bg-gray-800 dark:text-white dark:border-gray-600"
                    ></input>
                  ) : (
                    <span
                      className={
                        task.completed ? "line-through text-gray-400" : ""
                      }
                    >
                      {task.text}
                    </span>
                  )}
                  <input
                    type="checkbox"
                    className="appearance-none w-5 h-5 border-2 border-black rounded cursor-pointer checked:bg-red-400 dark:border-gray-400"
                    checked={task.completed}
                    onChange={() => ToggleTask(task)}
                  />
                  {editingId === task.id ? (
                    <button
                      onClick={() => SaveTask(task.id)}
                      className="bg-green-600 text-white px-3 py-1 rounded"
                    >
                      Save
                    </button>
                  ) : (
                    <button
                      onClick={() => EditTask(task)}
                      className="bg-blue-600 text-white px-3 py-1 rounded"
                    >
                      Edit
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {taskList.length > 0 && (
            <button
              className="bg-gray-900 text-red-400 px-3 py-2 rounded"
              onClick={DeleteTask}
            >
              Delete Task
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;