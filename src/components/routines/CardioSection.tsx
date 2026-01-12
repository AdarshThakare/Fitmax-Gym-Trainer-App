import SectionWrapper from "./SectionWrapper";
import SetRow from "./SetRow";
import AddSetButton from "./AddSetButton";
import { Heart } from "lucide-react";

interface Props {
  sets: { reps: number }[];
  onAdd(): void;
  onRemove(index: number): void;
  onUpdate(index: number, value: string): void;
}

const CardioSection = ({ sets, onAdd, onRemove, onUpdate }: Props) => {
  return (
    <SectionWrapper title="CARDIO" icon={Heart}>
      <div className="space-y-3">
        {sets.map((set, index) => (
          <SetRow
            key={index}
            label={`SET ${index + 1}`}
            value={set.reps}
            placeholder="Duration (min)"
            onChange={(v) => onUpdate(index, v)}
            onRemove={sets.length > 1 ? () => onRemove(index) : undefined}
          />
        ))}
      </div>

      <AddSetButton onClick={onAdd} />
    </SectionWrapper>
  );
};

export default CardioSection;
