"use client";
import React, { useState, useEffect, DragEvent } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Edit, Trash } from "lucide-react";
import { db } from "@/config/firebaseConfig";
import {
  collection,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
} from "firebase/firestore";
import { Task, TaskWithId } from "@/schema/task";

const TaskBoard: React.FC = () => {
  const [overDueTasks, setOverDueTasks] = useState<TaskWithId[]>([]);
  const [completedTasks, setCompletedTasks] = useState<TaskWithId[]>([]);
  const [pendingTasks, setPendingTasks] = useState<TaskWithId[]>([]);

  const [newTask, setNewTask] = useState<Task>({
    title: "",
    description: "",
    dueDate: "",
    priority: "MEDIUM",
    status: "PENDING",
  });

  const [editingTask, setEditingTask] = useState<TaskWithId | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "tasks"), (snapshot) => {
      const tasksData = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          title: data.title,
          description: data.description,
          dueDate: data.dueDate,
          priority: data.priority,
          status: data.status,
        };
      }) as TaskWithId[];

      setOverDueTasks(
        tasksData.filter(
          (task) =>
            new Date(task.dueDate) < new Date() && task.status !== "COMPLETED"
        )
      );

      setCompletedTasks(
        tasksData.filter((task) => task.status === "COMPLETED")
      );

      setPendingTasks(
        tasksData.filter(
          (task) =>
            new Date(task.dueDate) >= new Date() && task.status !== "COMPLETED"
        )
      );
    });

    return () => unsubscribe();
  }, []);

  const handleDragStart = (e: DragEvent<HTMLDivElement>, task: TaskWithId) => {
    e.dataTransfer.setData("taskId", task.id);
  };

  const handleDrop = async (
    e: DragEvent<HTMLDivElement>,
    newStatus: Task["status"]
  ) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData("taskId");
    const taskDoc = doc(db, "tasks", taskId);
    await updateDoc(taskDoc, { status: newStatus });

    if (newStatus === "COMPLETED") {
      setPendingTasks(pendingTasks.filter((task) => task.id !== taskId));
      setOverDueTasks(overDueTasks.filter((task) => task.id !== taskId));
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const deleteTask = async (id: string) => {
    await deleteDoc(doc(db, "tasks", id));

    setOverDueTasks(overDueTasks.filter((task) => task.id !== id));
  };

  const editTask = (task: TaskWithId) => {
    setEditingTask(task);
    setNewTask(task);
    setIsDialogOpen(true);
  };

  const updateTask = async () => {
    if (editingTask) {
      const taskDoc = doc(db, "tasks", editingTask.id);
      await updateDoc(taskDoc, newTask);
      setEditingTask(null);
      setIsDialogOpen(false);
    }
  };

  const getPriorityColor = (priority: Task["priority"]) => {
    const colors = {
      LOW: "bg-green-500",
      MEDIUM: "bg-yellow-500",
      HIGH: "bg-red-500",
    };
    return colors[priority] || colors.MEDIUM;
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Task Management</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Task</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Task Title"
                value={newTask.title}
                onChange={(e) =>
                  setNewTask({ ...newTask, title: e.target.value })
                }
              />
              <Textarea
                placeholder="Description"
                value={newTask.description}
                onChange={(e) =>
                  setNewTask({ ...newTask, description: e.target.value })
                }
              />
              <Input
                type="date"
                value={newTask.dueDate}
                onChange={(e) =>
                  setNewTask({ ...newTask, dueDate: e.target.value })
                }
              />
              <Select
                value={newTask.priority}
                defaultValue={newTask.priority}
                onValueChange={(value) =>
                  setNewTask({
                    ...newTask,
                    priority: value as Task["priority"],
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="LOW">Low</SelectItem>
                  <SelectItem value="MEDIUM">Medium</SelectItem>
                  <SelectItem value="HIGH">High</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={updateTask}>Update Task</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <TaskColumn
          title="Pending Tasks"
          tasks={pendingTasks}
          handleDragOver={handleDragOver}
          handleDrop={handleDrop}
          deleteTask={deleteTask}
          editTask={editTask}
          getPriorityColor={getPriorityColor}
          handleDragStart={handleDragStart}
        />
        <TaskColumn
          title="Completed Tasks"
          tasks={completedTasks}
          handleDragOver={handleDragOver}
          handleDrop={handleDrop}
          deleteTask={deleteTask}
          editTask={editTask}
          getPriorityColor={getPriorityColor}
          handleDragStart={handleDragStart}
        />
        <TaskColumn
          title="Overdue Tasks"
          tasks={overDueTasks}
          handleDragOver={handleDragOver}
          handleDrop={handleDrop}
          deleteTask={deleteTask}
          editTask={editTask}
          getPriorityColor={getPriorityColor}
          handleDragStart={handleDragStart}
        />
      </div>
    </div>
  );
};

const TaskColumn: React.FC<{
  title: string;
  tasks: TaskWithId[];
  handleDrop: (e: DragEvent<HTMLDivElement>, newStatus: Task["status"]) => void;
  handleDragOver: (e: DragEvent<HTMLDivElement>) => void;
  deleteTask: (id: string) => void;
  editTask: (task: TaskWithId) => void;
  getPriorityColor: (priority: Task["priority"]) => string;
  handleDragStart: (e: DragEvent<HTMLDivElement>, task: TaskWithId) => void;
}> = ({
  title,
  tasks,
  handleDragOver,
  handleDrop,
  deleteTask,
  editTask,
  getPriorityColor,
  handleDragStart,
}) => (
  <Card className="w-full md:w-1/3 p-4 m-2">
    <CardHeader>
      <CardTitle>{title}</CardTitle>
    </CardHeader>
    <CardContent
      onDrop={(e) =>
        handleDrop(e, title === "Completed Tasks" ? "COMPLETED" : "PENDING")
      }
      onDragOver={handleDragOver}
      className="min-h-64"
    >
      {tasks.map((task) => (
        <Card
          key={task.id}
          draggable
          onDragStart={(e) => handleDragStart(e, task)}
          className="p-3 mb-2 cursor-move hover:bg-gray-50"
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium">{task.title}</h3>
              <p className="text-sm text-gray-600">{task.description}</p>
              <p className="text-sm text-gray-500">Due: {task.dueDate}</p>
            </div>
            <div className="flex gap-2">
              <Badge className={getPriorityColor(task.priority)}>
                {task.priority}
              </Badge>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => editTask(task)}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => deleteTask(task.id)}
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </CardContent>
  </Card>
);

export default TaskBoard;
