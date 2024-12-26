import { z } from "zod";

export enum TaskStatus {
  PENDING = "PENDING",
  COMPLETED = "COMPLETED",
}

export enum TaskPriority {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
}

export const taskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  dueDate: z.string().min(1, "Due Date is required"),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]),
  status: z.enum(["PENDING", "COMPLETED"]),
});

type Task = z.infer<typeof taskSchema>;

interface TaskWithId extends Task {
  id: string;
}

export type { Task, TaskWithId };
