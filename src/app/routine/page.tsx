"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Calendar,
  TrendingUp,
  Flame,
  Plus,
  Trash,
  Dumbbell,
  Activity,
  Heart,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

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

interface PieChartData {
  name: string;
  value: number;
  color: string;
}

// Corner Elements Component
const CornerElements = () => {
  return (
    <>
      <div className="absolute top-0 left-0 w-4 h-4 border-l border-t border-primary/40"></div>
      <div className="absolute top-0 right-0 w-4 h-4 border-r border-t border-primary/40"></div>
      <div className="absolute bottom-0 left-0 w-4 h-4 border-l border-b border-primary/40"></div>
      <div className="absolute bottom-0 right-0 w-4 h-4 border-r border-b border-primary/40"></div>
    </>
  );
};

// Main Component
const RoutinesPage = () => {
  const [currentDate] = useState<Date>(new Date());
  const [streak, setStreak] = useState<number>(0);
  const [lastActiveDate, setLastActiveDate] = useState<string>("");
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

  // Progress data
  const [progressData, setProgressData] = useState<ProgressData[]>([]);
  const [volumeData, setVolumeData] = useState<VolumeData[]>([]);

  // Load data on mount
  useEffect(() => {
    loadStreakData();
    loadProgressData();
  }, []);

  // Load streak and activity data from localStorage
  const loadStreakData = (): void => {
    try {
      const savedStreak = parseInt(
        localStorage.getItem("fitnessStreak") || "0"
      );
      const savedLastDate = localStorage.getItem("lastActiveDate") || "";
      const savedActivity = JSON.parse(
        localStorage.getItem("monthlyActivity") || "{}"
      );
      const savedLogCounts = JSON.parse(
        localStorage.getItem("dailyLogCounts") || "{}"
      );

      setStreak(savedStreak);
      setLastActiveDate(savedLastDate);
      setMonthlyActivity(savedActivity);
      setDailyLogCounts(savedLogCounts);

      checkStreakValidity(savedLastDate, savedStreak);
    } catch (error) {
      console.error("Error loading streak data:", error);
    }
  };

  // Check if streak is still valid
  const checkStreakValidity = (
    lastDate: string,
    currentStreak: number
  ): void => {
    if (!lastDate) return;

    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();

    if (lastDate !== today && lastDate !== yesterday) {
      setStreak(0);
      localStorage.setItem("fitnessStreak", "0");
    }
  };

  // Load progress data from localStorage
  const loadProgressData = (): void => {
    try {
      const saved = JSON.parse(localStorage.getItem("workoutProgress") || "[]");
      setProgressData(saved.slice(-14));

      const volumeSaved = JSON.parse(
        localStorage.getItem("volumeProgress") || "[]"
      );
      setVolumeData(volumeSaved.slice(-7));
    } catch (error) {
      console.error("Error loading progress data:", error);
    }
  };

  // Submit routine and update streak
  const handleSubmitRoutine = (): void => {
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();

    let newStreak = streak;
    if (lastActiveDate === yesterday) {
      newStreak = streak + 1;
    } else if (lastActiveDate !== today) {
      newStreak = 1;
    }

    setStreak(newStreak);
    setLastActiveDate(today);
    localStorage.setItem("fitnessStreak", newStreak.toString());
    localStorage.setItem("lastActiveDate", today);

    // Update monthly activity
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

    // Track log counts per day for brightness
    const logCountKey = `${monthKey}-${dayKey}`;
    const currentCount = dailyLogCounts[logCountKey] || 0;
    const updatedLogCounts = {
      ...dailyLogCounts,
      [logCountKey]: currentCount + 1,
    };
    setDailyLogCounts(updatedLogCounts);
    localStorage.setItem("dailyLogCounts", JSON.stringify(updatedLogCounts));

    saveProgressData();
  };

  // Save workout progress
  const saveProgressData = (): void => {
    const totalPushups = pushupSets.reduce(
      (sum, set) => sum + (set.reps || 0),
      0
    );
    const totalWeightlifts = weightliftSets.reduce(
      (sum, set) => sum + (set.reps || 0),
      0
    );
    const totalCardio = cardioSets.reduce(
      (sum, set) => sum + (set.reps || 0),
      0
    );
    const totalCustom = customExercises.reduce(
      (sum, ex) => sum + ex.sets.reduce((s, set) => s + (set.reps || 0), 0),
      0
    );

    const newProgress: ProgressData = {
      date: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      pushups: totalPushups,
      weightlifts: totalWeightlifts,
      cardio: totalCardio,
      custom: totalCustom,
    };

    const updated = [...progressData, newProgress].slice(-14);
    setProgressData(updated);
    localStorage.setItem("workoutProgress", JSON.stringify(updated));

    // Calculate total volume
    const totalVolume = weightliftSets.reduce((sum, set) => {
      const weight = parseFloat(set.weight || "0") || 0;
      return sum + weight * (set.reps || 0);
    }, 0);

    const customVolume = customExercises.reduce((sum, ex) => {
      if (ex.type === "weighted") {
        return (
          sum +
          ex.sets.reduce((s, set) => {
            const weight = parseFloat(set.weight || "0") || 0;
            return s + weight * (set.reps || 0);
          }, 0)
        );
      }
      return sum;
    }, 0);

    const newVolume: VolumeData = {
      date: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      volume: totalVolume + customVolume,
    };

    const updatedVolume = [...volumeData, newVolume].slice(-7);
    setVolumeData(updatedVolume);
    localStorage.setItem("volumeProgress", JSON.stringify(updatedVolume));

    alert("Routine logged successfully! 🎉");
  };

  // Get calendar days info
  const getDaysInMonth = (): { firstDay: number; daysInMonth: number } => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    return { firstDay, daysInMonth };
  };

  // Get brightness class based on log count
  const getBrightnessClass = (logCount: number): string => {
    if (logCount >= 4) return "bg-primary text-white font-bold";
    if (logCount === 3) return "bg-primary/80 text-white font-bold";
    if (logCount === 2) return "bg-primary/50 text-primary font-bold";
    if (logCount === 1) return "bg-primary/20 text-primary font-bold";
    return "text-muted-foreground";
  };

  // Render calendar
  const renderCalendar = () => {
    const { firstDay, daysInMonth } = getDaysInMonth();
    const monthKey = `${currentDate.getFullYear()}-${currentDate.getMonth()}`;
    const activity = monthlyActivity[monthKey] || {};

    const days = [];

    // Empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-10"></div>);
    }

    // Calendar days
    for (let day = 1; day <= daysInMonth; day++) {
      const isActive = activity[day];
      const isToday = day === currentDate.getDate();
      const logCountKey = `${monthKey}-${day}`;
      const logCount = dailyLogCounts[logCountKey] || 0;

      days.push(
        <div
          key={day}
          className={`h-10 flex items-center justify-center rounded font-mono text-sm transition-all
            ${isToday ? "border-2 border-primary" : ""}
            ${isActive ? getBrightnessClass(logCount) : "text-muted-foreground"}
          `}
        >
          {day}
        </div>
      );
    }

    return days;
  };

  // Check if there's any activity logged
  const hasAnyActivity = (): boolean => {
    const hasPushups = pushupSets.some((set) => (set.reps || 0) > 0);
    const hasWeightlifts = weightliftSets.some((set) => (set.reps || 0) > 0);
    const hasCardio = cardioSets.some((set) => (set.reps || 0) > 0);
    const hasCustom = customExercises.some((ex) =>
      ex.sets.some((set) => (set.reps || 0) > 0)
    );

    return hasPushups || hasWeightlifts || hasCardio || hasCustom;
  };

  // Add set to exercise
  const addSet = (type: "pushup" | "weightlift" | "cardio"): void => {
    if (type === "pushup") {
      setPushupSets([...pushupSets, { reps: 0, type: "bodyweight" }]);
    } else if (type === "weightlift") {
      setWeightliftSets([
        ...weightliftSets,
        { reps: 0, weight: "", type: "weighted" },
      ]);
    } else if (type === "cardio") {
      setCardioSets([...cardioSets, { reps: 0, type: "duration" }]);
    }
  };

  // Remove set from exercise
  const removeSet = (
    type: "pushup" | "weightlift" | "cardio",
    index: number
  ): void => {
    if (type === "pushup") {
      setPushupSets(pushupSets.filter((_, i) => i !== index));
    } else if (type === "weightlift") {
      setWeightliftSets(weightliftSets.filter((_, i) => i !== index));
    } else if (type === "cardio") {
      setCardioSets(cardioSets.filter((_, i) => i !== index));
    }
  };

  // Update set values
  const updateSet = (
    type: "pushup" | "weightlift" | "cardio",
    index: number,
    field: string,
    value: string
  ): void => {
    if (type === "pushup") {
      const updated = [...pushupSets];
      updated[index] = {
        ...updated[index],
        [field]: field === "reps" ? parseInt(value) || 0 : value,
      };
      setPushupSets(updated);
    } else if (type === "weightlift") {
      const updated = [...weightliftSets];
      updated[index] = {
        ...updated[index],
        [field]: field === "reps" ? parseInt(value) || 0 : value,
      };
      setWeightliftSets(updated);
    } else if (type === "cardio") {
      const updated = [...cardioSets];
      updated[index] = {
        ...updated[index],
        [field]: field === "reps" ? parseInt(value) || 0 : value,
      };
      setCardioSets(updated);
    }
  };

  // Add custom exercise
  const addCustomExercise = (): void => {
    const name = prompt("Enter exercise name:");
    if (!name || name.trim() === "") return;

    const type = prompt("Enter type (weighted/bodyweight/duration):");
    if (
      !type ||
      !["weighted", "bodyweight", "duration"].includes(type.toLowerCase())
    ) {
      alert("Invalid type. Please use: weighted, bodyweight, or duration");
      return;
    }

    const exerciseType = type.toLowerCase() as
      | "weighted"
      | "bodyweight"
      | "duration";

    const newExercise: CustomExercise = {
      id: Date.now().toString(),
      name: name.trim(),
      type: exerciseType,
      sets:
        exerciseType === "weighted"
          ? [{ reps: 0, weight: "", type: "weighted" }]
          : [{ reps: 0, type: exerciseType }],
    };

    setCustomExercises([...customExercises, newExercise]);
  };

  // Remove custom exercise
  const removeCustomExercise = (exerciseId: string): void => {
    setCustomExercises(customExercises.filter((ex) => ex.id !== exerciseId));
  };

  // Add set to custom exercise
  const addCustomSet = (exerciseId: string): void => {
    setCustomExercises(
      customExercises.map((ex) => {
        if (ex.id === exerciseId) {
          const newSet: ExerciseSet =
            ex.type === "weighted"
              ? { reps: 0, weight: "", type: "weighted" }
              : { reps: 0, type: ex.type };
          return { ...ex, sets: [...ex.sets, newSet] };
        }
        return ex;
      })
    );
  };

  // Remove set from custom exercise
  const removeCustomSet = (exerciseId: string, setIndex: number): void => {
    setCustomExercises(
      customExercises.map((ex) => {
        if (ex.id === exerciseId) {
          return { ...ex, sets: ex.sets.filter((_, i) => i !== setIndex) };
        }
        return ex;
      })
    );
  };

  // Update custom exercise set
  const updateCustomSet = (
    exerciseId: string,
    setIndex: number,
    field: string,
    value: string
  ): void => {
    setCustomExercises(
      customExercises.map((ex) => {
        if (ex.id === exerciseId) {
          const updatedSets = [...ex.sets];
          updatedSets[setIndex] = {
            ...updatedSets[setIndex],
            [field]: field === "reps" ? parseInt(value) || 0 : value,
          };
          return { ...ex, sets: updatedSets };
        }
        return ex;
      })
    );
  };

  // Get pie chart data
  const getPieChartData = (): PieChartData[] => {
    if (progressData.length === 0) return [];

    const latest = progressData[progressData.length - 1];
    return [
      { name: "Push-ups", value: latest.pushups || 0, color: "#8b5cf6" },
      {
        name: "Weight Lifts",
        value: latest.weightlifts || 0,
        color: "#3b82f6",
      },
      { name: "Cardio", value: latest.cardio || 0, color: "#ef4444" },
      { name: "Custom", value: latest.custom || 0, color: "#10b981" },
    ].filter((item) => item.value > 0);
  };

  return (
    <section className="relative z-10 pt-12 pb-32 grow container mx-auto px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          <span className="text-primary">Daily</span>{" "}
          <span className="text-foreground">Routines</span>
        </h1>
        <p className="text-muted-foreground font-mono text-sm">
          Track your workouts and maintain your streak
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT SECTION - Exercise Input */}
        <div className="lg:col-span-1 space-y-6">
          {/* Push-ups */}
          <div className="relative backdrop-blur-sm border border-border rounded-lg p-6">
            <CornerElements />
            <div className="flex items-center gap-2 mb-4">
              <Dumbbell className="h-5 w-5 text-primary" />
              <h3 className="font-mono font-bold text-primary">PUSH-UPS</h3>
            </div>

            <div className="space-y-3">
              {pushupSets.map((set, index) => (
                <div key={index} className="flex gap-2 items-center">
                  <span className="text-xs text-muted-foreground font-mono w-12">
                    SET {index + 1}
                  </span>
                  <Input
                    type="number"
                    placeholder="Reps"
                    value={set.reps || ""}
                    onChange={(e) =>
                      updateSet("pushup", index, "reps", e.target.value)
                    }
                    className="border-primary/20 bg-background/50"
                    min="0"
                  />
                  {pushupSets.length > 1 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeSet("pushup", index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>

            <Button
              onClick={() => addSet("pushup")}
              variant="outline"
              size="sm"
              className="w-full mt-4 border-primary/20 hover:border-primary"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Set
            </Button>
          </div>

          {/* Weight Lifts */}
          <div className="relative backdrop-blur-sm border border-border rounded-lg p-6">
            <CornerElements />
            <div className="flex items-center gap-2 mb-4">
              <Activity className="h-5 w-5 text-primary" />
              <h3 className="font-mono font-bold text-primary">WEIGHT LIFTS</h3>
            </div>

            <div className="space-y-3">
              {weightliftSets.map((set, index) => (
                <div key={index} className="flex gap-2 items-center">
                  <span className="text-xs text-muted-foreground font-mono w-12">
                    SET {index + 1}
                  </span>
                  <Input
                    type="number"
                    placeholder="Weight (kg)"
                    value={set.weight || ""}
                    onChange={(e) =>
                      updateSet("weightlift", index, "weight", e.target.value)
                    }
                    className="border-primary/20 bg-background/50"
                    min="0"
                    step="0.5"
                  />
                  <Input
                    type="number"
                    placeholder="Reps"
                    value={set.reps || ""}
                    onChange={(e) =>
                      updateSet("weightlift", index, "reps", e.target.value)
                    }
                    className="border-primary/20 bg-background/50"
                    min="0"
                  />
                  {weightliftSets.length > 1 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeSet("weightlift", index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>

            <Button
              onClick={() => addSet("weightlift")}
              variant="outline"
              size="sm"
              className="w-full mt-4 border-primary/20 hover:border-primary"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Set
            </Button>
          </div>

          {/* Cardio */}
          <div className="relative backdrop-blur-sm border border-border rounded-lg p-6">
            <CornerElements />
            <div className="flex items-center gap-2 mb-4">
              <Heart className="h-5 w-5 text-primary" />
              <h3 className="font-mono font-bold text-primary">CARDIO</h3>
            </div>

            <div className="space-y-3">
              {cardioSets.map((set, index) => (
                <div key={index} className="flex gap-2 items-center">
                  <span className="text-xs text-muted-foreground font-mono w-12">
                    SET {index + 1}
                  </span>
                  <Input
                    type="number"
                    placeholder="Minutes"
                    value={set.reps || ""}
                    onChange={(e) =>
                      updateSet("cardio", index, "reps", e.target.value)
                    }
                    className="border-primary/20 bg-background/50"
                    min="0"
                  />
                  {cardioSets.length > 1 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeSet("cardio", index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>

            <Button
              onClick={() => addSet("cardio")}
              variant="outline"
              size="sm"
              className="w-full mt-4 border-primary/20 hover:border-primary"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Set
            </Button>
          </div>

          {/* Custom Exercises */}
          {customExercises.map((exercise) => (
            <div
              key={exercise.id}
              className="relative backdrop-blur-sm border border-border rounded-lg p-6"
            >
              <CornerElements />
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-primary" />
                  <h3 className="font-mono font-bold text-primary uppercase">
                    {exercise.name}
                  </h3>
                  <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded font-mono">
                    {exercise.type}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeCustomExercise(exercise.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-3">
                {exercise.sets.map((set, index) => (
                  <div key={index} className="flex gap-2 items-center">
                    <span className="text-xs text-muted-foreground font-mono w-12">
                      SET {index + 1}
                    </span>
                    {exercise.type === "weighted" && (
                      <Input
                        type="number"
                        placeholder="Weight (kg)"
                        value={set.weight || ""}
                        onChange={(e) =>
                          updateCustomSet(
                            exercise.id,
                            index,
                            "weight",
                            e.target.value
                          )
                        }
                        className="border-primary/20 bg-background/50"
                        min="0"
                        step="0.5"
                      />
                    )}
                    <Input
                      type="number"
                      placeholder={
                        exercise.type === "duration" ? "Minutes" : "Reps"
                      }
                      value={set.reps || ""}
                      onChange={(e) =>
                        updateCustomSet(
                          exercise.id,
                          index,
                          "reps",
                          e.target.value
                        )
                      }
                      className="border-primary/20 bg-background/50"
                      min="0"
                    />
                    {exercise.sets.length > 1 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeCustomSet(exercise.id, index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>

              <Button
                onClick={() => addCustomSet(exercise.id)}
                variant="outline"
                size="sm"
                className="w-full mt-4 border-primary/20 hover:border-primary"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Set
              </Button>
            </div>
          ))}

          {/* Add Custom Exercise Button */}
          <Button
            onClick={addCustomExercise}
            variant="outline"
            className="w-full border-dashed border-2 border-primary/40 hover:border-primary hover:bg-primary/10 py-6"
          >
            <Plus className="h-5 w-5 mr-2" />
            <span className="font-mono font-bold">ADD CUSTOM EXERCISE</span>
          </Button>

          {/* Submit Button */}
          <Button
            onClick={handleSubmitRoutine}
            disabled={!hasAnyActivity()}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 py-6 text-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            LOG ROUTINE
          </Button>
        </div>

        {/* RIGHT SECTION - Streaks & Analytics */}
        <div className="lg:col-span-2 space-y-6">
          {/* Streak Card */}
          <div className="relative backdrop-blur-sm border border-border rounded-lg p-6">
            <CornerElements />
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Flame className="h-8 w-8 text-orange-500" />
                <div>
                  <h3 className="font-mono font-bold text-2xl text-primary">
                    {streak} DAY STREAK
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Keep it going! 🔥
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground font-mono">
                  LAST ACTIVE
                </p>
                <p className="text-sm font-semibold">
                  {lastActiveDate || "Never"}
                </p>
              </div>
            </div>

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
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                  (day) => (
                    <div
                      key={day}
                      className="text-center text-xs text-muted-foreground font-mono"
                    >
                      {day}
                    </div>
                  )
                )}
              </div>
              <div className="grid grid-cols-7 gap-2">{renderCalendar()}</div>
            </div>
          </div>

          {/* Analytics Tabs */}
          <div className="relative backdrop-blur-sm border border-border rounded-lg p-6">
            <CornerElements />
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="h-5 w-5 text-primary" />
              <h3 className="font-mono font-bold text-primary">
                PROGRESS ANALYTICS
              </h3>
            </div>

            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="mb-6 w-full grid grid-cols-4 bg-background border">
                <TabsTrigger
                  value="overview"
                  className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
                >
                  Overview
                </TabsTrigger>
                <TabsTrigger
                  value="distribution"
                  className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
                >
                  Distribution
                </TabsTrigger>
                <TabsTrigger
                  value="volume"
                  className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
                >
                  Volume
                </TabsTrigger>
                <TabsTrigger
                  value="trends"
                  className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
                >
                  Trends
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview">
                {progressData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={progressData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                      <XAxis dataKey="date" stroke="#888" />
                      <YAxis stroke="#888" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#1a1a1a",
                          border: "1px solid #333",
                          borderRadius: "8px",
                        }}
                      />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="pushups"
                        stroke="#8b5cf6"
                        strokeWidth={2}
                        name="Push-ups"
                      />
                      <Line
                        type="monotone"
                        dataKey="weightlifts"
                        stroke="#3b82f6"
                        strokeWidth={2}
                        name="Weight Lifts"
                      />
                      <Line
                        type="monotone"
                        dataKey="cardio"
                        stroke="#ef4444"
                        strokeWidth={2}
                        name="Cardio (min)"
                      />
                      <Line
                        type="monotone"
                        dataKey="custom"
                        stroke="#10b981"
                        strokeWidth={2}
                        name="Custom"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="text-center text-muted-foreground py-12">
                    <p className="font-mono">
                      No data yet. Log your first routine!
                    </p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="distribution">
                <div className="flex justify-center items-center">
                  {getPieChartData().length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={getPieChartData() as any}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }: any) =>
                            `${name}: ${(percent * 100).toFixed(0)}%`
                          }
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {getPieChartData().map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#1a1a1a",
                            border: "1px solid #333",
                            borderRadius: "8px",
                          }}
                        />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="text-center text-muted-foreground py-12">
                      <p className="font-mono">
                        No data yet. Log your first routine!
                      </p>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="volume">
                {volumeData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={volumeData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                      <XAxis dataKey="date" stroke="#888" />
                      <YAxis stroke="#888" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#1a1a1a",
                          border: "1px solid #333",
                          borderRadius: "8px",
                        }}
                      />
                      <Legend />
                      <Bar
                        dataKey="volume"
                        fill="#8b5cf6"
                        name="Total Volume (kg)"
                        radius={[8, 8, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="text-center text-muted-foreground py-12">
                    <p className="font-mono">
                      No data yet. Log your first routine!
                    </p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="trends">
                {progressData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={progressData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                      <XAxis dataKey="date" stroke="#888" />
                      <YAxis stroke="#888" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#1a1a1a",
                          border: "1px solid #333",
                          borderRadius: "8px",
                        }}
                      />
                      <Legend />
                      <Area
                        type="monotone"
                        dataKey="pushups"
                        stackId="1"
                        stroke="#8b5cf6"
                        fill="#8b5cf6"
                        fillOpacity={0.6}
                        name="Push-ups"
                      />
                      <Area
                        type="monotone"
                        dataKey="weightlifts"
                        stackId="1"
                        stroke="#3b82f6"
                        fill="#3b82f6"
                        fillOpacity={0.6}
                        name="Weight Lifts"
                      />
                      <Area
                        type="monotone"
                        dataKey="cardio"
                        stackId="1"
                        stroke="#ef4444"
                        fill="#ef4444"
                        fillOpacity={0.6}
                        name="Cardio"
                      />
                      <Area
                        type="monotone"
                        dataKey="custom"
                        stackId="1"
                        stroke="#10b981"
                        fill="#10b981"
                        fillOpacity={0.6}
                        name="Custom"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="text-center text-muted-foreground py-12">
                    <p className="font-mono">
                      No data yet. Log your first routine!
                    </p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RoutinesPage;
