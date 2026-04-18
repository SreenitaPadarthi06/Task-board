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

  const handleSubmit = () => {
    if (!title.trim()) return;

    addTask(columnId, title, description);
    setTitle("");
    setDescription("");
  };

  return (
    <div>
      <input
        aria-label="Task title"
        placeholder="Task title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <input
        aria-label="Task description"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <button aria-label="Add task" onClick={handleSubmit}>
        Add Task
      </button>
    </div>
  );
}

// ----------------------
// TASK CARD
// ----------------------
function TaskCard({ task }) {
  const { deleteTask, updateTask } = useTaskStore();

  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);

  const [{ isDragging }, drag] = useDrag(() => ({
    type: "TASK",
    item: { id: task.id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const saveChanges = () => {
    updateTask({
      ...task,
      title,
      description,
    });
    setEditing(false);
  };

  return (
    <div
      ref={drag}
      className="task"
      style={{
        opacity: isDragging ? 0.5 : 1,
        cursor: "grab",
      }}
      tabIndex="0"
    >
      {editing ? (
        <>
          <input
            aria-label="Edit title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <input
            aria-label="Edit description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <button aria-label="Save task" onClick={saveChanges}>
            Save
          </button>
        </>
      ) : (
        <>
          <h4>{task.title}</h4>
          <p>{task.description}</p>

          <button
            aria-label="Edit task"
            onClick={() => setEditing(true)}
          >
            Edit
          </button>

          <button
            aria-label="Delete task"
            onClick={() => deleteTask(task.id)}
          >
            Delete
          </button>
        </>
      )}
    </div>
  );
}

// ----------------------
// COLUMN
// ----------------------
function Column({ column, tasks }) {
  const { moveTask } = useTaskStore();

  const [, drop] = useDrop(() => ({
    accept: "TASK",
    drop: (item) => moveTask(item.id, column.id),
  }));

  return (
    <div ref={drop} className="column">
      <h2>{column.title}</h2>

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

  const {
    columns,
    tasks,
    loadData,
    loading,
    error,
    clearError,
  } = useTaskStore();

  useEffect(() => {
    loadData();
  }, [loadData]);

  if (loading) {
    return <h2 className="app">Loading tasks...</h2>;
  }

  return (
    <div className="app">
      <h1>Task Management Board</h1>

      <input
        aria-label="Search tasks"
        placeholder="Search tasks..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {error && (
        <div style={{ color: "red", marginBottom: "15px" }}>
          {error}
          <button
            aria-label="Close error"
            onClick={clearError}
            style={{ marginLeft: "10px", width: "auto", padding: "4px 10px" }}
          >
            X
          </button>
        </div>
      )}

      <div className="board">
        {columns.map((column) => {
          const filteredTasks = tasks.filter(
            (task) =>
              task.columnId === column.id &&
              task.title
                .toLowerCase()
                .includes(search.toLowerCase())
          );

          return (
            <Column
              key={column.id}
              column={column}
              tasks={filteredTasks}
            />
          );
        })}
      </div>
    </div>
  );
}

export default App;