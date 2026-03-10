import SectionWrapper from "./SectionWrapper";
import AddSetButton from "./AddSetButton";
import { Heart, Trash } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface CardioSet {
  cardioType: "running" | "cycling";
  reps: number; // Duration in minutes
  distance?: string; // Distance in kilometers
}

interface Props {
  sets: CardioSet[];
  onAdd(): void;
  onRemove(index: number): void;
  onUpdate(index: number, field: string, value: string): void;
}

const CardioSection = ({ sets, onAdd, onRemove, onUpdate }: Props) => {
  return (
    <SectionWrapper title="CARDIO" icon={Heart}>
      <div className="space-y-3">
        {sets.map((set, index) => (
          <div key={index} className="flex flex-wrap gap-2 items-center">
            <span className="text-xs text-muted-foreground font-mono w-12">
              SET {index + 1}
            </span>

            <select
              title="Cardio Type"
              className="flex h-10 w-28 rounded-md border border-primary/20 bg-background/50 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={set.cardioType}
              onChange={(e) => onUpdate(index, "cardioType", e.target.value)}
            >
              <option value="running">Running</option>
              <option value="cycling">Cycling</option>
            </select>

            <Input
              type="number"
              placeholder="Time (min)"
              value={set.reps || ""}
              min="0"
              onChange={(e) => onUpdate(index, "reps", e.target.value)}
              className="border-primary/20 bg-background/50 flex-1 min-w-[70px]"
            />

            <Input
              type="number"
              placeholder="Distance (km)"
              value={set.distance || ""}
              min="0"
              step="0.1"
              onChange={(e) => onUpdate(index, "distance", e.target.value)}
              className="border-primary/20 bg-background/50 flex-1 min-w-[70px]"
            />

            {sets.length > 1 && (
              <Button
                variant="ghost"
                size="icon"
                title="Remove"
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

export default CardioSection;
