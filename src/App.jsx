import { useEffect, useState } from "react";
import { useTaskStore } from "./store/useTaskStore";
import { useDrag, useDrop } from "react-dnd";


// ----------------------
// ADD TASK FORM
// ----------------------
function AddTaskForm({ columnId }) {
  const { addTask } = useTaskStore();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleAdd = () => {
    if (!title.trim()) return;

    addTask(columnId, title, description);

    setTitle("");
    setDescription("");
  };

  return (
    <div style={{ marginBottom: "10px" }}>
      <input
        placeholder="Task title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={{ width: "100%", marginBottom: "5px" }}
      />
      <input
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        style={{ width: "100%", marginBottom: "5px" }}
      />
      <button onClick={handleAdd} style={{ width: "100%" }}>
        Add Task
      </button>
    </div>
  );
}


// ----------------------
// TASK CARD (Draggable)
// ----------------------
function TaskCard({ task }) {
  const { deleteTask, updateTask } = useTaskStore();
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);

  const [{ isDragging }, drag] = useDrag(() => ({
    type: "TASK",
    item: { id: task.id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const handleSave = () => {
    updateTask({
      ...task,
      title,
      description,
    });
    setIsEditing(false);
  };

  return (
    <div
      ref={drag}
      style={{
        background: "#f1f1f1",
        padding: "10px",
        marginTop: "10px",
        borderRadius: "5px",
        opacity: isDragging ? 0.5 : 1,
        cursor: "grab",
      }}
    >
      {isEditing ? (
        <>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{ width: "100%", marginBottom: "5px" }}
          />
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{ width: "100%", marginBottom: "5px" }}
          />
          <button onClick={handleSave}>Save</button>
        </>
      ) : (
        <>
          <strong>{task.title}</strong>
          <p>{task.description}</p>

          <button
            onClick={() => setIsEditing(true)}
            style={{ marginRight: "5px" }}
          >
            Edit
          </button>

          <button onClick={() => deleteTask(task.id)}>
            Delete
          </button>
        </>
      )}
    </div>
  );
}


// ----------------------
// COLUMN (Droppable)
// ----------------------
function Column({ column, tasks }) {
  const { moveTask } = useTaskStore();

  const [, drop] = useDrop(() => ({
    accept: "TASK",
    drop: (item) => {
      moveTask(item.id, column.id);
    },
  }));

  return (
    <div
      ref={drop}
      style={{
        background: "#fff",
        padding: "15px",
        borderRadius: "8px",
        width: "250px",
        minHeight: "300px",
      }}
    >
      <h3>{column.title}</h3>

      <AddTaskForm columnId={column.id} />

      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} />
      ))}
    </div>
  );
}


// ----------------------
// MAIN APP
// ----------------------
function App() {
  const [search, setSearch] = useState("");

  const { columns, tasks, loadData, loading, error, clearError } =
    useTaskStore();

  useEffect(() => {
    loadData();
  }, []);

  if (loading) return <h2>Loading...</h2>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>Task Board</h1>
     <input
  placeholder="Search tasks..."
  value={search}
  onChange={(e) => setSearch(e.target.value)}
  style={{
    marginBottom: "20px",
    padding: "8px",
    width: "300px",
  }}
/>

      {error && (
        <div style={{ color: "red", marginBottom: "10px" }}>
          {error}
          <button onClick={clearError} style={{ marginLeft: "10px" }}>
            X
          </button>
        </div>
      )}

      <div style={{ display: "flex", gap: "20px" }}>
        {columns.map((column) => {
          const columnTasks = tasks.filter(
  (task) =>
    task.columnId === column.id &&
    task.title.toLowerCase().includes(search.toLowerCase())
);


          return (
            <Column
              key={column.id}
              column={column}
              tasks={columnTasks}
            />
          );
        })}
      </div>
    </div>
  );
}

export default App;
