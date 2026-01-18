"use client";

import { useEffect, useState } from "react";

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

  // Load persisted data
  useEffect(() => {
    const streak = parseInt(localStorage.getItem("fitnessStreak") || "0");
    const last = localStorage.getItem("lastActiveDate") || "";
    const activity = JSON.parse(
      localStorage.getItem("monthlyActivity") || "{}",
    );
    const logs = JSON.parse(localStorage.getItem("dailyLogCounts") || "{}");

    setStreak(streak);
    setLastActiveDate(last);
    setMonthlyActivity(activity);
    setDailyLogCounts(logs);

    const savedProgress = JSON.parse(
      localStorage.getItem("workoutProgress") || "[]",
    );
    const savedVolume = JSON.parse(
      localStorage.getItem("volumeProgress") || "[]",
    );

    setProgressData(savedProgress.slice(-14));
    setVolumeData(savedVolume.slice(-7));
  }, []);

  // Calendar helpers
  const getDaysInMonth = () => {
    const y = currentDate.getFullYear();
    const m = currentDate.getMonth();
    return {
      firstDay: new Date(y, m, 1).getDay(),
      daysInMonth: new Date(y, m + 1, 0).getDate(),
    };
  };

  const getBrightnessClass = (count: number) => {
    if (count >= 4) return "bg-primary text-white font-bold";
    if (count === 3) return "bg-primary/80 text-white font-bold";
    if (count === 2) return "bg-primary/50 text-primary font-bold";
    if (count === 1) return "bg-primary/20 text-primary font-bold";
    return "text-muted-foreground";
  };

  const renderCalendar = () => {
    const { firstDay, daysInMonth } = getDaysInMonth();
    const monthKey = `${currentDate.getFullYear()}-${currentDate.getMonth()}`;
    const activity = monthlyActivity[monthKey] || [];

    const days = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`e-${i}`} className="h-10" />);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const isToday = day === currentDate.getDate();
      const logKey = `${monthKey}-${day}`;
      const count = dailyLogCounts[logKey] || 0;

      days.push(
        <div
          key={day}
          className={`h-10 flex items-center justify-center rounded font-mono text-sm
            ${isToday ? "border-2 border-primary" : ""}
            ${activity[day] ? getBrightnessClass(count) : "text-muted-foreground"}
          `}
        >
          {day}
        </div>,
      );
    }

    return days;
  };

  // Save routine
  const handleSubmitRoutine = () => {
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();

    let newStreak = streak;
    if (lastActiveDate === yesterday) newStreak++;
    else if (lastActiveDate !== today) newStreak = 1;

    setStreak(newStreak);
    setLastActiveDate(today);
    localStorage.setItem("fitnessStreak", newStreak.toString());
    localStorage.setItem("lastActiveDate", today);

    const monthKey = `${currentDate.getFullYear()}-${currentDate.getMonth()}`;
    const dayKey = currentDate.getDate();

    const updatedActivity = {
      ...monthlyActivity,
      [monthKey]: {
        ...(monthlyActivity[monthKey] || {}),
        [dayKey]: true,
      },
    };

    setMonthlyActivity(updatedActivity);
    localStorage.setItem("monthlyActivity", JSON.stringify(updatedActivity));

    const logKey = `${monthKey}-${dayKey}`;
    const updatedLogs = {
      ...dailyLogCounts,
      [logKey]: (dailyLogCounts[logKey] || 0) + 1,
    };
    setDailyLogCounts(updatedLogs);
    localStorage.setItem("dailyLogCounts", JSON.stringify(updatedLogs));

    const newProgress: ProgressData = {
      date: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      pushups: pushupSets.reduce((s, x) => s + x.reps, 0),
      weightlifts: weightliftSets.reduce((s, x) => s + x.reps, 0),
      cardio: cardioSets.reduce((s, x) => s + x.reps, 0),
      custom: customExercises.reduce(
        (s, ex) => s + ex.sets.reduce((a, b) => a + b.reps, 0),
        0,
      ),
    };

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

    // ✅ cumulative update if same day exists, else push new day
    const existingIndex = progressData.findIndex(
      (p) => p.date === newProgress.date,
    );

    let updatedProgress: ProgressData[] = [];
    let updatedVolume: VolumeData[] = [];

    if (existingIndex !== -1) {
      updatedProgress = [...progressData];
      updatedProgress[existingIndex] = {
        ...updatedProgress[existingIndex],
        pushups: updatedProgress[existingIndex].pushups + newProgress.pushups,
        weightlifts:
          updatedProgress[existingIndex].weightlifts + newProgress.weightlifts,
        cardio: updatedProgress[existingIndex].cardio + newProgress.cardio,
        custom: updatedProgress[existingIndex].custom + newProgress.custom,
      };

      updatedVolume = [...volumeData];
      if (updatedVolume[existingIndex]) {
        updatedVolume[existingIndex] = {
          ...updatedVolume[existingIndex],
          volume: updatedVolume[existingIndex].volume + volume,
        };
      } else {
        // fallback (just in case arrays mismatch)
        updatedVolume.push({ date: newProgress.date, volume });
      }
    } else {
      updatedProgress = [...progressData, newProgress].slice(-14);
      updatedVolume = [...volumeData, { date: newProgress.date, volume }].slice(
        -7,
      );
    }

    setProgressData(updatedProgress);
    localStorage.setItem("workoutProgress", JSON.stringify(updatedProgress));

    setVolumeData(updatedVolume);
    localStorage.setItem("volumeProgress", JSON.stringify(updatedVolume));

    // ✅ reset all inputs after submit
    setPushupSets([{ reps: 0, type: "bodyweight" }]);
    setWeightliftSets([{ reps: 0, weight: "", type: "weighted" }]);
    setCardioSets([{ reps: 0, type: "duration" }]);
    setCustomExercises([]);

    // ✅ toast instead of alert
    toast.success("Routine logged successfully!");
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
            currentDate={currentDate}
            renderCalendar={renderCalendar}
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
