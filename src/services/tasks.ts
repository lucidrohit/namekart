import {
  collection,
  addDoc,
  getDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
} from "firebase/firestore";
import { db } from "@/config/firebaseConfig";
import type { Task, TaskWithId } from "@/schema/task";
import { taskSchema } from "@/schema/task";

// Create a new task
export const createTask = async (task: Task): Promise<void> => {
  try {
    await addDoc(collection(db, "tasks"), task);
    console.log("Task created successfully");
  } catch (error) {
    console.error("Error creating task: ", error);
    throw new Error("Error creating task");
  }
};

// Read a task by ID
export const getTask = async (id: string): Promise<TaskWithId | undefined> => {
  try {
    const docRef = doc(db, "tasks", id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      if (data) {
        const taskData = taskSchema.parse(data);
        return { id: docSnap.id, ...taskData };
      } else {
        throw new Error("Task data is undefined");
      }
    } else {
      console.log("No such task!");
      return undefined;
    }
  } catch (error) {
    console.error("Error getting task: ", error);
    throw new Error("Error getting task");
  }
};

// Update a task by ID
export const updateTask = async (
  id: string,
  updatedTask: Partial<Task>
): Promise<void> => {
  try {
    const docRef = doc(db, "tasks", id);
    await updateDoc(docRef, updatedTask);
    console.log("Task updated successfully");
  } catch (error) {
    console.error("Error updating task: ", error);
    throw new Error("Error updating task");
  }
};

// Delete a task by ID
export const deleteTask = async (id: string): Promise<void> => {
  try {
    const docRef = doc(db, "tasks", id);
    await deleteDoc(docRef);
    console.log("Task deleted successfully");
  } catch (error) {
    console.error("Error deleting task: ", error);
    throw new Error("Error deleting task");
  }
};

export const getAllTasks = async (): Promise<TaskWithId[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, "tasks"));

    const tasks: TaskWithId[] = querySnapshot.docs.map((doc) => {
      const data = doc.data();

      const taskData = taskSchema.parse(data);
      return { id: doc.id, ...taskData };
    });

    return tasks;
  } catch (error) {
    console.error("Error getting tasks: ", error);
    throw new Error("Error getting tasks");
  }
};
