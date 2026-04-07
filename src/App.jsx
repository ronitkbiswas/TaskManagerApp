import { useState, useEffect } from "react";

export default function TaskManager() {
  const [tasks, setTasks] = useState(loadTasks);
  const [input, setInput] = useState("");

  function loadTasks() {
    try {
      const saved = localStorage.getItem("tasks");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  }

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  function addTask() {
    if (!input.trim()) return;
    const newTask = { id: crypto.randomUUID(), text: input, completed: false };
    setTasks((prev) => [...prev, newTask]);
    setInput("");
  }

  function toggleTask(id) {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  }

  function deleteTask(id) {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  }

  const completedCount = tasks.filter((t) => t.completed).length;
  const progress = tasks.length > 0 ? (completedCount / tasks.length) * 100 : 0;

  return (
    <div style={styles.pageWrapper}>
      <div style={styles.container}>
        <header style={styles.header}>
          <h1 style={styles.heading}>📝 Task Manager</h1>
          <br></br>
          <div style={styles.progressBarContainer}>
            <div style={{ ...styles.progressBar, width: `${progress}%` }} />
          </div>
          <p style={styles.count}>
            {tasks.length === 0 ? "Enjoy your day!" : `${completedCount} of ${tasks.length} tasks done`}
          </p>
        </header>

        <div style={styles.inputRow}>
          <input
            type="text"
            placeholder="What's the next task?"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTask()}
            style={styles.input}
          />
          <button onClick={addTask} style={styles.addButton}>
            ＋
          </button>
        </div>

        <ul style={styles.list}>
          {tasks.map(({ id, text, completed }) => (
            <li key={id} style={styles.listItem}>
              <div onClick={() => toggleTask(id)} style={styles.taskContent}>
                <div style={{
                  ...styles.checkbox,
                  backgroundColor: completed ? "#6366f1" : "transparent",
                  borderColor: completed ? "#6366f1" : "#d1d5db"
                }}>
                  {completed && "✓"}
                </div>
                <span style={{
                  ...styles.taskText,
                  textDecoration: completed ? "line-through" : "none",
                  color: completed ? "#9ca3af" : "#1f2937",
                }}>
                  {text}
                </span>
              </div>

              <button onClick={() => deleteTask(id)} style={styles.deleteButton}>
                ✕
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  
  );
}

const styles = {
  pageWrapper: {
    minHeight: "50vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, #b9db3f 0%, #ffffff 100%)",
    padding: "20px",
  },
  container: {
    width: "100%",
    maxWidth: "280px",
    background: "rgba(255, 255, 255, 0.95)",
    backdropFilter: "blur(10px)",
    padding: "32px",
    borderRadius: "24px",
    boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
  },
  header: {
    marginBottom: "24px",
  },
  heading: {
    fontSize: "28px",
    fontWeight: "800",
    color: "#1f2937",
    letterSpacing: "-0.5px",
    marginBottom: "8px",
  },
  progressBarContainer: {
    height: "6px",
    background: "#f3f4f6",
    borderRadius: "10px",
    overflow: "hidden",
    marginBottom: "10px",
  },
  progressBar: {
    height: "100%",
    background: "#31b301",
    transition: "width 0.4s ease",
  },
  count: {
    fontSize: "14px",
    color: "#6b7280",
    fontWeight: "500",
  },
  inputRow: {
    display: "flex",
    gap: "12px",
    marginBottom: "24px",
  },
  input: {
    flex: 1,
    padding: "14px 18px",
    borderRadius: "4px",
    border: "2px solid #f3f4f6",
    fontSize: "15px",
    outline: "none",
    transition: "border-color 0.2s",
    backgroundColor: "#f9fafb",
  },
  addButton: {
    width: "48px",
    background: "#3bcd02",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    fontSize: "20px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 4px 12px rgba(99, 102, 241, 0.3)",
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
    padding: "14px 0",
    borderBottom: "1px solid #f3f4f6",
    transition: "transform 0.2s ease",
  },
  taskContent: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    cursor: "pointer",
    flex: 1,
  },
  checkbox: {
    width: "22px",
    height: "22px",
    border: "2px solid",
    borderRadius: "6px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "12px",
    color: "white",
    transition: "all 0.2s",
  },
  taskText: {
    fontSize: "16px",
    fontWeight: "500",
  },
  deleteButton: {
    background: "transparent",
    color: "#d1d5db",
    border: "none",
    fontSize: "16px",
    cursor: "pointer",
    padding: "4px 8px",
    transition: "color 0.2s",
  },
};