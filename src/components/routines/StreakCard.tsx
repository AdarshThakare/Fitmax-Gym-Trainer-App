import { useState } from "react";
import CornerElements from "./CornerElements";
import { Flame, ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  streak: number;
  lastActiveDate: string;
  monthlyActivity: Record<string, Record<number, boolean>>;
  dailyLogCounts: Record<string, number>;
  compact?: boolean;
}

const getBrightnessClass = (count: number) => {
  // Primary (blue) scale where less = darker, more = brighter
  if (count >= 4) return "bg-primary border-primary text-white font-bold shadow-sm ring-1 ring-primary/50";
  if (count === 3) return "bg-primary/80 border-primary/80 text-white shadow-sm";
  if (count === 2) return "bg-primary/60 border-primary/60 text-white shadow-sm";
  if (count === 1) return "bg-primary/40 border-primary/40 text-white shadow-sm";
  return "bg-background border-border text-muted-foreground hover:bg-muted/50";
};

const StreakCard = ({
  streak,
  lastActiveDate,
  monthlyActivity,
  dailyLogCounts,
  compact = false,
}: Props) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrentDate(new Date(currentDate.getFullYear(), parseInt(e.target.value), 1));
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrentDate(new Date(parseInt(e.target.value), currentDate.getMonth(), 1));
  };

  const getDaysInMonth = () => {
    const y = currentDate.getFullYear();
    const m = currentDate.getMonth();
    return {
      firstDay: new Date(y, m, 1).getDay(),
      daysInMonth: new Date(y, m + 1, 0).getDate(),
    };
  };

  const renderCalendar = () => {
    const { firstDay, daysInMonth } = getDaysInMonth();
    const monthKey = `${currentDate.getFullYear()}-${currentDate.getMonth()}`;
    const activity = monthlyActivity[monthKey] || {};

    const days = [];
    const now = new Date();

    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-10" />);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const isToday =
        day === now.getDate() &&
        currentDate.getMonth() === now.getMonth() &&
        currentDate.getFullYear() === now.getFullYear();

      const logKey = `${monthKey}-${day}`;
      const count = dailyLogCounts[logKey] || 0;

      days.push(
        <div
          key={day}
          title={`${count} workouts on ${currentDate.toLocaleDateString('default', { month: 'long', year: 'numeric' })} ${day}`}
          className={`h-10 w-full flex items-center justify-center rounded-md font-mono text-sm border transition-colors cursor-default
            ${isToday ? "ring-2 ring-primary ring-offset-1 ring-offset-background" : ""}
            ${getBrightnessClass(count)}
          `}
        >
          {day}
        </div>
      );
    }

    return days;
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);

  return (
    <div className={`relative backdrop-blur-sm border border-border rounded-xl shadow-sm overflow-hidden ${compact ? "p-3 border-none bg-transparent" : "p-6"}`}>
      {compact ? null : <CornerElements />}

      <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${compact ? "" : "mb-6"}`}>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-orange-500/10 rounded-lg">
            <Flame className="h-8 w-8 text-orange-500 animate-pulse" />
          </div>
          <div>
            <h3 className="font-mono font-bold text-2xl text-foreground">
              {streak} DAY STREAK
            </h3>
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              <CalendarIcon className="h-3.5 w-3.5" />
              Last active: {lastActiveDate || "Never"}
            </p>
          </div>
        </div>
      </div>

      {compact ? null : (
        <div className="bg-card/50 p-4 rounded-lg border border-border/50">
        <div className="flex flex-wrap gap-2 justify-between items-center mb-4">
          <div className="flex gap-2">
            <select
              value={currentDate.getMonth()}
              onChange={handleMonthChange}
              className="bg-transparent text-sm border border-border rounded-md px-2 py-1.5 font-medium hover:bg-muted focus:ring-1 focus:ring-primary focus:outline-none"
            >
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i} value={i}>
                  {new Date(0, i).toLocaleString("default", { month: "long" })}
                </option>
              ))}
            </select>
            <select
              value={currentDate.getFullYear()}
              onChange={handleYearChange}
              className="bg-transparent text-sm border border-border rounded-md px-2 py-1.5 font-medium hover:bg-muted focus:ring-1 focus:ring-primary focus:outline-none"
            >
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-md"
              onClick={handlePrevMonth}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-md"
              onClick={handleNextMonth}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1.5 sm:gap-2 mb-2">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div
              key={day}
              className="text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider"
            >
              {day.slice(0, 1)}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1.5 sm:gap-2">{renderCalendar()}</div>

        <div className="flex items-center justify-end gap-2 mt-4 text-xs text-muted-foreground">
          <span>Less</span>
          <div className="flex gap-1.5">
            <div className="w-4 h-4 rounded-sm bg-background border border-border"></div>
            <div className="w-4 h-4 rounded-sm bg-primary/40 border border-primary/40"></div>
            <div className="w-4 h-4 rounded-sm bg-primary/60 border border-primary/60"></div>
            <div className="w-4 h-4 rounded-sm bg-primary/80 border border-primary/80"></div>
            <div className="w-4 h-4 rounded-sm bg-primary border border-primary"></div>
          </div>
          <span>More</span>
        </div>
      </div>
      )}
    </div>
  );
};

export default StreakCard;
