import { useMemo } from "react";

export interface Routine {
  date: string;
  [key: string]: any;
}

export const useStreak = (routines: Routine[] | undefined) => {
  return useMemo(() => {
    if (!routines) {
      return {
        streak: 0,
        lastActiveDate: "",
        monthlyActivity: {},
        dailyLogCounts: {},
      };
    }

    const reverseRoutines = [...routines].reverse(); // Sort oldest to newest

    let streak = 0;
    let lastActiveDate = "";
    const monthlyActivity: Record<string, Record<number, boolean>> = {};
    const dailyLogCounts: Record<string, number> = {};

    let lastDateObj: Date | null = null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (const r of reverseRoutines) {
      const d = new Date(r.date);
      d.setHours(0, 0, 0, 0);

      const mKey = `${d.getFullYear()}-${d.getMonth()}`;
      const day = d.getDate();

      if (!monthlyActivity[mKey]) monthlyActivity[mKey] = {};
      monthlyActivity[mKey][day] = true;

      const logKey = `${mKey}-${day}`;
      // In the app, Routines don't natively have a `logCount` saved directly unless they just do `|| 1` per day
      dailyLogCounts[logKey] = (r.logCount as number) || 1;

      // For streak calculation
      if (lastDateObj) {
        const diffTime = Math.abs(d.getTime() - lastDateObj.getTime());
        const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays === 1) {
          streak++;
        } else if (diffDays > 1) {
          streak = 1;
        }
      } else {
        streak = 1;
      }
      
      lastDateObj = d;
      lastActiveDate = r.date;
    }

    // Reset streak if we missed yesterday
    if (lastDateObj) {
      const diffTime = Math.abs(today.getTime() - lastDateObj.getTime());
      const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays > 1) {
        streak = 0;
      }
    }

    return { streak, lastActiveDate, monthlyActivity, dailyLogCounts };
  }, [routines]);
};
