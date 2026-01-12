import { JSX } from "react";
import CornerElements from "./CornerElements";
import { Flame } from "lucide-react";

interface Props {
  streak: number;
  lastActiveDate: string;
  currentDate: Date;
  renderCalendar(): JSX.Element[];
}

const StreakCard = ({
  streak,
  lastActiveDate,
  currentDate,
  renderCalendar,
}: Props) => {
  return (
    <div className="relative backdrop-blur-sm border border-border rounded-lg p-6">
      <CornerElements />

      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Flame className="h-8 w-8 text-orange-500" />
          <div>
            <h3 className="font-mono font-bold text-2xl text-primary">
              {streak} DAY STREAK
            </h3>
            <p className="text-sm text-muted-foreground">Keep it going!</p>
          </div>
        </div>

        <div className="text-right">
          <p className="text-xs text-muted-foreground font-mono">LAST ACTIVE</p>
          <p className="text-sm font-semibold">{lastActiveDate || "Never"}</p>
        </div>
      </div>

      {/* Calendar */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <h4 className="font-mono text-sm text-muted-foreground">
            {currentDate.toLocaleString("default", {
              month: "long",
              year: "numeric",
            })}
          </h4>
        </div>

        <div className="grid grid-cols-7 gap-2 mb-2">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div
              key={day}
              className="text-center text-xs text-muted-foreground font-mono"
            >
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-2">{renderCalendar()}</div>
      </div>
    </div>
  );
};

export default StreakCard;
