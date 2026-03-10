"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";

// UI
import { Button } from "@/components/ui/button";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Sections
import PushupSection from "@/components/routines/PushupSection";
import WeightLiftSection from "@/components/routines/WeightLiftSection";
import CustomExercisesSection from "@/components/routines/CustomExercisesSection";
import CardioSection from "@/components/routines/CardioSection";
import CrunchesSection from "@/components/routines/CrunchesSection";
import SquatsSection from "@/components/routines/SquatsSection";
import ExerciseCarouselChart from "@/components/routines/charts/ExerciseCarouselChart";
import TimeframeAnalysisChart from "@/components/routines/charts/TimeframeAnalysisChart";
import ComparativeAnalysisChart from "@/components/routines/charts/ComparativeAnalysisChart";
import { toast } from "sonner";

// Types
interface ExerciseSet {
  reps: number;
  type: string;
  weight?: string;
}

interface CardioSet {
  cardioType: "running" | "cycling";
  reps: number;
  distance?: string;
}

interface CustomExercise {
  id: string;
  name: string;
  type: "weighted" | "bodyweight" | "duration";
  sets: ExerciseSet[];
}

const RoutinesPage = () => {
  const [currentDate] = useState(new Date());
  const { user, isLoaded: isUserLoaded } = useUser();
  const userId = user?.id as string;

  const routines = useQuery(api.routines.getUserRoutines, userId ? { userId } : "skip");
  const saveRoutine = useMutation(api.routines.saveRoutine);

  // Exercise states
  const [pushupSets, setPushupSets] = useState<ExerciseSet[]>([
    { reps: 0, type: "bodyweight" },
  ]);
  const [weightliftSets, setWeightliftSets] = useState<ExerciseSet[]>([
    { reps: 0, weight: "", type: "weighted" },
  ]);
  const [cardioSets, setCardioSets] = useState<CardioSet[]>([
    { reps: 0, cardioType: "running", distance: "" },
  ]);
  const [crunchesSets, setCrunchesSets] = useState<ExerciseSet[]>([
    { reps: 0, type: "bodyweight" },
  ]);
  const [squatsSets, setSquatsSets] = useState<ExerciseSet[]>([
    { reps: 0, type: "bodyweight" },
  ]);
  const [customExercises, setCustomExercises] = useState<CustomExercise[]>([]);

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

    // Extracted specific metrics
    const runningTime = cardioSets.filter(x => x.cardioType === "running").reduce((s, x) => s + x.reps, 0);
    const runningDistance = cardioSets.filter(x => x.cardioType === "running").reduce((s, x) => s + (parseFloat(x.distance || "0") || 0), 0);
    const cyclingTime = cardioSets.filter(x => x.cardioType === "cycling").reduce((s, x) => s + x.reps, 0);
    const cyclingDistance = cardioSets.filter(x => x.cardioType === "cycling").reduce((s, x) => s + (parseFloat(x.distance || "0") || 0), 0);

    const crunches = crunchesSets.reduce((s, x) => s + x.reps, 0);
    const squats = squatsSets.reduce((s, x) => s + x.reps, 0);
    const custom = customExercises.reduce(
      (s, ex) => s + ex.sets.reduce((a, b) => a + b.reps, 0),
      0,
    );

    try {
      await saveRoutine({
        userId,
        date: today,
        pushups,
        weightlifts,
        cardio,
        runningTime,
        runningDistance,
        cyclingTime,
        cyclingDistance,
        crunches,
        squats,
        custom,
        pushupSetsDetail: pushupSets.filter(s => s.reps > 0),
        weightliftSetsDetail: weightliftSets.filter(s => s.reps > 0),
        cardioSetsDetail: cardioSets.filter(s => s.reps > 0 || parseFloat(s.distance || "0") > 0),
        crunchesSetsDetail: crunchesSets.filter(s => s.reps > 0),
        squatsSetsDetail: squatsSets.filter(s => s.reps > 0),
        customSetsDetail: customExercises.map(ex => ({
          ...ex,
          sets: ex.sets.filter(s => s.reps > 0)
        })).filter(ex => ex.sets.length > 0),
      });

      // reset all inputs after submit
      setPushupSets([{ reps: 0, type: "bodyweight" }]);
      setWeightliftSets([{ reps: 0, weight: "", type: "weighted" }]);
      setCardioSets([{ reps: 0, cardioType: "running", distance: "" }]);
      setCrunchesSets([{ reps: 0, type: "bodyweight" }]);
      setSquatsSets([{ reps: 0, type: "bodyweight" }]);
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

    const hasCardio = cardioSets.some((s) => s.reps > 0 || parseFloat(s.distance || "0") > 0);

    const hasCrunches = crunchesSets.some((s) => s.reps > 0);
    const hasSquats = squatsSets.some((s) => s.reps > 0);

    const hasCustom = customExercises.some((ex) =>
      ex.sets.some((s) => s.reps > 0),
    );

    return hasPushups || hasWeightlifts || hasCardio || hasCrunches || hasSquats || hasCustom;
  };

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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 w-full max-w-7xl mx-auto items-start">
        <div className="flex flex-col gap-6 w-full">
          <Tabs defaultValue="simple" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="simple">Simple</TabsTrigger>
              <TabsTrigger value="custom">Custom</TabsTrigger>
            </TabsList>
            <TabsContent value="simple" className="space-y-6 mt-6">
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
                  setCardioSets([...cardioSets, { reps: 0, cardioType: "running", distance: "" }])
                }
                onRemove={(i) =>
                  setCardioSets(cardioSets.filter((_, x) => x !== i))
                }
                onUpdate={(i, f, v) => {
                  const c = [...cardioSets];
                  (c[i] as any)[f] = f === "reps" ? parseInt(v) || 0 : v;
                  setCardioSets(c);
                }}
              />

              <CrunchesSection
                sets={crunchesSets}
                onAdd={() =>
                  setCrunchesSets([...crunchesSets, { reps: 0, type: "bodyweight" }])
                }
                onRemove={(i) =>
                  setCrunchesSets(crunchesSets.filter((_, x) => x !== i))
                }
                onUpdate={(i, v) => {
                  const c = [...crunchesSets];
                  c[i].reps = parseInt(v) || 0;
                  setCrunchesSets(c);
                }}
              />

              <SquatsSection
                sets={squatsSets}
                onAdd={() =>
                  setSquatsSets([...squatsSets, { reps: 0, type: "bodyweight" }])
                }
                onRemove={(i) =>
                  setSquatsSets(squatsSets.filter((_, x) => x !== i))
                }
                onUpdate={(i, v) => {
                  const c = [...squatsSets];
                  c[i].reps = parseInt(v) || 0;
                  setSquatsSets(c);
                }}
              />
            </TabsContent>
            <TabsContent value="custom" className="space-y-6 mt-6">
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
            </TabsContent>
          </Tabs>

          <Button
            disabled={!hasAnyActivity()}
            onClick={handleSubmitRoutine}
            className="w-full py-6 text-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            LOG ROUTINE
          </Button>
        </div>

        <div className="flex flex-col gap-6 w-full md:sticky md:top-24 md:mt-0 lg:-mt-2">
          <h2 className="text-2xl font-bold tracking-tight mb-2">Analytics</h2>
          <ExerciseCarouselChart
            routines={routines || []}
            pushupSets={pushupSets}
            weightliftSets={weightliftSets}
            cardioSets={cardioSets}
            crunchesSets={crunchesSets}
            squatsSets={squatsSets}
            customExercises={customExercises}
          />
          {routines && routines.length > 0 && (
            <>
              <TimeframeAnalysisChart routines={routines} />
              <ComparativeAnalysisChart routines={routines} />
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default RoutinesPage;

