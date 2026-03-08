"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";

// UI
import { Button } from "@/components/ui/button";

// Sections
import PushupSection from "@/components/routines/PushupSection";
import WeightLiftSection from "@/components/routines/WeightLiftSection";
import StreakCard from "@/components/routines/StreakCard";
import AnalyticsPanel from "@/components/routines/AnalyticsPanel";
import CustomExercisesSection from "@/components/routines/CustomExercisesSection";
import CardioSection from "@/components/routines/CardioSection";
import { toast } from "sonner";

// Types
interface ExerciseSet {
  reps: number;
  type: string;
  weight?: string;
}

interface CustomExercise {
  id: string;
  name: string;
  type: "weighted" | "bodyweight" | "duration";
  sets: ExerciseSet[];
}

interface ProgressData {
  date: string;
  pushups: number;
  weightlifts: number;
  cardio: number;
  custom: number;
}

interface VolumeData {
  date: string;
  volume: number;
}

interface MonthlyActivity {
  [key: string]: {
    [key: number]: boolean;
  };
}

interface DailyLogCounts {
  [key: string]: number;
}

const RoutinesPage = () => {
  const [currentDate] = useState(new Date());
  const { user, isLoaded: isUserLoaded } = useUser();
  const userId = user?.id as string;

  const routines = useQuery(api.routines.getUserRoutines, userId ? { userId } : "skip");
  const saveRoutine = useMutation(api.routines.saveRoutine);

  const [streak, setStreak] = useState(0);
  const [lastActiveDate, setLastActiveDate] = useState("");

  const [monthlyActivity, setMonthlyActivity] = useState<MonthlyActivity>({});
  const [dailyLogCounts, setDailyLogCounts] = useState<DailyLogCounts>({});

  // Exercise states
  const [pushupSets, setPushupSets] = useState<ExerciseSet[]>([
    { reps: 0, type: "bodyweight" },
  ]);
  const [weightliftSets, setWeightliftSets] = useState<ExerciseSet[]>([
    { reps: 0, weight: "", type: "weighted" },
  ]);
  const [cardioSets, setCardioSets] = useState<ExerciseSet[]>([
    { reps: 0, type: "duration" },
  ]);
  const [customExercises, setCustomExercises] = useState<CustomExercise[]>([]);

  // Progress
  const [progressData, setProgressData] = useState<ProgressData[]>([]);
  const [volumeData, setVolumeData] = useState<VolumeData[]>([]);

  // Load data from Convex
  useEffect(() => {
    if (routines === undefined) return;

    const reverseRoutines = [...routines].reverse(); // Sort oldest to newest

    let newStreak = 0;
    let newLastActive = "";
    const newMonthlyActivity: MonthlyActivity = {};
    const newDailyLogCounts: DailyLogCounts = {};
    const newProgressDict: Record<string, ProgressData> = {};
    const newVolumeDict: Record<string, VolumeData> = {};

    let lastDateObj: Date | null = null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (const r of reverseRoutines) {
      const d = new Date(r.date);
      d.setHours(0, 0, 0, 0);

      const mKey = `${d.getFullYear()}-${d.getMonth()}`;
      const day = d.getDate();

      if (!newMonthlyActivity[mKey]) newMonthlyActivity[mKey] = {};
      newMonthlyActivity[mKey][day] = true;

      const logKey = `${mKey}-${day}`;
      newDailyLogCounts[logKey] = r.logCount || 1;

      // For streak calculation
      if (lastDateObj) {
        const diffTime = Math.abs(d.getTime() - lastDateObj.getTime());
        const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays === 1) {
          newStreak++;
        } else if (diffDays > 1) {
          newStreak = 1;
        }
      } else {
        newStreak = 1;
      }
      lastDateObj = d;
      newLastActive = r.date;

      // Progress & Volume
      const chartDate = d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });

      if (newProgressDict[chartDate]) {
        newProgressDict[chartDate].pushups += r.pushups;
        newProgressDict[chartDate].weightlifts += r.weightlifts;
        newProgressDict[chartDate].cardio += r.cardio;
        newProgressDict[chartDate].custom += r.custom;
      } else {
        newProgressDict[chartDate] = {
          date: chartDate,
          pushups: r.pushups,
          weightlifts: r.weightlifts,
          cardio: r.cardio,
          custom: r.custom,
        };
      }

      if (newVolumeDict[chartDate]) {
        newVolumeDict[chartDate].volume += r.volume;
      } else {
        newVolumeDict[chartDate] = {
          date: chartDate,
          volume: r.volume,
        };
      }
    }

    // Reset streak if we missed yesterday
    if (lastDateObj) {
      const diffTime = Math.abs(today.getTime() - lastDateObj.getTime());
      const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays > 1) {
        newStreak = 0;
      }
    }

    setStreak(newStreak);
    setLastActiveDate(newLastActive);
    setMonthlyActivity(newMonthlyActivity);
    setDailyLogCounts(newDailyLogCounts);

    setProgressData(Object.values(newProgressDict).slice(-14));
    setVolumeData(Object.values(newVolumeDict).slice(-7));
  }, [routines]);



  // Save routine
  const handleSubmitRoutine = async () => {
    if (!userId) {
      toast.error("Please login to save your routine.");
      return;
    }

    const today = new Date().toDateString();

    const pushups = pushupSets.reduce((s, x) => s + x.reps, 0);
    const weightlifts = weightliftSets.reduce((s, x) => s + x.reps, 0);
    const cardio = cardioSets.reduce((s, x) => s + x.reps, 0);
    const custom = customExercises.reduce(
      (s, ex) => s + ex.sets.reduce((a, b) => a + b.reps, 0),
      0,
    );

    const volume =
      weightliftSets.reduce(
        (s, x) => s + (parseFloat(x.weight || "0") || 0) * x.reps,
        0,
      ) +
      customExercises.reduce((s, ex) => {
        if (ex.type !== "weighted") return s;
        return (
          s +
          ex.sets.reduce(
            (a, b) => a + (parseFloat(b.weight || "0") || 0) * b.reps,
            0,
          )
        );
      }, 0);

    try {
      await saveRoutine({
        userId,
        date: today,
        pushups,
        weightlifts,
        cardio,
        custom,
        volume,
      });

      // reset all inputs after submit
      setPushupSets([{ reps: 0, type: "bodyweight" }]);
      setWeightliftSets([{ reps: 0, weight: "", type: "weighted" }]);
      setCardioSets([{ reps: 0, type: "duration" }]);
      setCustomExercises([]);

      toast.success("Routine logged successfully!");
    } catch (e) {
      toast.error("Error saving routine.");
      console.error(e);
    }
  };

  const hasAnyActivity = () => {
    const hasPushups = pushupSets.some((s) => s.reps > 0);

    const hasWeightlifts = weightliftSets.some(
      (s) => s.reps > 0 && parseFloat(s.weight || "0") > 0,
    );

    const hasCardio = cardioSets.some((s) => s.reps > 0);

    const hasCustom = customExercises.some((ex) =>
      ex.sets.some((s) => s.reps > 0),
    );

    return hasPushups || hasWeightlifts || hasCardio || hasCustom;
  };

  const pieData = progressData.length
    ? [
      {
        name: "Push-ups",
        value: progressData.at(-1)!.pushups,
        color: "#8b5cf6",
      },
      {
        name: "Weight Lifts",
        value: progressData.at(-1)!.weightlifts,
        color: "#3b82f6",
      },
      {
        name: "Cardio",
        value: progressData.at(-1)!.cardio,
        color: "#ef4444",
      },
      {
        name: "Custom",
        value: progressData.at(-1)!.custom,
        color: "#10b981",
      },
    ].filter((x) => x.value > 0)
    : [];

  const handleAddCustomExercise = ({
    name,
    type,
  }: {
    name: string;
    type: "weighted" | "bodyweight" | "duration";
  }) => {
    setCustomExercises([
      ...customExercises,
      {
        id: Date.now().toString(),
        name,
        type,
        sets:
          type === "weighted"
            ? [{ reps: 0, weight: "", type: "weighted" }]
            : [{ reps: 0, type }],
      },
    ]);
  };

  if (!isUserLoaded || routines === undefined) {
    return (
      <section className="pt-12 pb-32 container mx-auto px-4 flex justify-center items-center min-h-[50vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          <p className="text-muted-foreground font-mono text-sm animate-pulse">Loading routines...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="pt-12 pb-32 container mx-auto px-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-6">
          <PushupSection
            sets={pushupSets}
            onAdd={() =>
              setPushupSets([...pushupSets, { reps: 0, type: "bodyweight" }])
            }
            onRemove={(i) =>
              setPushupSets(pushupSets.filter((_, x) => x !== i))
            }
            onUpdate={(i, v) => {
              const c = [...pushupSets];
              c[i].reps = parseInt(v) || 0;
              setPushupSets(c);
            }}
          />

          <WeightLiftSection
            sets={weightliftSets}
            onAdd={() =>
              setWeightliftSets([
                ...weightliftSets,
                { reps: 0, weight: "", type: "weighted" },
              ])
            }
            onRemove={(i) =>
              setWeightliftSets(weightliftSets.filter((_, x) => x !== i))
            }
            onUpdate={(i, f, v) => {
              const c = [...weightliftSets];
              (c[i] as any)[f] = f === "reps" ? parseInt(v) || 0 : v;
              setWeightliftSets(c);
            }}
          />

          <CardioSection
            sets={cardioSets}
            onAdd={() =>
              setCardioSets([...cardioSets, { reps: 0, type: "duration" }])
            }
            onRemove={(i) =>
              setCardioSets(cardioSets.filter((_, x) => x !== i))
            }
            onUpdate={(i, v) => {
              const c = [...cardioSets];
              c[i].reps = parseInt(v) || 0;
              setCardioSets(c);
            }}
          />

          <CustomExercisesSection
            exercises={customExercises}
            onAddExercise={handleAddCustomExercise}
            onRemoveExercise={(id) =>
              setCustomExercises(customExercises.filter((x) => x.id !== id))
            }
            onAddSet={(id) =>
              setCustomExercises(
                customExercises.map((ex) =>
                  ex.id === id
                    ? {
                      ...ex,
                      sets: [
                        ...ex.sets,
                        ex.type === "weighted"
                          ? { reps: 0, weight: "", type: "weighted" }
                          : { reps: 0, type: ex.type },
                      ],
                    }
                    : ex,
                ),
              )
            }
            onRemoveSet={(id, i) =>
              setCustomExercises(
                customExercises.map((ex) =>
                  ex.id === id
                    ? { ...ex, sets: ex.sets.filter((_, x) => x !== i) }
                    : ex,
                ),
              )
            }
            onUpdateSet={(id, i, f, v) =>
              setCustomExercises(
                customExercises.map((ex) =>
                  ex.id === id
                    ? {
                      ...ex,
                      sets: ex.sets.map((s, x) =>
                        x === i
                          ? {
                            ...s,
                            [f]: f === "reps" ? parseInt(v) || 0 : v,
                          }
                          : s,
                      ),
                    }
                    : ex,
                ),
              )
            }
          />

          <Button
            disabled={!hasAnyActivity()}
            onClick={handleSubmitRoutine}
            className="w-full py-6 text-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            LOG ROUTINE
          </Button>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <StreakCard
            streak={streak}
            lastActiveDate={lastActiveDate}
            monthlyActivity={monthlyActivity as Record<string, Record<number, boolean>>}
            dailyLogCounts={dailyLogCounts as Record<string, number>}
          />

          <AnalyticsPanel
            progressData={progressData}
            volumeData={volumeData}
            pieData={pieData}
          />
        </div>
      </div>
    </section>
  );
};

export default RoutinesPage;
