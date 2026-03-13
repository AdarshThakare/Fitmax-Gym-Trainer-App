import { useMemo } from "react";
import { Routine } from "./useStreak";

export interface PerformanceStats {
  today: number[];
  yesterday: number[];
  personalBest: number[];
  indicators: { name: string; max: number }[];
}

export const usePerformanceStats = (routines: Routine[] | undefined) => {
  return useMemo(() => {
    if (!routines || routines.length === 0) {
      return {
        today: [0, 0, 0, 0, 0],
        yesterday: [0, 0, 0, 0, 0],
        personalBest: [0, 0, 0, 0, 0],
        indicators: [
          { name: "Pushups", max: 100 },
          { name: "Weightlifts", max: 100 },
          { name: "Cardio", max: 100 },
          { name: "Crunches", max: 100 },
          { name: "Squats", max: 100 },
        ],
      };
    }

    // Standardized metrics
    const metrics = ["pushups", "weightlifts", "cardio", "crunches", "squats"];
    
    // Group totals by date
    const dailyTotals: Record<string, number[]> = {};
    const maxValues = [0, 0, 0, 0, 0];

    routines.forEach((r) => {
      const date = r.date;
      if (!dailyTotals[date]) dailyTotals[date] = [0, 0, 0, 0, 0];
      
      metrics.forEach((m, idx) => {
        const val = r[m] || 0;
        dailyTotals[date][idx] += val;
        if (dailyTotals[date][idx] > maxValues[idx]) {
          maxValues[idx] = dailyTotals[date][idx];
        }
      });
    });

    const sortedDates = Object.keys(dailyTotals).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
    
    const todayData = dailyTotals[sortedDates[0]] || [0, 0, 0, 0, 0];
    const yesterdayData = dailyTotals[sortedDates[1]] || [0, 0, 0, 0, 0];
    const personalBest = maxValues;

    const indicators = metrics.map((m, idx) => ({
      name: m.charAt(0).toUpperCase() + m.slice(1),
      max: Math.max(10, Math.ceil(personalBest[idx] * 1.2)), // Buffer for aesthetics
    }));

    return { today: todayData, yesterday: yesterdayData, personalBest, indicators };
  }, [routines]);
};
