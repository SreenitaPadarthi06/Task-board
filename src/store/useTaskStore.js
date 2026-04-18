import { create } from "zustand";
import { persist } from "zustand/middleware";
import { v4 as uuidv4 } from "uuid";
import {
  fetchTasks,
  fetchColumns,
  addTaskApi,
  updateTaskApi,
  deleteTaskApi,
  moveTaskApi,
} from "../services/mockApi";

export const useTaskStore = create(
  persist(
    (set, get) => ({
      tasks: [],
      columns: [],
      loading: false,
      error: null,

      loadData: async () => {
        if (get().tasks.length && get().columns.length) return;

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

      addTask: async (columnId, title, description) => {
        const tempId = "temp-" + uuidv4();
        const newTask = { id: tempId, columnId, title, description };

        set((state) => ({ tasks: [...state.tasks, newTask] }));

        try {
          await addTaskApi(newTask);
        } catch (err) {
          set((state) => ({
            tasks: state.tasks.filter((t) => t.id !== tempId),
            error: err.message,
          }));
        }
      },

      updateTask: async (updatedTask) => {
        const old = get().tasks;
        set({
          tasks: old.map((t) => (t.id === updatedTask.id ? updatedTask : t)),
        });

        try {
          await updateTaskApi(updatedTask);
        } catch (err) {
          set({ tasks: old, error: err.message });
        }
      },

      deleteTask: async (taskId) => {
        const old = get().tasks;
        set({ tasks: old.filter((t) => t.id !== taskId) });

        try {
          await deleteTaskApi(taskId);
        } catch (err) {
          set({ tasks: old, error: err.message });
        }
      },

      moveTask: async (taskId, newColumnId) => {
        const old = get().tasks;

        set({
          tasks: old.map((t) =>
            t.id === taskId ? { ...t, columnId: newColumnId } : t
          ),
        });

        try {
          await moveTaskApi(taskId, newColumnId);
        } catch (err) {
          set({ tasks: old, error: err.message });
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: "task-board-storage",
    }
  )
);