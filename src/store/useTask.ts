import { create } from "zustand";
import { TaskStatus, TaskPriority } from "@/lib/enum";

type TaskStore = {
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
};

const useTaskStore = create<TaskStore>()((set) => ({
  title: "",
  description: "",
  status: TaskStatus.PENDING,
  priority: TaskPriority.LOW,
  setTitle: (title: string) => set({ title }),
  setDescription: (description: string) => set({ description }),
  setStatus: (status: TaskStatus) => set({ status }),
  setPriority: (priority: TaskPriority) => set({ priority }),
}));

export default useTaskStore;
