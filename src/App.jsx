import { useState, useEffect } from "react";

// ✅ Main App Component
export default function TaskManager() {
  // 📦 STATE
  // tasks = array of task objects: { id, text, completed }
  //
  // 💾 LOAD FROM LOCALSTORAGE on first render:
  // Instead of starting with [], we check if tasks were saved before.
  // localStorage.getItem("tasks") returns a JSON string, or null if nothing saved.
  // JSON.parse() converts that string back into a JavaScript array.
  // If nothing is saved yet, we fall back to an empty array [].
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("tasks");
    return saved ? JSON.parse(saved) : [];
  });

  // input = what the user is typing in the text box
  const [input, setInput] = useState("");

  // 💾 SAVE TO LOCALSTORAGE whenever tasks change
  // useEffect runs the function inside it every time [tasks] changes.
  // JSON.stringify() converts the array into a string so localStorage can store it.
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]); // 👈 only runs when 'tasks' changes

  // ➕ ADD TASK
  function addTask() {
    // Don't add empty tasks
    if (input.trim() === "") return;

    // Create a new task object
    const newTask = {
      id: Date.now(),       // unique ID using current timestamp
      text: input,          // the task text from input box
      completed: false,     // new tasks start as not completed
    };

    // Add the new task to the tasks array
    setTasks([...tasks, newTask]);

    // Clear the input box
    setInput("");
  }

  // ✅ MARK COMPLETE / INCOMPLETE (toggle)
  function toggleComplete(id) {
    // Go through all tasks and flip 'completed' for the matching one
    const updated = tasks.map((task) => {
      if (task.id === id) {
        return { ...task, completed: !task.completed };
      }
      return task;
    });

    setTasks(updated);
  }

  // 🗑️ DELETE TASK
  function deleteTask(id) {
    // Keep all tasks EXCEPT the one with this id
    const filtered = tasks.filter((task) => task.id !== id);
    setTasks(filtered);
  }

  // 🎨 RENDER
  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>📝 Task Manager</h1>

      {/* INPUT AREA */}
      <div style={styles.inputRow}>
        <input
          type="text"
          placeholder="Enter a task..."
          value={input}
          onChange={(e) => setInput(e.target.value)}  // update input state on every keystroke
          onKeyDown={(e) => e.key === "Enter" && addTask()} // add on Enter key
          style={styles.input}
        />
        <button onClick={addTask} style={styles.addButton}>
          Add
        </button>
      </div>

      {/* TASK COUNT */}
      <p style={styles.count}>
        {tasks.length === 0
          ? "No tasks yet. Add one above!"
          : `${tasks.filter((t) => t.completed).length} / ${tasks.length} completed`}
      </p>

      {/* TASK LIST */}
      <ul style={styles.list}>
        {tasks.map((task) => (
          <li key={task.id} style={styles.listItem}>

            {/* TASK TEXT — strikethrough if completed */}
            <span
              onClick={() => toggleComplete(task.id)}  // click to toggle
              style={{
                ...styles.taskText,
                textDecoration: task.completed ? "line-through" : "none",
                color: task.completed ? "#aaa" : "#000",
                cursor: "pointer",
              }}
            >
              {task.completed ? "✅" : "⬜"} {task.text}
            </span>

            {/* DELETE BUTTON */}
            <button
              onClick={() => deleteTask(task.id)}
              style={styles.deleteButton}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

// 🎨 Simple inline styles (no CSS file needed)
const styles = {
  container: {
    maxWidth: "480px",
    margin: "40px auto",
    fontFamily: "sans-serif",
    padding: "0 16px",
  },
  heading: {
    fontSize: "24px",
    marginBottom: "16px",
  },
  inputRow: {
    display: "flex",
    gap: "8px",
    marginBottom: "8px",
  },
  input: {
    flex: 1,
    padding: "8px",
    fontSize: "16px",
    border: "1px solid #ccc",
    borderRadius: "4px",
  },
  addButton: {
    padding: "8px 16px",
    fontSize: "16px",
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  count: {
    color: "#555",
    fontSize: "14px",
    marginBottom: "8px",
  },
  list: {
    listStyle: "none",
    padding: 0,
    margin: 0,
  },
  listItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 0",
    borderBottom: "1px solid #eee",
  },
  taskText: {
    fontSize: "16px",
    flex: 1,
  },
  deleteButton: {
    marginLeft: "12px",
    padding: "4px 10px",
    fontSize: "13px",
    backgroundColor: "#f44336",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
};