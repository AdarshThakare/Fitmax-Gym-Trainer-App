"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";

// UI
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

// Sections
import PushupSection from "@/components/routines/PushupSection";
import WeightLiftSection from "@/components/routines/WeightLiftSection";
import CustomExercisesSection, { ExerciseDBItem } from "@/components/routines/CustomExercisesSection";
import CustomExerciseDetailsPanel from "@/components/routines/CustomExerciseDetailsPanel";
import CustomRoutineForm from "@/components/routines/CustomRoutineForm";
import CardioSection from "@/components/routines/CardioSection";
import CrunchesSection from "@/components/routines/CrunchesSection";
import SquatsSection from "@/components/routines/SquatsSection";
import ExerciseCarouselChart from "@/components/routines/charts/ExerciseCarouselChart";
import TimeframeAnalysisChart from "@/components/routines/charts/TimeframeAnalysisChart";
import ComparativeAnalysisChart from "@/components/routines/charts/ComparativeAnalysisChart";
import CustomAnalyticsChart from "@/components/routines/charts/CustomAnalyticsChart";
import CustomTimeframeAnalysisChart from "@/components/routines/charts/CustomTimeframeAnalysisChart";
import CustomComparativeAnalysisChart from "@/components/routines/charts/CustomComparativeAnalysisChart";
import ActivityPieChart from "@/components/routines/charts/ActivityPieChart";
import CustomActivityPieChart from "@/components/routines/charts/CustomActivityPieChart";
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

  const [activeTab, setActiveTab] = useState("simple");
  const [selectedCustomExercise, setSelectedCustomExercise] = useState<ExerciseDBItem | null>(null);

  const routines = useQuery(api.routines.getUserRoutines, userId ? { userId } : "skip");
  const trackedCustoms = useQuery(api.customExercises.getTrackedExercises, userId ? { userId } : "skip");
  const saveRoutine = useMutation(api.routines.saveRoutine);
  const trackCustomExercise = useMutation(api.customExercises.addTrackedExercise);
  const untrackCustomExercise = useMutation(api.customExercises.removeTrackedExercise);

  // Deletion Modal State
  const [exerciseToDelete, setExerciseToDelete] = useState<{ id: string, name: string, trackedId: string } | null>(null);

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

  // Sync tracked exercises from DB automatically
  useEffect(() => {
    if (trackedCustoms) {
      setCustomExercises(prev => {
        // Preserve local typing states but map to DB trackings
        const updatedFromDb = trackedCustoms.map((t: any) => {
          const existing = prev.find(p => p.id === t.exerciseId);
          if (existing) return existing; // preserve their typed numbers!

          return {
            id: t.exerciseId,
            name: t.name,
            type: t.type as any,
            sets: t.type === "duration" ? [{ reps: 0, type: "duration" }] : t.type === "weighted" ? [{ reps: 0, weight: "", type: "weighted" }] : [{ reps: 0, type: "bodyweight" }]
          };
        });

        // Retain optimistic UI entries that haven't hit the DB query yet
        const optimisticEntries = prev.filter(p => !trackedCustoms.some((t: any) => t.exerciseId === p.id));

        const merged = [...updatedFromDb, ...optimisticEntries];

        // Prevent needless re-renders if the array maps exactly
        const isIdentical = prev.length === merged.length && prev.every((val, index) => val.id === merged[index].id);

        return isIdentical ? prev : merged;
      });
    }
  }, [trackedCustoms]);

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

      // Preserve tracking list natively, only flush the iteration counts
      setCustomExercises(customExercises.map(ex => ({
        ...ex,
        sets: ex.type === "duration" ? [{ reps: 0, type: "duration" }] : ex.type === "weighted" ? [{ reps: 0, weight: "", type: "weighted" }] : [{ reps: 0, type: "bodyweight" }]
      })));

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

  const handleAddCustomExercise = async ({
    name,
    type,
    id
  }: {
    name: string;
    type: "weighted" | "bodyweight" | "duration";
    id: string; // The exercise DB string from context
  }) => {
    // 1. Immediately inject to local UI for optimistic rendering
    if (!customExercises.find(c => c.id === id)) {
      setCustomExercises([
        ...customExercises,
        {
          id,
          name,
          type,
          sets:
            type === "weighted"
              ? [{ reps: 0, weight: "", type: "weighted" }]
              : [{ reps: 0, type }],
        },
      ]);
    }

    // 2. Commit tracking metadata to database
    if (userId) {
      const capitalizedName = name.charAt(0).toUpperCase() + name.slice(1);
      toast.promise(
        trackCustomExercise({
          userId,
          exerciseId: id,
          name,
          type,
        }),
        {
          loading: `Saving ${capitalizedName} to your dashboard...`,
          success: `${capitalizedName} safely tracked to Custom!`,
          error: "Failed to track exercise globally.",
        }
      );
    }
    
    // 3. Auto-redirect to the Custom tab
    setActiveTab("custom");
  };

  const executeCascadeDelete = async () => {
    if (!exerciseToDelete || !userId) return;

    try {
      await untrackCustomExercise({
        userId,
        trackedId: exerciseToDelete.trackedId as any,
        exerciseId: exerciseToDelete.id
      });
      // Flush from local view
      setCustomExercises(customExercises.filter(x => x.id !== exerciseToDelete.id));
      setExerciseToDelete(null);

      const capitalizedName = exerciseToDelete.name.charAt(0).toUpperCase() + exerciseToDelete.name.slice(1);
      // Since routines tables mutate historically via convex backend, it might take a moment. We'll show a success message right away.
      toast.success(`Removed ${capitalizedName} and purged history!`);
    } catch (e) {
      toast.error("Failed executing cascade deletion.");
    }
  };

  if (!isUserLoaded || routines === undefined || trackedCustoms === undefined) {
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
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="simple">Simple</TabsTrigger>
              <TabsTrigger value="explore">Explore</TabsTrigger>
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
              <Button
                disabled={!hasAnyActivity()}
                onClick={handleSubmitRoutine}
                className="w-full py-6 mt-6 text-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                LOG ROUTINE
              </Button>
            </TabsContent>
            <TabsContent value="explore" className="space-y-6 mt-6">
              <CustomExercisesSection
                onSelectExerciseDetails={setSelectedCustomExercise}
                onAddExercise={(data) => handleAddCustomExercise({ ...data, id: data.name.toLowerCase().replace(/\s+/g, '-') })}
              />
            </TabsContent>

            <TabsContent value="custom" className="space-y-6 mt-6">
              <CustomRoutineForm
                exercises={customExercises}
                onRemoveExercise={(id) => {
                  const targetTracked = trackedCustoms?.find((t: any) => t.exerciseId === id);
                  if (targetTracked) {
                    setExerciseToDelete({ id, name: targetTracked.name, trackedId: targetTracked._id });
                  } else {
                    // Fallback for exercises just added this session before refresh
                    setCustomExercises(customExercises.filter((x) => x.id !== id));
                  }
                }}
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
                className="w-full py-6 mt-6 text-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed shadow-md bg-gradient-to-r from-primary to-blue-500"
              >
                LOG ROUTINE
              </Button>
            </TabsContent>
          </Tabs>
        </div>

        <div className="flex flex-col gap-6 w-full md:sticky md:top-24 md:mt-0 lg:-mt-2">
          {activeTab === "simple" ? (
            <>
              <h2 className="text-2xl font-bold tracking-tight mb-2">Analytics</h2>
              <ExerciseCarouselChart
                routines={routines || []}
                pushupSets={pushupSets}
                weightliftSets={weightliftSets}
                cardioSets={cardioSets}
                crunchesSets={crunchesSets}
                squatsSets={squatsSets}
              />
              {routines && routines.length > 0 && (
                <>
                  <ComparativeAnalysisChart routines={routines} />
                </>
              )}
            </>
          ) : activeTab === "explore" ? (
            <CustomExerciseDetailsPanel exercise={selectedCustomExercise} />
          ) : (
            <>
              <h2 className="text-2xl font-bold tracking-tight mb-2">Custom Analytics</h2>

              <CustomAnalyticsChart routines={routines || []} customExercises={customExercises} />
              {routines && routines.some(r => r.customSetsDetail && r.customSetsDetail.length > 0) && (
                <>
                  <CustomComparativeAnalysisChart routines={routines} />
                </>
              )}
            </>
          )}
        </div>
      </div>

      {/* Full Width Bottom Analytics Row */}
      {activeTab === "simple" && routines && routines.length > 0 && (
        <div className="w-full max-w-7xl mx-auto mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
          <div className="lg:col-span-2">
            <TimeframeAnalysisChart routines={routines} />
          </div>
          <div className="lg:col-span-1 border rounded-xl overflow-hidden shadow-sm h-full">
            <ActivityPieChart routines={routines} />
          </div>
        </div>
      )}

      {activeTab === "custom" && routines && routines.some(r => r.customSetsDetail && r.customSetsDetail.length > 0) && (
        <div className="w-full max-w-7xl mx-auto mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
          <div className="lg:col-span-2">
            <CustomTimeframeAnalysisChart routines={routines} />
          </div>
          <div className="lg:col-span-1 border rounded-xl overflow-hidden shadow-sm h-full">
            <CustomActivityPieChart routines={routines} />
          </div>
        </div>
      )}

      <AlertDialog open={!!exerciseToDelete} onOpenChange={(open: boolean) => !open && setExerciseToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. You are removing <span className="font-bold">{exerciseToDelete?.name}</span> from your Custom Dashboard. This will permanently loop through your historical routines and delete all logged sets and reps mapped to this exercise from your convex database, irreversibly wiping its historical data from your analytics charts.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={executeCascadeDelete} className="bg-red-600 hover:bg-red-700">Delete Permanently</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  );
};

export default RoutinesPage;

