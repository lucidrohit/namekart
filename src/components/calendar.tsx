"use client";

import React, { useEffect, useState } from "react";
import Calendar from "react-calendar";
import moment from "moment";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import "react-calendar/dist/Calendar.css";
import { TaskWithId } from "@/schema/task";

import { db } from "@/config/firebaseConfig";
import { collection, onSnapshot } from "firebase/firestore";

const TaskCalendar: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [tasks, setTasks] = useState<TaskWithId[]>([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "tasks"), (snapshot) => {
      const tasksData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as TaskWithId[];
      setTasks(tasksData);
    });

    return () => unsubscribe();
  }, []);

  // Group tasks by date
  const tasksByDate: Record<string, TaskWithId[]> = tasks.reduce(
    (acc, task) => {
      const date = moment(task.dueDate).format("YYYY-MM-DD");
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(task);
      return acc;
    },
    {} as Record<string, TaskWithId[]>
  );

  const getTasksForDate = (date: Date): TaskWithId[] => {
    const dateStr = moment(date).format("YYYY-MM-DD");
    return tasksByDate[dateStr] || [];
  };

  const getTileContent = ({ date }: { date: Date }): JSX.Element | null => {
    const dateTasks = getTasksForDate(date);
    if (dateTasks.length === 0) return null;

    const priorityCounts = dateTasks.reduce((acc, task) => {
      acc[task.priority] = (acc[task.priority] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return (
      <div className="text-xs mt-1 flex flex-wrap gap-1 justify-center">
        {priorityCounts.HIGH > 0 && (
          <div className="w-2 h-2 rounded-full bg-red-500" />
        )}
        {priorityCounts.MEDIUM > 0 && (
          <div className="w-2 h-2 rounded-full bg-yellow-500" />
        )}
        {priorityCounts.LOW > 0 && (
          <div className="w-2 h-2 rounded-full bg-green-500" />
        )}
      </div>
    );
  };

  const getTileClassName = ({ date }: { date: Date }): string => {
    const dateTasks = getTasksForDate(date);
    if (dateTasks.length === 0) return "";
    return "font-bold";
  };

  const getPriorityColor = (priority: TaskWithId["priority"]): string => {
    const colors = {
      HIGH: "bg-red-500",
      MEDIUM: "bg-yellow-500",
      LOW: "bg-green-500",
    };
    return colors[priority];
  };

  return (
    <Card className="w-full  p-4">
      <CardHeader>
        <CardTitle className="text-2xl">Task Calendar</CardTitle>
      </CardHeader>
      <CardContent className="h-[calc(100%-5rem)]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
          <div className="flex flex-col">
            <Calendar
              //   @ts-ignore
              onChange={setSelectedDate}
              value={selectedDate}
              tileContent={getTileContent}
              tileClassName={getTileClassName}
              className="w-full flex-grow"
              minDetail="month"
              //   @ts-ignore

              //    calendarType='US'
            />
            <div className="mt-4 flex justify-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <span>High Priority</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <span>Medium Priority</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span>Low Priority</span>
              </div>
            </div>
          </div>

          <div className="border-l pl-6">
            <h3 className="text-xl font-semibold mb-4">
              Tasks for {moment(selectedDate).format("MMMM D, YYYY")}
            </h3>
            <ScrollArea className="h-[calc(100%-3rem)] pr-4">
              <div className="space-y-4">
                {getTasksForDate(selectedDate).map((task) => (
                  <Card
                    key={task.id}
                    className="p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-grow">
                        <h4 className="text-lg font-semibold">{task.title}</h4>
                        <p className="text-gray-600 mt-1">{task.description}</p>
                        <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                          <span>Due: {moment(task.dueDate).format("LT")}</span>
                          <span>•</span>
                          <span>ID: {task.id}</span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <Badge
                          className={`${getPriorityColor(
                            task.priority
                          )} text-white`}
                        >
                          {task.priority}
                        </Badge>
                        <Badge
                          variant={
                            task.status === "COMPLETED"
                              ? "secondary"
                              : "outline"
                          }
                        >
                          {task.status}
                        </Badge>
                      </div>
                    </div>
                  </Card>
                ))}
                {getTasksForDate(selectedDate).length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-gray-500 italic">
                      No tasks scheduled for this date
                    </p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TaskCalendar;
