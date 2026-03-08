import SectionWrapper from "./SectionWrapper";
import AddSetButton from "./AddSetButton";
import { Dumbbell, Trash } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Set {
  reps: number;
  weight?: string;
}

interface Props {
  sets: Set[];
  onAdd(): void;
  onRemove(index: number): void;
  onUpdate(index: number, field: string, value: string): void;
}

const WeightLiftSection = ({ sets, onAdd, onRemove, onUpdate }: Props) => {
  return (
    <SectionWrapper title="WEIGHT LIFTS" icon={Dumbbell}>
      <div className="space-y-3">
        {sets.map((set, index) => (
          <div key={index} className="flex gap-2 items-center">
            <span className="text-xs text-muted-foreground font-mono w-12">
              SET {index + 1}
            </span>

            <Input
              type="number"
              placeholder="Weight (kg)"
              value={set.weight || ""}
              min="0"
              step="0.5"
              onChange={(e) => onUpdate(index, "weight", e.target.value)}
              className="border-primary/20 bg-background/50"
            />

            <Input
              type="number"
              placeholder="Reps"
              value={set.reps || ""}
              min="0"
              onChange={(e) => onUpdate(index, "reps", e.target.value)}
              className="border-primary/20 bg-background/50"
            />

            {sets.length > 1 && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onRemove(index)}
                className="text-red-500 hover:text-red-700"
              >
                <Trash className="h-4 w-4" />
              </Button>
            )}
          </div>
        ))}
      </div>

      <AddSetButton onClick={onAdd} />
    </SectionWrapper>
  );
};

export default WeightLiftSection;
