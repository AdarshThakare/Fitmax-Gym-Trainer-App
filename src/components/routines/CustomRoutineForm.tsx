import SectionWrapper from "./SectionWrapper";
import { Activity, Trash, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface ExerciseSet {
  reps: number;
  weight?: string;
}

export interface CustomExercise {
  id: string;
  name: string;
  type: "weighted" | "bodyweight" | "duration";
  sets: ExerciseSet[];
}

interface Props {
  exercises: CustomExercise[];
  onAddSet(id: string): void;
  onRemoveSet(id: string, index: number): void;
  onUpdateSet(id: string, index: number, field: string, value: string): void;
  onRemoveExercise(id: string): void;
}

const CustomRoutineForm = ({
  exercises,
  onAddSet,
  onRemoveSet,
  onUpdateSet,
  onRemoveExercise,
}: Props) => {
  if (exercises.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center border rounded-none border-dashed bg-card/50">
        <Activity className="w-10 h-10 text-muted-foreground/30 mb-3" />
        <p className="text-muted-foreground font-medium">No custom exercises added yet.</p>
        <p className="text-xs text-muted-foreground/80 mt-1 max-w-[300px]">Head over to the Explore tab to discover exercises and add them to your routine log.</p>
      </div>
    );
  }

  return (
    <>
      {exercises.map((exercise) => (
        <SectionWrapper
          key={exercise.id}
          title={exercise.name.toUpperCase()}
          icon={Activity}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-md font-mono">
              {exercise.type}
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onRemoveExercise(exercise.id)}
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
                    min="0"
                    step="0.5"
                    onChange={(e) =>
                      onUpdateSet(exercise.id, index, "weight", e.target.value)
                    }
                    className="border-primary/20 bg-background/50"
                  />
                )}

                <Input
                  type="number"
                  placeholder={
                    exercise.type === "duration" ? "Minutes" : "Reps"
                  }
                  value={set.reps || ""}
                  min="0"
                  onChange={(e) =>
                    onUpdateSet(exercise.id, index, "reps", e.target.value)
                  }
                  className="border-primary/20 bg-background/50"
                />

                {exercise.sets.length > 1 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onRemoveSet(exercise.id, index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>

          <Button
            onClick={() => onAddSet(exercise.id)}
            variant="outline"
            size="sm"
            className="w-full mt-4 border-primary/20 hover:border-primary rounded-none"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Set
          </Button>
        </SectionWrapper>
      ))}
    </>
  );
};

export default CustomRoutineForm;
