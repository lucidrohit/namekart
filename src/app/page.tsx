import ListTasks from "@/components/list-tasks";

export default function Dashboard() {
  return (
    <div className="container mx-auto p-4 w-full flex flex-col flex-1">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p className="mt-2 text-gray-600">
        Welcome to Tasky! Get started by creating a new task.
      </p>
      <ListTasks />
    </div>
  );
}
