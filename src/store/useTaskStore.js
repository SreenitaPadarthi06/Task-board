import { create } from "zustand";
import { v4 as uuidv4 } from "uuid";
import {
  fetchTasks,
  fetchColumns,
  addTaskApi,
  updateTaskApi,
  deleteTaskApi,
  moveTaskApi,
} from "../services/mockApi";

export const useTaskStore = create((set, get) => ({
  tasks: [],
  columns: [],
  loading: false,
  error: null,

  // ----------------------
  // INITIAL FETCH
  // ----------------------
  loadData: async () => {
    set({ loading: true, error: null });
    try {
      const [tasks, columns] = await Promise.all([
        fetchTasks(),
        fetchColumns(),
      ]);
      set({ tasks, columns, loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  // ----------------------
  // ADD TASK (Optimistic)
  // ----------------------
  addTask: async (columnId, title, description) => {
    const newTask = {
      id: uuidv4(),
      columnId,
      title,
      description,
    };

    const previousTasks = get().tasks;

    // Optimistic update
    set({ tasks: [...previousTasks, newTask] });

    try {
      await addTaskApi(newTask);
    } catch (err) {
      // Rollback
      set({ tasks: previousTasks, error: err.message });
    }
  },

  // ----------------------
  // UPDATE TASK (Optimistic)
  // ----------------------
  updateTask: async (updatedTask) => {
    const previousTasks = get().tasks;

    set({
      tasks: previousTasks.map((t) =>
        t.id === updatedTask.id ? updatedTask : t
      ),
    });

    try {
      await updateTaskApi(updatedTask);
    } catch (err) {
      set({ tasks: previousTasks, error: err.message });
    }
  },

  // ----------------------
  // DELETE TASK (Optimistic)
  // ----------------------
  deleteTask: async (taskId) => {
    const previousTasks = get().tasks;

    set({
      tasks: previousTasks.filter((t) => t.id !== taskId),
    });

    try {
      await deleteTaskApi(taskId);
    } catch (err) {
      set({ tasks: previousTasks, error: err.message });
    }
  },

  // ----------------------
  // MOVE TASK (Optimistic)
  // ----------------------
  moveTask: async (taskId, newColumnId) => {
    const previousTasks = get().tasks;

    set({
      tasks: previousTasks.map((t) =>
        t.id === taskId ? { ...t, columnId: newColumnId } : t
      ),
    });

    try {
      await moveTaskApi(taskId, newColumnId);
    } catch (err) {
      set({ tasks: previousTasks, error: err.message });
    }
  },

  clearError: () => set({ error: null }),
}));
