"use client";
export const API_KEY = "AIzaSyD6Nva64ItJL4QWXiOpLwruGvkr4G82HD0";
export const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Plus } from "lucide-react";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createTask } from "@/services/tasks";
import { useToast } from "@/hooks/use-toast";
import { Task, taskSchema } from "@/schema/task";
import { useRouter } from "next/navigation";

export function CreateTaskDialog() {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="w-full">
          <Plus />
          <span>New Task</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Task</DialogTitle>
          <DialogDescription>
            Create a new task to get started.
          </DialogDescription>
          <CreateTaskForm onClose={() => setIsOpen(false)} />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

function CreateTaskForm({ onClose }: { onClose: () => void }) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<Task>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: "",
      description: "",
      dueDate: "",
      priority: "MEDIUM",
      status: "PENDING",
    },
  });
  const router = useRouter();

  const { toast } = useToast();

  const generateFeedbackPrompt = (newTask: any, monthlyTasks: any) => {
    const formattedMonthlyTasks = monthlyTasks
      .map(
        (task: any) =>
          `- ${task.title} (Deadline: ${task.dueDate}, Priority: ${task.priority})`
      )
      .join("\n");

    return `
    A new task was added: "${newTask.title}" (Deadline: ${newTask.dueDate}, Priority: ${newTask.priority}).

    Here is the user's task list for the month:
    ${formattedMonthlyTasks}

    Provide feedback on the new task and its alignment with the user's workload. Suggest improvements or scheduling tips.
    `;
  };

  const getGeminiFeedback = async (prompt: any) => {
    try {
      const response = await fetch(GEMINI_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log("gemini res:", data);
      return data?.candidates?.[0]?.content || "No feedback available.";
    } catch (error) {
      console.error("Error fetching Gemini Flash feedback:", error);
      return "Error fetching feedback. Please try again.";
    }
  };

  const onSubmit: SubmitHandler<Task> = async (data) => {
    console.log(data);
    try {
      await createTask(data);
      const prompt = generateFeedbackPrompt(data, [data]);
      toast({ title: "Task created successfully", description: prompt });
      // const feedback = await getGeminiFeedback(prompt);
      toast({ title: "AI Feedback", description: "ai not working" });

      onClose();
      router.push("/");
    } catch (error: unknown) {
      toast({
        title: "Error creating task",
        description: (error as Error).message,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
      <div>
        <label>Title</label>
        <Input placeholder="Title" {...register("title")} />
        {errors.title && (
          <span className="text-red-500 text-xs">{errors.title.message}</span>
        )}
      </div>
      <div className="mt-2">
        <label className="text-sm">Description</label>
        <Input placeholder="Description" {...register("description")} />
        {errors.description && (
          <span className="text-red-500 text-xs">
            {errors.description.message}
          </span>
        )}
      </div>
      <div className="mt-2">
        <label className="text-sm">Due Date</label>
        <Input placeholder="Due Date" type="date" {...register("dueDate")} />
        {errors.dueDate && (
          <span className="text-red-500 text-xs">{errors.dueDate.message}</span>
        )}
      </div>
      <div className="mt-2">
        <label className="text-sm">Priority</label>
        <Select
          defaultValue="MEDIUM"
          onValueChange={(value: any) => {
            setValue("priority", value);
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="LOW">Low</SelectItem>
            <SelectItem value="MEDIUM">Medium</SelectItem>
            <SelectItem value="HIGH">High</SelectItem>
          </SelectContent>
        </Select>
        {errors.priority && (
          <span className="text-red-500 text-xs">
            {errors.priority.message}
          </span>
        )}
      </div>
      <div className="mt-2">
        <label className="text-sm">Status</label>
        <Select
          defaultValue="PENDING"
          onValueChange={(value: any) => {
            setValue("status", value);
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="PENDING">Pending</SelectItem>
            <SelectItem value="COMPLETED">Completed</SelectItem>
          </SelectContent>
        </Select>
        {errors.status && (
          <span className="text-red-500 text-xs">{errors.status.message}</span>
        )}
      </div>
      <Button type="submit">Create Task</Button>
    </form>
  );
}
