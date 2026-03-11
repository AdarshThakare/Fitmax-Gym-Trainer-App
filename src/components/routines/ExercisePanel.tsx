import PushupSection from "./PushupSection";
import WeightLiftSection from "./WeightLiftSection";
import CardioSection from "./CardioSection";
import CustomRoutineForm from "./CustomRoutineForm";
import { Button } from "@/components/ui/button";

interface Props {
  pushups: any[];
  weightlifts: any[];
  cardio: any[];
  customExercises: any[];
  hasAnyActivity: boolean;
  handlers: {
    addSet(type: "pushup" | "weightlift" | "cardio"): void;
    removeSet(type: "pushup" | "weightlift" | "cardio", index: number): void;
    updateSet(
      type: "pushup" | "weightlift" | "cardio",
      index: number,
      field: string,
      value: string
    ): void;
    addCustomExercise(): void;
    removeCustomExercise(id: string): void;
    addCustomSet(id: string): void;
    removeCustomSet(id: string, index: number): void;
    updateCustomSet(
      id: string,
      index: number,
      field: string,
      value: string
    ): void;
    submit(): void;
  };
}

const ExercisePanel = ({
  pushups,
  weightlifts,
  cardio,
  customExercises,
  hasAnyActivity,
  handlers,
}: Props) => {
  return (
    <div className="lg:col-span-1 space-y-6">
      <PushupSection
        sets={pushups}
        onAdd={() => handlers.addSet("pushup")}
        onRemove={(i) => handlers.removeSet("pushup", i)}
        onUpdate={(i, v) => handlers.updateSet("pushup", i, "reps", v)}
      />

      <WeightLiftSection
        sets={weightlifts}
        onAdd={() => handlers.addSet("weightlift")}
        onRemove={(i) => handlers.removeSet("weightlift", i)}
        onUpdate={(i, field, v) =>
          handlers.updateSet("weightlift", i, field, v)
        }
      />

      <CardioSection
        sets={cardio}
        onAdd={() => handlers.addSet("cardio")}
        onRemove={(i) => handlers.removeSet("cardio", i)}
        onUpdate={(i, v) => handlers.updateSet("cardio", i, "reps", v)}
      />

      <CustomRoutineForm
        exercises={customExercises}
        onRemoveExercise={handlers.removeCustomExercise}
        onAddSet={handlers.addCustomSet}
        onRemoveSet={handlers.removeCustomSet}
        onUpdateSet={handlers.updateCustomSet}
      />

      <Button
        onClick={handlers.submit}
        disabled={!hasAnyActivity}
        className="w-full bg-primary text-primary-foreground hover:bg-primary/90 py-6 text-lg font-bold disabled:opacity-50"
      >
        LOG ROUTINE
      </Button>
    </div>
  );
};

export default ExercisePanel;
