const API_DELAY = 1000; // 1 second delay
const FAILURE_RATE = 0.2; // 20% chance of failure

let tasks = [
  { id: "1", columnId: "todo", title: "Plan project", description: "Outline features" },
  { id: "2", columnId: "inprogress", title: "Setup state", description: "Implement Zustand" }
];

let columns = [
  { id: "todo", title: "To Do" },
  { id: "inprogress", title: "In Progress" },
  { id: "done", title: "Done" }
];

const simulateApiCall = (data) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() < FAILURE_RATE) {
        reject(new Error("Network error. Please try again."));
      } else {
        resolve(data);
      }
    }, API_DELAY);
  });
};

export const fetchTasks = () => simulateApiCall(tasks);
export const fetchColumns = () => simulateApiCall(columns);

export const addTaskApi = (task) =>
  simulateApiCall(task).then((res) => {
    tasks.push(res);
    return res;
  });

export const updateTaskApi = (updatedTask) =>
  simulateApiCall(updatedTask).then((res) => {
    tasks = tasks.map((t) => (t.id === res.id ? res : t));
    return res;
  });

export const deleteTaskApi = (taskId) =>
  simulateApiCall(taskId).then(() => {
    tasks = tasks.filter((t) => t.id !== taskId);
    return { success: true };
  });

export const moveTaskApi = (taskId, newColumnId) =>
  simulateApiCall({ taskId, newColumnId }).then(() => {
    tasks = tasks.map((t) =>
      t.id === taskId ? { ...t, columnId: newColumnId } : t
    );
    return { success: true };
  });
