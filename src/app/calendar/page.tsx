import TaskCalendar from "@/components/calendar";

export default function CalendarPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold">Calendar</h1>
      <p className="text-gray-500">View your tasks by date</p>
      <div className="mt-4">
        <TaskCalendar />
      </div>
    </div>
  );
}
export const dynamic = "force-dynamic";
